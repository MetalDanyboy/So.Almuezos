const http = require("node:http");
const https = require("node:https");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const root = __dirname;
const port = Number(process.env.PORT || 5173);
const sessions = new Map();
const SESSION_MAX_AGE_MS = 30 * 60 * 1000;
const SESSION_IDLE_MS = 10 * 60 * 1000;
const SESSION_CLEANUP_MS = 60 * 1000;
const OVERPASS_URLS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];
const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";
const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";
const USER_AGENT = "So.Almuerzos local app (OpenStreetMap/Overpass)";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const categoryLabels = {
  restaurant: "Restaurant",
  fast_food: "Rapido",
  cafe: "Cafe",
  food_court: "Patio de comida",
  pub: "Pub",
  bar: "Bar",
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }
    if (url.pathname === "/healthz") {
      sendJson(res, 200, { ok: true, service: "so-almuerzos" });
      return;
    }
    serveStatic(req, res, url);
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Error inesperado" });
  }
});

server.listen(port, "0.0.0.0", () => {
  const addresses = networkAddresses();
  console.log(`So.Almuerzos listo en http://127.0.0.1:${port}/`);
  addresses.forEach((address) => console.log(`Red local: http://${address}:${port}/`));
});

setInterval(cleanupExpiredSessions, SESSION_CLEANUP_MS).unref();

async function handleApi(req, res, url) {
  cleanupExpiredSessions();

  if (req.method === "POST" && url.pathname === "/api/sessions") {
    const body = await readJson(req);
    const id = code();
    const participant = participantFrom(body.name || "Anfitrion");
    const session = {
      id,
      hostId: participant.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: "lobby",
      locked: false,
      resultIndex: 0,
      setup: null,
      participants: [participant],
    };
    sessions.set(id, session);
    sendJson(res, 201, { session: publicSession(session), participant, links: shareLinks(req, id) });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/location/ip") {
    try {
      const location = await lookupIpLocation();
      sendJson(res, 200, { location });
    } catch (error) {
      sendJson(res, 502, { error: error.message || "No se pudo obtener ubicacion por red" });
    }
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/geocode") {
    try {
      const query = String(url.searchParams.get("q") || "").trim();
      if (!query) {
        sendJson(res, 400, { error: "Falta direccion" });
        return;
      }
      const location = await geocodeAddress(query);
      sendJson(res, 200, { location });
    } catch (error) {
      sendJson(res, 502, { error: error.message || "No se pudo geocodificar la direccion" });
    }
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/geocode-suggestions") {
    try {
      const query = String(url.searchParams.get("q") || "").trim();
      if (query.length < 3) {
        sendJson(res, 200, { locations: [] });
        return;
      }
      const locations = await geocodeAddresses(query, 6);
      sendJson(res, 200, { locations });
    } catch (error) {
      sendJson(res, 502, { error: error.message || "No se pudieron obtener sugerencias" });
    }
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/reverse") {
    try {
      const coords = parseCoords(url);
      const location = await reverseGeocode(coords);
      sendJson(res, 200, { location });
    } catch (error) {
      sendJson(res, 502, { error: error.message || "No se pudo obtener la direccion aproximada" });
    }
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/places") {
    try {
      const coords = parseCoords(url);
      const radius = Math.max(500, Math.min(5000, Number(url.searchParams.get("radius")) || 3000));
      const places = await fetchNearbyPlaces(coords, radius);
      sendJson(res, 200, { places, source: "openstreetmap-overpass" });
    } catch (error) {
      sendJson(res, 502, { error: error.message || "No se pudieron obtener locales cercanos" });
    }
    return;
  }

  const match = url.pathname.match(/^\/api\/sessions\/([^/]+)(?:\/([^/]+))?$/);
  if (!match) {
    sendJson(res, 404, { error: "Ruta no encontrada" });
    return;
  }

  const session = sessions.get(match[1]);
  if (!session) {
    sendJson(res, 404, { error: "La sesion expiro. Crea una nueva para volver a jugar.", expired: true });
    return;
  }
  if (isExpiredSession(session)) {
    sessions.delete(session.id);
    sendJson(res, 410, { error: "La sesion expiro. Crea una nueva para volver a jugar.", expired: true });
    return;
  }

  const action = match[2];
  if (req.method === "GET" && !action) {
    sendJson(res, 200, { session: publicSession(session), links: shareLinks(req, session.id) });
    return;
  }

  if (req.method === "POST" && action === "close") {
    const body = await readJson(req);
    if (body.participantId !== session.hostId) {
      sendJson(res, 403, { error: "Solo el anfitrion puede finalizar la sesion" });
      return;
    }
    sessions.delete(session.id);
    sendJson(res, 200, { closed: true, expired: true });
    return;
  }

  if (req.method === "POST" && action === "join") {
    if (session.locked || session.status !== "lobby") {
      sendJson(res, 409, { error: "La sesion ya empezo y no acepta mas personas" });
      return;
    }
    const body = await readJson(req);
    const participant = participantFrom(body.name || `Persona ${session.participants.length + 1}`);
    session.participants.push(participant);
    touch(session);
    sendJson(res, 201, { session: publicSession(session), participant, links: shareLinks(req, session.id) });
    return;
  }

  if (req.method === "POST" && action === "setup") {
    if (session.locked || session.status !== "lobby") {
      sendJson(res, 409, { error: "La sesion ya empezo; no se puede cambiar la ubicacion" });
      return;
    }
    const body = await readJson(req);
    session.setup = {
      coords: body.coords,
      places: body.places || [],
      questions: body.questions || [],
      usedFallback: Boolean(body.usedFallback),
    };
    touch(session);
    sendJson(res, 200, { session: publicSession(session) });
    return;
  }

  if (req.method === "POST" && action === "start") {
    if (!session.setup) {
      sendJson(res, 400, { error: "Falta elegir ubicacion antes de iniciar" });
      return;
    }
    session.status = "started";
    session.locked = true;
    session.resultIndex = 0;
    session.participants = session.participants.map((participant) => ({
      ...participant,
      answers: {},
      done: false,
      updatedAt: Date.now(),
    }));
    touch(session);
    sendJson(res, 200, { session: publicSession(session), links: shareLinks(req, session.id) });
    return;
  }

  if (req.method === "POST" && action === "recommendation-next") {
    if (session.status !== "finished") {
      sendJson(res, 409, { error: "La recomendacion solo puede cambiar cuando todos terminaron" });
      return;
    }
    session.resultIndex = (Number(session.resultIndex) || 0) + 1;
    touch(session);
    sendJson(res, 200, { session: publicSession(session), links: shareLinks(req, session.id) });
    return;
  }

  if (req.method === "POST" && action === "recommendation-select") {
    if (session.status !== "finished") {
      sendJson(res, 409, { error: "La recomendacion solo puede cambiar cuando todos terminaron" });
      return;
    }
    const body = await readJson(req);
    session.resultIndex = Math.max(0, Number(body.index) || 0);
    touch(session);
    sendJson(res, 200, { session: publicSession(session), links: shareLinks(req, session.id) });
    return;
  }

  if (req.method === "POST" && action === "participant") {
    const body = await readJson(req);
    const participant = session.participants.find((item) => item.id === body.id);
    if (!participant) {
      sendJson(res, 404, { error: "Participante no encontrado" });
      return;
    }
    participant.name = body.name || participant.name;
    participant.answers = body.answers || participant.answers || {};
    participant.done = Boolean(body.done);
    participant.updatedAt = Date.now();
    if (session.participants.length > 0 && session.participants.every((item) => item.done)) {
      session.status = "finished";
      session.resultIndex = Number(session.resultIndex) || 0;
    }
    touch(session);
    sendJson(res, 200, { session: publicSession(session), participant });
    return;
  }

  sendJson(res, 404, { error: "Accion no encontrada" });
}

function serveStatic(req, res, url) {
  let filePath = decodeURIComponent(url.pathname);
  if (filePath === "/" || !path.extname(filePath)) filePath = "/index.html";
  const resolved = path.resolve(root, `.${filePath}`);
  if (!resolved.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(resolved, (error, buffer) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": mimeTypes[path.extname(resolved)] || "application/octet-stream" });
    res.end(buffer);
  });
}

function publicSession(session) {
  return {
    id: session.id,
    hostId: session.hostId,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    expiresAt: Math.min(session.createdAt + SESSION_MAX_AGE_MS, session.updatedAt + SESSION_IDLE_MS),
    status: session.status,
    locked: session.locked,
    resultIndex: Number(session.resultIndex) || 0,
    setup: session.setup,
    participants: session.participants.map((participant) => ({ ...participant })),
  };
}

function participantFrom(name) {
  return {
    id: `p_${code()}_${Math.random().toString(16).slice(2, 8)}`,
    name,
    answers: {},
    done: false,
    updatedAt: Date.now(),
  };
}

function touch(session) {
  session.updatedAt = Date.now();
}

function isExpiredSession(session, now = Date.now()) {
  return now - session.createdAt > SESSION_MAX_AGE_MS || now - session.updatedAt > SESSION_IDLE_MS;
}

function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (isExpiredSession(session, now)) sessions.delete(id);
  }
}

function code() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload));
}

function shareLinks(req, id) {
  const host = req.headers.host || `127.0.0.1:${port}`;
  const current = `http://${host}/?session=${id}`;
  const local = networkAddresses().map((address) => `http://${address}:${port}/?session=${id}`);
  return [current, ...local.filter((link) => link !== current)];
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) {
        reject(new Error("Payload demasiado grande"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("JSON invalido"));
      }
    });
  });
}

function networkAddresses() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((item) => item && item.family === "IPv4" && !item.internal)
    .map((item) => item.address);
}

async function lookupIpLocation() {
  const primary = await getJson("https://ipapi.co/json/").catch(() => null);
  if (primary?.latitude && primary?.longitude) {
    return {
      lat: Number(primary.latitude),
      lon: Number(primary.longitude),
      label: [primary.city, primary.region, primary.country_name].filter(Boolean).join(", "),
      source: "ipapi.co",
      approximate: true,
    };
  }

  const fallback = await getJson("https://ipwho.is/").catch(() => null);
  if (fallback?.success !== false && fallback?.latitude && fallback?.longitude) {
    return {
      lat: Number(fallback.latitude),
      lon: Number(fallback.longitude),
      label: [fallback.city, fallback.region, fallback.country].filter(Boolean).join(", "),
      source: "ipwho.is",
      approximate: true,
    };
  }

  throw new Error("No pude calcular una ubicacion aproximada por red");
}

async function geocodeAddress(query) {
  const [first] = await geocodeAddresses(query, 1);
  if (!first) throw new Error("Direccion no encontrada. Prueba con calle, comuna y pais.");
  return first;
}

async function geocodeAddresses(query, limit = 5) {
  const url = new URL(NOMINATIM_SEARCH_URL);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("q", query);
  const results = await getJson(url.toString());
  if (!Array.isArray(results)) return [];
  return results.map(formatGeocodeResult).filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lon));
}

function formatGeocodeResult(result) {
  const address = result.address || {};
  const street = [address.road || address.pedestrian || address.neighbourhood, address.house_number].filter(Boolean).join(" ");
  const locality =
    address.suburb ||
    address.city_district ||
    address.municipality ||
    address.city ||
    address.town ||
    address.village ||
    address.hamlet ||
    "";
  const province = address.county || address.state_district || address.state || "";
  const country = address.country || "";
  const title = [street, locality].filter(Boolean).join(", ") || result.name || result.display_name || "Direccion";
  const meta = [province, country].filter(Boolean).join(", ");
  return {
    lat: Number(result.lat),
    lon: Number(result.lon),
    label: result.display_name || [title, meta].filter(Boolean).join(", "),
    title,
    meta,
    parts: {
      street,
      locality,
      province,
      country,
      postcode: address.postcode || "",
    },
    source: "nominatim",
  };
}

async function reverseGeocode(coords) {
  const url = new URL(NOMINATIM_REVERSE_URL);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", String(coords.lat));
  url.searchParams.set("lon", String(coords.lon));
  url.searchParams.set("zoom", "18");
  url.searchParams.set("addressdetails", "1");
  const data = await getJson(url.toString());
  return {
    lat: coords.lat,
    lon: coords.lon,
    label: data.display_name || `${coords.lat}, ${coords.lon}`,
    source: "nominatim",
  };
}

async function fetchNearbyPlaces(coords, radius) {
  const query = `
    [out:json][timeout:18];
    (
      node["amenity"~"restaurant|fast_food|cafe|food_court|pub|bar"](around:${radius},${coords.lat},${coords.lon});
      way["amenity"~"restaurant|fast_food|cafe|food_court|pub|bar"](around:${radius},${coords.lat},${coords.lon});
      relation["amenity"~"restaurant|fast_food|cafe|food_court|pub|bar"](around:${radius},${coords.lat},${coords.lon});
    );
    out center tags 90;
  `;
  const data = await postFormJsonWithFallback(OVERPASS_URLS, { data: query });
  return (data.elements || [])
    .map((element) => normalizePlace(element, coords))
    .filter((place) => place.name && Number.isFinite(place.distance))
    .filter(uniquePlace())
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 50);
}

function normalizePlace(element, origin) {
  const tags = element.tags || {};
  const lat = Number(element.lat ?? element.center?.lat);
  const lon = Number(element.lon ?? element.center?.lon);
  const amenity = tags.amenity || "restaurant";
  const cuisine = String(tags.cuisine || "").toLowerCase();
  return {
    id: `${element.type}-${element.id}`,
    name: tags.name || tags.brand || "",
    cuisine,
    kind: humanizeCuisine(cuisine) || categoryLabels[amenity] || "Local",
    distance: haversine(origin.lat, origin.lon, lat, lon),
    lat,
    lon,
    tags: {
      amenity,
      cuisine,
      delivery: tags.delivery,
      takeaway: tags.takeaway,
      opening_hours: tags.opening_hours,
      phone: tags.phone || tags["contact:phone"],
      website: tags.website || tags["contact:website"],
    },
  };
}

function parseCoords(url) {
  const lat = Number(url.searchParams.get("lat"));
  const lon = Number(url.searchParams.get("lon"));
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    throw new Error("Coordenadas invalidas");
  }
  return { lat, lon };
}

function haversine(lat1, lon1, lat2, lon2) {
  if (!Number.isFinite(lat2) || !Number.isFinite(lon2)) return Number.NaN;
  const radius = 6371000;
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function humanizeCuisine(value) {
  if (!value) return "";
  return String(value)
    .split(";")
    .slice(0, 2)
    .join(" / ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function uniquePlace() {
  const seen = new Set();
  return (place) => {
    const name = place.name.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
    const lat = Number.isFinite(place.lat) ? place.lat.toFixed(4) : "";
    const lon = Number.isFinite(place.lon) ? place.lon.toFixed(4) : "";
    const key = `${name}-${lat}-${lon}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  };
}

function getJson(target) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      target,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": USER_AGENT,
        },
        timeout: 5000,
      },
      (response) => {
        let body = "";
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`HTTP ${response.statusCode}`));
            return;
          }
          try {
            resolve(JSON.parse(body));
          } catch {
            reject(new Error("Respuesta invalida"));
          }
        });
      },
    );
    request.on("timeout", () => {
      request.destroy(new Error("Timeout"));
    });
    request.on("error", reject);
  });
}

async function postFormJsonWithFallback(targets, form) {
  const errors = [];
  for (const target of targets) {
    try {
      return await postFormJson(target, form);
    } catch (error) {
      errors.push(`${new URL(target).hostname}: ${error.message}`);
    }
  }
  throw new Error(`Overpass no respondio (${errors.join("; ")})`);
}

function postFormJson(target, form) {
  return new Promise((resolve, reject) => {
    const body = new URLSearchParams(form).toString();
    const url = new URL(target);
    const request = https.request(
      {
        hostname: url.hostname,
        path: `${url.pathname}${url.search}`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Content-Length": Buffer.byteLength(body),
          "User-Agent": USER_AGENT,
        },
        timeout: 20000,
      },
      (response) => {
        let responseBody = "";
        response.on("data", (chunk) => {
          responseBody += chunk;
        });
        response.on("end", () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`HTTP ${response.statusCode}`));
            return;
          }
          try {
            resolve(JSON.parse(responseBody));
          } catch {
            reject(new Error("Respuesta invalida"));
          }
        });
      },
    );
    request.on("timeout", () => {
      request.destroy(new Error("Timeout"));
    });
    request.on("error", reject);
    request.write(body);
    request.end();
  });
}

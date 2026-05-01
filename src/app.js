const API_BASE = "/api";

const fallbackPlaces = [
  {
    id: "fallback-1",
    name: "La Fuente de Soda Mental",
    cuisine: "sandwich",
    kind: "Completos y sandwiches",
    distance: 650,
    tags: { takeaway: "yes", delivery: "yes", cuisine: "sandwich" },
  },
  {
    id: "fallback-2",
    name: "Sushi Cerca Pero No Tanto",
    cuisine: "sushi",
    kind: "Sushi",
    distance: 950,
    tags: { takeaway: "yes", cuisine: "sushi" },
  },
  {
    id: "fallback-3",
    name: "Menu del Dia Salvavidas",
    cuisine: "chilean",
    kind: "Menu casero",
    distance: 500,
    tags: { cuisine: "chilean", delivery: "no" },
  },
  {
    id: "fallback-4",
    name: "Pizza con Argumentos",
    cuisine: "pizza",
    kind: "Pizza",
    distance: 1100,
    tags: { takeaway: "yes", delivery: "yes", cuisine: "pizza" },
  },
  {
    id: "fallback-5",
    name: "Ensaladas para Gente que Durmio Bien",
    cuisine: "salad",
    kind: "Ensaladas y bowls",
    distance: 700,
    tags: { takeaway: "yes", cuisine: "salad" },
  },
];

const questionPool = [
  {
    id: "mood",
    text: "El estomago ha hablado. ¿Que vibra tiene el almuerzo?",
    hint: "El oraculo culinario ajustara sus bigotes imaginarios.",
    answers: [
      { label: "Regalon", help: "Algo con abrazo incorporado", value: "comfort" },
      { label: "Liviano", help: "Que no de sueño de escritorio", value: "light" },
      { label: "Power", help: "Necesito combustible serio", value: "hearty" },
      { label: "Sorprendeme", help: "Hoy confio en el caos sabroso", value: "random" },
    ],
  },
  {
    id: "speed",
    text: "¿Cuanta paciencia trae tu reloj?",
    hint: "Respuesta honesta. Nadie juzga al hambre con apuro.",
    answers: [
      { label: "Modo avion", help: "Menos de 20 minutos", value: "fast" },
      { label: "Normal", help: "Puedo esperar un poco", value: "normal" },
      { label: "Sin drama", help: "Que valga la pena", value: "slow" },
      { label: "Delivery", help: "Que llegue a mi guarida", value: "delivery" },
    ],
  },
  {
    id: "budget",
    text: "¿Como esta el presupuesto hoy?",
    hint: "El bolsillo tambien almuerza, aunque a veces se hace el leso.",
    answers: [
      { label: "Economico", help: "Rico sin hipotecar el futuro", value: "low" },
      { label: "Medio", help: "Algo piola y digno", value: "medium" },
      { label: "Me lo merezco", help: "Hoy se celebra sobrevivir", value: "high" },
      { label: "Lo que sea", help: "Mientras sea bueno", value: "any" },
    ],
  },
  {
    id: "flavor",
    text: "¿Que sabor te esta guiñando el ojo?",
    hint: "Elige con valentia. O con hambre. Ambas sirven.",
    answers: [
      { label: "Casero", help: "Menu, cazuela, plato del dia", value: "homey" },
      { label: "Asiatico", help: "Sushi, ramen, wok o similar", value: "asian" },
      { label: "Italiano", help: "Pizza, pasta, pan bonito", value: "italian" },
      { label: "Americano", help: "Burger, papas, sandwich", value: "american" },
    ],
  },
  {
    id: "walk",
    text: "¿Hasta donde caminaria tu yo hambriento?",
    hint: "Considera clima, zapatos y dignidad personal.",
    answers: [
      { label: "Muy cerca", help: "Hasta 700 metros", value: 700 },
      { label: "Caminable", help: "Hasta 1.5 km", value: 1500 },
      { label: "Explorador", help: "Hasta 3 km", value: 3000 },
      { label: "Solo delivery", help: "La calle no es mi camino", value: 5000, delivery: true },
    ],
  },
  {
    id: "risk",
    text: "Nivel de aventura gastronomica permitido:",
    hint: "El almuerzo puede ser decision o arco narrativo.",
    answers: [
      { label: "Seguro", help: "Algo conocido", value: "safe" },
      { label: "Curioso", help: "Puede haber plot twist", value: "curious" },
      { label: "Audaz", help: "Que venga lo raro", value: "bold" },
      { label: "Cero decision", help: "Decide por mi", value: "oracle" },
    ],
  },
  {
    id: "nap",
    text: "Despues de comer, ¿hay reunion o siesta imaginaria?",
    hint: "El almuerzo puede ser aliado laboral o villano de calendario.",
    answers: [
      { label: "Reunion seria", help: "Necesito seguir humano", value: "focus" },
      { label: "Tarde liviana", help: "Puedo quedar en modo sofa", value: "sleepy" },
      { label: "Entreno despues", help: "No quiero rodar", value: "sport" },
      { label: "No se pregunta", help: "La sobremesa manda", value: "chaos" },
    ],
  },
  {
    id: "mess",
    text: "Nivel de mancha aceptable en la ropa:",
    hint: "La servilleta tiene limites, igual que la paciencia.",
    answers: [
      { label: "Cero riesgo", help: "Hoy vengo presentable", value: "clean" },
      { label: "Moderado", help: "Una salsa estrategica se perdona", value: "normal" },
      { label: "Sin miedo", help: "Que chorree con personalidad", value: "messy" },
      { label: "Cubiertos, por favor", help: "Nada de guerra manual", value: "cutlery" },
    ],
  },
  {
    id: "temperature",
    text: "¿El cuerpo pide algo caliente, frio o diplomatico?",
    hint: "El clima opina, pero el hambre tiene derecho a replica.",
    answers: [
      { label: "Calientito", help: "Que salga vaporcito feliz", value: "hot" },
      { label: "Fresco", help: "Algo liviano y crujiente", value: "fresh" },
      { label: "Da igual", help: "Mientras no sea tristeza", value: "any" },
      { label: "Picante", help: "Que despierte el alma", value: "spicy" },
    ],
  },
  {
    id: "company",
    text: "¿Este almuerzo es solo o con testigos?",
    hint: "Hay comidas que brillan solas y otras necesitan publico.",
    answers: [
      { label: "Solo", help: "Rapido, rico, sin negociacion", value: "solo" },
      { label: "Con equipo", help: "Algo facil de acordar", value: "group" },
      { label: "Cita piola", help: "Que no parezca patio de bus", value: "date" },
      { label: "Para llevar", help: "Como y desaparezco", value: "takeaway" },
    ],
  },
  {
    id: "decision",
    text: "¿Cuanta energia tienes para elegir?",
    hint: "Esto mide tu bateria social frente al menu de 12 paginas.",
    answers: [
      { label: "Minima", help: "Dame un clasico", value: "simple" },
      { label: "Normal", help: "Puedo mirar dos opciones", value: "normal" },
      { label: "Chef interior", help: "Hoy quiero explorar", value: "explore" },
      { label: "Que decida la app", help: "Renuncio con elegancia", value: "auto" },
    ],
  },
];

const cuisineMap = {
  comfort: ["chilean", "sandwich", "pizza", "burger", "empanada", "peruvian"],
  light: ["salad", "poke", "vegetarian", "vegan", "japanese", "sushi"],
  hearty: ["steak_house", "barbecue", "burger", "peruvian", "mexican", "chilean"],
  asian: ["sushi", "japanese", "chinese", "thai", "korean", "ramen", "asian"],
  italian: ["italian", "pizza", "pasta"],
  american: ["burger", "sandwich", "american", "chicken"],
  homey: ["chilean", "regional", "peruvian", "latin_american"],
};

const categoryLabels = {
  restaurant: "Restaurant",
  fast_food: "Rapido",
  cafe: "Cafe",
  food_court: "Patio de comida",
  pub: "Pub",
  bar: "Bar",
};

class LunchOracle extends HTMLElement {
  constructor() {
    super();
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session") || "";
    this.state = {
      step: sessionId ? "joining" : "mode",
      choiceMode: "",
      groupMode: "",
      address: "",
      addressSuggestions: [],
      addressSuggesting: false,
      coords: null,
      places: [],
      questionIndex: 0,
      answers: {},
      participants: [{ id: createId(), name: "Persona 1", answers: {}, done: false }],
      activeParticipant: 0,
      sessionQuestions: pickQuestions(),
      sessionId,
      participantId: localStorage.getItem(`soLunchParticipant:${sessionId}`) || "",
      participantName: localStorage.getItem("soLunchName") || "",
      isHost: false,
      shareUrl: sessionId ? makeShareUrl(sessionId) : "",
      sessionReady: false,
      sessionStatus: "local",
      sessionUpdatedAt: 0,
      resultIndex: 0,
      loading: false,
      message: "",
      recommendation: null,
      usedFallback: false,
      locatingNote: "",
      geoFallbackAvailable: false,
    };
  }

  connectedCallback() {
    if (this.state.sessionId) this.connectToSession();
    this.render();
  }

  setState(patch) {
    const active = document.activeElement;
    const placesList = this.querySelector('[data-role="places-list"]');
    const placesScrollTop = placesList ? placesList.scrollTop : null;
    const preserved =
      active?.dataset?.role && active.matches("input")
        ? {
            role: active.dataset.role,
            index: active.dataset.index,
            value: active.value,
            start: active.selectionStart,
            end: active.selectionEnd,
          }
        : null;
    this.state = { ...this.state, ...patch };
    this.render();
    if (placesScrollTop !== null) {
      const restoredPlaces = this.querySelector('[data-role="places-list"]');
      if (restoredPlaces) restoredPlaces.scrollTop = placesScrollTop;
    }
    if (preserved) {
      const selector =
        preserved.index === undefined
          ? `[data-role="${preserved.role}"]`
          : `[data-role="${preserved.role}"][data-index="${preserved.index}"]`;
      const restored = this.querySelector(selector);
      if (restored) {
        restored.value = preserved.value;
        restored.focus();
        if (Number.isInteger(preserved.start) && Number.isInteger(preserved.end)) {
          restored.setSelectionRange(preserved.start, preserved.end);
        }
      }
    }
  }

  render() {
    const { step, questionIndex } = this.state;
    const questions = this.activeQuestions();
    const progress =
      step === "questions" ? Math.round((questionIndex / questions.length) * 100) : step === "result" ? 100 : 6;

    this.innerHTML = `
      <main class="app-shell">
        <section class="experience">
          <header class="topbar">
            <div class="brand">
              <div class="logo" aria-hidden="true"></div>
              <div>
                <h1>So.Almuerzos</h1>
                <p>El genio del almuerzo negocia con tu hambre y con tu grupo.</p>
              </div>
            </div>
            <div class="status-pill">${this.statusLabel()}</div>
          </header>
          <section class="stage">${this.mainContent()}</section>
          <div class="progress" aria-label="Progreso"><span style="--progress: ${progress}%"></span></div>
        </section>
        <aside class="side">
          ${this.factsPanel()}
          ${this.placesPanel()}
        </aside>
      </main>
    `;

    this.bindEvents();
  }

  statusLabel() {
    if (this.state.loading) return `<span class="loading">Consultando</span>`;
    if (this.state.step === "mode") return "Inicio";
    if (this.state.step === "groupType") return "Grupo";
    if (this.state.step === "lobby") return "Lobby";
    if (this.state.step === "joining") return "Invitacion";
    if (this.state.step === "waiting") return "Esperando";
    if (this.state.step === "locating") return "Ubicacion";
    if (this.state.step === "questions") return `Pregunta ${this.state.questionIndex + 1}/${this.activeQuestions().length}`;
    if (this.state.step === "result") return "Veredicto";
    return "Listo";
  }

  activeQuestions() {
    return this.state.sessionQuestions.length ? this.state.sessionQuestions : questionPool.slice(0, 8);
  }

  currentParticipant() {
    if (this.isSharedSession()) {
      return (
        this.state.participants.find((person) => person.id === this.state.participantId) ||
        this.state.participants[0] || { name: "Invitado", answers: {} }
      );
    }
    return this.state.participants[this.state.activeParticipant] || this.state.participants[0];
  }

  isSharedSession() {
    return Boolean(this.state.sessionId && this.state.participantId);
  }

  sharePanel() {
    if (!this.state.sessionId) return "";
    return `
      <div class="share-box">
        <span>Link del grupo</span>
        <div class="share-row">
          <input class="input" readonly value="${escapeHtml(this.state.shareUrl)}" />
          <button class="secondary" data-action="copy-link">Copiar</button>
        </div>
        <p>Comparte este link con quienes van a votar el almuerzo.</p>
      </div>
    `;
  }

  mainContent() {
    if (this.state.step === "mode") return this.modeContent();
    if (this.state.step === "groupType") return this.groupTypeContent();
    if (this.state.step === "lobby") return this.lobbyContent();
    if (this.state.step === "joining") return this.joinContent();
    if (this.state.step === "waiting") return this.waitingContent();
    if (this.state.step === "locating") return this.locationContent();
    if (this.state.step === "questions") return this.questionContent();
    return this.resultContent();
  }

  modeContent() {
    return `
      <div class="question-area">
        <div class="oracle-row">
          ${renderGenie("curious")}
          <div class="bubble">
            <h2>¿Quien tiene hambre?</h2>
            <p>Primero decidimos si esto es una aventura personal o una negociacion grupal con riesgo de opiniones fuertes.</p>
            <div class="answer-grid">
              <button class="answer" data-action="choose-individual">
                <strong>Solo yo</strong>
                <span>Una persona, una panza, un destino.</span>
              </button>
              <button class="answer" data-action="choose-group">
                <strong>Grupo</strong>
                <span>Varias personas, compatibilidad y diplomacia.</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  groupTypeContent() {
    const hostNameReady = Boolean((this.state.participantName || "").trim());
    const canCreateSharedGroup = hostNameReady && !this.state.loading;
    return `
      <div class="question-area">
        <div class="oracle-row">
          ${renderGenie("focused")}
          <div class="bubble">
            <h2>¿Como se junta el grupo?</h2>
            <p>Elige si todos responderan en este dispositivo o si cada persona entrara desde su propio link.</p>
            <div class="answer-grid">
              <button class="answer" data-action="choose-local-group">
                <strong>En este dispositivo</strong>
                <span>Modo mesa compartida, se turnan para responder.</span>
              </button>
              <button class="answer" data-action="choose-link-group" ${canCreateSharedGroup ? "" : "disabled"} title="${hostNameReady ? "" : "Escribe el nombre del anfitrion primero"}">
                <strong>Por link</strong>
                <span>Cada persona responde desde su celular o computador.</span>
              </button>
            </div>
            <div class="field-row">
              <input class="input" data-role="host-name" value="${escapeHtml(this.state.participantName)}" placeholder="Nombre del anfitrion" />
              <button class="secondary" data-action="save-host-name" ${hostNameReady && !this.state.loading ? "" : "disabled"}>Guardar nombre</button>
            </div>
            <button class="secondary full" data-action="back-to-mode">Volver</button>
          </div>
        </div>
      </div>
    `;
  }

  joinContent() {
    if (this.state.sessionStatus === "expired") {
      return `
        <div class="question-area">
          <div class="oracle-row">
            ${renderGenie("sleepy")}
            <div class="bubble">
              <h2>Sesion expirada</h2>
              <p>${escapeHtml(this.state.message || "Esta sesion ya expiro. Crea una nueva para volver a decidir el almuerzo.")}</p>
              <button class="primary" data-action="restart">Crear nueva sesion</button>
            </div>
          </div>
        </div>
      `;
    }
    const locked = this.state.sessionStatus !== "local" && this.state.sessionStatus !== "lobby";
    const canJoin = Boolean((this.state.participantName || "").trim()) && !this.state.loading;
    if (locked) {
      return `
        <div class="question-area">
          <div class="oracle-row">
            ${renderGenie("suspicious")}
            <div class="bubble">
              <h2>Sesion ya iniciada</h2>
              <p>El anfitrion ya cerro la puerta del almuerzo para mantener las respuestas sincronizadas. No se puede ingresar a este grupo ahora.</p>
              ${this.state.message ? `<div class="toast">${escapeHtml(this.state.message)}</div>` : ""}
            </div>
          </div>
        </div>
      `;
    }
    return `
      <div class="question-area">
        <div class="oracle-row">
          ${renderGenie("curious")}
          <div class="bubble">
            <h2>Te invitaron a una sesion</h2>
            <p>Escribe tu nombre y responde desde tu dispositivo. Cuando todos terminen, So.Almuerzos tira el veredicto grupal.</p>
            <div class="field-row">
              <input class="input" data-role="join-name" value="${escapeHtml(this.state.participantName)}" placeholder="Tu nombre para el consejo del almuerzo" />
              <button class="primary" data-action="join-session" ${canJoin ? "" : "disabled"}>Entrar</button>
            </div>
            ${this.state.message ? `<div class="toast">${escapeHtml(this.state.message)}</div>` : ""}
          </div>
        </div>
      </div>
    `;
  }

  waitingContent() {
    const ready = this.state.participants.filter((person) => person.done).length;
    const total = this.state.participants.length;
    const setupText = this.state.sessionReady
      ? `${ready}/${total} personas listas. El genio esta contando servilletas.`
      : "Esperando que el anfitrion elija ubicacion y locales cercanos.";
    return `
      <div class="question-area">
        <div class="oracle-row">
          ${renderGenie("focused")}
          <div class="bubble">
            <h2>Sesion ${escapeHtml(this.state.sessionId)}</h2>
            <p>${escapeHtml(setupText)}</p>
            ${this.sharePanel()}
            <div class="group-box">
              <div class="group-title"><h3>Personas conectadas</h3></div>
              <div class="people-scores">
                ${this.state.participants
                  .map(
                    (person) => `
                      <div class="person-score">
                        <span>${escapeHtml(person.name)}</span>
                        <b>${person.done ? "OK" : "..."}</b>
                      </div>
                    `,
                  )
                  .join("")}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  lobbyContent() {
    const readyToStart = Boolean(this.state.sessionReady);
    const addressReady = Boolean((this.state.address || "").trim());
    const canSearchAddress = addressReady && !this.state.loading;
    const canStart = readyToStart && !this.state.loading;
    const setupText = readyToStart
      ? "Ubicacion lista. Revisa que esten todos y apreta iniciar cuando el consejo este completo."
      : "Comparte el link y luego el anfitrion elige la ubicacion para buscar locales.";
    return `
      <div class="question-area">
        <div class="oracle-row">
          ${renderGenie(readyToStart ? "happy" : "focused")}
          <div class="bubble">
            <h2>Lobby del almuerzo</h2>
            <p>${escapeHtml(setupText)}</p>
            ${this.sharePanel()}
            <section class="group-box">
              <div class="group-title"><h3>Personas conectadas</h3></div>
              <div class="people-scores">
                ${this.state.participants
                  .map(
                    (person) => `
                      <div class="person-score">
                        <span>${escapeHtml(person.name)}</span>
                        <b>${person.done ? "OK" : "Entra"}</b>
                      </div>
                    `,
                  )
                  .join("")}
              </div>
            </section>
            ${
              this.state.isHost
                ? `
                  <section class="group-box">
                    <div class="group-title"><h3>Ubicacion del grupo</h3></div>
                    <div class="actions">
                      <button class="secondary" data-action="geolocate" ${this.state.loading ? "disabled" : ""}>Usar mi ubicacion</button>
                      <button class="secondary" data-action="ip-geolocate" ${this.state.loading ? "disabled" : ""}>Ubicacion aproximada</button>
                      <button class="secondary" data-action="sample" ${this.state.loading ? "disabled" : ""}>Probar con Santiago Centro</button>
                    </div>
                    <div class="or-divider"><span>o</span></div>
                    <label class="field-label" for="group-address">Ingresa la direccion manualmente</label>
                    <div class="field-row">
                      <input id="group-address" class="input" data-role="address" value="${escapeHtml(this.state.address)}" placeholder="Ej: Av. Providencia 1234, Santiago" />
                      <button class="primary" data-action="search-address" ${canSearchAddress ? "" : "disabled"}>Buscar</button>
                    </div>
                    ${this.addressSuggestionsPanel()}
                    <button class="primary full" data-action="start-session" ${canStart ? "" : "disabled"} title="${readyToStart ? "" : "Primero elige una ubicacion"}">Iniciar preguntas</button>
                  </section>
                `
                : `<div class="toast">Espera a que el anfitrion elija ubicacion e inicie. Si alguien trae hambre extrema, que levante la mano dramaticamente.</div>`
            }
            ${this.state.message ? `<div class="toast">${escapeHtml(this.state.message)}</div>` : ""}
            ${this.geoFallbackButton()}
            ${this.state.locatingNote ? `<div class="toast alt">${escapeHtml(this.state.locatingNote)}</div>` : ""}
          </div>
        </div>
      </div>
    `;
  }

  geoFallbackButton() {
    if (!this.state.geoFallbackAvailable) return "";
    return `
      <div class="toast alt geo-help">
        <p>El permiso del sitio puede estar correcto y aun asi Windows/Chrome no entregar coordenadas. Puedo usar una ubicacion aproximada por red para destrabar la busqueda.</p>
        <button class="secondary" data-action="ip-geolocate" ${this.state.loading ? "disabled" : ""}>Usar ubicacion aproximada</button>
      </div>
    `;
  }

  locationContent() {
    const addressReady = Boolean((this.state.address || "").trim());
    const canSearchAddress = addressReady && !this.state.loading;
    return `
      <div class="question-area">
        <div class="oracle-row">
          ${renderGenie("curious")}
          <div class="bubble">
            <h2>¿Donde esta el hambre?</h2>
            <p>Usa tu ubicacion o escribe una direccion. Buscare locales cercanos con OpenStreetMap y luego hare preguntas tipo Akinator para recomendarte algo razonable, rico y con un poco de teatro.</p>
            <div class="actions">
              <button class="primary" data-action="geolocate" ${this.state.loading ? "disabled" : ""}>Usar mi ubicacion</button>
              <button class="secondary" data-action="ip-geolocate" ${this.state.loading ? "disabled" : ""}>Ubicacion aproximada</button>
              <button class="secondary" data-action="sample" ${this.state.loading ? "disabled" : ""}>Probar con Santiago Centro</button>
            </div>
            <div class="or-divider"><span>o</span></div>
            <label class="field-label" for="manual-address">Ingresa la direccion manualmente</label>
            <div class="field-row">
              <input id="manual-address" class="input" data-role="address" value="${escapeHtml(this.state.address)}" placeholder="Ej: Av. Providencia 1234, Santiago" />
              <button class="primary" data-action="search-address" ${canSearchAddress ? "" : "disabled"}>Buscar</button>
            </div>
            ${this.addressSuggestionsPanel()}
            ${
              this.state.choiceMode === "group" && this.state.groupMode === "local"
                ? `<section class="group-box">
                    <div class="group-title">
                      <h3>Comensales</h3>
                      <button class="secondary mini" data-action="add-person" ${this.state.loading ? "disabled" : ""}>Sumar persona</button>
                    </div>
                    <div class="people-list">
                      ${this.state.participants
                        .map(
                          (person, index) => `
                            <label class="person-chip">
                              <span>${index + 1}</span>
                              <input data-role="person-name" data-index="${index}" value="${escapeHtml(person.name)}" />
                            </label>
                          `,
                        )
                        .join("")}
                    </div>
                  </section>`
                : ""
            }
            ${this.state.message ? `<div class="toast">${escapeHtml(this.state.message)}</div>` : ""}
            ${this.geoFallbackButton()}
            ${this.state.locatingNote ? `<div class="toast alt">${escapeHtml(this.state.locatingNote)}</div>` : ""}
          </div>
        </div>
      </div>
    `;
  }

  questionContent() {
    const q = this.activeQuestions()[this.state.questionIndex];
    const shuffled = stableShuffle(q.answers, `${q.id}-${this.state.coords?.lat || 0}-${Date.now().toString().slice(0, -4)}`);
    const person = this.currentParticipant();

    return `
      <div class="question-area">
        <div class="oracle-row">
          ${renderGenie(expressionForQuestion(q.id))}
          <div class="bubble">
            <div class="person-banner">
              <span>Turno de</span>
              <b>${escapeHtml(person.name)}</b>
            </div>
            <h2>${escapeHtml(q.text)}</h2>
            <p>${escapeHtml(q.hint)}</p>
            <div class="answer-grid">
              ${shuffled
                .map(
                  (answer) => `
                    <button class="answer" data-action="answer" data-question="${q.id}" data-value="${escapeHtml(
                      String(answer.value),
                    )}" data-delivery="${answer.delivery ? "yes" : "no"}">
                      <strong>${escapeHtml(answer.label)}</strong>
                      <span>${escapeHtml(answer.help)}</span>
                    </button>
                  `,
                )
                .join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  resultContent() {
    const rec = this.state.recommendation;
    if (!rec) {
      return `<div class="question-area"><div class="bubble"><h2>El oraculo se distrajo</h2><p>Intenta de nuevo.</p><button class="primary" data-action="restart">Reiniciar</button></div></div>`;
    }

    const mapsUrl = makeMapsUrl(rec, this.state.coords);
    const reason = rec.reason.join(" ");
    const isAdmin = this.canControlRecommendation();
    const restartLabel = this.isSharedSession() && this.state.isHost ? "Finalizar Sesion" : "Empezar de nuevo";

    return `
      <div class="question-area">
        <div class="oracle-row">
          ${renderGenie("happy")}
          <div class="bubble result">
            <div class="result-head">
              <div class="winner">
              <div>
                <h2>${escapeHtml(rec.name)}</h2>
                <p>${escapeHtml(rec.kind)} a ${formatDistance(rec.distance)}. ${escapeHtml(reason)}</p>
              </div>
              <div class="score">${rec.score}%</div>
              </div>
              <div class="actions result-actions">
                <a class="link-button" href="${mapsUrl}" target="_blank" rel="noreferrer">Ver ubicacion</a>
                ${
                  isAdmin
                    ? `<button class="secondary" data-action="reroll">Otra recomendacion</button>`
                    : ""
                }
                <button class="primary" data-action="restart">${restartLabel}</button>
              </div>
            </div>
            <div class="tags">
              ${rec.badges.map((badge) => `<span class="tag">${escapeHtml(badge)}</span>`).join("")}
            </div>
            ${this.groupCompatibility()}
            ${this.topRecommendations()}
            ${
              this.state.usedFallback
                ? `<div class="toast">No pude obtener locales reales desde la API, asi que use datos de respaldo para que la experiencia siga viva. En navegador con internet deberia consultar OpenStreetMap.</div>`
                : ""
            }
          </div>
        </div>
      </div>
    `;
  }

  factsPanel() {
    const { coords } = this.state;
    const current = this.currentParticipant();
    const delivery = this.state.participants.some((person) => wantsDelivery(person.answers)) ? "Si" : "Opcional";
    const done = this.state.participants.filter((person) => person.done).length;
    const facts = [
      ["Ubicacion", coords ? `${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}` : "Pendiente"],
      ["Locales", this.state.places.length ? String(this.state.places.length) : "Aun no"],
      ["Grupo", `${done}/${this.state.participants.length} listos`],
      ["Turno", current?.name || "Persona 1"],
      ["Delivery", delivery],
      ["Radio", current?.answers.walk ? formatDistance(Number(current.answers.walk)) : "Por decidir"],
    ];

    return `
      <section class="panel">
        <div class="panel-header"><h3>Datos del oraculo</h3></div>
        <div class="panel-body facts">
          ${facts.map(([label, value]) => `<div class="fact"><span>${label}</span><b>${escapeHtml(value)}</b></div>`).join("")}
        </div>
      </section>
    `;
  }

  placesPanel() {
    const places = this.state.places.slice(0, 12);
    return `
      <section class="panel">
        <div class="panel-header"><h3>Locales detectados</h3></div>
        <div class="panel-body places" data-role="places-list">
          ${
            places.length
              ? places.map((place) => this.placeItem(place)).join("")
              : `<p class="muted">Cuando haya ubicacion, aparecera la tropa culinaria cercana.</p>`
          }
        </div>
      </section>
    `;
  }

  placeItem(place) {
    const tags = badgesFor(place).slice(0, 3);
    return `
      <article class="place">
        <h4>${escapeHtml(place.name)}</h4>
        <div class="tiny">${escapeHtml(place.kind)} · ${formatDistance(place.distance)}</div>
        ${place.address ? `<div class="tiny">${escapeHtml(place.address)}</div>` : ""}
        <div class="tags">${tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
      </article>
    `;
  }

  addressSuggestionsPanel() {
    if (this.state.addressSuggesting) {
      return `<div class="address-suggestions"><div class="address-hint">Buscando direcciones...</div></div>`;
    }
    const suggestions = this.state.addressSuggestions || [];
    if (!suggestions.length) return "";
    return `
      <div class="address-suggestions">
        ${suggestions
          .map(
            (item, index) => `
              <button class="address-option" data-action="select-address-suggestion" data-index="${index}">
                <strong>${escapeHtml(item.title || item.label)}</strong>
                <span>${escapeHtml(item.meta || item.label)}</span>
              </button>
            `,
          )
          .join("")}
      </div>
    `;
  }

  bindEvents() {
    this.querySelectorAll("[data-action]").forEach((element) => {
      element.addEventListener("click", (event) => {
        if (event.currentTarget.disabled) return;
        const action = event.currentTarget.dataset.action;
        if (action === "choose-individual") this.chooseIndividual();
        if (action === "choose-group") this.setState({ step: "groupType", choiceMode: "group" });
        if (action === "choose-local-group") this.chooseLocalGroup();
        if (action === "choose-link-group") this.createSession();
        if (action === "back-to-mode") this.setState({ step: "mode", choiceMode: "", groupMode: "" });
        if (action === "save-host-name") this.saveHostName();
        if (action === "geolocate") this.useGeolocation();
        if (action === "ip-geolocate") this.useIpGeolocation();
        if (action === "add-person") this.addParticipant();
        if (action === "create-session") this.createSession();
        if (action === "start-session") this.startSession();
        if (action === "copy-link") this.copyShareLink();
        if (action === "join-session") {
          const input = this.querySelector('[data-role="join-name"]');
          this.joinSession(input.value.trim());
        }
        if (action === "sample") {
          this.setState({ address: "Plaza de Armas, Santiago, Chile", addressSuggestions: [], addressSuggesting: false, loading: true, message: "" });
          this.loadPlaces({ lat: -33.4378, lon: -70.6505 });
        }
        if (action === "search-address") {
          const input = this.querySelector('[data-role="address"]');
          this.lookupAddress(input.value.trim());
        }
        if (action === "select-address-suggestion") this.selectAddressSuggestion(Number(event.currentTarget.dataset.index));
        if (action === "answer") this.answer(event.currentTarget);
        if (action === "reroll") this.finish(true);
        if (action === "select-recommendation") this.selectRecommendation(Number(event.currentTarget.dataset.index));
        if (action === "restart") this.restart();
      });
    });

    const input = this.querySelector('[data-role="address"]');
    if (input) {
      input.addEventListener("input", (event) => {
        const address = event.target.value;
        this.setState({ address });
        this.queueAddressSuggestions(address);
      });
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && event.target.value.trim()) this.lookupAddress(event.target.value.trim());
      });
    }

    const joinInput = this.querySelector('[data-role="join-name"]');
    if (joinInput) {
      joinInput.addEventListener("input", (event) => {
        this.setState({ participantName: event.target.value });
      });
      joinInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && event.target.value.trim()) this.joinSession(event.target.value.trim());
      });
    }

    const hostInput = this.querySelector('[data-role="host-name"]');
    if (hostInput) {
      hostInput.addEventListener("input", (event) => {
        this.setState({ participantName: event.target.value });
      });
      hostInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && event.target.value.trim()) this.saveHostName();
      });
    }

    this.querySelectorAll('[data-role="person-name"]').forEach((input) => {
      input.addEventListener("input", (event) => {
        const index = Number(event.target.dataset.index);
        this.state.participants[index].name = event.target.value.trim() || `Persona ${index + 1}`;
      });
    });
  }

  addParticipant() {
    if (this.state.sessionId) {
      this.setState({ message: "En sesion compartida, cada persona entra desde el link y se suma sola." });
      return;
    }
    const participants = [
      ...this.state.participants,
      {
        id: createId(),
        name: `Persona ${this.state.participants.length + 1}`,
        answers: {},
        done: false,
      },
    ];
    this.setState({ participants });
  }

  chooseIndividual() {
    this.setState({
      step: "locating",
      choiceMode: "individual",
      groupMode: "",
      participants: [{ id: createId(), name: "Persona 1", answers: {}, done: false }],
      activeParticipant: 0,
      message: "",
    });
  }

  chooseLocalGroup() {
    const hostName = this.state.participantName.trim() || "Anfitrion";
    localStorage.setItem("soLunchName", hostName);
    this.setState({
      step: "locating",
      choiceMode: "group",
      groupMode: "local",
      participants: [{ id: createId(), name: hostName, answers: {}, done: false }],
      activeParticipant: 0,
      message: "",
    });
  }

  saveHostName() {
    const hostName = (this.state.participantName || "").trim();
    if (!hostName) {
      this.setState({ message: "Escribe el nombre del anfitrion primero." });
      return;
    }
    localStorage.setItem("soLunchName", hostName);
    const participants = this.state.participants.map((person, index) =>
      index === 0 ? { ...person, name: hostName } : person,
    );
    this.setState({ participantName: hostName, participants, message: `Listo, anfitrion: ${hostName}.` });
  }

  async createSession() {
    const hostName = (this.state.participantName || "").trim();
    if (!hostName) {
      this.setState({ message: "Escribe el nombre del anfitrion antes de crear el grupo por link." });
      return;
    }
    localStorage.setItem("soLunchName", hostName);
    this.setState({ loading: true, message: "" });
    try {
      const { session, participant, links } = await apiPost("/sessions", { name: hostName });
      const shareUrl = preferredShareUrl(session.id, links);
      localStorage.setItem(`soLunchParticipant:${session.id}`, participant.id);
      localStorage.setItem("soLunchName", participant.name);
      this.setState({
        step: "lobby",
        choiceMode: "group",
        groupMode: "link",
        sessionId: session.id,
        participantId: participant.id,
        participantName: participant.name,
        isHost: true,
        shareUrl,
        participants: session.participants,
        loading: false,
        sessionStatus: session.status,
        sessionReady: false,
        message: "Sesion creada. Comparte el link; las preguntas empezaran solo cuando apretes iniciar.",
      });
      window.history.replaceState({}, "", `?session=${session.id}`);
      this.startSync();
    } catch (error) {
      this.setState({ loading: false, message: `No pude crear la sesion: ${error.message}` });
    }
  }

  async joinSession(name) {
    if (!name) {
      this.setState({ message: "Pon tu nombre para que el genio sepa a quien culpar si gana la ensalada." });
      return;
    }
    this.setState({ loading: true, message: "" });
    try {
      const { session, participant, links } = await apiPost(`/sessions/${this.state.sessionId}/join`, { name });
      localStorage.setItem(`soLunchParticipant:${session.id}`, participant.id);
      localStorage.setItem("soLunchName", participant.name);
      this.applySession(session, participant.id);
      this.setState({
        loading: false,
        step: session.status === "started" ? "questions" : session.status === "finished" ? "result" : "lobby",
        participantName: participant.name,
        shareUrl: preferredShareUrl(session.id, links),
        message: "",
      });
      this.startSync();
    } catch (error) {
      if (error.expired) {
        this.handleExpiredSession(error.message);
        return;
      }
      this.setState({ loading: false, message: `No pude entrar a la sesion: ${error.message}` });
    }
  }

  async connectToSession() {
    try {
      const { session, links } = await apiGet(`/sessions/${this.state.sessionId}`);
      if (links?.length) this.state.shareUrl = preferredShareUrl(session.id, links);
      const knownParticipant = session.participants.find((person) => person.id === this.state.participantId);
      if (!knownParticipant) {
        this.setState({
          step: "joining",
          participants: session.participants,
          sessionReady: Boolean(session.setup),
          sessionStatus: session.status,
          isHost: false,
          message: session.locked ? "Esta sesion ya empezo y no acepta mas personas." : "",
        });
        return;
      }
      this.applySession(session, knownParticipant.id);
      this.startSync();
    } catch (error) {
      if (error.expired) {
        this.handleExpiredSession(error.message);
        return;
      }
      this.setState({ step: "joining", message: `No pude cargar la sesion: ${error.message}` });
    }
  }

  startSync() {
    if (this.syncTimer) clearInterval(this.syncTimer);
    this.syncTimer = setInterval(() => this.syncSession(), 1800);
  }

  async syncSession() {
    if (!this.state.sessionId) return;
    try {
      const { session, links } = await apiGet(`/sessions/${this.state.sessionId}`);
      if (links?.length) this.state.shareUrl = preferredShareUrl(session.id, links);
      if (session.updatedAt === this.state.sessionUpdatedAt) return;
      this.applySession(session, this.state.participantId);
    } catch (error) {
      if (error.expired) this.handleExpiredSession(error.message);
      // Keep the UI usable if a poll fails.
    }
  }

  handleExpiredSession(message = "La sesion expiro. Crea una nueva para volver a jugar.") {
    if (this.syncTimer) clearInterval(this.syncTimer);
    if (this.state.sessionId) localStorage.removeItem(`soLunchParticipant:${this.state.sessionId}`);
    window.history.replaceState({}, "", window.location.pathname);
    this.setState({
      step: "joining",
      sessionId: "",
      participantId: "",
      participants: [],
      sessionReady: false,
      sessionStatus: "expired",
      loading: false,
      message,
    });
  }

  applySession(session, participantId = this.state.participantId, shouldRender = true) {
    const setup = session.setup;
    const participant = session.participants.find((person) => person.id === participantId);
    const allDone = setup && session.participants.length > 0 && session.participants.every((person) => person.done);
    const patch = {
      participants: session.participants,
      participantId,
      isHost: Boolean(participantId && session.hostId === participantId),
      shareUrl: this.state.shareUrl || makeShareUrl(session.id),
      sessionUpdatedAt: session.updatedAt,
      sessionReady: Boolean(setup),
      sessionStatus: session.status,
      resultIndex: Number(session.resultIndex) || 0,
      coords: setup?.coords || this.state.coords,
      places: setup?.places || this.state.places,
      sessionQuestions: setup?.questions?.length ? setup.questions : this.state.sessionQuestions,
      usedFallback: setup?.usedFallback ?? this.state.usedFallback,
    };

    if (session.status === "lobby") {
      patch.step = participant ? "lobby" : "joining";
    }

    if (setup && session.status === "started" && participant && !participant.done && ["joining", "waiting", "locating", "lobby"].includes(this.state.step)) {
      patch.step = "questions";
      patch.questionIndex = answeredCount(participant.answers, setup.questions);
    }

    if (setup && session.status === "started" && participant?.done && !allDone && this.state.step !== "result") {
      patch.step = "waiting";
    }

    if (allDone || session.status === "finished") {
      patch.recommendation = recommendGroupLunch(setup.places, session.participants, null, Number(session.resultIndex) || 0);
      patch.step = "result";
    }

    if (shouldRender) this.setState(patch);
    else this.state = { ...this.state, ...patch };
  }

  async copyShareLink() {
    try {
      await navigator.clipboard.writeText(this.state.shareUrl);
      this.setState({ message: "Link copiado. Ahora a perseguir indecisos." });
    } catch {
      this.setState({ message: "No pude copiar automaticamente. Puedes seleccionar el link manualmente." });
    }
  }

  async useGeolocation() {
    const availability = await geolocationAvailability();
    if (!availability.ok) {
      this.setState({
        loading: false,
        locatingNote: "",
        message: availability.message,
        geoFallbackAvailable: true,
      });
      return;
    }

    this.setState({
      loading: true,
      message: "",
      geoFallbackAvailable: false,
      locatingNote: "Pidiendo ubicacion al navegador. Si aparece un permiso, aceptalo; si estas en celular, activa GPS.",
    });

    try {
      const position = await getBestPosition();
      const coords = normalizePosition(position);
      const address = await reverseGeocode(coords).catch(() => "");
      const accuracy = Math.round(position.coords.accuracy || 0);
      const precisionNote = accuracy
        ? accuracy <= 250
          ? `Ubicacion tomada con buena precision: aprox. ${accuracy} m.`
          : `Ubicacion tomada, pero la precision es amplia: aprox. ${accuracy} m. Si el mapa queda lejos, escribe una direccion.`
        : "Ubicacion tomada por el navegador.";
      this.state.address = address || this.state.address;
      this.state.locatingNote = precisionNote;
      await this.loadPlaces(coords);
    } catch (error) {
      this.setState({
        loading: false,
        locatingNote: "",
        message: geolocationErrorMessage(error),
        geoFallbackAvailable: true,
      });
    }
  }

  async useIpGeolocation() {
    this.setState({
      loading: true,
      message: "",
      geoFallbackAvailable: false,
      locatingNote: "Calculando ubicacion aproximada por red. Puede quedar a nivel comuna/ciudad.",
    });

    try {
      const { location } = await apiGet("/location/ip");
      const coords = { lat: Number(location.lat), lon: Number(location.lon) };
      if (!Number.isFinite(coords.lat) || !Number.isFinite(coords.lon)) throw new Error("Ubicacion aproximada invalida");
      this.state.address = location.label || this.state.address;
      this.state.locatingNote = `Ubicacion aproximada por red: ${location.label || "sin etiqueta"}. Si queda lejos, escribe una direccion.`;
      await this.loadPlaces(coords);
    } catch (error) {
      this.setState({
        loading: false,
        locatingNote: "",
        geoFallbackAvailable: false,
        message: `Tampoco pude calcular ubicacion aproximada por red (${error.message}). Escribe una direccion y seguimos.`,
      });
    }
  }

  async lookupAddress(address) {
    if (!address) {
      this.setState({ message: "Necesito una direccion. El hambre es poderosa, pero no adivina coordenadas." });
      return;
    }

    this.setState({ loading: true, address, addressSuggestions: [], addressSuggesting: false, message: "", locatingNote: "Buscando esa direccion sin mover la silla." });
    try {
      const { location } = await apiGet(`/geocode?q=${encodeURIComponent(address)}`);
      await this.loadPlaces({ lat: Number(location.lat), lon: Number(location.lon) });
    } catch (error) {
      this.setState({
        loading: false,
        locatingNote: "",
        message: `${error.message}. Prueba con calle, comuna y pais.`,
      });
    }
  }

  queueAddressSuggestions(address) {
    if (this.addressSuggestTimer) clearTimeout(this.addressSuggestTimer);
    const query = address.trim();
    if (query.length < 3) {
      this.addressSuggestRequest = (this.addressSuggestRequest || 0) + 1;
      this.setState({ addressSuggestions: [], addressSuggesting: false });
      return;
    }
    const requestId = (this.addressSuggestRequest || 0) + 1;
    this.addressSuggestRequest = requestId;
    this.addressSuggestTimer = setTimeout(() => this.fetchAddressSuggestions(query, requestId), 320);
  }

  async fetchAddressSuggestions(query, requestId) {
    this.setState({ addressSuggesting: true });
    try {
      const { locations } = await apiGet(`/geocode-suggestions?q=${encodeURIComponent(query)}`);
      if (requestId !== this.addressSuggestRequest) return;
      this.setState({ addressSuggestions: locations || [], addressSuggesting: false });
    } catch {
      if (requestId !== this.addressSuggestRequest) return;
      this.setState({ addressSuggestions: [], addressSuggesting: false });
    }
  }

  async selectAddressSuggestion(index) {
    const suggestion = this.state.addressSuggestions[index];
    if (!suggestion) return;
    if (this.addressSuggestTimer) clearTimeout(this.addressSuggestTimer);
    this.addressSuggestRequest = (this.addressSuggestRequest || 0) + 1;
    this.setState({
      address: suggestion.label,
      addressSuggestions: [],
      addressSuggesting: false,
      loading: true,
      message: "",
      locatingNote: "Usando la direccion seleccionada. El genio se puso lentes para leer el mapa.",
    });
    await this.loadPlaces({ lat: Number(suggestion.lat), lon: Number(suggestion.lon) });
  }

  async loadPlaces(coords) {
    try {
      const places = await fetchNearbyPlaces(coords, 3000);
      const sessionQuestions = pickQuestions();
      const usablePlaces = places.length ? places : fallbackPlaces;
      this.setState({
        coords,
        places: usablePlaces,
        addressSuggestions: [],
        addressSuggesting: false,
        step: this.state.sessionId ? "lobby" : "questions",
        questionIndex: 0,
        activeParticipant: 0,
        loading: false,
        usedFallback: !places.length,
        sessionQuestions,
        sessionReady: Boolean(this.state.sessionId),
        message: this.state.sessionId
          ? "Ubicacion lista. Cuando esten todos, apreta iniciar preguntas."
          : places.length ? "" : "No encontre locales reales cerca de ahi; usare respaldo.",
      });
      await this.publishSetup(coords, usablePlaces, sessionQuestions, !places.length);
    } catch (error) {
      if (error.quotaBlocked) {
        const quota = error.quota || {};
        this.setState({
          coords,
          places: [],
          addressSuggestions: [],
          addressSuggesting: false,
          loading: false,
          usedFallback: false,
          sessionReady: false,
          message: `${error.message} Quedan ${quota.remainingProtected ?? 0} consultas protegidas y el contador se reinicia en ${quota.resetsIn || "el proximo mes"}.`,
        });
        return;
      }
      const sessionQuestions = pickQuestions();
      this.setState({
        coords,
        places: fallbackPlaces,
        addressSuggestions: [],
        addressSuggesting: false,
        step: this.state.sessionId ? "lobby" : "questions",
        questionIndex: 0,
        activeParticipant: 0,
        loading: false,
        usedFallback: true,
        sessionQuestions,
        sessionReady: Boolean(this.state.sessionId),
        message: this.state.sessionId
          ? `Use datos de respaldo porque la API externa no respondio (${error.message}). Ya puedes iniciar.`
          : `La API externa no respondio (${error.message}). Active plan B con servilleta y dignidad.`,
      });
      await this.publishSetup(coords, fallbackPlaces, sessionQuestions, true);
    }
  }

  async publishSetup(coords, places, questions, usedFallback) {
    if (!this.state.sessionId || !this.state.participantId) return;
    await apiPost(`/sessions/${this.state.sessionId}/setup`, {
      coords,
      places,
      questions,
      usedFallback,
    }).catch((error) => {
      this.setState({ message: `No pude sincronizar la ubicacion con el grupo: ${error.message}` });
    });
  }

  async startSession() {
    if (!this.state.sessionId || !this.state.isHost) return;
    if (!this.state.sessionReady) {
      this.setState({ message: "Primero elige una ubicacion para buscar locales." });
      return;
    }
    this.setState({ loading: true, message: "" });
    try {
      const { session } = await apiPost(`/sessions/${this.state.sessionId}/start`, {});
      this.applySession(session, this.state.participantId);
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false, message: `No pude iniciar: ${error.message}` });
    }
  }

  answer(button) {
    const question = button.dataset.question;
    const rawValue = button.dataset.value;
    const value = question === "walk" ? Number(rawValue) : rawValue;
    const person = this.currentParticipant();
    const answers = { ...person.answers, [question]: value };
    if (button.dataset.delivery === "yes") answers.delivery = true;
    const participants = this.state.participants.map((item, index) =>
      index === this.state.activeParticipant ? { ...item, answers } : item,
    );

    const nextIndex = this.state.questionIndex + 1;
    const questions = this.activeQuestions();
    if (this.isSharedSession()) {
      if (nextIndex >= questions.length) {
        const completed = participants.map((item) =>
          item.id === this.state.participantId ? { ...item, answers, done: true } : item,
        );
        this.setState({ participants: completed, questionIndex: nextIndex, step: "waiting" });
        this.saveRemoteParticipant(answers, true);
        return;
      }
      this.setState({ participants, answers, questionIndex: nextIndex });
      this.saveRemoteParticipant(answers, false);
      return;
    }

    if (nextIndex >= questions.length) {
      const completed = participants.map((item, index) =>
        index === this.state.activeParticipant ? { ...item, answers, done: true } : item,
      );
      const nextParticipant = completed.findIndex((item, index) => index > this.state.activeParticipant && !item.done);
      if (nextParticipant !== -1) {
        this.setState({
          participants: completed,
          answers: {},
          activeParticipant: nextParticipant,
          questionIndex: 0,
          message: `${completed[this.state.activeParticipant].name} listo. Ahora le toca a ${completed[nextParticipant].name}.`,
        });
        return;
      }
      this.state.participants = completed;
      this.finish(false);
      return;
    }

    this.setState({ participants, answers, questionIndex: nextIndex });
  }

  async saveRemoteParticipant(answers, done) {
    const person = this.currentParticipant();
    if (!this.state.sessionId || !person?.id) return;
    try {
      const { session } = await apiPost(`/sessions/${this.state.sessionId}/participant`, {
        id: person.id,
        name: person.name,
        answers,
        done,
      });
      this.applySession(session, person.id);
    } catch (error) {
      this.setState({ message: `No pude guardar tu respuesta: ${error.message}` });
    }
  }

  async finish(reroll = false) {
    if (reroll && this.isSharedSession()) {
      this.setState({ loading: true, message: "" });
      try {
        const { session } = await apiPost(`/sessions/${this.state.sessionId}/recommendation-next`, {});
        this.applySession(session, this.state.participantId);
        this.setState({ loading: false });
      } catch (error) {
        this.setState({ loading: false, message: `No pude cambiar recomendacion: ${error.message}` });
      }
      return;
    }
    const resultIndex = reroll ? this.state.resultIndex + 1 : this.state.resultIndex;
    const recommendation = recommendGroupLunch(
      this.state.places,
      this.state.participants,
      null,
      resultIndex,
    );
    this.setState({ recommendation, resultIndex, step: "result", loading: false });
  }

  async selectRecommendation(index) {
    if (!Number.isInteger(index) || index < 0) return;
    if (!this.canControlRecommendation()) {
      this.setState({ message: "Solo el administrador puede cambiar la recomendacion del grupo." });
      return;
    }

    if (this.isSharedSession()) {
      this.setState({ loading: true, message: "" });
      try {
        const { session } = await apiPost(`/sessions/${this.state.sessionId}/recommendation-select`, { index });
        this.applySession(session, this.state.participantId);
        this.setState({ loading: false });
      } catch (error) {
        this.setState({ loading: false, message: `No pude seleccionar recomendacion: ${error.message}` });
      }
      return;
    }

    const recommendation = recommendGroupLunch(this.state.places, this.state.participants, null, index);
    this.setState({ recommendation, resultIndex: index, step: "result" });
  }

  canControlRecommendation() {
    return !this.isSharedSession() || this.state.isHost;
  }

  async restart() {
    const sessionId = this.state.sessionId;
    const shouldCloseSharedSession = Boolean(sessionId && this.state.isHost);
    if (shouldCloseSharedSession) {
      this.setState({ loading: true, message: "Cerrando sesion grupal..." });
      await apiPost(`/sessions/${sessionId}/close`, { participantId: this.state.participantId }).catch(() => null);
    }
    if (this.syncTimer) clearInterval(this.syncTimer);
    if (sessionId) localStorage.removeItem(`soLunchParticipant:${sessionId}`);
    window.history.replaceState({}, "", window.location.pathname);
    this.setState({
      step: "mode",
      address: "",
      addressSuggestions: [],
      addressSuggesting: false,
      coords: null,
      places: [],
      questionIndex: 0,
      answers: {},
      participants: [{ id: createId(), name: "Persona 1", answers: {}, done: false }],
      activeParticipant: 0,
      sessionQuestions: pickQuestions(),
      sessionId: "",
      participantId: "",
      participantName: localStorage.getItem("soLunchName") || "",
      isHost: false,
      shareUrl: "",
      sessionReady: false,
      sessionStatus: "local",
      sessionUpdatedAt: 0,
      choiceMode: "",
      groupMode: "",
      loading: false,
      message: "",
      recommendation: null,
      usedFallback: false,
      locatingNote: "",
      geoFallbackAvailable: false,
    });
  }

  groupCompatibility() {
    const rec = this.state.recommendation;
    if (!rec?.peopleScores?.length || this.state.participants.length < 2) return "";
    return `
      <section class="compatibility">
        <h3>Compatibilidad del grupo</h3>
        <div class="people-scores">
          ${rec.peopleScores
            .map(
              (item) => `
                <div class="person-score">
                  <span>${escapeHtml(item.name)}</span>
                  <b>${item.score}%</b>
                </div>
              `,
            )
            .join("")}
        </div>
      </section>
    `;
  }

  topRecommendations() {
    const alternatives = this.state.recommendation?.alternatives || [];
    if (!alternatives.length) return "";
    const isAdmin = this.canControlRecommendation();
    const items = alternatives
      .map((item, index) => {
        const content = `
          <span>${index + 1}</span>
          <div>
            <b>${escapeHtml(item.name)}</b>
            <small>${escapeHtml(item.kind)} - ${formatDistance(item.distance)}</small>
          </div>
          <strong>${item.score}%</strong>
        `;
        const activeClass = item.id === this.state.recommendation.id ? "is-active" : "";
        return isAdmin
          ? `<button class="top-item ${activeClass}" data-action="select-recommendation" data-index="${index}">${content}</button>`
          : `<div class="top-item ${activeClass}">${content}</div>`;
      })
      .join("");
    return `
      <section class="compatibility">
        <h3>Top 3 recomendaciones</h3>
        <div class="top-list">
          ${items}
        </div>
      </section>
    `;
  }
}

customElements.define("lunch-oracle", LunchOracle);

async function fetchNearbyPlaces(coords, radius) {
  const data = await apiGet(`/places?lat=${encodeURIComponent(coords.lat)}&lon=${encodeURIComponent(coords.lon)}&radius=${encodeURIComponent(radius)}`);
  return data.places || [];
}

async function reverseGeocode(coords) {
  const data = await apiGet(`/reverse?lat=${encodeURIComponent(coords.lat)}&lon=${encodeURIComponent(coords.lon)}`);
  return data.location?.label || "";
}

async function geolocationAvailability() {
  const localHostnames = new Set(["localhost", "127.0.0.1", "::1"]);
  if (!window.isSecureContext && !localHostnames.has(window.location.hostname)) {
    return {
      ok: false,
      message:
        "El navegador bloqueo la geolocalizacion porque la pagina no esta en HTTPS. Usa una direccion manual o abre la version publicada con HTTPS.",
    };
  }

  if (!navigator.geolocation) {
    return {
      ok: false,
      message: "Este navegador no entrega geolocalizacion. Escribe una direccion y seguimos.",
    };
  }

  if (navigator.permissions?.query) {
    try {
      const permission = await navigator.permissions.query({ name: "geolocation" });
      if (permission.state === "denied") {
        return {
          ok: false,
          message:
            "El permiso de ubicacion esta bloqueado para esta pagina. Cambialo en la configuracion del navegador o escribe una direccion.",
        };
      }
    } catch {
      // Some browsers do not support querying geolocation permission cleanly.
    }
  }

  return { ok: true };
}

function getBestPosition() {
  return getPositionOnce({ enableHighAccuracy: true, maximumAge: 0, timeout: 9000 }).catch((firstError) =>
    getPositionOnce({ enableHighAccuracy: false, maximumAge: 600000, timeout: 7000 }).catch(() => {
      throw firstError;
    }),
  );
}

function getPositionOnce(options) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!isUsablePosition(position)) {
          reject(new Error("POSITION_UNAVAILABLE"));
          return;
        }
        resolve(position);
      },
      reject,
      options,
    );
  });
}

function isUsablePosition(position) {
  const latitude = position?.coords?.latitude;
  const longitude = position?.coords?.longitude;
  return Number.isFinite(latitude) && Number.isFinite(longitude) && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180;
}

function normalizePosition(position) {
  if (!isUsablePosition(position)) throw new Error("POSITION_UNAVAILABLE");
  return {
    lat: Number(position.coords.latitude),
    lon: Number(position.coords.longitude),
  };
}

function geolocationErrorMessage(error) {
  if (error?.code === 1) {
    return "El navegador rechazo el permiso de ubicacion. Revisa permisos del sitio o escribe una direccion.";
  }
  if (error?.code === 2 || error?.message === "POSITION_UNAVAILABLE") {
    return "El sitio tiene permiso, pero el navegador no recibio coordenadas del sistema. En Windows revisa Configuracion > Privacidad y seguridad > Ubicacion, o usa la ubicacion aproximada por red.";
  }
  if (error?.code === 3) {
    return "El navegador se demoro demasiado entregando ubicacion. Puedes reintentar, usar ubicacion aproximada o escribir una direccion.";
  }
  return "No pude obtener tu ubicacion actual. Escribe una direccion y seguimos.";
}

function recommendLunch(places, answers, avoidId = null, rankIndex = 0) {
  const maxWalk = Number(answers.walk || 1500);
  const delivery = wantsDelivery(answers);
  const candidates = places
    .filter((place) => place.id !== avoidId)
    .map((place) => scorePlace(place, answers, maxWalk, delivery))
    .sort((a, b) => b.rawScore - a.rawScore);

  const selected = candidates.length ? candidates[rankIndex % candidates.length] : null;
  const best = selected || scorePlace(fallbackPlaces[0], answers, maxWalk, delivery);
  return {
    ...best.place,
    score: Math.max(62, Math.min(99, Math.round(best.rawScore))),
    reason: best.reason,
    badges: badgesFor(best.place, answers),
    alternatives: candidates.slice(0, 3).map((candidate) => recommendationSummary(candidate.place, candidate.rawScore)),
  };
}

function recommendGroupLunch(places, participants, avoidId = null, rankIndex = 0) {
  const readyPeople = participants.filter((person) => Object.keys(person.answers || {}).length);
  if (readyPeople.length <= 1) {
    return recommendLunch(places, readyPeople[0]?.answers || {}, avoidId, rankIndex);
  }

  const candidates = places
    .filter((place) => place.id !== avoidId)
    .map((place) => {
      const scored = readyPeople.map((person) => {
        const maxWalk = Number(person.answers.walk || 1500);
        const delivery = wantsDelivery(person.answers);
        const result = scorePlace(place, person.answers, maxWalk, delivery);
        return {
          name: person.name,
          raw: result.rawScore,
          score: Math.max(40, Math.min(99, Math.round(result.rawScore))),
          reason: result.reason,
        };
      });
      const average = scored.reduce((sum, item) => sum + item.raw, 0) / scored.length;
      const lowest = Math.min(...scored.map((item) => item.raw));
      const spread = Math.max(...scored.map((item) => item.raw)) - lowest;
      const rawScore = average + lowest * 0.22 - spread * 0.34;
      return { place, peopleScores: scored, rawScore };
    })
    .sort((a, b) => b.rawScore - a.rawScore);

  const selected = candidates.length ? candidates[rankIndex % candidates.length] : null;
  const best = selected || {
    place: fallbackPlaces[0],
    peopleScores: [],
    rawScore: 70,
  };
  const groupScore = Math.max(62, Math.min(99, Math.round(best.rawScore)));
  const lowest = best.peopleScores.reduce((min, item) => (item.score < min.score ? item : min), best.peopleScores[0]);
  const reason = [
    `Es la opcion mas compatible para ${readyPeople.length} personas.`,
    lowest ? `Incluso ${lowest.name} queda razonablemente cubierto.` : "El consejo del hambre queda conforme.",
  ];

  return {
    ...best.place,
    score: groupScore,
    reason,
    peopleScores: best.peopleScores.map((item) => ({ ...item, score: Math.max(45, Math.min(99, item.score)) })),
    badges: badgesFor(best.place, mergeAnswers(readyPeople.map((person) => person.answers))),
    alternatives: candidates.slice(0, 3).map((candidate) => recommendationSummary(candidate.place, candidate.rawScore)),
  };
}

function recommendationSummary(place, rawScore) {
  return {
    id: place.id,
    name: place.name,
    kind: place.kind,
    distance: place.distance,
    lat: place.lat,
    lon: place.lon,
    address: place.address,
    mapsQuery: place.mapsQuery,
    score: Math.max(62, Math.min(99, Math.round(rawScore))),
  };
}

function mergeAnswers(answerList) {
  return answerList.reduce((merged, answers) => {
    Object.entries(answers).forEach(([key, value]) => {
      if (key === "delivery" && value) merged.delivery = true;
      if (merged[key] === undefined) merged[key] = value;
    });
    return merged;
  }, {});
}

function scorePlace(place, answers, maxWalk, delivery) {
  let score = 58;
  const reason = [];
  const cuisine = `${place.cuisine} ${place.kind}`.toLowerCase();
  const seed = `${place.id}-${JSON.stringify(answers)}`;
  const preferred = new Set([
    ...(cuisineMap[answers.mood] || []),
    ...(cuisineMap[answers.flavor] || []),
  ]);

  if (preferred.size && [...preferred].some((item) => cuisine.includes(item))) {
    score += 18;
    reason.push("Calza con el antojo declarado.");
  }

  if (place.distance <= maxWalk) {
    score += 15;
    reason.push("Esta a una distancia razonable.");
  } else {
    score -= Math.min(18, (place.distance - maxWalk) / 130);
  }

  if (answers.speed === "fast" && place.distance < 900) score += 9;
  if (answers.speed === "delivery" || delivery) score += deliveryScore(place);
  if (answers.budget === "low" && /fast_food|sandwich|cafe|menu|chilean|empanada/i.test(cuisine)) score += 7;
  if (answers.budget === "high" && /restaurant|sushi|peruvian|italian|steak/i.test(cuisine)) score += 5;
  if (answers.risk === "safe" && /pizza|burger|sandwich|chilean|cafe/i.test(cuisine)) score += 7;
  if (answers.risk === "bold" && /thai|korean|indian|ramen|vegan|peruvian/i.test(cuisine)) score += 9;
  if (answers.nap === "focus" && /salad|poke|sushi|cafe|vegetarian|vegan/i.test(cuisine)) score += 7;
  if (answers.nap === "sleepy" && /pizza|burger|sandwich|peruvian|chilean/i.test(cuisine)) score += 6;
  if (answers.nap === "sport" && /salad|chicken|poke|japanese|vegetarian/i.test(cuisine)) score += 8;
  if (answers.mess === "clean" && /sushi|salad|poke|cafe/i.test(cuisine)) score += 6;
  if (answers.mess === "messy" && /burger|sandwich|pizza|barbecue/i.test(cuisine)) score += 7;
  if (answers.temperature === "hot" && /ramen|soup|chilean|peruvian|pizza|cafe/i.test(cuisine)) score += 6;
  if (answers.temperature === "fresh" && /salad|sushi|poke|vegetarian|vegan/i.test(cuisine)) score += 7;
  if (answers.temperature === "spicy" && /thai|korean|indian|mexican|peruvian/i.test(cuisine)) score += 8;
  if (answers.company === "group" && /pizza|burger|sandwich|restaurant|food court/i.test(cuisine)) score += 5;
  if (answers.company === "takeaway") score += deliveryScore(place);
  if (answers.decision === "simple" && /pizza|burger|sandwich|chilean|cafe/i.test(cuisine)) score += 6;
  if (answers.decision === "explore") score += seededNumber(`${seed}-explore`) * 9;
  if (answers.risk === "oracle") score += seededNumber(`${seed}-oracle`) * 12;
  if (answers.mood === "random") score += seededNumber(`${seed}-random`) * 18;
  score += Math.max(-4, Math.min(8, Number(place.quality) || 0));

  score += Math.max(0, 12 - place.distance / 250);
  if (!reason.length) reason.push("No es perfecto, pero el hambre aprobo la mocion.");
  if (delivery && deliveryScore(place) > 0) reason.push("Tiene senales de delivery o retiro.");

  return { place, rawScore: score, reason };
}

function deliveryScore(place) {
  const delivery = String(place.tags.delivery || "").toLowerCase();
  const takeaway = String(place.tags.takeaway || "").toLowerCase();
  if (delivery === "yes") return 15;
  if (takeaway === "yes") return 9;
  return place.distance < 1500 ? 5 : -4;
}

function badgesFor(place, answers = {}) {
  const badges = [];
  if (place.cuisine) badges.push(humanizeCuisine(place.cuisine));
  if (place.distance < 800) badges.push("Cerca");
  if (String(place.tags.delivery || "").toLowerCase() === "yes" || wantsDelivery(answers)) badges.push("Delivery");
  if (String(place.tags.takeaway || "").toLowerCase() === "yes") badges.push("Retiro");
  if (!badges.length) badges.push(place.kind);
  return [...new Set(badges)].slice(0, 5);
}

function wantsDelivery(answers) {
  return Boolean(answers.delivery || answers.speed === "delivery");
}

function makeMapsUrl(place, coords) {
  const fallbackNear = coords ? ` cerca de ${coords.lat.toFixed(6)},${coords.lon.toFixed(6)}` : "";
  const queryText =
    place.mapsQuery ||
    [place.name, place.address, place.kind].filter(Boolean).join(", ") ||
    (Number.isFinite(place.lat) && Number.isFinite(place.lon) ? `${place.lat},${place.lon}` : `local de comida${fallbackNear}`);
  const query = encodeURIComponent(queryText);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function renderGenie(expression) {
  return `
    <div class="genie genie-${expression}" aria-hidden="true">
      <div class="genie-aura"></div>
      <div class="genie-turban">
        <i class="turban-band"></i>
        <i class="turban-jewel"></i>
        <i class="turban-feather"></i>
        <span></span>
      </div>
      <div class="genie-head">
        <i class="ear left"></i>
        <i class="ear right"></i>
        <i class="brow left"></i>
        <i class="brow right"></i>
        <i class="eye left"></i>
        <i class="eye right"></i>
        <i class="nose"></i>
        <i class="mustache left"></i>
        <i class="mustache right"></i>
        <i class="mouth"></i>
        <i class="beard"></i>
        <i class="earring left"></i>
        <i class="earring right"></i>
      </div>
      <div class="genie-body">
        <i class="arm left"></i>
        <i class="arm right"></i>
        <i class="hand left"></i>
        <i class="hand right"></i>
        <i class="shirt"></i>
        <i class="vest"></i>
        <i class="belt"></i>
        <i class="belt-jewel"></i>
      </div>
      <div class="genie-smoke">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
}

function expressionForQuestion(id) {
  const expressions = {
    mood: "curious",
    speed: "focused",
    budget: "suspicious",
    flavor: "happy",
    walk: "focused",
    risk: "suspicious",
    nap: "sleepy",
    mess: "shocked",
    temperature: "happy",
    company: "curious",
    decision: "focused",
  };
  return expressions[id] || "curious";
}

function formatDistance(meters) {
  if (!Number.isFinite(meters)) return "distancia misteriosa";
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function humanizeCuisine(value) {
  if (!value) return "";
  return value
    .split(";")[0]
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function haversine(lat1, lon1, lat2, lon2) {
  const toRad = (number) => (number * Math.PI) / 180;
  const earth = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return earth * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function stableShuffle(items, salt) {
  return [...items]
    .map((item, index) => ({ item, sort: seededNumber(`${salt}-${index}`) }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function pickQuestions() {
  const required = randomItems(["mood", "speed", "flavor", "walk"], 3);
  const requiredQuestions = required.map((id) => questionPool.find((question) => question.id === id));
  const optional = questionPool.filter((question) => !required.includes(question.id));
  return [...requiredQuestions, ...randomItems(optional, 2)].filter(Boolean);
}

function randomItems(items, count) {
  return [...items]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .slice(0, count)
    .map(({ item }) => item);
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

function createId() {
  return `person-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function makeShareUrl(sessionId) {
  const url = new URL(window.location.href);
  url.searchParams.set("session", sessionId);
  return url.toString();
}

function preferredShareUrl(sessionId, links = []) {
  const remoteFriendly = links.find((link) => !link.includes("127.0.0.1") && !link.includes("localhost"));
  return remoteFriendly || links[0] || makeShareUrl(sessionId);
}

function answeredCount(answers = {}, questions = []) {
  const ids = new Set(Object.keys(answers));
  return Math.min(
    questions.length,
    questions.reduce((count, question) => count + (ids.has(question.id) ? 1 : 0), 0),
  );
}

async function apiGet(path) {
  const response = await fetch(`${API_BASE}${path}`, { headers: { Accept: "application/json" } });
  return parseApiResponse(response);
}

async function apiPost(path, payload) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload || {}),
  });
  return parseApiResponse(response);
}

async function parseApiResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || "Error de servidor");
    error.status = response.status;
    error.expired = Boolean(data.expired) || response.status === 410;
    error.quotaBlocked = Boolean(data.quotaBlocked) || response.status === 429;
    error.quota = data.quota || null;
    throw error;
  }
  return data;
}

function seededNumber(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(Math.sin(hash));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

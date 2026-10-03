"use strict";

const image = (photo, width = 900) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&q=82`;

const recipes = [
  {
    id: "tiramisu", name: "Tiramisú clásico", category: "Sin horno", time: 35, difficulty: "Fácil",
    description: "Capas de café, mascarpone cremoso y cacao. Un clásico italiano para compartir.",
    image: image("photo-1571877227200-a0d98ea607e9"), timerMinutes: 240,
    ingredients: ["250 g de queso mascarpone", "200 ml de crema para batir", "3 huevos, claras y yemas separadas", "80 g de azúcar", "200 g de soletillas", "250 ml de café espresso frío", "Cacao sin azúcar para espolvorear"],
    steps: ["Bate las yemas con el azúcar hasta obtener una mezcla pálida y espesa. Incorpora el mascarpone hasta que no queden grumos.", "Monta la crema a punto suave. Bate las claras a punto de nieve e integra ambas preparaciones con movimientos envolventes.", "Pasa rápidamente las soletillas por el café y cubre con ellas el fondo de un molde. Añade una capa de crema.", "Repite las capas, cubre y refrigera al menos 4 horas. Espolvorea cacao justo antes de servir."]
  },
  {
    id: "brownies", name: "Brownies de chocolate", category: "Galletas y barras", time: 40, difficulty: "Fácil",
    description: "Centro húmedo, bordes ligeramente crujientes y todo el sabor del chocolate.",
    image: image("photo-1606313564200-e75d5e30476c"), timerMinutes: 25,
    ingredients: ["180 g de chocolate semiamargo", "120 g de mantequilla", "180 g de azúcar", "2 huevos grandes", "90 g de harina", "25 g de cacao en polvo", "1 pizca de sal", "60 g de nueces troceadas (opcional)"],
    steps: ["Precalienta el horno a 175 °C y forra un molde cuadrado con papel para hornear.", "Derrite el chocolate con la mantequilla a baño maría o en intervalos cortos. Deja templar.", "Bate los huevos con el azúcar; agrega el chocolate. Incorpora la harina, el cacao y la sal sin sobrebatir. Añade las nueces.", "Vierte en el molde y hornea de 22 a 25 minutos. El centro debe quedar ligeramente húmedo. Deja enfriar antes de cortar."]
  },
  {
    id: "pay-limon", name: "Pay de limón", category: "Sin horno", time: 30, difficulty: "Fácil",
    description: "Relleno sedoso y cítrico sobre una base crujiente de galleta.",
    image: image("photo-1519915028121-7d3463d20b13"), timerMinutes: 180,
    ingredients: ["200 g de galletas tipo María", "90 g de mantequilla derretida", "1 lata de leche condensada (397 g)", "180 ml de jugo de limón", "3 yemas", "Ralladura de 2 limones", "Crema batida para decorar"],
    steps: ["Tritura las galletas y mézclalas con la mantequilla. Presiona la mezcla en un molde para pay y refrigera 15 minutos.", "Bate las yemas con la leche condensada, el jugo y la ralladura de limón hasta integrar.", "Vierte el relleno sobre la base. Refrigera al menos 3 horas o hasta que esté firme.", "Decora con crema batida y ralladura fresca antes de servir."]
  },
  {
    id: "cheesecake", name: "Cheesecake de frutos rojos", category: "Pasteles", time: 75, difficulty: "Intermedia",
    description: "Tarta de queso suave con una corona brillante de frutos del bosque.",
    image: image("photo-1533134242443-d4fd215305ad"), timerMinutes: 55,
    ingredients: ["200 g de galletas digestivas", "90 g de mantequilla derretida", "600 g de queso crema a temperatura ambiente", "160 g de azúcar", "3 huevos", "150 g de crema agria", "1 cucharadita de vainilla", "200 g de frutos rojos"],
    steps: ["Precalienta el horno a 160 °C. Tritura las galletas, mézclalas con mantequilla y presiona en la base de un molde desmontable.", "Bate el queso crema con el azúcar a velocidad baja. Agrega los huevos de uno en uno; incorpora la crema agria y la vainilla.", "Vierte sobre la base y hornea a baño maría durante 50–55 minutos. El centro debe temblar ligeramente.", "Apaga el horno, deja la puerta entreabierta 30 minutos y luego enfría. Refrigera al menos 4 horas y sirve con frutos rojos."]
  },
  {
    id: "churros", name: "Churros caseros", category: "Tradicionales", time: 35, difficulty: "Intermedia",
    description: "Dorados, crujientes y cubiertos de azúcar con canela. Mejor recién hechos.",
    image: image("photo-1624371414361-e670edf4898d"), timerMinutes: 3,
    ingredients: ["250 ml de agua", "50 g de mantequilla", "1 cucharada de azúcar", "150 g de harina", "1 pizca de sal", "2 huevos", "Aceite vegetal para freír", "100 g de azúcar y 1 cucharadita de canela"],
    steps: ["Calienta el agua con la mantequilla, el azúcar y la sal hasta que hierva. Retira del fuego y añade toda la harina de golpe.", "Mezcla enérgicamente hasta formar una masa lisa que se despegue de las paredes. Deja entibiar y agrega los huevos uno por uno.", "Pasa la masa a una manga con boquilla de estrella. Calienta el aceite a 175 °C y forma tiras directamente sobre el aceite, cortándolas con tijeras.", "Fríe por tandas durante 2–3 minutos, girando para dorar por todos lados. Escurre y reboza en azúcar con canela."]
  },
  {
    id: "galletas", name: "Galletas con chispas", category: "Galletas y barras", time: 28, difficulty: "Fácil",
    description: "Galletas suaves por dentro, con chocolate derretido en cada mordida.",
    image: image("photo-1499636136210-6f4ee915583e"), timerMinutes: 11,
    ingredients: ["125 g de mantequilla suave", "100 g de azúcar morena", "50 g de azúcar blanca", "1 huevo", "1 cucharadita de vainilla", "190 g de harina", "½ cucharadita de bicarbonato", "150 g de chispas de chocolate"],
    steps: ["Precalienta el horno a 180 °C y prepara dos bandejas con papel para hornear.", "Bate la mantequilla con ambos azúcares hasta que esté cremosa. Agrega el huevo y la vainilla.", "Incorpora la harina y el bicarbonato; añade las chispas. Forma bolitas y colócalas separadas en la bandeja.", "Hornea 10–12 minutos, hasta que los bordes estén dorados. Deja reposar 5 minutos antes de pasarlas a una rejilla."]
  },
  {
    id: "flan", name: "Flan de caramelo", category: "Tradicionales", time: 65, difficulty: "Fácil",
    description: "El postre de siempre: delicado, cremoso y bañado en caramelo casero.",
    image: image("photo-1470324161839-ce2bb6fa6bc3"), timerMinutes: 50,
    ingredients: ["150 g de azúcar para el caramelo", "500 ml de leche entera", "4 huevos", "100 g de azúcar", "1 cucharadita de vainilla", "1 pizca de sal"],
    steps: ["Precalienta el horno a 160 °C. Calienta el azúcar en una sartén hasta obtener un caramelo ámbar y repártelo en el fondo de seis flaneras.", "Entibia la leche sin dejar que hierva. Bate los huevos con el azúcar, la vainilla y la sal.", "Vierte la leche poco a poco sobre los huevos mientras mezclas. Cuela la preparación y llena los moldes.", "Coloca los moldes en una fuente con agua caliente hasta la mitad y hornea 45–50 minutos. Enfría y refrigera antes de desmoldar."]
  },
  {
    id: "tarta-manzana", name: "Tarta rústica de manzana", category: "Pasteles", time: 60, difficulty: "Intermedia",
    description: "Manzanas con canela sobre una masa dorada, sencilla y sin molde.",
    image: image("photo-1568571780765-9276ac8b75a2"), timerMinutes: 40,
    ingredients: ["200 g de harina", "100 g de mantequilla fría", "2 cucharadas de azúcar", "4 cucharadas de agua fría", "3 manzanas", "2 cucharadas de azúcar morena", "1 cucharadita de canela", "1 huevo batido para barnizar"],
    steps: ["Mezcla la harina con el azúcar. Desmenuza la mantequilla fría hasta obtener migas y agrega el agua poco a poco. Forma un disco y refrigera 20 minutos.", "Corta las manzanas en láminas y mézclalas con el azúcar morena y la canela.", "Extiende la masa en un círculo sobre papel para hornear. Coloca las manzanas en el centro y pliega los bordes hacia adentro.", "Barniza los bordes con huevo y hornea a 190 °C durante 35–40 minutos, hasta que la masa esté dorada."]
  }
];

const placeholderImage = "assets/postre-placeholder.svg";
const favoritesKey = "dulce-pausa-favorites";
const state = { category: "Todos", favoritesOnly: false, favorites: new Set(), activeRecipe: null, timerRemaining: 0, timerInterval: null, wakeLock: null, toastTimeout: null };
const grid = document.querySelector("#recipe-grid");
const searchInput = document.querySelector("#search-input");
const dialog = document.querySelector("#recipe-dialog");
const dialogContent = document.querySelector("#dialog-content");
const toast = document.querySelector("#toast");

function announce(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(state.toastTimeout);
  state.toastTimeout = setTimeout(() => toast.classList.remove("visible"), 3400);
}

function loadFavorites() {
  try {
    const stored = localStorage.getItem(favoritesKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) state.favorites = new Set(parsed.filter((id) => recipes.some((recipe) => recipe.id === id)));
    }
  } catch (error) {
    console.error("No se pudieron cargar los favoritos locales.", error);
    announce("No se pudieron leer tus favoritos guardados en este dispositivo.");
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(favoritesKey, JSON.stringify([...state.favorites]));
    return true;
  } catch (error) {
    console.error("No se pudieron guardar los favoritos locales.", error);
    announce("No fue posible guardar el favorito. Revisa el espacio disponible del navegador.");
    return false;
  }
}

function renderCategories() {
  const categories = ["Todos", ...new Set(recipes.map((recipe) => recipe.category))];
  document.querySelector("#category-filters").innerHTML = categories.map((category) =>
    `<button class="filter-chip" type="button" data-category="${category}" aria-pressed="${state.category === category}">${category}</button>`
  ).join("");
}

function filteredRecipes() {
  const query = searchInput.value.trim().toLocaleLowerCase("es");
  return recipes.filter((recipe) => {
    const matchesCategory = state.category === "Todos" || recipe.category === state.category;
    const matchesSearch = !query || `${recipe.name} ${recipe.description} ${recipe.category} ${recipe.ingredients.join(" ")}`.toLocaleLowerCase("es").includes(query);
    const matchesFavorite = !state.favoritesOnly || state.favorites.has(recipe.id);
    return matchesCategory && matchesSearch && matchesFavorite;
  });
}

function renderRecipes() {
  const visibleRecipes = filteredRecipes();
  grid.innerHTML = visibleRecipes.map((recipe) => `
    <article class="recipe-card">
      <div class="card-image-wrap">
        <img class="card-image" src="${recipe.image}" alt="${recipe.name}" loading="lazy" data-fallback="${placeholderImage}">
        <span class="card-category">${recipe.category}</span>
        <button class="favorite-button" type="button" data-favorite="${recipe.id}" aria-label="${state.favorites.has(recipe.id) ? "Quitar de" : "Añadir a"} favoritos: ${recipe.name}" aria-pressed="${state.favorites.has(recipe.id)}">${state.favorites.has(recipe.id) ? "♥" : "♡"}</button>
      </div>
      <div class="card-body">
        <h3 class="card-title">${recipe.name}</h3>
        <p class="card-description">${recipe.description}</p>
        <div class="card-meta"><span>${recipe.time} min</span><span class="difficulty">${recipe.difficulty}</span></div>
        <button class="card-open" type="button" data-open="${recipe.id}">Ver receta <span aria-hidden="true">→</span></button>
      </div>
    </article>`).join("");
  document.querySelector("#results-summary").textContent = `${visibleRecipes.length} ${visibleRecipes.length === 1 ? "receta" : "recetas"}${state.favoritesOnly ? " en tus favoritos" : ""}`;
  document.querySelector("#empty-state").hidden = visibleRecipes.length > 0;
  document.querySelector("#favorites-toggle").setAttribute("aria-pressed", String(state.favoritesOnly));
  document.querySelector(".favorites-label").textContent = state.favoritesOnly ? "Ver todas" : "Ver favoritos";
}

function showRecipe(id) {
  const recipe = recipes.find((item) => item.id === id);
  if (!recipe) return;
  stopTimer();
  exitCookMode();
  state.activeRecipe = recipe;
  state.timerRemaining = recipe.timerMinutes * 60;
  dialogContent.innerHTML = `
    <section class="detail-hero">
      <img class="detail-image" src="${recipe.image}" alt="${recipe.name}" data-fallback="${placeholderImage}">
      <div><p class="eyebrow">${recipe.category.toUpperCase()}</p><h2 class="detail-title" id="dialog-title">${recipe.name}</h2>
      <p class="detail-description">${recipe.description}</p>
      <div class="detail-meta"><span>◷ ${recipe.time} min en total</span><span>${recipe.difficulty}</span><span>⏱ ${formatTime(recipe.timerMinutes * 60)} de horneado/preparación</span></div></div>
    </section>
    <div class="recipe-columns">
      <section aria-labelledby="ingredients-title"><h3 id="ingredients-title">Ingredientes</h3><ul class="ingredient-list">${recipe.ingredients.map((item) => `<li>${item}</li>`).join("")}</ul></section>
      <section aria-labelledby="steps-title"><h3 id="steps-title">Paso a paso</h3><ol class="step-list">${recipe.steps.map((step) => `<li>${step}</li>`).join("")}</ol></section>
    </div>
    <section class="timer-panel" aria-label="Temporizador de preparación">
      <div class="timer-heading"><strong>Temporizador</strong><span class="timer-display" id="timer-display" role="timer" aria-live="off">${formatTime(state.timerRemaining)}</span></div>
      <div class="timer-controls"><button class="timer-button primary" type="button" id="timer-start">Iniciar</button><button class="timer-button" type="button" id="timer-reset">Reiniciar ${recipe.timerMinutes} min</button></div>
    </section>
    <button class="cook-mode-button" id="cook-mode" type="button" aria-pressed="false">✦ Activar modo cocina</button>`;
  dialogContent.querySelector("#timer-start").addEventListener("click", toggleTimer);
  dialogContent.querySelector("#timer-reset").addEventListener("click", resetTimer);
  dialogContent.querySelector("#cook-mode").addEventListener("click", toggleCookMode);
  dialogContent.querySelectorAll("img[data-fallback]").forEach((img) => img.addEventListener("error", useFallbackImage, { once: true }));
  dialog.showModal();
  dialog.querySelector(".close-dialog").focus();
}

function useFallbackImage(event) {
  const img = event.target;
  if (!(img instanceof HTMLImageElement)) return;
  if (img.src.endsWith(img.dataset.fallback)) return;
  img.src = img.dataset.fallback;
}

function formatTime(seconds) {
  const safeSeconds = Math.max(0, seconds);
  return `${String(Math.floor(safeSeconds / 60)).padStart(2, "0")}:${String(safeSeconds % 60).padStart(2, "0")}`;
}

function updateTimerDisplay() {
  const display = dialogContent.querySelector("#timer-display");
  if (display) display.textContent = formatTime(state.timerRemaining);
}

function toggleTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
    dialogContent.querySelector("#timer-start").textContent = "Continuar";
    return;
  }
  if (state.timerRemaining <= 0) resetTimer();
  dialogContent.querySelector("#timer-start").textContent = "Pausar";
  state.timerInterval = setInterval(() => {
    state.timerRemaining -= 1;
    updateTimerDisplay();
    if (state.timerRemaining <= 0) {
      stopTimer();
      dialogContent.querySelector("#timer-start").textContent = "Iniciar de nuevo";
      announce("¡Se terminó el tiempo! Revisa tu postre.");
      if ("Notification" in window && Notification.permission === "granted") new Notification("Dulce Pausa", { body: "¡Se terminó el tiempo! Revisa tu postre.", icon: "assets/icon.svg" });
    }
  }, 1000);
}

function stopTimer() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = null;
}

function resetTimer() {
  stopTimer();
  state.timerRemaining = state.activeRecipe.timerMinutes * 60;
  updateTimerDisplay();
  dialogContent.querySelector("#timer-start").textContent = "Iniciar";
}

async function toggleCookMode() {
  if (document.body.classList.contains("cook-mode-active")) {
    exitCookMode();
    announce("Modo cocina desactivado.");
    return;
  }
  document.body.classList.add("cook-mode-active");
  dialogContent.querySelector("#cook-mode").textContent = "✓ Desactivar modo cocina";
  dialogContent.querySelector("#cook-mode").setAttribute("aria-pressed", "true");
  if ("wakeLock" in navigator) {
    try {
      state.wakeLock = await navigator.wakeLock.request("screen");
      state.wakeLock.addEventListener("release", () => { state.wakeLock = null; });
      announce("Modo cocina activado. La pantalla permanecerá encendida mientras esta pestaña esté visible.");
    } catch (error) {
      console.error("No se pudo activar Wake Lock.", error);
      announce("Modo cocina activo. El navegador no permitió mantener la pantalla encendida.");
    }
  } else {
    announce("Modo cocina activo. Este navegador no permite evitar que la pantalla se apague.");
  }
}

function exitCookMode() {
  document.body.classList.remove("cook-mode-active");
  if (state.wakeLock) {
    state.wakeLock.release().catch((error) => console.error("No se pudo liberar Wake Lock.", error));
    state.wakeLock = null;
  }
  const button = dialogContent.querySelector("#cook-mode");
  if (button) {
    button.textContent = "✦ Activar modo cocina";
    button.setAttribute("aria-pressed", "false");
  }
}

function toggleFavorite(id) {
  const wasFavorite = state.favorites.has(id);
  if (wasFavorite) {
    state.favorites.delete(id);
  } else {
    state.favorites.add(id);
  }
  if (saveFavorites()) {
    renderRecipes();
    announce(wasFavorite ? "Postre eliminado de favoritos." : "Postre guardado en favoritos.");
  } else if (wasFavorite) {
    state.favorites.add(id);
  } else {
    state.favorites.delete(id);
  }
}

function setConnectionStatus() {
  const online = navigator.onLine;
  const status = document.querySelector("#connection-status");
  status.classList.toggle("offline", !online);
  document.querySelector("#connection-label").textContent = online ? "Tu cocina está conectada" : "Estás en modo sin conexión";
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    document.querySelector("#connection-label").textContent = navigator.onLine ? "Recetario listo" : "Modo sin conexión";
    return;
  }
  navigator.serviceWorker.register("./sw.js").then(() => {
    if (!navigator.onLine) setConnectionStatus();
  }).catch((error) => {
    console.error("No se pudo registrar el Service Worker.", error);
    announce("No fue posible activar el modo offline. Abre la aplicación desde un servidor seguro (HTTPS o localhost).");
  });
}

document.querySelector("#category-filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  renderCategories();
  renderRecipes();
});
document.querySelector("#favorites-toggle").addEventListener("click", () => {
  state.favoritesOnly = !state.favoritesOnly;
  renderRecipes();
});
document.querySelector("#clear-search").addEventListener("click", () => {
  searchInput.value = "";
  state.category = "Todos";
  state.favoritesOnly = false;
  renderCategories();
  renderRecipes();
});
searchInput.addEventListener("input", renderRecipes);
grid.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");
  if (favoriteButton) {
    toggleFavorite(favoriteButton.dataset.favorite);
    return;
  }
  const openButton = event.target.closest("[data-open]");
  if (openButton) showRecipe(openButton.dataset.open);
});
grid.addEventListener("error", useFallbackImage, true);
dialog.addEventListener("close", () => {
  stopTimer();
  exitCookMode();
});
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
});
document.addEventListener("visibilitychange", async () => {
  if (document.visibilityState === "visible" && document.body.classList.contains("cook-mode-active") && "wakeLock" in navigator && !state.wakeLock) {
    try {
      state.wakeLock = await navigator.wakeLock.request("screen");
    } catch (error) {
      console.error("No se pudo reactivar Wake Lock.", error);
    }
  }
});
window.addEventListener("online", setConnectionStatus);
window.addEventListener("offline", setConnectionStatus);

loadFavorites();
renderCategories();
renderRecipes();
setConnectionStatus();
registerServiceWorker();

"use strict";

const image = (photo, width = 900) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&q=82`;

const DESSERTS_API_URL = "https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert";
const RECIPE_API_URL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
const TRANSLATION_URL = "https://api.mymemory.translated.net/get";
const dessertCacheKey = "dulce-pausa-themealdb-desserts";
const mealDetailsCacheKey = "dulce-pausa-themealdb-details";
const translationUsageKey = "dulce-pausa-translation-usage";
const API_PAGE_SIZE = 12;
const MAX_CACHED_MEAL_DETAILS = 20;
const TRANSLATION_DAILY_LIMIT = 4500;
const TRANSLATION_SEGMENT_LIMIT = 450;

const recipes = [
  {
    id: "tiramisu", name: "Tiramisú clásico", category: "Sin horno", time: 275, difficulty: "Fácil",
    description: "Capas de café, mascarpone cremoso y cacao. Un clásico italiano para compartir. Requiere al menos 4 horas de refrigeración.",
    image: image("photo-1571877227200-a0d98ea607e9"), timerMinutes: null,
    ingredients: ["250 g de queso mascarpone", "200 ml de crema para batir", "3 huevos, claras y yemas separadas", "80 g de azúcar", "200 g de soletillas", "250 ml de café espresso frío", "Cacao sin azúcar para espolvorear"],
    steps: ["Bate las yemas con el azúcar hasta obtener una mezcla pálida y espesa. Incorpora el mascarpone hasta que no queden grumos.", "Monta la crema a punto suave. Bate las claras a punto de nieve e integra ambas preparaciones con movimientos envolventes.", "Pasa rápidamente las soletillas por el café y cubre con ellas el fondo de un molde. Añade una capa de crema.", "Repite las capas, cubre y refrigera al menos 4 horas. Espolvorea cacao justo antes de servir."]
  },
  {
    id: "brownies", name: "Brownies de chocolate", category: "Galletas y barras", time: 40, difficulty: "Fácil",
    description: "Centro húmedo, bordes ligeramente crujientes y todo el sabor del chocolate.",
    image: image("photo-1606313564200-e75d5e30476c"), timerMinutes: 25, timerLabel: "Horneado",
    ingredients: ["180 g de chocolate semiamargo", "120 g de mantequilla", "180 g de azúcar", "2 huevos grandes", "90 g de harina", "25 g de cacao en polvo", "1 pizca de sal", "60 g de nueces troceadas (opcional)"],
    steps: ["Precalienta el horno a 175 °C y forra un molde cuadrado con papel para hornear.", "Derrite el chocolate con la mantequilla a baño maría o en intervalos cortos. Deja templar.", "Bate los huevos con el azúcar; agrega el chocolate. Incorpora la harina, el cacao y la sal sin sobrebatir. Añade las nueces.", "Vierte en el molde y hornea de 22 a 25 minutos. El centro debe quedar ligeramente húmedo. Deja enfriar antes de cortar."]
  },
  {
    id: "pay-limon", name: "Pay de limón", category: "Sin horno", time: 225, difficulty: "Fácil",
    description: "Relleno sedoso y cítrico sobre una base crujiente de galleta. Incluye 15 minutos para enfriar la base y al menos 3 horas para que cuaje el relleno.",
    image: image("photo-1519915028121-7d3463d20b13"), timerMinutes: null,
    ingredients: ["200 g de galletas tipo María", "90 g de mantequilla derretida", "1 lata de leche condensada (397 g)", "180 ml de jugo de limón", "3 yemas", "Ralladura de 2 limones", "Crema batida para decorar"],
    steps: ["Tritura las galletas y mézclalas con la mantequilla. Presiona la mezcla en un molde para pay y refrigera 15 minutos.", "Bate las yemas con la leche condensada, el jugo y la ralladura de limón hasta integrar.", "Vierte el relleno sobre la base. Refrigera al menos 3 horas o hasta que esté firme.", "Decora con crema batida y ralladura fresca antes de servir."]
  },
  {
    id: "cheesecake", name: "Cheesecake de frutos rojos", category: "Pasteles", time: 345, difficulty: "Intermedia",
    description: "Tarta de queso suave con una corona brillante de frutos del bosque. Calcula 30 minutos de enfriado en el horno y al menos 4 horas de refrigeración, aparte del horneado.",
    image: image("photo-1533134242443-d4fd215305ad"), timerMinutes: 55, timerLabel: "Horneado",
    ingredients: ["200 g de galletas digestivas", "90 g de mantequilla derretida", "600 g de queso crema a temperatura ambiente", "160 g de azúcar", "3 huevos", "150 g de crema agria", "1 cucharadita de vainilla", "200 g de frutos rojos"],
    steps: ["Precalienta el horno a 160 °C. Tritura las galletas, mézclalas con mantequilla y presiona en la base de un molde desmontable.", "Bate el queso crema con el azúcar a velocidad baja. Agrega los huevos de uno en uno; incorpora la crema agria y la vainilla.", "Vierte sobre la base y hornea a baño maría durante 50–55 minutos. El centro debe temblar ligeramente.", "Apaga el horno, deja la puerta entreabierta 30 minutos y luego enfría. Refrigera al menos 4 horas y sirve con frutos rojos."]
  },
  {
    id: "churros", name: "Churros caseros", category: "Tradicionales", time: 35, difficulty: "Intermedia",
    description: "Dorados, crujientes y cubiertos de azúcar con canela. Mejor recién hechos.",
    image: image("photo-1624371414361-e670edf4898d"), timerMinutes: 3, timerLabel: "Fritura por tanda",
    ingredients: ["250 ml de agua", "50 g de mantequilla", "1 cucharada de azúcar", "150 g de harina", "1 pizca de sal", "2 huevos", "Aceite vegetal para freír", "100 g de azúcar y 1 cucharadita de canela"],
    steps: ["Calienta el agua con la mantequilla, el azúcar y la sal hasta que hierva. Retira del fuego y añade toda la harina de golpe.", "Mezcla enérgicamente hasta formar una masa lisa que se despegue de las paredes. Deja entibiar y agrega los huevos uno por uno.", "Pasa la masa a una manga con boquilla de estrella. Calienta el aceite a 175 °C y forma tiras directamente sobre el aceite, cortándolas con tijeras.", "Fríe por tandas durante 2–3 minutos, girando para dorar por todos lados. Escurre y reboza en azúcar con canela."]
  },
  {
    id: "galletas", name: "Galletas con chispas", category: "Galletas y barras", time: 28, difficulty: "Fácil",
    description: "Galletas suaves por dentro, con chocolate derretido en cada mordida.",
    image: image("photo-1499636136210-6f4ee915583e"), timerMinutes: 11, timerLabel: "Horneado por tanda",
    ingredients: ["125 g de mantequilla suave", "100 g de azúcar morena", "50 g de azúcar blanca", "1 huevo", "1 cucharadita de vainilla", "190 g de harina", "½ cucharadita de bicarbonato", "150 g de chispas de chocolate"],
    steps: ["Precalienta el horno a 180 °C y prepara dos bandejas con papel para hornear.", "Bate la mantequilla con ambos azúcares hasta que esté cremosa. Agrega el huevo y la vainilla.", "Incorpora la harina y el bicarbonato; añade las chispas. Forma bolitas y colócalas separadas en la bandeja.", "Hornea 10–12 minutos, hasta que los bordes estén dorados. Deja reposar 5 minutos antes de pasarlas a una rejilla."]
  },
  {
    id: "flan", name: "Flan de caramelo", category: "Tradicionales", time: 195, difficulty: "Fácil",
    description: "El postre de siempre: delicado, cremoso y bañado en caramelo casero. Considera al menos 2 horas de refrigeración después de hornearlo y enfriarlo.",
    image: image("photo-1653988354010-39637252a2db"), timerMinutes: 50, timerLabel: "Horneado a baño maría",
    ingredients: ["150 g de azúcar para el caramelo", "500 ml de leche entera", "4 huevos", "100 g de azúcar", "1 cucharadita de vainilla", "1 pizca de sal"],
    steps: ["Precalienta el horno a 160 °C. Calienta el azúcar en una sartén hasta obtener un caramelo ámbar y repártelo en el fondo de seis flaneras.", "Entibia la leche sin dejar que hierva. Bate los huevos con el azúcar, la vainilla y la sal.", "Vierte la leche poco a poco sobre los huevos mientras mezclas. Cuela la preparación y llena los moldes.", "Coloca los moldes en una fuente con agua caliente hasta la mitad y hornea 45–50 minutos. Deja enfriar unos 10 minutos y refrigera al menos 2 horas antes de desmoldar."]
  },
  {
    id: "tarta-manzana", name: "Tarta rústica de manzana", category: "Pasteles", time: 80, difficulty: "Intermedia",
    description: "Manzanas con canela sobre una masa dorada, sencilla y sin molde. Incluye 20 minutos de reposo refrigerado para la masa.",
    image: image("photo-1568571780765-9276ac8b75a2"), timerMinutes: 40, timerLabel: "Horneado",
    ingredients: ["200 g de harina", "100 g de mantequilla fría", "2 cucharadas de azúcar", "4 cucharadas de agua fría", "3 manzanas", "2 cucharadas de azúcar morena", "1 cucharadita de canela", "1 huevo batido para barnizar"],
    steps: ["Mezcla la harina con el azúcar. Desmenuza la mantequilla fría hasta obtener migas y agrega el agua poco a poco. Forma un disco y refrigera 20 minutos.", "Corta las manzanas en láminas y mézclalas con el azúcar morena y la canela.", "Extiende la masa en un círculo sobre papel para hornear. Coloca las manzanas en el centro y pliega los bordes hacia adentro.", "Barniza los bordes con huevo y hornea a 190 °C durante 35–40 minutos, hasta que la masa esté dorada."]
  }
];

const placeholderImage = "assets/postre-placeholder.svg";
const favoritesKey = "dulce-pausa-favorites";
const MAX_TIMER_MINUTES = 24 * 60;
let apiRecipes = loadCachedDesserts();
const state = { category: "Todos", favoritesOnly: false, favorites: new Set(), activeRecipe: null, timerDurationSeconds: null, timerRemaining: null, timerEndTimestamp: null, timerInterval: null, wakeLock: null, toastTimeout: null, visibleApiCount: API_PAGE_SIZE, translationPending: false };
const grid = document.querySelector("#recipe-grid");
const searchInput = document.querySelector("#search-input");
const dialog = document.querySelector("#recipe-dialog");
const dialogContent = document.querySelector("#dialog-content");
const catalogStatus = document.querySelector("#catalog-status");
const refreshDessertsButton = document.querySelector("#refresh-desserts");
const loadMoreDessertsButton = document.querySelector("#load-more-desserts");
const toast = document.querySelector("#toast");

function announce(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(state.toastTimeout);
  state.toastTimeout = setTimeout(() => toast.classList.remove("visible"), 3400);
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  })[character]);
}

function safeMealImage(value) {
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && url.hostname === "www.themealdb.com") return url.href;
  } catch (error) {
    console.warn("TheMealDB devolvió una URL de imagen inválida.", error);
  }
  return placeholderImage;
}

function safeRecipeSource(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : "";
  } catch (error) {
    if (value) console.warn("La receta incluye un enlace de origen inválido.", error);
    return "";
  }
}

function parseDurations(text) {
  const durations = [];
  const pattern = /\b(\d{1,3})(?:\s*(?:-|–|to)\s*(\d{1,3}))?\s*(minutes?|mins?|hours?|hrs?)\b/gi;
  for (const match of text.matchAll(pattern)) {
    const low = Number(match[1]);
    const high = Number(match[2] || match[1]);
    const multiplier = match[3].toLowerCase().startsWith("h") ? 60 : 1;
    durations.push(Math.round(((low + high) / 2) * multiplier));
  }
  return durations;
}

function estimateRecipeTime(recipe) {
  if (Number.isFinite(recipe.time) && recipe.time > 0) return recipe.time;
  const preparation = Math.max(15, Math.min(50, Math.round(8 + recipe.ingredients.length + recipe.steps.length * 1.4)));
  let cooking = 0;
  let resting = 0;
  let requiresCooking = false;

  for (const step of recipe.steps) {
    const text = step.toLocaleLowerCase("en");
    const minutes = parseDurations(step).reduce((total, duration) => total + duration, 0);
    if (/refrigerat|chill|cool|rest|stand|set aside|let .* sit/.test(text)) {
      resting += minutes;
    } else if (/bake|oven|fry|cook|boil|simmer|roast|microwave|grill|heat|pan\b/.test(text)) {
      requiresCooking = true;
      cooking += minutes;
    }
  }

  if (requiresCooking && cooking === 0) {
    const instructions = recipe.steps.join(" ").toLocaleLowerCase("en");
    cooking = /bake|oven|roast/.test(instructions) ? 35 : /fry|pan\b/.test(instructions) ? 20 : 15;
  }
  return Math.max(15, Math.min(600, Math.ceil((preparation + cooking + resting) / 5) * 5));
}

function splitTranslationSegments(text) {
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  return sentences.flatMap((sentence) => {
    const trimmed = sentence.trim();
    if (new TextEncoder().encode(trimmed).length <= TRANSLATION_SEGMENT_LIMIT) return [trimmed];
    const chunks = [];
    let chunk = "";
    for (const word of trimmed.split(/\s+/)) {
      const candidate = chunk ? `${chunk} ${word}` : word;
      if (new TextEncoder().encode(candidate).length > TRANSLATION_SEGMENT_LIMIT && chunk) {
        chunks.push(chunk);
        chunk = word;
      } else {
        chunk = candidate;
      }
    }
    if (chunk) chunks.push(chunk);
    return chunks;
  }).filter(Boolean);
}

function translationCharactersUsed() {
  try {
    const usage = JSON.parse(localStorage.getItem(translationUsageKey) || "{}");
    return usage.date === new Date().toISOString().slice(0, 10) ? Number(usage.characters) || 0 : 0;
  } catch (error) {
    console.error("No se pudo leer el uso diario de traducción.", error);
    throw new Error("No se pudo comprobar el límite diario de traducción en este navegador.");
  }
}

function reserveTranslationCharacters(characters) {
  const used = translationCharactersUsed();
  if (used + characters > TRANSLATION_DAILY_LIMIT) {
    throw new Error("Se alcanzó el límite diario de traducción gratuita. Inténtalo mañana o consulta la receta original.");
  }
  try {
    localStorage.setItem(translationUsageKey, JSON.stringify({
      date: new Date().toISOString().slice(0, 10),
      characters: used + characters
    }));
  } catch (error) {
    console.error("No se pudo guardar el límite de traducción.", error);
    throw new Error("El navegador no pudo guardar el control de uso de traducción.");
  }
}

async function translateSentence(sentence) {
  const url = new URL(TRANSLATION_URL);
  url.searchParams.set("q", sentence);
  url.searchParams.set("langpair", "en|es-MX");
  const data = await fetchJson(url.href);
  if (data.responseStatus !== 200 || !data.responseData?.translatedText) {
    throw new Error(data.responseDetails || "El servicio no devolvió una traducción.");
  }
  const decoder = document.createElement("textarea");
  decoder.innerHTML = data.responseData.translatedText;
  return decoder.value;
}

async function translateParagraph(text) {
  const segments = splitTranslationSegments(text);
  const translations = [];
  for (const segment of segments) translations.push(await translateSentence(segment));
  return translations.join(" ");
}

async function translateMealRecipe(recipe) {
  if (!navigator.onLine) throw new Error("Conéctate a internet para traducir esta receta.");
  const sourceTexts = [recipe.name, recipe.description, ...recipe.ingredients, ...recipe.steps];
  const characterCount = sourceTexts.flatMap(splitTranslationSegments)
    .reduce((total, segment) => total + segment.length, 0);
  reserveTranslationCharacters(characterCount);
  const translateList = (items) => Promise.all(items.map(translateParagraph));
  const [name, description, ingredients, steps] = await Promise.all([
    translateParagraph(recipe.name),
    translateParagraph(recipe.description),
    translateList(recipe.ingredients),
    translateList(recipe.steps)
  ]);
  return { name, description, ingredients, steps };
}

function normalizeMealSummary(meal) {
  if (!meal) return null;
  const mealId = String(meal.mealId || meal.idMeal || "");
  const name = meal.name || meal.strMeal;
  if (!/^\d+$/.test(mealId) || typeof name !== "string" || !name.trim()) return null;
  return {
    id: `meal-${mealId}`,
    mealId,
    name: name.trim(),
    category: "Recetas internacionales",
    time: null,
    difficulty: "No especificada",
    description: "Una receta dulce de distintas partes del mundo. Abre para consultar ingredientes e instrucciones.",
    image: safeMealImage(meal.image || meal.strMealThumb),
    ingredients: []
  };
}

function loadCachedDesserts() {
  try {
    const stored = localStorage.getItem(dessertCacheKey);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) throw new TypeError("La caché local de postres no tiene el formato esperado.");
    return parsed.map(normalizeMealSummary).filter(Boolean);
  } catch (error) {
    console.error("No se pudieron recuperar los postres guardados para uso offline.", error);
    return [];
  }
}

function saveCachedDesserts(desserts) {
  try {
    localStorage.setItem(dessertCacheKey, JSON.stringify(desserts));
  } catch (error) {
    console.error("No se pudieron guardar los postres online para uso offline.", error);
    catalogStatus.textContent = "Recetas cargadas. El navegador no permitió guardar una copia offline.";
  }
}

function setCatalogStatus(message, isError = false) {
  catalogStatus.textContent = message;
  catalogStatus.toggleAttribute("data-error", isError);
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`El servicio respondió HTTP ${response.status}.`);
    return await response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}

async function loadDesserts() {
  if (!navigator.onLine) {
    setCatalogStatus(apiRecipes.length
      ? `Sin conexión. Se muestran ${apiRecipes.length} recetas adicionales guardadas en este dispositivo.`
      : "Sin conexión. Tu recetario guardado sigue disponible.");
    return;
  }

  refreshDessertsButton.disabled = true;
  setCatalogStatus("Buscando más recetas...");
  try {
    const data = await fetchJson(DESSERTS_API_URL);
    if (!Array.isArray(data.meals)) throw new TypeError("La respuesta de TheMealDB no contiene la lista esperada de postres.");
    apiRecipes = data.meals.map(normalizeMealSummary).filter(Boolean);
    state.visibleApiCount = API_PAGE_SIZE;
    saveCachedDesserts(apiRecipes);
    renderCategories();
    renderRecipes();
    setCatalogStatus(apiRecipes.length
      ? `Encontramos ${apiRecipes.length} recetas internacionales. Algunas están en inglés: puedes traducirlas al español al abrirlas.`
      : "No encontramos recetas adicionales para mostrar.");
  } catch (error) {
    console.error("No se pudieron cargar las recetas internacionales.", error);
    setCatalogStatus(apiRecipes.length
      ? `No se pudieron actualizar las recetas. Se conservan ${apiRecipes.length} recetas guardadas y el recetario local.`
      : "No se pudieron cargar más recetas. Tu recetario local sigue disponible; intenta actualizar cuando tengas conexión.",
    true);
  } finally {
    refreshDessertsButton.disabled = false;
  }
}

function loadCachedMealDetails() {
  try {
    const stored = localStorage.getItem(mealDetailsCacheKey);
    if (!stored) return {};
    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new TypeError("La caché de detalles de recetas tiene un formato inválido.");
    return parsed;
  } catch (error) {
    console.error("No se pudieron leer los detalles de recetas guardados.", error);
    return {};
  }
}

function normalizeMealDetails(meal) {
  if (meal && /^\d+$/.test(String(meal.mealId || "")) && Array.isArray(meal.ingredients) && Array.isArray(meal.steps)) {
    return {
      ...meal,
      id: `meal-${meal.mealId}`,
      name: String(meal.name || ""),
      category: "Recetas internacionales",
      time: Number(meal.time) || estimateRecipeTime(meal),
      timeEstimated: true,
      difficulty: "No especificada",
      image: safeMealImage(meal.image),
      sourceUrl: safeRecipeSource(meal.sourceUrl),
      translation: meal.translation && Array.isArray(meal.translation.ingredients) && Array.isArray(meal.translation.steps)
        ? meal.translation
        : null,
      translated: Boolean(meal.translated)
    };
  }
  if (!meal || !/^\d+$/.test(String(meal.idMeal || "")) || typeof meal.strMeal !== "string") {
    throw new TypeError("TheMealDB devolvió un detalle de receta incompleto.");
  }
  const ingredients = [];
  for (let index = 1; index <= 20; index += 1) {
    const ingredient = meal[`strIngredient${index}`]?.trim();
    if (!ingredient) continue;
    const measure = meal[`strMeasure${index}`]?.trim();
    ingredients.push([measure, ingredient].filter(Boolean).join(" "));
  }
  const instructions = String(meal.strInstructions || "").trim();
  const steps = instructions
    .replace(/([.!?])\s+(?=[A-ZÁÉÍÓÚÑ])/g, "$1\n")
    .split(/\r?\n+/)
    .map((step) => step.replace(/^[\s▢•]+/, "").trim())
    .filter(Boolean);
  if (!ingredients.length || !steps.length) throw new TypeError("TheMealDB no proporcionó ingredientes o instrucciones para esta receta.");
  const recipe = {
    id: `meal-${meal.idMeal}`,
    mealId: String(meal.idMeal),
    name: meal.strMeal.trim(),
    category: "Recetas internacionales",
    time: 0,
    difficulty: "No especificada",
    description: [meal.strArea, meal.strCategory].filter(Boolean).join(" · ") || "Receta dulce internacional.",
    image: safeMealImage(meal.strMealThumb),
    ingredients,
    steps,
    timerMinutes: null,
    timerLabel: null,
    sourceUrl: safeRecipeSource(meal.strSource),
    translation: null,
    translated: false,
    timeEstimated: true
  };
  recipe.time = estimateRecipeTime(recipe);
  return recipe;
}

function saveMealDetails(recipe) {
  try {
    const cachedDetails = loadCachedMealDetails();
    delete cachedDetails[recipe.mealId];
    cachedDetails[recipe.mealId] = recipe;
    const recentDetails = Object.entries(cachedDetails).slice(-MAX_CACHED_MEAL_DETAILS);
    localStorage.setItem(mealDetailsCacheKey, JSON.stringify(Object.fromEntries(recentDetails)));
  } catch (error) {
    console.error("No se pudo guardar el detalle de la receta para uso offline.", error);
    announce("La receta está disponible ahora, pero no se pudo guardar para consultarla offline.");
  }
}

async function fetchMealDetails(recipe) {
  const cached = loadCachedMealDetails()[recipe.mealId];
  if (cached) return normalizeMealDetails(cached);
  const data = await fetchJson(`${RECIPE_API_URL}${encodeURIComponent(recipe.mealId)}`);
  if (!Array.isArray(data.meals) || !data.meals.length) throw new Error("TheMealDB no encontró el detalle de este postre.");
  const details = normalizeMealDetails(data.meals[0]);
  saveMealDetails(details);
  return details;
}

function loadFavorites() {
  try {
    const stored = localStorage.getItem(favoritesKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) state.favorites = new Set(parsed.filter((id) =>
        recipes.some((recipe) => recipe.id === id) || /^meal-\d+$/.test(String(id))
      ));
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
  const categories = ["Todos", ...new Set([...recipes, ...apiRecipes].map((recipe) => recipe.category))];
  document.querySelector("#category-filters").innerHTML = categories.map((category) =>
    `<button class="filter-chip" type="button" data-category="${category}" aria-pressed="${state.category === category}">${category}</button>`
  ).join("");
}

function filteredRecipes() {
  const query = searchInput.value.trim().toLocaleLowerCase("es");
  return [...recipes, ...apiRecipes].filter((recipe) => {
    const matchesCategory = state.category === "Todos" || recipe.category === state.category;
    const matchesSearch = !query || `${recipe.name} ${recipe.description} ${recipe.category} ${recipe.ingredients.join(" ")}`.toLocaleLowerCase("es").includes(query);
    const matchesFavorite = !state.favoritesOnly || state.favorites.has(recipe.id);
    return matchesCategory && matchesSearch && matchesFavorite;
  });
}

function renderRecipes() {
  const matches = filteredRecipes();
  const localRecipes = matches.filter((recipe) => !recipe.mealId);
  const matchingApiRecipes = matches.filter((recipe) => recipe.mealId);
  const visibleRecipes = [...localRecipes, ...matchingApiRecipes.slice(0, state.visibleApiCount)];
  grid.innerHTML = visibleRecipes.map((recipe) => `
    <article class="recipe-card">
      <div class="card-image-wrap">
        <img class="card-image" src="${escapeHTML(recipe.image)}" alt="${escapeHTML(recipe.name)}" loading="lazy" data-fallback="${placeholderImage}">
        <span class="card-category">${escapeHTML(recipe.category)}</span>
        <button class="favorite-button" type="button" data-favorite="${escapeHTML(recipe.id)}" aria-label="${state.favorites.has(recipe.id) ? "Quitar de" : "Añadir a"} favoritos: ${escapeHTML(recipe.name)}" aria-pressed="${state.favorites.has(recipe.id)}">${state.favorites.has(recipe.id) ? "♥" : "♡"}</button>
      </div>
      <div class="card-body">
        <h3 class="card-title">${escapeHTML(recipe.name)}</h3>
        <p class="card-description">${escapeHTML(recipe.description)}</p>
        <div class="card-meta"><span class="card-total-time">${recipe.time ? `${recipe.mealId ? "Aprox. " : ""}${escapeHTML(formatDuration(recipe.time))}` : "Tiempo por confirmar"}</span><span class="difficulty">${escapeHTML(recipe.difficulty)}</span></div>
        <button class="card-open" type="button" data-open="${escapeHTML(recipe.id)}">Ver receta <span aria-hidden="true">→</span></button>
      </div>
    </article>`).join("");
  const apiShown = Math.min(matchingApiRecipes.length, state.visibleApiCount);
  document.querySelector("#results-summary").textContent = `${visibleRecipes.length} ${visibleRecipes.length === 1 ? "receta" : "recetas"}${state.favoritesOnly ? " en tus favoritos" : ""}${matchingApiRecipes.length > apiShown ? ` · ${apiShown} de ${matchingApiRecipes.length} recetas adicionales` : ""}`;
  document.querySelector("#empty-state").hidden = visibleRecipes.length > 0;
  loadMoreDessertsButton.hidden = matchingApiRecipes.length <= apiShown;
  document.querySelector("#favorites-toggle").setAttribute("aria-pressed", String(state.favoritesOnly));
  document.querySelector(".favorites-label").textContent = state.favoritesOnly ? "Ver todas" : "Ver favoritos";
}

async function showRecipe(id) {
  let recipe = recipes.find((item) => item.id === id) || apiRecipes.find((item) => item.id === id);
  if (!recipe) return;
  stopTimer();
  exitCookMode();
  state.activeRecipe = recipe;
  state.timerDurationSeconds = Number.isInteger(recipe.timerMinutes) && recipe.timerMinutes > 0 ? recipe.timerMinutes * 60 : null;
  state.timerRemaining = state.timerDurationSeconds;
  if (recipe.mealId) {
    dialogContent.innerHTML = `<p class="api-detail-loading" role="status">Cargando ingredientes e instrucciones...</p>`;
    dialog.showModal();
    try {
      recipe = await fetchMealDetails(recipe);
      state.activeRecipe = recipe;
    } catch (error) {
      console.error(`No se pudo cargar el detalle de ${recipe.name}.`, error);
      dialogContent.innerHTML = `<section class="api-detail-error" role="alert"><h2 id="dialog-title">No se pudo cargar la receta</h2><p>Comprueba tu conexión o inténtalo de nuevo. Si ya habías consultado esta receta, vuelve a conectarte para cargarla y guardarla offline.</p><button class="text-button" type="button" data-retry-recipe="${escapeHTML(state.activeRecipe.id)}">Intentar de nuevo</button></section>`;
      announce("No fue posible cargar los ingredientes y pasos.");
      return;
    }
    apiRecipes = apiRecipes.map((item) => item.id === recipe.id ? { ...item, ...recipe } : item);
    renderRecipes();
  }
  renderRecipeDetails(recipe);
  dialog.showModal();
  dialog.querySelector(".close-dialog").focus();
}

function renderRecipeDetails(recipe) {
  const translation = recipe.translated ? recipe.translation : null;
  const displayName = translation?.name || recipe.name;
  const displayDescription = translation?.description || recipe.description;
  const displayIngredients = translation?.ingredients || recipe.ingredients;
  const displaySteps = translation?.steps || recipe.steps;
  const translationStatus = recipe.translation
    ? "Traducción automática: puede contener errores o conservar términos en inglés. Contrástala con la receta original."
    : "";
  dialogContent.innerHTML = `
    <section class="detail-hero">
      <img class="detail-image" src="${escapeHTML(recipe.image)}" alt="${escapeHTML(displayName)}" data-fallback="${placeholderImage}">
      <div><p class="eyebrow">${escapeHTML(recipe.category.toUpperCase())}</p><h2 class="detail-title" id="dialog-title">${escapeHTML(displayName)}</h2>
      <p class="detail-description">${escapeHTML(displayDescription)}</p>
      ${recipe.time ? `<div class="detail-time-total"><span>${recipe.timeEstimated ? "Tiempo total aproximado" : "Tiempo total estimado"}</span><strong>${escapeHTML(formatDuration(recipe.time))}</strong><small>${recipe.timeEstimated ? "Estimación orientativa calculada a partir de los ingredientes, pasos y duraciones mencionadas; puede variar." : "Incluye preparación, cocción y los tiempos de reposo indicados."}${recipe.sourceUrl ? ` <a href="${escapeHTML(recipe.sourceUrl)}" target="_blank" rel="noopener noreferrer">Ver receta original</a>` : ""}</small></div>` : ""}
      <div class="detail-meta"><span>${escapeHTML(recipe.difficulty)}</span>${recipe.timerMinutes ? `<span>⏱ ${escapeHTML(recipe.timerLabel)}: ${recipe.timerMinutes} min</span>` : `<span>${recipe.mealId ? "Temporizador ajustable" : "Sin cocción cronometrada"}</span>`}</div></div>
    </section>
    ${recipe.mealId ? `<section class="translation-tools" aria-label="Idioma de la receta"><button class="text-button translation-button" id="toggle-translation" type="button" ${state.translationPending ? "disabled" : ""}>${state.translationPending ? "Traduciendo receta..." : recipe.translated ? "Ver original" : "Traducir al español"}</button><p class="translation-note" id="translation-status" role="status" aria-live="polite">${escapeHTML(translationStatus)}</p>${recipe.sourceUrl ? `<a class="source-recipe-link" href="${escapeHTML(recipe.sourceUrl)}" target="_blank" rel="noopener noreferrer">Consultar la receta original ↗</a>` : ""}</section>` : ""}
    <div class="recipe-columns">
      <section aria-labelledby="ingredients-title"><h3 id="ingredients-title">Ingredientes</h3><ul class="ingredient-list">${displayIngredients.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul></section>
      <section aria-labelledby="steps-title"><h3 id="steps-title">Paso a paso</h3><ol class="step-list">${displaySteps.map((step) => `<li>${escapeHTML(step)}</li>`).join("")}</ol></section>
    </div>
    <section class="timer-panel" aria-label="Temporizador de preparación">
      <div class="timer-heading"><div><strong>${escapeHTML(recipe.timerLabel || "Temporizador opcional")}</strong><p class="timer-description">${recipe.timerMinutes ? "Ajusta el tiempo sugerido para este proceso. Los reposos y la refrigeración se indican aparte." : recipe.mealId ? "Elige un tiempo para recibir un recordatorio durante la preparación." : "Esta receta no necesita cocción cronometrada. Si quieres, configura un temporizador para una tarea puntual."}</p></div><span class="timer-display" id="timer-display" role="timer" aria-live="off">${formatTime(state.timerRemaining)}</span></div>
      <div class="timer-controls">
        <div class="timer-adjustment" aria-label="Ajustar duración en minutos">
          <button class="timer-adjust-button" type="button" id="timer-decrease" aria-label="Restar un minuto">−</button>
          <label class="timer-minutes-field"><span>Minutos</span><input id="timer-minutes" type="number" min="1" max="${MAX_TIMER_MINUTES}" step="1" inputmode="numeric" value="${recipe.timerMinutes ?? ""}" placeholder="—" aria-label="Duración del temporizador en minutos"></label>
          <button class="timer-adjust-button" type="button" id="timer-increase" aria-label="Sumar un minuto">+</button>
        </div>
        <button class="timer-button primary" type="button" id="timer-start" ${state.timerRemaining === null ? "disabled" : ""}>Iniciar</button>
        <button class="timer-button" type="button" id="timer-reset">Reiniciar</button>
      </div>
    </section>
    <button class="cook-mode-button" id="cook-mode" type="button" aria-pressed="false">✦ Activar modo cocina</button>`;
  dialogContent.querySelector("#timer-start").addEventListener("click", toggleTimer);
  dialogContent.querySelector("#timer-reset").addEventListener("click", resetTimer);
  dialogContent.querySelector("#timer-minutes").addEventListener("input", handleTimerInput);
  dialogContent.querySelector("#timer-decrease").addEventListener("click", () => adjustTimerMinutes(-1));
  dialogContent.querySelector("#timer-increase").addEventListener("click", () => adjustTimerMinutes(1));
  dialogContent.querySelector("#cook-mode").addEventListener("click", toggleCookMode);
  const translationButton = dialogContent.querySelector("#toggle-translation");
  if (translationButton) translationButton.addEventListener("click", () => toggleRecipeTranslation(recipe));
  dialogContent.querySelectorAll("img[data-fallback]").forEach((img) => img.addEventListener("error", useFallbackImage, { once: true }));
}

async function toggleRecipeTranslation(recipe) {
  if (!recipe) return;
  if (recipe.translation) {
    recipe.translated = !recipe.translated;
    saveMealDetails(recipe);
    renderRecipeDetails(recipe);
    return;
  }

  state.translationPending = true;
  renderRecipeDetails(recipe);
  const status = dialogContent.querySelector("#translation-status");
  if (status) status.textContent = "Traduciendo ingredientes y pasos...";
  try {
    recipe.translation = await translateMealRecipe(recipe);
    recipe.translated = true;
    saveMealDetails(recipe);
    if (state.activeRecipe?.id === recipe.id) {
      state.activeRecipe = recipe;
      renderRecipeDetails(recipe);
    }
  } catch (error) {
    console.error("No se pudo traducir la receta.", error);
    state.translationPending = false;
    if (state.activeRecipe?.id === recipe.id) {
      renderRecipeDetails(recipe);
      const translationStatus = dialogContent.querySelector("#translation-status");
      if (translationStatus) translationStatus.textContent = `${error.message} La receta original sigue disponible.`;
    }
    announce("No se pudo traducir la receta. Puedes consultar la versión original.");
    return;
  } finally {
    state.translationPending = false;
  }
  if (state.activeRecipe?.id === recipe.id) renderRecipeDetails(recipe);
}

function useFallbackImage(event) {
  const img = event.target;
  if (!(img instanceof HTMLImageElement)) return;
  if (img.src.endsWith(img.dataset.fallback)) return;
  img.src = img.dataset.fallback;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "--:--";
  const safeSeconds = Math.floor(seconds);
  return `${String(Math.floor(safeSeconds / 60)).padStart(2, "0")}:${String(safeSeconds % 60).padStart(2, "0")}`;
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (!hours) return `${minutes} min`;
  return remainingMinutes ? `${hours} h ${remainingMinutes} min` : `${hours} h`;
}

function updateTimerDisplay() {
  const display = dialogContent.querySelector("#timer-display");
  if (display) display.textContent = formatTime(state.timerRemaining);
}

function updateTimerControls() {
  const isRunning = Boolean(state.timerInterval);
  const input = dialogContent.querySelector("#timer-minutes");
  const decreaseButton = dialogContent.querySelector("#timer-decrease");
  const increaseButton = dialogContent.querySelector("#timer-increase");
  if (input) input.disabled = isRunning;
  if (decreaseButton) decreaseButton.disabled = isRunning;
  if (increaseButton) increaseButton.disabled = isRunning;
  const startButton = dialogContent.querySelector("#timer-start");
  if (startButton) startButton.disabled = isRunning ? false : state.timerRemaining === null;
}

function setTimerMinutes(minutes) {
  const input = dialogContent.querySelector("#timer-minutes");
  if (!input) return;
  if (!Number.isFinite(minutes) || minutes < 1) {
    input.value = "";
    state.timerDurationSeconds = null;
    state.timerRemaining = null;
  } else {
    const safeMinutes = Math.min(MAX_TIMER_MINUTES, Math.floor(minutes));
    input.value = String(safeMinutes);
    state.timerDurationSeconds = safeMinutes * 60;
    state.timerRemaining = state.timerDurationSeconds;
  }
  updateTimerDisplay();
  updateTimerControls();
  const startButton = dialogContent.querySelector("#timer-start");
  if (startButton) startButton.textContent = "Iniciar";
}

function handleTimerInput(event) {
  const value = event.currentTarget.value;
  setTimerMinutes(value === "" ? null : Number(value));
}

function adjustTimerMinutes(change) {
  const input = dialogContent.querySelector("#timer-minutes");
  if (!input || input.disabled) return;
  setTimerMinutes((input.value === "" ? 0 : Number(input.value)) + change);
}

function toggleTimer() {
  if (state.timerInterval) {
    state.timerRemaining = Math.max(0, Math.ceil((state.timerEndTimestamp - Date.now()) / 1000));
    stopTimer();
    updateTimerDisplay();
    dialogContent.querySelector("#timer-start").textContent = "Continuar";
    updateTimerControls();
    return;
  }
  if (state.timerRemaining === null || state.timerRemaining <= 0) resetTimer();
  if (state.timerRemaining === null) return;
  dialogContent.querySelector("#timer-start").textContent = "Pausar";
  state.timerEndTimestamp = Date.now() + (state.timerRemaining * 1000);
  state.timerInterval = setInterval(() => {
    state.timerRemaining = Math.max(0, Math.ceil((state.timerEndTimestamp - Date.now()) / 1000));
    updateTimerDisplay();
    if (state.timerRemaining <= 0) {
      stopTimer();
      dialogContent.querySelector("#timer-start").textContent = "Iniciar de nuevo";
      announce("¡Se terminó el tiempo! Revisa tu postre.");
      if ("Notification" in window && Notification.permission === "granted") new Notification("Dulce Pausa", { body: "¡Se terminó el tiempo! Revisa tu postre.", icon: "assets/icon.svg" });
    }
  }, 1000);
  updateTimerControls();
}

function stopTimer() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = null;
  state.timerEndTimestamp = null;
  updateTimerControls();
}

function resetTimer() {
  stopTimer();
  state.timerRemaining = state.timerDurationSeconds;
  updateTimerDisplay();
  const startButton = dialogContent.querySelector("#timer-start");
  if (startButton) startButton.textContent = "Iniciar";
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
  document.querySelector('meta[name="theme-color"]').content = "#0F3C65";
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
refreshDessertsButton.addEventListener("click", loadDesserts);
loadMoreDessertsButton.addEventListener("click", () => {
  state.visibleApiCount += API_PAGE_SIZE;
  renderRecipes();
});
dialogContent.addEventListener("click", (event) => {
  const retryButton = event.target.closest("[data-retry-recipe]");
  if (retryButton) showRecipe(retryButton.dataset.retryRecipe);
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
window.addEventListener("online", loadDesserts);
window.addEventListener("offline", setConnectionStatus);

loadFavorites();
renderCategories();
renderRecipes();
setConnectionStatus();
registerServiceWorker();
setCatalogStatus(apiRecipes.length
  ? `Recetas adicionales guardadas en este dispositivo: ${apiRecipes.length}.`
  : "Cargando más recetas...");
loadDesserts();

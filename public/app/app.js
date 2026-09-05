import {
  ACCENT_COLORS,
  CARE,
  FOODS,
  NEED_KEYS,
  TOGETHER,
  TOYS,
  absenceReport,
  addMemory,
  advanceState,
  applyChanges,
  cleanName,
  dayNumber,
  foodAvailability,
  growthFor,
  levelInfo,
  makeState,
  moodFor,
  statusPhrase,
} from "./game-core.js";
import { CAPY_HEIGHT, CAPY_PIXELS, CAPY_WIDTH } from "./pet-art.js";
import { dialogueFor, localizedDialogue } from "./dialogues.js";
import {
  LIBRARY_KEY,
  activeProfile,
  addProfile,
  emptyLibrary,
  normalizeLibrary,
  removeProfile,
  selectProfile,
  updateProfile,
} from "./pet-library.js";
import {
  QUEST_DEFINITIONS,
  activateQuest,
  completeQuest,
  currentQuest,
  normalizeQuestProgress,
  questIsDue,
  questTimeLabel,
  localizedQuest,
  recordQuestAction,
  taskQuestComplete,
} from "./quest-core.js";
import { startQuestGame } from "./quest-games.js";
import { startPackCards } from "./pack-cards.js";
import {
  departNow,
  destinationById,
  isTraveling,
  normalizeTravel,
  recallTravel,
  localizedDestination,
  travelProgress,
  travelTimeLabel,
} from "./travel-core.js";
import { localAmbience } from "./weather.js";
import {
  EQUIPMENT_SLOTS,
  ITEM_DEFINITIONS,
  addInventoryItem,
  inventoryCompletion,
  localizedItem,
  localizedSlot,
  normalizeInventory,
  rewardForDestination,
  toggleEquipment,
  togglePlacedItem,
} from "./inventory-core.js";
import {
  ANIMAL_FRIENDS,
  CROPS,
  WORLD_AREAS,
  availableCompanions,
  companionActivityEffect,
  consumeHarvest,
  cropProgress,
  cropTimeLabel,
  friendBookEntry,
  harvestCrop,
  normalizeGarden,
  normalizeWorld,
  plantCrop,
  prepareWorldActivity,
  recordFriendCompanionActivity,
  recordFriendMeeting,
  recallWorldActivity,
  selectCrop,
  selectWorldArea,
  settleWorldActivity,
  startWorldActivity,
  localizedCrop,
  localizedFriend,
  travelCompanion,
  waterCrop,
  worldActivityTimeLabel,
} from "./world-core.js";
import { applyI18n, languageFor, t } from "./i18n.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

function markBootFailure(error) {
  if (document.documentElement.dataset.appState === "ready") return;
  const detail = error instanceof Error ? error.message : String(error || "Unknown start error");
  document.documentElement.dataset.appState = "error";
  document.documentElement.dataset.bootError = detail;
  const message = $("#boot-message");
  if (message) message.textContent = "Kinkybara could not start. Reload the page — your local save stays safe.";
}

window.addEventListener("error", (event) => markBootFailure(event.error || event.message));
window.addEventListener("unhandledrejection", (event) => markBootFailure(event.reason));

const NEED_LABEL_KEYS = {
  satiety: "need.satiety",
  fun: "need.fun",
  clean: "need.clean",
  energy: "need.energy",
  social: "need.social",
  curiosity: "need.curiosity",
};

const GROUPS = {
  en: {
    feed: { kicker: "FEED", title: "Give {name} something juicy", instruction: "Pick a treat and drag it to that impatient mouth.", items: FOODS },
    play: { kicker: "PLAY", title: "Show me how you throw", instruction: "Throw it. A firm hand gets attention.", items: TOYS },
    care: { kicker: "CARE", title: "Hands on, please", instruction: "Brush slowly or get your Kinkybara properly wet.", items: CARE },
    together: { kicker: "CLOSER", title: "Come a little closer", instruction: "Choose the mood. We can discuss who leads.", items: TOGETHER },
  },
  de: {
    feed: { kicker: "FÜTTERN", title: "Gib {name} etwas Saftiges", instruction: "Wähl einen Happen und zieh ihn direkt zum ungeduldigen Maul.", items: FOODS },
    play: { kicker: "SPIELEN", title: "Zeig mir, wie du wirfst", instruction: "Wirf. Eine feste Hand bekommt Aufmerksamkeit.", items: TOYS },
    care: { kicker: "PFLEGEN", title: "Hände dran, bitte", instruction: "Bürste langsam oder mach dein Kinkybara ordentlich nass.", items: CARE },
    together: { kicker: "NÄHER", title: "Komm ein bisschen näher", instruction: "Wähl die Stimmung. Wer führt, handeln wir aus.", items: TOGETHER },
  },
};

const CAPY_ANIMATIONS = [
  "is-eating", "is-loved", "is-fetching", "is-playing", "is-brushed", "is-bathing",
  "is-drying", "is-cuddling", "is-talking", "is-exploring", "is-sunbathing", "is-tugging", "is-disgusted",
];

const elements = {
  day: $("#day-label"),
  clock: $("#clock"),
  habitat: $("#habitat"),
  speech: $("#speech-text"),
  capy: $("#pixel-capy"),
  petButton: $("#pet-button"),
  pond: $("#pond"),
  heartLayer: $("#heart-layer"),
  sceneLayer: $("#scene-layer"),
  bubbleLayer: $("#bubble-layer"),
  dropHint: $("#drop-hint"),
  name: $("#pet-name"),
  level: $("#level"),
  xp: $("#xp-fill"),
  xpCaption: $("#xp-caption"),
  mood: $("#mood"),
  actions: $("#actions"),
  sleepAction: $("#sleep-action"),
  sleepLabel: $("#sleep-label"),
  tray: $("#activity-tray"),
  trayKicker: $("#tray-kicker"),
  trayTitle: $("#tray-title"),
  trayInstruction: $("#tray-instruction"),
  trayItems: $("#tray-items"),
  trayProgress: $("#tray-progress"),
  ghost: $("#drag-ghost"),
  toast: $("#toast"),
  dedicationDialog: $("#dedication-dialog"),
  welcomeDialog: $("#welcome-dialog"),
  awayDialog: $("#away-dialog"),
  journalDialog: $("#journal-dialog"),
  libraryDialog: $("#library-dialog"),
  questDialog: $("#quest-dialog"),
  questGameDialog: $("#quest-game-dialog"),
  packCardsDialog: $("#pack-cards-dialog"),
  gearLockerDialog: $("#gear-locker-dialog"),
  friendBookDialog: $("#friend-book-dialog"),
  questAlert: $("#quest-alert"),
  questAlertOpen: $("#quest-alert-open"),
  questAlertDismiss: $("#quest-alert-dismiss"),
  questBadge: $("#quest-badge"),
  questStage: $("#quest-stage"),
  questGameStatus: $("#quest-game-status"),
  travelPostcard: $("#travel-postcard"),
  travelDialog: $("#travel-dialog"),
  weatherDialog: $("#weather-dialog"),
  weatherIcon: $("#weather-icon"),
  weatherTemperature: $("#weather-temperature"),
  weatherCondition: $("#weather-condition"),
  journeyDialog: $("#journey-dialog"),
  areaSessionDialog: $("#area-session-dialog"),
  inventoryDialog: $("#inventory-dialog"),
  gardenDialog: $("#garden-dialog"),
  inventoryGrid: $("#inventory-grid"),
  gardenPlots: $("#garden-plots"),
  animalVisitor: $("#animal-visitor"),
  outfitLayer: $("#outfit-layer"),
  hoodToggle: $("#hood-toggle"),
  placedBackgroundItemsLayer: $("#placed-background-items-layer"),
  placedItemsLayer: $("#placed-items-layer"),
  dialogueDialog: $("#dialogue-dialog"),
  settingsDialog: $("#settings-dialog"),
};

function initializeValue(name, factory) {
  try {
    return factory();
  } catch (error) {
    markBootFailure(new Error(`${name}: ${error instanceof Error ? error.message : String(error)}`));
    throw error;
  }
}

let library = emptyLibrary();
let activePetId = null;
let hasStoredState = false;
let awayInfo = null;
let state = initializeValue("state", loadState);
let currentPhrase = "";
let activeTray = null;
let selectedItem = null;
let drag = null;
let interactionBusy = false;
let bubbleSession = null;
let currentConversation = null;
let toastTimer = 0;
let lastPetAt = 0;
let petTapCount = 0;
let audioContext;
let deferredInstallPrompt = null;
let suppressClickUntil = 0;
let adoptionMode = "first";
let questWakeTimer = 0;
let activeGameCleanup = null;
let packCardsCleanup = null;
let pendingQuestAction = null;
let lastQuestNotice = "";
let weatherData = initializeValue("weather-data", () => localAmbience(Date.now(), state.language));
let inventoryFilter = "all";
let packCardsDifficulty = "switch";
let pendingAreaSessionArea = null;
let pendingAreaCompanionId = null;
let pendingJourneyCompanionId = null;

function awardChanges(changes, now = Date.now()) {
  const before = levelInfo(state.xp);
  state = applyChanges(state, changes, now);
  const gained = Number(changes?.xp) || 0;
  const after = levelInfo(state.xp);
  if (gained > 0 && elements.heartLayer) {
    const badge = document.createElement("span");
    badge.className = "floating-xp";
    badge.textContent = `+${Number.isInteger(gained) ? gained : gained.toFixed(1)} XP`;
    elements.heartLayer.append(badge);
    window.setTimeout(() => badge.remove(), 1700);
  }
  if (after.level > before.level) {
    showToast(state.language === "de" ? `LEVEL ${after.level}! ${state.name.toUpperCase()} WÄCHST.` : `LEVEL ${after.level}! ${state.name.toUpperCase()} IS GROWING.`, 4400);
  }
  return state;
}

const NAME_SUGGESTIONS = ["Thron", "Nox", "Moxie", "Pixel", "Echo", "Pico", "Nova", "Riot"];

const LANGUAGE_COPY = Object.freeze({
  en: {
    day: "DAY",
    items: "ITEMS",
    traveling: "AT A PARTY",
    sleeping: "SLEEPING",
    wake: "WAKE UP",
    wakeHint: "Good morning",
    growth: { baby: "LITTLE KINKYBARA", young: "YOUNG KINKYBARA", grown: "GROWN KINKYBARA", majestic: "PROUD KINKYBARA" },
    mood: { urgent: "NEEDS YOU", sad: "GRUMPY", okay: "DOING OKAY", great: "DELIGHTED", happy: "HAPPY", sleeping: "SLEEPING" },
    area: { home: "THE DEN", meadow: "KENNEL CLUB", garden: "PLAY AREA", wintergarden: "PACK LOUNGE" },
    areaVibe: { home: "GEAR UP · WIND DOWN · REPEAT", meadow: "LEASHES READY · ATTITUDE ON", garden: "ASK FIRST · PLAY ROUGH", wintergarden: "JUICE · CARDS · BAD IDEAS" },
  },
  de: {
    day: "TAG",
    items: "GEGENSTÄNDE",
    traveling: "AUF EINER PARTY",
    sleeping: "SCHLÄFT",
    wake: "WECKEN",
    wakeHint: "Guten Morgen",
    growth: { baby: "KLEINES KINKYBARA", young: "JUNGES KINKYBARA", grown: "ERWACHSENES KINKYBARA", majestic: "STOLZES KINKYBARA" },
    mood: { urgent: "BRAUCHT DICH", sad: "MÜRRISCH", okay: "GANZ OKAY", great: "SEELIG", happy: "GLÜCKLICH", sleeping: "SCHLÄFT" },
    area: { home: "DIE HÖHLE", meadow: "KENNEL CLUB", garden: "PLAY AREA", wintergarden: "PACK LOUNGE" },
    areaVibe: { home: "GEAR AN · RUNTERKOMMEN · NOCHMAL", meadow: "LEINEN BEREIT · ATTITUDE AN", garden: "ERST FRAGEN · DANN ROUGH", wintergarden: "SAFT · KARTEN · SCHLECHTE IDEEN" },
  },
});

const ENGLISH_STATUS_COPY = Object.freeze({
  sleeping: "Shh … collar off, lights low. Be good until I’m back.",
  urgent: {
    satiety: ["Feed me. That was an order — unless you ask nicely.", "My mouth wants something juicy. Don’t keep it waiting.", "I’m hungry enough to stop pretending I’m patient."],
    fun: ["I need a toy. And a little resistance.", "Throw something. I’m in the mood to chase trouble.", "I have far too much mischief and nowhere to put it."],
    clean: ["Get me wet and call it self-care.", "I smell like a very good bad idea. Brush me.", "Firm hands, warm water. You know what to do."],
    energy: ["I’m about to fold. Come here and be my pillow.", "Even a bossy pup needs a nap. Lights down.", "My stamina has left the club without me."],
    social: ["Closer. Now. Please. See? Switch.", "I want attention — the good, deliberate kind.", "Your pocket has room. I checked."],
    curiosity: ["Something smells like trouble. I want in.", "Take me somewhere with questionable lighting.", "My nose found a bad idea. Obviously we should follow it."],
  },
  low: {
    satiety: ["A peach would hit the spot. Yes, that was deliberate.", "Something firm, something juicy — surprise me."],
    fun: ["The tug rope looks untouched. Rude.", "I could be good. Or we could play."],
    clean: ["My fur is wearing last night’s attitude.", "A slow brush would improve my mood considerably."],
    energy: ["I’m soft, sleepy, and temporarily harmless.", "Come closer. I need a warm place to crash."],
    social: ["I miss your hands. The kind ones. Mostly.", "A little attention would make me dangerously charming."],
    curiosity: ["Show me something I’m not supposed to find interesting.", "I’m bored enough to make excellent mistakes."],
  },
  time: {
    morning: ["Morning. Coffee first, commands later.", "I’m still soft. Don’t take advantage — or ask nicely.", "Good morning, good pup. Decide for yourself who I mean."],
    day: ["I’ve been far too good today. Suspicious, isn’t it?", "Clear plan: play first, cuddle later. Or switch it.", "Daylight makes the gear look innocent. Almost."],
    dusk: ["Low light, polished gear, one look too many. Dangerous mix.", "It’s getting dark — perfect timing for bad ideas and good agreements.", "Golden hour. Even my attitude looks soft around the edges."],
    night: ["Collar on, lights down. The rest is negotiable.", "At night I’m either very cuddly or very persuasive.", "The moon is up. So is the mischief."],
  },
  switch: [
    "Being good is easy. Being cheeky suits me better.",
    "Today I’m on top. Tomorrow, we negotiate.",
    "The leash is decoration until someone asks nicely.",
    "Come closer. Slowly. I like the tension.",
    "I can sit, stay, and set boundaries. Versatile, right?",
    "I’m a switch: lap pup one minute, giving orders the next.",
    "Dom, sub, alpha, switch — I contain multitudes. And treats.",
    "Sniff first. Worship later. That’s my workflow.",
    "Netflix and chill? I control the remote. We negotiate the rest.",
    "Rubber, furry, or just the hood — I dress for the mood.",
    "Edging? I prefer calling it excellent timing.",
    "Blow … bubbles. What did you think I meant?",
    "Cuddles, snuggles, then one very bad idea.",
    "Alpha energy is cute. I prefer evidence.",
    "Good sub, good dom, great switch. I’m flexible.",
    "Worship is a strong word. Keep going.",
    "Scratch the right spot and I may consider behaving.",
    "The collar fits. So does your stare.",
    "I like clear words, soft hands, and very bad excuses.",
    "When I say down, I may not mean the dog bed.",
    "Tonight: wagging, teasing, then cuddling.",
    "I don’t bite. Unless the punchline asks for it.",
    "Who’s leading whom? Wrong question. Changing answer.",
    "Good pup. That could be me. Or you. Choose wisely.",
    "I watch my boundaries. And yours.",
    "You get the soft side today. Don’t get smug.",
    "Your pocket looks inviting. Your lap looks better.",
    "Stay close. That was almost an order.",
    "Sweet face, sharp attitude. It’s called range.",
  ],
});

const PET_PHRASES = Object.freeze({
  en: [
    "Yes. Right there.",
    "Good hand. Keep going.",
    "Careful — I might get used to that.",
    "A little firmer. I can take it.",
    "That tickles. Don’t stop.",
    "Who trained whom here?",
    "Soft touch, sharp grin. Perfect.",
    "Worship is a strong word. This is a promising start.",
  ],
  de: [
    "Ja. Genau da.",
    "Gute Hand. Weitermachen.",
    "Vorsicht – daran könnte ich mich gewöhnen.",
    "Ein bisschen fester. Ich halte das aus.",
    "Das kitzelt. Nicht aufhören.",
    "Wer hat hier eigentlich wen trainiert?",
    "Weiche Berührung, scharfes Grinsen. Perfekt.",
    "Worship ist ein großes Wort. Das ist ein guter Anfang.",
  ],
});

function pickEnglishPhrase(options, value, now, salt = 0) {
  const bucket = Math.floor(now / 900_000);
  const seed = Math.abs(Math.floor(value.interactions * 7 + value.xp * 3 + dayNumber(value, now) * 11 + bucket + salt));
  return options[seed % options.length];
}

function ui() {
  return LANGUAGE_COPY[languageFor(state.language)];
}

function localizedStatusPhrase(value = state, now = Date.now()) {
  if (value.language === "de") return statusPhrase(value, now);
  if (value.sleeping) return ENGLISH_STATUS_COPY.sleeping;
  const lowest = NEED_KEYS.map((key) => [key, value[key]]).sort((a, b) => a[1] - b[1])[0];
  if (lowest[1] < 25) return pickEnglishPhrase(ENGLISH_STATUS_COPY.urgent[lowest[0]], value, now, 17);
  if (lowest[1] < 48) return pickEnglishPhrase(ENGLISH_STATUS_COPY.low[lowest[0]], value, now, 29);
  const hour = new Date(now).getHours();
  const period = hour < 7 ? "morning" : hour < 17 ? "day" : hour < 21 ? "dusk" : "night";
  if ((Math.floor(now / 900_000) + value.interactions) % 3 === 0) return pickEnglishPhrase(ENGLISH_STATUS_COPY.time[period], value, now, 41);
  return pickEnglishPhrase(ENGLISH_STATUS_COPY.switch, value, now, 53);
}

function applyTheme(primary = state.primaryAccent, secondary = state.secondaryAccent) {
  const primaryColor = ACCENT_COLORS[primary] || ACCENT_COLORS.violet;
  const secondaryColor = ACCENT_COLORS[secondary] || ACCENT_COLORS.red;
  document.documentElement.style.setProperty("--accent-primary", primaryColor.hex);
  document.documentElement.style.setProperty("--accent-secondary", secondaryColor.hex);
  document.documentElement.dataset.theme = "kinkybara";
}

function applyLanguage(language = state.language) {
  state.language = languageFor(language);
  applyI18n(document, state.language);
  weatherData = localAmbience(Date.now(), state.language);
  renderWeather();
  $$("#language-picker [data-language]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.language === state.language);
  });
}

function groupFor(category) {
  return GROUPS[languageFor(state.language)]?.[category] || GROUPS.en[category];
}

function destinationCopy(destination) {
  return localizedDestination(destination, state.language);
}

function itemCopy(item) {
  return localizedItem(item, state.language);
}

function activityItemForArea(area) {
  if (area === "meadow") return ITEM_DEFINITIONS.kennel_sign;
  if (area !== "garden") return null;
  return {
    id: "play_area_sign",
    type: "landmark",
    area: "garden",
    label: state.language === "de" ? "Play-Area-Schild" : "Play Area sign",
    icon: "▰",
    asset: "./assets/kennel-fruit-pair.png",
    detail: state.language === "de" ? "Pfirsich und Aubergine laden zum roughen Spiel ein." : "Peach and aubergine invite some rough play.",
  };
}

function createItemArtwork(item, className, fallback = "?") {
  if (item?.asset) {
    const image = document.createElement("img");
    image.className = className;
    image.src = item.asset;
    image.alt = "";
    image.decoding = "async";
    image.dataset.item = item.id;
    if (item.slot) image.dataset.slot = item.slot;
    return image;
  }
  const icon = document.createElement("span");
  icon.className = className;
  icon.textContent = item?.icon || fallback;
  if (item?.id) icon.dataset.item = item.id;
  if (item?.slot) icon.dataset.slot = item.slot;
  return icon;
}

function cropCopy(crop) {
  return localizedCrop(crop, state.language);
}

function friendCopy(friend) {
  return localizedFriend(friend, state.language);
}

function mergeChangeSets(...sets) {
  const merged = {};
  sets.filter(Boolean).forEach((changes) => {
    Object.entries(changes).forEach(([key, value]) => {
      if (Number.isFinite(value)) merged[key] = (merged[key] || 0) + value;
    });
  });
  return merged;
}

function scaleChangeSet(changes, progress = 1) {
  const scale = Math.max(0, Math.min(1, Number(progress) || 0));
  return Object.fromEntries(Object.entries(changes || {})
    .map(([key, value]) => [key, Math.round(value * scale)])
    .filter(([, value]) => value !== 0));
}

function companionEffectText(friendId, activity, progress = 1) {
  if (!friendId) {
    return state.language === "de"
      ? "Allein unterwegs. Freunde aus dem Freundebuch können hier bewusst mitkommen."
      : "Going solo. Friends from the friend book can be invited here.";
  }
  const effect = companionActivityEffect(friendId, activity, progress, state.language);
  if (!effect) return "";
  const friend = friendCopy(ANIMAL_FRIENDS[friendId]);
  const labels = state.language === "de"
    ? { satiety: "Satt", fun: "Spaß", clean: "Frisch", energy: "Energie", social: "Nähe", curiosity: "Neugier", xp: "XP" }
    : { satiety: "Full", fun: "Fun", clean: "Fresh", energy: "Energy", social: "Bond", curiosity: "Curious", xp: "XP" };
  const changes = Object.entries(effect.changes).map(([key, value]) => `${labels[key] || key} ${value > 0 ? "+" : ""}${value}`).join(" · ");
  return `${friend?.label || ""} · ${effect.trait.label}: ${effect.trait.detail}${changes ? ` (${changes})` : ""}`;
}

function renderCompanionPicker({ options, effect, selectedId, activity, disabled = false, onSelect }) {
  const entries = availableCompanions(state.world, state.language, Date.now(), worldSeed());
  const validSelectedId = entries.some((entry) => entry.friend.id === selectedId) ? selectedId : null;
  options.replaceChildren();
  options.setAttribute("aria-label", state.language === "de" ? "Begleitung wählen" : "Choose a companion");
  const choices = [
    { id: null, icon: "•", label: state.language === "de" ? "ALLEIN" : "SOLO", detail: state.language === "de" ? "Nur Kinkybara" : "Just Kinkybara" },
    ...entries.map((entry) => ({ id: entry.friend.id, icon: entry.friend.icon, label: entry.friend.label, detail: entry.friend.trait.label })),
  ];
  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.companionId = choice.id || "solo";
    button.classList.toggle("is-selected", choice.id === validSelectedId);
    button.setAttribute("aria-pressed", String(choice.id === validSelectedId));
    button.disabled = disabled;
    const icon = document.createElement("span");
    icon.textContent = choice.icon;
    const copy = document.createElement("span");
    const name = document.createElement("strong");
    const detail = document.createElement("small");
    name.textContent = choice.label;
    detail.textContent = choice.detail;
    copy.append(name, detail);
    button.append(icon, copy);
    button.addEventListener("click", () => {
      onSelect(choice.id);
      window.requestAnimationFrame(() => options.querySelector(`[data-companion-id="${choice.id || "solo"}"]`)?.focus());
    });
    options.append(button);
  });
  effect.textContent = entries.length
    ? companionEffectText(validSelectedId, activity)
    : (state.language === "de" ? "Noch allein – lerne Besucher kennen, damit sie dich begleiten können." : "Solo for now — meet visitors before inviting them along.");
  return validSelectedId;
}

function friendOriginText(entry) {
  const origin = entry.record?.origin;
  if (origin?.kind === "travel") return destinationCopy(destinationById(origin.destinationId))?.title || origin.label || (state.language === "de" ? "auf einer Reise" : "on a trip");
  if (origin?.kind === "world" && WORLD_AREAS[origin.area]) {
    const labels = state.language === "de"
      ? { home: "Die Höhle", meadow: "Kennel Club", garden: "Play Area", wintergarden: "Pack Lounge" }
      : { home: "The Den", meadow: "Kennel Club", garden: "Play Area", wintergarden: "Pack Lounge" };
    return labels[origin.area];
  }
  if (origin?.label) return origin.label;
  return state.language === "de" ? "Ort beim alten Spielstand nicht gespeichert" : "Place not recorded in the earlier save";
}

function questCopy(quest) {
  return localizedQuest(quest, state.language);
}

function renderAccentOptions() {
  const groups = [
    [$("#primary-accent-options"), "primaryAccent", state.primaryAccent || "violet"],
    [$("#secondary-accent-options"), "secondaryAccent", state.secondaryAccent || "red"],
    [$("#settings-primary-accent-options"), "settingsPrimaryAccent", state.primaryAccent || "violet"],
    [$("#settings-secondary-accent-options"), "settingsSecondaryAccent", state.secondaryAccent || "red"],
  ];
  groups.forEach(([container, name, selected]) => {
    if (!container) return;
    container.replaceChildren(...Object.entries(ACCENT_COLORS).map(([key, color]) => {
      const label = document.createElement("label");
      const colorLabel = state.language === "de" ? color.de : color.label;
      label.title = colorLabel;
      label.setAttribute("aria-label", colorLabel);
      label.innerHTML = `<input type="radio" name="${name}" value="${key}" ${key === selected ? "checked" : ""}><span style="--swatch:${color.hex}"></span><small>${colorLabel}</small>`;
      return label;
    }));
  });
}

function syncAccentPreview() {
  const form = $("#welcome-form");
  const primary = form?.elements.primaryAccent?.value || state.primaryAccent;
  let secondary = form?.elements.secondaryAccent?.value || state.secondaryAccent;
  if (primary === secondary && form) {
    const alternative = Object.keys(ACCENT_COLORS).find((key) => key !== primary);
    const input = form.querySelector(`input[name="secondaryAccent"][value="${alternative}"]`);
    if (input) input.checked = true;
    secondary = alternative;
  }
  applyTheme(primary, secondary);
}

function loadState() {
  try {
    const raw = localStorage.getItem(LIBRARY_KEY);
    library = raw ? normalizeLibrary(JSON.parse(raw)) : emptyLibrary();
    const profile = activeProfile(library);
    hasStoredState = Boolean(profile);
    if (!profile) return makeState();
    activePetId = profile.id;
    awayInfo = absenceReport(profile.state);
    library = updateProfile(library, activePetId, awayInfo.state);
    return awayInfo.state;
  } catch {
    library = emptyLibrary();
    activePetId = null;
    hasStoredState = false;
    return makeState();
  }
}

function saveState() {
  if (!hasStoredState || !activePetId) return;
  try {
    library = updateProfile(library, activePetId, state);
    library = selectProfile(library, activePetId);
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
  } catch {
    showToast(state.language === "de" ? "Die Kinkybara-Bibliothek konnte nicht gespeichert werden." : "The Kinkybara library could not be saved.");
  }
}

function travelSeed() {
  return `${activePetId || "new"}:${state.name}:${state.adoptedAt}`;
}

function worldSeed() {
  return `${activePetId || "new"}:${state.name}:world`;
}

function prepareTravelCargo() {
  if (!isTraveling(state.travel)) return;
  state.inventory = normalizeInventory(state.inventory);
  state.world = normalizeWorld(state.world, Date.now(), worldSeed());
  if (!state.travel.rewardId) {
    state.travel.rewardId = rewardForDestination(state.inventory, state.travel.destinationId, `${travelSeed()}:${state.travel.departedAt}`);
  }
  if (state.travel.companionChoice === "solo") {
    state.travel.companionId = null;
  } else if (state.travel.companionChoice === "auto" && (state.travel.companionId === null || state.travel.companionId === undefined)) {
    state.travel.companionId = travelCompanion(state.world, `${travelSeed()}:${state.travel.destinationId}:${state.travel.departedAt}`);
  }
}

function syncTravelState(now = Date.now()) {
  if (!hasStoredState) return false;
  const previousStatus = state.travel?.status || "home";
  const canDepart = !state.sleeping && !state.world?.activity && !interactionBusy && !currentConversation && !activeTray && !document.querySelector("dialog[open]");
  if (!state.travel || state.travel.status === "away" || canDepart) {
    state.travel = normalizeTravel(state.travel, state.adoptedAt, now, travelSeed());
  }
  const traveling = isTraveling(state.travel, now);
  if (traveling) prepareTravelCargo();
  if (state.travel?.returnPending && !traveling) {
    const destination = destinationCopy(destinationById(state.travel.lastDestinationId));
    const tripProgress = state.travel.lastRecalled ? Math.max(0, Math.min(1, Number(state.travel.lastTripProgress) || 0)) : 1;
    const qualifiesForReturn = !state.travel.lastRecalled || tripProgress >= 0.25;
    const rewardId = qualifiesForReturn
      ? state.travel.lastRewardId || rewardForDestination(state.inventory, state.travel.lastDestinationId, `${travelSeed()}:return:${state.travel.completedTrips}`)
      : null;
    const reward = rewardId ? itemCopy(ITEM_DEFINITIONS[rewardId]) : null;
    const companion = friendCopy(ANIMAL_FRIENDS[state.travel.lastCompanionId]);
    if (companion && qualifiesForReturn) {
      state.world = recordFriendMeeting(state.world, companion.id, now, worldSeed(), {
        kind: "travel",
        destinationId: state.travel.lastDestinationId,
        label: destination?.title,
      });
      state.world = recordFriendCompanionActivity(state.world, companion.id, "travel", now, worldSeed());
    }
    const inventoryResult = rewardId ? addInventoryItem(state.inventory, rewardId, now) : { inventory: state.inventory, added: false };
    state.inventory = inventoryResult.inventory;
    if (qualifiesForReturn && !reward) {
      state.garden = normalizeGarden(state.garden);
      state.garden.seeds = Object.fromEntries(Object.entries(state.garden.seeds).map(([key, amount]) => [key, amount + 1]));
    }
    state.travel = { ...state.travel, returnPending: false, lastRewardId: rewardId };
    const companionEffect = qualifiesForReturn ? companionActivityEffect(companion?.id, "travel", tripProgress, state.language) : null;
    if (tripProgress > 0) state = awardChanges(mergeChangeSets(scaleChangeSet({ curiosity: 9, fun: 5, social: -2, energy: -4, xp: 12 }, tripProgress), companionEffect?.changes), now);
    const findText = reward
      ? (state.language === "de" ? `${reward.label} für unsere Sammlung` : `${reward.label} for our collection`)
      : (state.language === "de" ? "ein buntes Samentütchen für den Garten" : "a colorful seed packet for the garden");
    const companionText = companion && qualifiesForReturn
      ? (state.language === "de" ? ` Zusammen mit ${companion.label}; ${companionEffect?.trait.label || "die Begleitung"} wirkte nach.` : ` Together with ${companion.label}; ${companionEffect?.trait.label || "their company"} left its mark.`)
      : "";
    const place = destination?.title || (state.language === "de" ? "einem Abenteuer" : "an adventure");
    const memoryText = !qualifiesForReturn
      ? (state.language === "de"
        ? `${state.name} ist früh aus ${place} zurückgekommen. Die Reise war zu kurz für einen Fund.`
        : `${state.name} returned early from ${place}. The trip was too short for a find.`)
      : (state.language === "de"
        ? `${state.name} ist aus ${place} zurück und brachte ${findText} mit.${companionText}`
        : `${state.name} returned from ${place} and brought back ${findText}.${companionText}`);
    remember(memoryText, reward?.icon || "⌁");
    currentPhrase = !qualifiesForReturn
      ? (state.language === "de"
        ? "Da bin ich wieder! Die Reise war noch zu kurz für einen Fund."
        : "I am back! The trip was still too short for a find.")
      : (state.language === "de"
        ? `Da bin ich wieder! Ich war in ${destination?.title || "der Ferne"} und habe ${findText} mitgebracht.${companion ? ` ${companion.label} war dabei!` : ""}`
        : `I am back! I went to ${destination?.title || "somewhere new"} and brought back ${findText}.${companion ? ` ${companion.label} came along!` : ""}`);
    showToast(state.language === "de"
      ? `${state.name.toUpperCase()} IST ZURÜCK · ${qualifiesForReturn ? reward?.label?.toUpperCase() || "NEUE SAMEN" : "ZU KURZ FÜR EINEN FUND"}!`
      : `${state.name.toUpperCase()} IS BACK · ${qualifiesForReturn ? reward?.label?.toUpperCase() || "NEW SEEDS" : "TOO SHORT FOR A FIND"}!`, 5200);
  } else if (traveling) {
    const destination = destinationCopy(destinationById(state.travel.destinationId));
    const companion = friendCopy(ANIMAL_FRIENDS[state.travel.companionId]);
    currentPhrase = state.language === "de"
      ? `Reisepost von ${state.name}: Ich bin gerade bei ${destination.title}${companion ? ` – ${companion.label} ist mitgekommen` : ""} und komme von allein wieder zurück.`
      : `Party post from ${state.name}: I am at ${destination.title}${companion ? ` — ${companion.label} came along` : ""} and will return on my own.`;
  }
  if (previousStatus !== state.travel?.status && state.travel?.status === "away") {
    const destination = destinationCopy(destinationById(state.travel.destinationId));
    const companion = friendCopy(ANIMAL_FRIENDS[state.travel.companionId]);
    showToast(state.language === "de"
      ? `${state.name} ist ${companion ? `mit ${companion.label}` : "allein"} zu ${destination.title} gereist.`
      : `${state.name} headed to ${destination.title} ${companion ? `with ${companion.label}` : "on their own"}.`, 4200);
  }
  return traveling;
}

function syncWorldState(now = Date.now(), traveling = isTraveling(state.travel, now)) {
  const previousArea = state.world?.area || state.landscapeArea || "home";
  const settled = settleWorldActivity(state.world, now, worldSeed());
  state.world = settled.world;
  const settledCompanion = settled.completion
    ? completedCompanion(settled.completion, 1, now)
    : { companion: null, effect: null };
  if (settled.completion && elements.areaSessionDialog.open) elements.areaSessionDialog.close();
  if (settled.completion?.area === "meadow") {
    const secretBonus = settled.completion.secretBonus;
    state = awardChanges(mergeChangeSets(activityChanges("meadow", 1, secretBonus), settledCompanion.effect?.changes), now);
    currentPhrase = state.language === "de"
      ? `Kennel Club war intensiv. Nähe voll, Bauch leer – und dieses Glitzern bleibt noch eine Weile.${secretBonus === "spotless" ? " Blitzblank reinzugehen hat offenbar bleibenden Eindruck gemacht: Das Nähe-Glitzern hält diesmal extra lang." : ""}${settledCompanion.companion ? ` ${settledCompanion.companion.label}s ${settledCompanion.effect.trait.label} hat die Session verändert.` : ""}`
      : `The Kennel Club was intense. Bond full, belly empty — and that sparkle will linger.${secretBonus === "spotless" ? " Going in spotless apparently made a lasting impression: the bond sparkle sticks around extra long." : ""}${settledCompanion.companion ? ` ${settledCompanion.companion.label}'s ${settledCompanion.effect.trait.label} changed the session.` : ""}`;
    remember(state.language === "de" ? `${state.name} kam nach 40 Minuten sehr glücklich, sehr hungrig und voller besonderer Nähe aus dem Kennel Club.${secretBonus === "spotless" ? " Weil es blitzblank hineinging, hält das Nähe-Glitzern vier statt zwei Stunden." : ""}${settledCompanion.companion ? ` Begleitung: ${settledCompanion.companion.label} (${settledCompanion.effect.trait.label}).` : ""}` : `${state.name} returned from 40 minutes at the Kennel Club delighted, hungry and glowing with closeness.${secretBonus === "spotless" ? " Going in spotless made the bond sparkle last four hours instead of two." : ""}${settledCompanion.companion ? ` Companion: ${settledCompanion.companion.label} (${settledCompanion.effect.trait.label}).` : ""}`, "♣");
    showToast(state.language === "de" ? `KENNEL CLUB · NÄHE GLITZERT ${secretBonus === "spotless" ? 4 : 2} STUNDEN` : `KENNEL CLUB · BOND SPARKLES FOR ${secretBonus === "spotless" ? 4 : 2} HOURS`, 5200);
  } else if (settled.completion?.area === "garden") {
    const secretBonus = settled.completion.secretBonus;
    state = awardChanges(mergeChangeSets(activityChanges("garden", 1, secretBonus), settledCompanion.effect?.changes), now);
    currentPhrase = state.language === "de"
      ? `Play Area war rough. Sehr glücklich, sehr dreckig, komplett ausgepowert.${secretBonus === "pineapple" ? " Der Ananassaft vorher hat die Sache verdächtig saftig gehalten – mehr Ausdauer, breiteres Grinsen." : ""}${settledCompanion.companion ? ` ${settledCompanion.companion.label}s ${settledCompanion.effect.trait.label} hat die Session verändert.` : ""}`
      : `The Play Area was rough. Very happy, very messy, completely spent.${secretBonus === "pineapple" ? " That pineapple juice beforehand kept things suspiciously juicy — more stamina, bigger grin." : ""}${settledCompanion.companion ? ` ${settledCompanion.companion.label}'s ${settledCompanion.effect.trait.label} changed the session.` : ""}`;
    remember(state.language === "de" ? `${state.name} kam nach 40 Minuten rougher Play Area dreckig, müde und sehr zufrieden zurück.${secretBonus === "pineapple" ? " Weil es vorher Ananassaft getrunken hatte, gab es mehr Spaß und deutlich weniger Energie-Crash." : ""}${settledCompanion.companion ? ` Begleitung: ${settledCompanion.companion.label} (${settledCompanion.effect.trait.label}).` : ""}` : `${state.name} returned from 40 rough minutes in the Play Area messy, tired and deeply satisfied.${secretBonus === "pineapple" ? " Pineapple juice beforehand meant more fun and much less of an energy crash." : ""}${settledCompanion.companion ? ` Companion: ${settledCompanion.companion.label} (${settledCompanion.effect.trait.label}).` : ""}`, "▰");
    showToast(state.language === "de" ? "PLAY AREA · FRISCH & ENERGIE STARK GESUNKEN" : "PLAY AREA · FRESH & ENERGY DROPPED HARD", 5200);
  }
  state.world = normalizeWorld(state.world, now, worldSeed());
  state.garden = normalizeGarden(state.garden);
  state.inventory = normalizeInventory(state.inventory);
  if (state.sleeping) state.world = { ...state.world, area: "home" };
  state.landscapeArea = state.world.area;
  if (!settled.completion && !traveling && previousArea !== state.world.area && !interactionBusy && !document.querySelector("dialog[open]")) {
    const area = ui().area[state.world.area];
    currentPhrase = state.language === "de" ? `Ich bin von allein weitergezogen. Jetzt bin ich bei ${area.toLowerCase()}.` : `I wandered on by myself. Now I am at ${area.toLowerCase()}.`;
    showToast(state.language === "de" ? `${state.name} ist jetzt bei ${area}.` : `${state.name} is now at ${area}.`, 2800);
  }
}

function wanderPosition(now = Date.now()) {
  const value = [...`${state.name}:${state.landscapeArea}:${Math.floor(now / 30_000)}`]
    .reduce((sum, character) => ((sum * 31) + character.charCodeAt(0)) >>> 0, 17);
  return 25 + (value % 46);
}

function berlinSolarScene(now = Date.now()) {
  const date = new Date(now);
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date - start) / 86_400_000);
  const daylightHours = 12 + 4.1 * Math.cos((2 * Math.PI * (day - 172)) / 365);
  const sunrise = 12 - daylightHours / 2;
  const sunset = 12 + daylightHours / 2;
  const hour = date.getHours() + date.getMinutes() / 60;
  const visible = hour >= sunrise && hour <= sunset;
  const progress = visible ? Math.max(0, Math.min(1, (hour - sunrise) / (sunset - sunrise))) : 0;
  const phase = !visible ? "night" : hour < sunrise + 1.25 ? "dawn" : hour > sunset - 1.25 ? "sunset" : "day";
  return {
    phase,
    sunX: `${8 + progress * 84}%`,
    sunY: `${74 - Math.sin(Math.PI * progress) * 62}px`,
    moonX: `${hour < sunrise ? 72 : 18}%`,
    sunrise,
    sunset,
  };
}

function renderOutfit() {
  elements.outfitLayer.replaceChildren();
  for (const [slot, itemId] of Object.entries(state.inventory.equipped)) {
    const item = ITEM_DEFINITIONS[itemId];
    if (!item) continue;
    const piece = document.createElement("i");
    piece.className = "outfit-piece";
    piece.dataset.slot = slot;
    piece.dataset.item = itemId;
    piece.textContent = item.icon;
    if (slot === "hood") {
      const expression = document.createElement("span");
      expression.className = "hood-expression";
      expression.setAttribute("aria-hidden", "true");
      piece.append(expression);
    }
    elements.outfitLayer.append(piece);
  }
}

function renderPlacedItems(traveling = false, now = Date.now()) {
  elements.placedBackgroundItemsLayer.replaceChildren();
  elements.placedItemsLayer.replaceChildren();
  if (traveling) return;
  const areaItems = state.inventory.placedItemIds
    .map((id) => ITEM_DEFINITIONS[id])
    .filter((item) => item?.area === state.landscapeArea);
  const activityArea = ["meadow", "garden"].includes(state.landscapeArea) ? state.landscapeArea : null;
  const activityItem = activityItemForArea(activityArea);
  const activityItemId = activityItem?.id || null;
  const hasActivityItem = activityItemId && areaItems.some((item) => item.id === activityItemId);
  const visibleItems = hasActivityItem || !activityItem
    ? areaItems
    : [activityItem, ...areaItems];

  visibleItems.forEach((item, index) => {
    const isHomePlayMat = item.id === "play_mat" && state.landscapeArea === "home";
    const button = document.createElement(isHomePlayMat ? "div" : "button");
    if (button instanceof HTMLButtonElement) button.type = "button";
    button.className = "placed-world-item";
    button.dataset.itemId = item.id;
    const isActivitySign = item.id === activityItemId;
    if (isActivitySign) {
      button.classList.add("is-activity-sign");
      button.dataset.worldActivity = activityArea;
    }
    button.style.setProperty("--left", isHomePlayMat ? "40%" : `${19 + ((index * 31) % 66)}%`);
    button.style.setProperty("--bottom", isHomePlayMat ? "101px" : `${105 + ((index % 2) * 48)}px`);
    const copy = itemCopy(item);
    const active = state.world.activity?.area === activityArea;
    const activityLabel = active
      ? worldActivityTimeLabel(state.world, now, state.language, worldSeed())
      : (state.language === "de" ? "40-MINUTEN-SESSION STARTEN" : "START 40-MINUTE SESSION");
    if (!isHomePlayMat) {
      button.setAttribute("aria-label", isActivitySign ? `${copy.label}: ${activityLabel}` : copy.label);
      button.title = isActivitySign ? `${copy.label} · ${activityLabel}` : copy.label;
    }
    button.append(createItemArtwork(item, "placed-world-icon"));
    if (isActivitySign) {
      const badge = document.createElement("small");
      badge.className = "activity-sign-badge";
      badge.textContent = active ? worldActivityTimeLabel(state.world, now, state.language, worldSeed()) : "40 MIN";
      button.append(badge);
      button.classList.toggle("is-running", active);
    }
    (isHomePlayMat ? elements.placedBackgroundItemsLayer : elements.placedItemsLayer).append(button);
  });
}

function renderAnimalVisitor(traveling = false) {
  const friend = !traveling && !state.sleeping ? friendCopy(ANIMAL_FRIENDS[state.world.friendId]) : null;
  elements.animalVisitor.hidden = !friend;
  if (!friend) return;
  $("#visitor-icon").textContent = friend.icon;
  $("#visitor-name").textContent = friend.label;
  elements.animalVisitor.setAttribute("aria-label", state.language === "de" ? `${friend.label} begrüßen` : `Greet ${friend.label}`);
}

function areaSessionDetails(area) {
  const kennel = area === "meadow";
  const de = state.language === "de";
  return {
    title: kennel ? "Kennel Club" : "Play Area",
    icon: kennel ? "♣" : "▰",
    copy: de
      ? (kennel
        ? `${state.name} bleibt 40 Minuten im Kennel Club. Nähe wird vollständig gefüllt und glitzert danach zwei Stunden; Hunger steigt deutlich.`
        : `${state.name} bleibt 40 Minuten in der Play Area. Rough Play bringt Spaß und Neugier, kostet aber viel Energie und Frische.`)
      : (kennel
        ? `${state.name} stays at the Kennel Club for 40 minutes. Bond fills completely and sparkles for two hours; hunger rises sharply.`
        : `${state.name} stays in the Play Area for 40 minutes. Rough play brings fun and curiosity, but costs plenty of energy and freshness.`),
    effects: kennel
      ? (de ? [["NÄHE", "VOLL + 2 H GLITZERN"], ["SPASS", "+18"], ["SATT", "−35"], ["ENERGIE", "−10"]] : [["BOND", "FULL + 2 H SPARKLE"], ["FUN", "+18"], ["FULL", "−35"], ["ENERGY", "−10"]])
      : (de ? [["SPASS", "+22"], ["NEUGIER", "+12"], ["FRISCH", "−35"], ["ENERGIE", "−35"]] : [["FUN", "+22"], ["CURIOUS", "+12"], ["FRESH", "−35"], ["ENERGY", "−35"]]),
  };
}

function renderAreaSessionDialog(now = Date.now()) {
  const active = state.world.activity;
  const area = active?.area || pendingAreaSessionArea;
  if (!area || !["meadow", "garden"].includes(area)) return;
  const details = areaSessionDetails(area);
  const running = Boolean(active);
  $("#area-session-kicker").textContent = state.language === "de" ? (running ? "SESSION LÄUFT" : "40-MINUTEN-SESSION") : (running ? "SESSION IN PROGRESS" : "40-MINUTE SESSION");
  $("#area-session-title").textContent = details.title;
  $("#area-session-hero").dataset.area = area;
  $("#area-session-icon").textContent = details.icon;
  $("#area-session-copy").textContent = details.copy;
  const effects = $("#area-session-effects");
  effects.replaceChildren();
  details.effects.forEach(([label, value]) => {
    const row = document.createElement("div");
    const key = document.createElement("small");
    const output = document.createElement("strong");
    key.textContent = label;
    output.textContent = value;
    row.append(key, output);
    effects.append(row);
  });
  $("#area-companion-heading").textContent = state.language === "de" ? "WER KOMMT MIT?" : "WHO COMES ALONG?";
  const displayedCompanionId = running ? active.companionId : pendingAreaCompanionId;
  pendingAreaCompanionId = renderCompanionPicker({
    options: $("#area-companion-options"),
    effect: $("#area-companion-effect"),
    selectedId: displayedCompanionId,
    activity: area,
    disabled: running,
    onSelect: (friendId) => {
      pendingAreaCompanionId = friendId;
      renderAreaSessionDialog();
    },
  });
  $("#area-session-running").hidden = !running;
  if (running) {
    const duration = Math.max(1, active.returnsAt - active.startedAt);
    const progress = Math.max(0, Math.min(100, ((now - active.startedAt) / duration) * 100));
    $("#area-session-countdown").textContent = worldActivityTimeLabel(state.world, now, state.language, worldSeed());
    $("#area-session-progress").style.setProperty("--value", `${progress}%`);
    $("#area-session-return-copy").textContent = state.language === "de"
      ? `Du kannst ${state.name} jederzeit zurückholen. Bei früher Rückkehr wirken die Veränderungen anteilig.`
      : `You can bring ${state.name} home at any time. Effects are proportional when returning early.`;
  }
  $("#area-session-primary").textContent = state.language === "de"
    ? (running ? "JETZT ZURÜCKHOLEN" : "40 MIN STARTEN")
    : (running ? "BRING HOME NOW" : "START 40 MIN");
  $("#area-session-primary").classList.toggle("is-recall", running);
  $("#area-session-dialog .secondary-button").textContent = state.language === "de" ? "NOCH NICHT" : "NOT NOW";
}

function openAreaSessionDialog(area = state.landscapeArea) {
  if (isTraveling(state.travel) || state.sleeping || interactionBusy) return;
  pendingAreaSessionArea = state.world.activity?.area || area;
  const activeCompanionId = state.world.activity?.companionId;
  const companionIsUnlocked = availableCompanions(state.world, state.language, Date.now(), worldSeed()).some((entry) => entry.friend.id === pendingAreaCompanionId);
  pendingAreaCompanionId = activeCompanionId || (companionIsUnlocked ? pendingAreaCompanionId : null);
  renderAreaSessionDialog();
  openDialog(elements.areaSessionDialog);
}

function activityChanges(area, progress = 1, secretBonus = null) {
  const scale = (value) => Math.round(value * Math.max(0, Math.min(1, progress)));
  if (area === "meadow") return {
    satiety: scale(-35),
    fun: scale(18 + (secretBonus === "spotless" ? 6 : 0)),
    social: scale(100),
    energy: scale(-10),
    xp: scale(20 + (secretBonus === "spotless" ? 8 : 0)),
  };
  return {
    satiety: scale(-15),
    fun: scale(22 + (secretBonus === "pineapple" ? 8 : 0)),
    curiosity: scale(12 + (secretBonus === "pineapple" ? 3 : 0)),
    clean: scale(-35),
    energy: scale(-35 + (secretBonus === "pineapple" ? 10 : 0)),
    xp: scale(18 + (secretBonus === "pineapple" ? 6 : 0)),
  };
}

function completedCompanion(completion, progress = 1, now = Date.now()) {
  const companion = friendCopy(ANIMAL_FRIENDS[completion?.companionId]);
  if (!companion) return { companion: null, effect: null };
  const effect = companionActivityEffect(companion.id, completion.area, progress, state.language);
  if (progress >= 0.25) state.world = recordFriendCompanionActivity(state.world, companion.id, completion.area, now, worldSeed());
  return { companion, effect };
}

function startAreaStay(area = pendingAreaSessionArea || state.landscapeArea) {
  if (state.world.activity) return;
  if (isTraveling(state.travel) || state.sleeping || interactionBusy) return;
  const now = Date.now();
  const result = startWorldActivity(state.world, area, now, worldSeed(), { clean: state.clean, companionId: pendingAreaCompanionId });
  if (!result.started) return;
  state.world = result.world;
  const kennel = result.world.activity.area === "meadow";
  const companion = friendCopy(ANIMAL_FRIENDS[result.world.activity.companionId]);
  talk(state.language === "de"
    ? `${kennel ? "Vierzig Minuten Kennel Club. Ich komme von allein zurück – wahrscheinlich hungrig und sehr zufrieden." : "Vierzig Minuten Play Area. Danach brauche ich vermutlich Dusche, Snack und Schlaf."}${companion ? ` ${companion.label} kommt mit.` : ""}`
    : `${kennel ? "Forty minutes at the Kennel Club. I’ll return on my own — probably hungry and very pleased." : "Forty minutes in the Play Area. Afterward I’ll probably need a shower, snack and sleep."}${companion ? ` ${companion.label} is coming along.` : ""}`, { speak: false });
  remember(state.language === "de" ? `${state.name} startet eine 40-Minuten-Session im ${kennel ? "Kennel Club" : "Play Area"}.${companion ? ` ${companion.label} ist dabei.` : ""}` : `${state.name} starts a 40-minute ${kennel ? "Kennel Club" : "Play Area"} session.${companion ? ` ${companion.label} is joining.` : ""}`, kennel ? "♣" : "▰");
  showToast(state.language === "de" ? "40-MINUTEN-SESSION GESTARTET" : "40-MINUTE SESSION STARTED", 3200);
  if (elements.areaSessionDialog.open) elements.areaSessionDialog.close();
  render(now);
}

function recallAreaStay() {
  if (!state.world.activity) return;
  const now = Date.now();
  const recalled = recallWorldActivity(state.world, now, worldSeed());
  if (!recalled.completion) return;
  const { area, progress, secretBonus: capturedSecretBonus } = recalled.completion;
  const secretBonus = progress >= 0.25 ? capturedSecretBonus : null;
  state.world = recalled.world;
  const { companion, effect: companionEffect } = completedCompanion(recalled.completion, progress, now);
  if (progress > 0) state = awardChanges(mergeChangeSets(activityChanges(area, progress, secretBonus), companionEffect?.changes), now);
  state.landscapeArea = "home";
  const minutes = Math.max(0, Math.round((now - recalled.completion.startedAt) / 60_000));
  const place = area === "meadow" ? "Kennel Club" : "Play Area";
  currentPhrase = state.language === "de"
    ? `Da bin ich wieder. ${minutes} Minuten ${place} waren fürs Erste genug.${secretBonus === "pineapple" ? " Der Ananassaft vorher hat trotzdem für verdächtig gute Ausdauer gesorgt." : secretBonus === "spotless" ? " Blitzblank reinzugehen ist dort übrigens nicht unbemerkt geblieben." : ""}${companion ? ` ${companion.label}s ${companionEffect.trait.label} hat die Session verändert.` : ""}`
    : `I am back. ${minutes} minutes at the ${place} was enough for now.${secretBonus === "pineapple" ? " That pineapple juice still made for suspiciously good stamina." : secretBonus === "spotless" ? " Going in spotless did not go unnoticed, by the way." : ""}${companion ? ` ${companion.label}'s ${companionEffect.trait.label} changed the session.` : ""}`;
  remember(state.language === "de" ? `${state.name} wurde nach ${minutes} Minuten vorzeitig aus dem ${place} zurückgeholt.${secretBonus ? ` Verdeckter ${secretBonus === "pineapple" ? "Ananassaft" : "Blitzblank"}-Bonus ausgelöst.` : ""}${companion ? ` Begleitung: ${companion.label}.` : ""}` : `${state.name} was brought home early after ${minutes} minutes at the ${place}.${secretBonus ? ` Hidden ${secretBonus} bonus triggered.` : ""}${companion ? ` Companion: ${companion.label}.` : ""}`, area === "meadow" ? "♣" : "▰");
  showToast(state.language === "de" ? `${state.name.toUpperCase()} IST WIEDER ZU HAUSE` : `${state.name.toUpperCase()} IS HOME AGAIN`, 3600);
  if (elements.areaSessionDialog.open) elements.areaSessionDialog.close();
  render(now);
}

function renderLandscape(now = Date.now(), traveling = isTraveling(state.travel, now)) {
  const growth = growthFor(state);
  const sessionAway = Boolean(state.world.activity);
  elements.habitat.dataset.area = state.landscapeArea;
  elements.habitat.classList.toggle("is-away", traveling);
  elements.habitat.classList.toggle("is-session-away", sessionAway);
  elements.petButton.dataset.growth = growth.id;
  elements.petButton.setAttribute("aria-label", state.language === "de" ? `${state.name} streicheln oder einen ausgewählten Gegenstand geben` : `Pet ${state.name} or give the selected item`);
  $('.cabin[data-landmark="cabin"]').setAttribute("aria-label", state.language === "de" ? `${state.name}s kleine Schlafhütte ansehen` : `Look at ${state.name}'s little sleeping den`);
  const petX = `${wanderPosition(now)}%`;
  elements.petButton.style.setProperty("--pet-x", petX);
  elements.hoodToggle.style.setProperty("--pet-x", petX);
  elements.hoodToggle.hidden = traveling || sessionAway || state.sleeping || !state.inventory.equipped.hood;
  elements.hoodToggle.setAttribute("aria-label", state.language === "de" ? "Hood abnehmen" : "Take off hood");
  elements.hoodToggle.title = state.language === "de" ? "Hood abnehmen" : "Take off hood";
  $$("button[data-area]", $("#world-navigation")).forEach((item) => {
    item.classList.toggle("is-active", item.dataset.area === state.landscapeArea);
    item.setAttribute("aria-pressed", String(item.dataset.area === state.landscapeArea));
    item.disabled = Boolean(state.world.activity);
  });
  renderOutfit();
  renderPlacedItems(traveling, now);
  renderAnimalVisitor(traveling || sessionAway);
  elements.travelPostcard.hidden = !traveling;
  if (!traveling) {
    if (elements.travelDialog.open) elements.travelDialog.close();
    return;
  }
  const destination = destinationCopy(destinationById(state.travel.destinationId));
  elements.travelPostcard.dataset.stamp = state.language === "de" ? "REISEPOST" : "PARTY POST";
  $("#travel-stamp").textContent = destination.icon;
  $("#travel-kind").textContent = `${state.language === "de" ? "REISEPOST" : "PARTY POST"} · ${destination.kind}`;
  $("#travel-place").textContent = destination.title;
  $("#travel-countdown").textContent = travelTimeLabel(state.travel, now, state.language);
  if (elements.travelDialog.open) {
    $("#travel-dialog-countdown").textContent = travelTimeLabel(state.travel, now, state.language);
    $("#travel-progress-fill").style.setProperty("--value", `${travelProgress(state.travel, now)}%`);
  }
}

function renderWeather() {
  elements.habitat.dataset.weather = weatherData.kind;
  elements.weatherIcon.textContent = "BERLIN";
  elements.weatherTemperature.textContent = `${Math.round(weatherData.temperature)}°`;
  elements.weatherCondition.textContent = weatherData.label.toUpperCase();
  elements.weatherDialog.setAttribute("aria-label", state.language === "de" ? `Berliner Wetterreferenz: ${weatherData.label}, ${Math.round(weatherData.temperature)} Grad` : `Berlin weather reference: ${weatherData.label}, ${Math.round(weatherData.temperature)} degrees`);
  $("#weather-dialog-icon").textContent = "BERLIN";
  $("#weather-dialog-label").textContent = weatherData.label;
  $("#weather-dialog-temp").textContent = `${weatherData.temperature.toLocaleString("de-DE")} °C`;
  $("#weather-dialog-phrase").textContent = weatherData.phrase;
  $("#weather-clouds").textContent = `${weatherData.cloudCover} %`;
  $("#weather-rain").textContent = `${weatherData.precipitation.toLocaleString("de-DE")} mm`;
}

function refreshWeather() {
  weatherData = localAmbience(Date.now(), state.language);
  renderWeather();
}

function openWeatherDetails() {
  renderWeather();
  openDialog(elements.weatherDialog);
}

function openTravelDetails() {
  if (!isTraveling(state.travel)) return;
  const destination = destinationCopy(destinationById(state.travel.destinationId));
  $("#travel-dialog-kind").textContent = `${destination.kind} · ${state.language === "de" ? "REISEPOST" : "PARTY POST"}`;
  $("#travel-dialog-title").textContent = destination.title;
  $("#travel-dialog-place").textContent = destination.place;
  $("#travel-dialog-icon").textContent = destination.icon;
  $("#travel-dialog-doing").textContent = `${state.name} ${destination.doing}.`;
  $("#travel-dialog-fact").textContent = destination.fact;
  $("#travel-dialog-countdown").textContent = travelTimeLabel(state.travel, Date.now(), state.language);
  $("#travel-progress-fill").style.setProperty("--value", `${travelProgress(state.travel)}%`);
  $("#travel-illustration").dataset.palette = destination.palette;
  const companion = friendCopy(ANIMAL_FRIENDS[state.travel.companionId]);
  $("#travel-companion").hidden = !companion;
  if (companion) {
    const effect = companionActivityEffect(companion.id, "travel", 1, state.language);
    $("#travel-companion-icon").textContent = companion.icon;
    $("#travel-companion-name").textContent = `${companion.label} · ${effect?.trait.label || companion.trait.label}`;
  }
  $("#travel-reward-label").textContent = state.language === "de"
    ? (state.travel.rewardId ? "Ein geheimnisvoller neuer Fund" : "Eine Überraschung aus der Ferne")
    : (state.travel.rewardId ? "A mysterious new find" : "A surprise from afar");
  $("#travel-history").textContent = state.language === "de"
    ? `${state.name} hat bereits ${state.travel.completedTrips} ${state.travel.completedTrips === 1 ? "Reise" : "Reisen"} beendet und ${state.travel.visitedIds.length} verschiedene Orte entdeckt.`
    : `${state.name} has completed ${state.travel.completedTrips} ${state.travel.completedTrips === 1 ? "outing" : "outings"} and discovered ${state.travel.visitedIds.length} different places.`;
  openDialog(elements.travelDialog);
}

function openJourneyDialog() {
  if (!hasStoredState) return;
  if (isTraveling(state.travel)) {
    openTravelDetails();
    return;
  }
  if (state.sleeping) {
    showToast(state.language === "de" ? `Weck ${state.name} erst auf, bevor der Rucksack gepackt wird.` : `Wake ${state.name} before packing the party bag.`);
    return;
  }
  if (state.world.activity) {
    showToast(state.language === "de" ? "Die 40-Minuten-Session läuft noch. Danach kann die Reise starten." : "The 40-minute session is still running. Travel can start afterward.");
    return;
  }
  if (interactionBusy || currentConversation) {
    showToast(state.language === "de" ? "Lass die aktuelle gemeinsame Aktion kurz zu Ende gehen." : "Let the current activity finish first.");
    return;
  }
  closeTray();
  state.world = normalizeWorld(state.world, Date.now(), worldSeed());
  const companions = availableCompanions(state.world, state.language, Date.now(), worldSeed());
  if (!companions.some((entry) => entry.friend.id === pendingJourneyCompanionId)) pendingJourneyCompanionId = null;
  $("#journey-capy-name").textContent = state.name;
  $("#journey-title").textContent = state.language === "de" ? `${state.name}, wohin geht es wohl?` : `Where will ${state.name} go?`;
  const until = Math.max(0, (Number(state.travel?.nextDepartureAt) || Date.now()) - Date.now());
  const totalMinutes = Math.max(1, Math.ceil(until / 60_000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  $("#journey-companion-heading").textContent = state.language === "de" ? "WER KOMMT MIT?" : "WHO COMES ALONG?";
  pendingJourneyCompanionId = renderCompanionPicker({
    options: $("#journey-companion-options"),
    effect: $("#journey-companion-effect"),
    selectedId: pendingJourneyCompanionId,
    activity: "travel",
    onSelect: (friendId) => {
      pendingJourneyCompanionId = friendId;
      openJourneyDialog();
    },
  });
  $("#auto-travel-heading").textContent = state.language === "de" ? "EIGENSTÄNDIGE REISEN SIND AKTIV" : "INDEPENDENT TRAVEL IS ACTIVE";
  $("#auto-travel-status").textContent = state.language === "de"
    ? `${state.name} zieht auch von allein los und bleibt dann drei bis vier Stunden unterwegs. Nächste mögliche Abreise ungefähr in ${hours ? `${hours} Std.${minutes ? " " : ""}` : ""}${minutes ? `${minutes} Min.` : ""}`
    : `${state.name} also heads out independently and then stays away for three to four hours. Next possible departure in about ${hours ? `${hours} hr${minutes ? " " : ""}` : ""}${minutes ? `${minutes} min` : ""}.`;
  openDialog(elements.journeyDialog);
}

function startManualJourney() {
  if (isTraveling(state.travel) || state.sleeping || interactionBusy) return;
  const now = Date.now();
  const companionIsUnlocked = availableCompanions(state.world, state.language, now, worldSeed()).some((entry) => entry.friend.id === pendingJourneyCompanionId);
  const chosenCompanionId = companionIsUnlocked ? pendingJourneyCompanionId : null;
  const nextTravel = departNow(state.travel, state.adoptedAt, now, travelSeed(), { companionId: chosenCompanionId });
  if (nextTravel.returnPending) {
    state.travel = nextTravel;
    if (elements.journeyDialog.open) elements.journeyDialog.close();
    syncTravelState(now);
    render(now);
    return;
  }
  state.travel = nextTravel;
  prepareTravelCargo();
  const destination = destinationCopy(destinationById(state.travel.destinationId));
  const companion = friendCopy(ANIMAL_FRIENDS[state.travel.companionId]);
  remember(state.language === "de"
    ? `${state.name} wurde von dir auf eine Überraschungsreise geschickt. Das Ziel: ${destination.title}.${companion ? ` ${companion.label} reist mit.` : ""}`
    : `You sent ${state.name} on a surprise outing. The destination: ${destination.title}.${companion ? ` ${companion.label} is joining.` : ""}`, "⌁");
  elements.journeyDialog.close();
  talk(state.language === "de"
    ? `Rucksack gepackt! Ich habe mein Ziel selbst gewählt: ${destination.title}.${companion ? ` ${companion.label} kommt mit!` : ""} Bis später!`
    : `Party bag packed! I chose my own destination: ${destination.title}.${companion ? ` ${companion.label} is coming!` : ""} See you later!`);
  playSound("happy");
  haptic([20, 35, 20, 35, 35]);
  showToast(state.language === "de" ? `${state.name.toUpperCase()} IST AUF ÜBERRASCHUNGSREISE!` : `${state.name.toUpperCase()} IS OFF TO A SURPRISE PARTY!`, 4200);
  render(now);
  window.setTimeout(openTravelDetails, 220);
}

function recallFromParty() {
  const now = Date.now();
  if (!isTraveling(state.travel, now)) return;
  state.travel = recallTravel(state.travel, state.adoptedAt, now, travelSeed());
  if (elements.travelDialog.open) elements.travelDialog.close();
  syncTravelState(now);
  playSound("happy");
  haptic([20, 35, 20]);
  render(now);
}

function renderInventory(filter = inventoryFilter) {
  inventoryFilter = filter;
  state.inventory = normalizeInventory(state.inventory);
  state.garden = normalizeGarden(state.garden);
  const completion = inventoryCompletion(state.inventory);
  const equippedCount = Object.values(state.inventory.equipped).filter(Boolean).length;
  $("#inventory-summary").innerHTML = state.language === "de" ? `
    <div><strong>${completion.owned}/${completion.total}</strong><small>ENTDECKT</small></div>
    <div><strong>${equippedCount}/5</strong><small>ANGEZOGEN</small></div>
    <div><strong>${state.inventory.placedItemIds.length}</strong><small>PLATZIERT</small></div>` : `
    <div><strong>${completion.owned}/${completion.total}</strong><small>DISCOVERED</small></div>
    <div><strong>${equippedCount}/5</strong><small>WORN</small></div>
    <div><strong>${state.inventory.placedItemIds.length}</strong><small>PLACED</small></div>`;
  $$("button[data-filter]", $("#inventory-tabs")).forEach((button) => button.classList.toggle("is-active", button.dataset.filter === filter));
  const hint = $("#inventory-hint");
  hint.textContent = filter === "container"
    ? (state.language === "de" ? "Der Gear-Schrank ist immer hier. Das Freundebuch kann dein Kinkybara von einer Reise mitbringen." : "The gear locker is always here. Your Kinkybara can bring the friend book home from a trip.")
    : filter === "placeable"
      ? (state.language === "de" ? "Weltfunde kannst du platzieren und direkt in der jeweiligen Welt anklicken." : "World finds can be placed and clicked directly in their matching area.")
      : (state.language === "de" ? "Jeder Outfit-Platz hält ein Teil. Deine Signaturfarben prägen besondere Ausrüstung automatisch." : "Each outfit slot holds one item. Your signature colors automatically shape special gear.");
  elements.inventoryGrid.replaceChildren();

  if (filter === "harvest") {
    const gardenCard = document.createElement("article");
    gardenCard.className = "inventory-card is-placed";
    gardenCard.innerHTML = state.language === "de"
      ? '<span class="inventory-card-icon">♣</span><strong>Gemüsegarten</strong><small>Pflanzen, gießen und auch offline wachsen lassen.</small><button type="button" data-open-garden>GARTEN PFLEGEN</button>'
      : '<span class="inventory-card-icon">♣</span><strong>Vegetable garden</strong><small>Plant, water and let it grow while offline.</small><button type="button" data-open-garden>TEND THE GARDEN</button>';
    elements.inventoryGrid.append(gardenCard);
    for (const baseCrop of Object.values(CROPS)) {
      const crop = cropCopy(baseCrop);
      const card = document.createElement("article");
      card.className = "inventory-card";
      card.innerHTML = `<span class="inventory-card-icon">${crop.icon}</span><strong>${crop.label}</strong><small>${state.garden.harvest[crop.id]} ${state.language === "de" ? "Stück im Vorrat" : "in the pantry"}.</small><button type="button" data-feed-harvest="${crop.id}" ${state.garden.harvest[crop.id] ? "" : "disabled"}>${state.garden.harvest[crop.id] ? (state.language === "de" ? "JETZT FÜTTERN" : "FEED NOW") : (state.language === "de" ? "NOCH NICHT GEERNTET" : "NOT HARVESTED YET")}</button>`;
      elements.inventoryGrid.append(card);
    }
    return;
  }

  const definitions = Object.values(ITEM_DEFINITIONS)
    .filter((item) => filter === "all" || item.type === filter)
    .sort((a, b) => Number(b.type === "container") - Number(a.type === "container"));
  for (const baseItem of definitions) {
    const item = itemCopy(baseItem);
    const owned = state.inventory.ownedItemIds.includes(item.id);
    const known = owned || item.type === "container";
    const equipped = item.slot && state.inventory.equipped[item.slot] === item.id;
    const placed = state.inventory.placedItemIds.includes(item.id);
    const card = document.createElement("article");
    card.className = `inventory-card${item.type === "container" ? " is-container-card" : ""}${owned ? "" : " is-locked"}${equipped ? " is-equipped" : ""}${placed ? " is-placed" : ""}`;
    const icon = known
      ? createItemArtwork(item, "inventory-card-icon")
      : createItemArtwork(null, "inventory-card-icon", "?");
    const name = document.createElement("strong");
    name.textContent = known ? item.label : (state.language === "de" ? "Unbekannter Reisefund" : "Unknown party find");
    const detail = document.createElement("small");
    detail.textContent = known ? item.detail : (state.language === "de" ? "Dein Kinkybara kann diesen Gegenstand von einer Party mitbringen." : "Your Kinkybara may bring this item home from a party.");
    const tag = document.createElement("em");
    tag.textContent = item.slot
      ? localizedSlot(item.slot, state.language)
      : item.type === "container" ? (state.language === "de" ? "SAMMLUNG" : "COLLECTION") : ui().area[item.area];
    const action = document.createElement("button");
    action.type = "button";
    action.dataset.inventoryItem = item.id;
    action.disabled = !owned;
    action.textContent = state.language === "de"
      ? (!owned ? (item.type === "container" ? "AUF REISE FINDEN" : "NOCH UNENTDECKT") : item.type === "wearable" ? (equipped ? "AUSZIEHEN" : "ANZIEHEN") : item.type === "container" ? "ÖFFNEN" : (placed ? "EINPACKEN" : "PLATZIEREN"))
      : (!owned ? (item.type === "container" ? "FIND ON A TRIP" : "UNDISCOVERED") : item.type === "wearable" ? (equipped ? "TAKE OFF" : "PUT ON") : item.type === "container" ? "OPEN" : (placed ? "PACK AWAY" : "PLACE"));
    card.append(icon, name, detail, tag, action);
    elements.inventoryGrid.append(card);
  }
}

function openInventory(filter = "all") {
  if (!hasStoredState || interactionBusy) return;
  closeTray();
  renderInventory(filter);
  openDialog(elements.inventoryDialog);
}

function openGearLocker() {
  const wearables = Object.values(ITEM_DEFINITIONS).filter((item) => item.type === "wearable");
  $("#gear-locker-title").textContent = state.language === "de" ? `${state.name}s Gear` : `${state.name}'s gear`;
  $("#gear-locker-copy").textContent = state.language === "de" ? "Alle Accessoires nach Slots sortiert. Tippe auf ein gefundenes Teil, um es direkt anzuziehen oder abzulegen." : "All accessories sorted by slot. Tap a discovered piece to put it on or take it off.";
  const grid = $("#gear-locker-grid");
  grid.replaceChildren();
  wearables.forEach((baseItem) => {
    const item = itemCopy(baseItem);
    const owned = state.inventory.ownedItemIds.includes(item.id);
    const equipped = state.inventory.equipped[item.slot] === item.id;
    const button = document.createElement("button");
    button.type = "button";
    button.disabled = !owned;
    button.dataset.lockerItem = item.id;
    button.className = equipped ? "is-equipped" : "";
    const artwork = owned ? createItemArtwork(item, "locker-gear-icon") : createItemArtwork(null, "locker-gear-icon", "?");
    const name = document.createElement("strong");
    name.textContent = owned ? item.label : (state.language === "de" ? "Unbekannt" : "Unknown");
    const meta = document.createElement("small");
    meta.textContent = `${localizedSlot(item.slot, state.language)} · ${owned ? (equipped ? (state.language === "de" ? "ANGEZOGEN" : "WORN") : (state.language === "de" ? "IM SCHRANK" : "IN LOCKER")) : (state.language === "de" ? "AUF REISE FINDEN" : "FIND ON A TRIP")}`;
    button.append(artwork, name, meta);
    grid.append(button);
  });
  if (elements.inventoryDialog.open) elements.inventoryDialog.close();
  if (!elements.gearLockerDialog.open) openDialog(elements.gearLockerDialog);
}

function openFriendBook() {
  const now = Date.now();
  state.world = normalizeWorld(state.world, now, worldSeed());
  $("#friend-book-title").textContent = state.language === "de" ? `${state.world.metFriendIds.length} von ${Object.keys(ANIMAL_FRIENDS).length} Freunden` : `${state.world.metFriendIds.length} of ${Object.keys(ANIMAL_FRIENDS).length} friends`;
  $("#friend-book-copy").textContent = state.language === "de" ? "Tippe auf einen Freund für Fundort, Beziehung, gemeinsame Erlebnisse und die besondere Begleiter-Eigenschaft." : "Tap a friend for where you met, your relationship, shared history and their companion trait.";
  const grid = $("#friend-book-grid");
  grid.replaceChildren();
  Object.values(ANIMAL_FRIENDS).forEach((baseFriend) => {
    const entry = friendBookEntry(state.world, baseFriend.id, state.language, now, worldSeed());
    if (!entry) return;
    const { friend, met, record, relationship } = entry;
    const card = document.createElement("article");
    card.className = `friend-book-card ${met ? "is-met" : "is-unknown"}`;
    const icon = document.createElement("span");
    icon.textContent = met ? friend.icon : "?";
    const name = document.createElement("strong");
    name.textContent = met ? `${friend.label} · ${friend.species}` : (state.language === "de" ? "Noch unbekannt" : "Not met yet");
    const teaser = document.createElement("small");
    teaser.textContent = met ? `${relationship.label} · ${friend.personality}` : (state.language === "de" ? "Vielleicht beim nächsten Besuch oder auf einer Reise." : "Maybe on the next visit or trip.");
    if (met) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "friend-book-toggle";
      button.setAttribute("aria-expanded", "false");
      const summary = document.createElement("span");
      summary.className = "friend-book-summary";
      summary.append(name, teaser);
      const chevron = document.createElement("b");
      chevron.setAttribute("aria-hidden", "true");
      chevron.textContent = "+";
      button.append(icon, summary, chevron);
      const firstMetAt = Number(record.firstMetAt) || 0;
      const date = document.createElement("time");
      date.dateTime = firstMetAt ? new Date(firstMetAt).toISOString() : "";
      date.textContent = firstMetAt
        ? new Intl.DateTimeFormat(state.language === "de" ? "de-DE" : "en-GB", { dateStyle: "medium" }).format(firstMetAt)
        : (state.language === "de" ? "Datum unbekannt" : "Date unknown");
      const details = document.createElement("div");
      details.className = "friend-book-details";
      details.id = `friend-details-${friend.id}`;
      details.hidden = true;
      button.setAttribute("aria-controls", details.id);
      const firstMet = document.createElement("p");
      firstMet.innerHTML = state.language === "de" ? "<b>KENNENGELERNT</b>" : "<b>FIRST MET</b>";
      firstMet.append(` · ${friendOriginText(entry)} · ${date.textContent}`);
      const history = document.createElement("p");
      history.innerHTML = state.language === "de" ? "<b>GEMEINSAM</b>" : "<b>TOGETHER</b>";
      history.append(state.language === "de"
        ? ` · ${record.meetings} Begegnungen · ${record.tripsTogether} Reisen · ${record.sessionsTogether.meadow}× Kennel Club · ${record.sessionsTogether.garden}× Play Area`
        : ` · ${record.meetings} meetings · ${record.tripsTogether} trips · ${record.sessionsTogether.meadow}× Kennel Club · ${record.sessionsTogether.garden}× Play Area`);
      const trait = document.createElement("p");
      const traitName = document.createElement("b");
      traitName.textContent = friend.trait.label.toUpperCase();
      trait.append(traitName);
      trait.append(` · ${friend.trait.detail}`);
      details.append(date, firstMet, history, trait);
      card.append(button, details);
      button.addEventListener("click", () => {
        const opening = !card.classList.contains("is-open");
        grid.querySelectorAll(".friend-book-card.is-open").forEach((openCard) => {
          openCard.classList.remove("is-open");
          const openButton = openCard.querySelector(".friend-book-toggle");
          openButton?.setAttribute("aria-expanded", "false");
          const openChevron = openButton?.querySelector("b");
          if (openChevron) openChevron.textContent = "+";
          const openDetails = openCard.querySelector(".friend-book-details");
          if (openDetails) openDetails.hidden = true;
        });
        card.classList.toggle("is-open", opening);
        button.setAttribute("aria-expanded", String(opening));
        chevron.textContent = opening ? "−" : "+";
        details.hidden = !opening;
      });
    } else {
      const summary = document.createElement("div");
      summary.className = "friend-book-summary";
      summary.append(name, teaser);
      card.append(icon, summary);
    }
    grid.append(card);
  });
  if (elements.inventoryDialog.open) elements.inventoryDialog.close();
  if (!elements.friendBookDialog.open) openDialog(elements.friendBookDialog);
}

function useInventoryItem(itemId) {
  const item = itemCopy(ITEM_DEFINITIONS[itemId]);
  if (!item) return;
  if (item.type === "container") {
    if (item.id === "gear_locker") openGearLocker();
    if (item.id === "friend_book") openFriendBook();
    return;
  }
  if (item.type === "wearable") {
    const result = toggleEquipment(state.inventory, itemId);
    state.inventory = result.inventory;
    const replaced = itemCopy(ITEM_DEFINITIONS[result.replacedId]);
    talk(state.language === "de"
      ? (result.equipped ? `${item.label} steht mir ausgezeichnet!${replaced ? ` ${replaced.label} kommt dafür zurück in den Rucksack.` : ""}` : `${item.label} liegt wieder ordentlich im Rucksack.`)
      : (result.equipped ? `${item.label} looks excellent on me!${replaced ? ` ${replaced.label} goes back into the party bag.` : ""}` : `${item.label} is neatly packed away again.`), { speak: false });
    animateCapy("is-loved", 1200);
  } else {
    const result = togglePlacedItem(state.inventory, itemId);
    state.inventory = result.inventory;
    talk(state.language === "de"
      ? (result.placed ? `${item.label} steht jetzt bei ${ui().area[item.area].toLowerCase()}. Ich werde es dort wiederfinden.` : `${item.label} ist wieder sicher im Rucksack.`)
      : (result.placed ? `${item.label} is now at ${ui().area[item.area].toLowerCase()}. I will find it there.` : `${item.label} is safely packed away again.`), { speak: false });
  }
  haptic(16);
  renderInventory();
  render();
  if (elements.gearLockerDialog.open) openGearLocker();
}

function removeEquippedHood() {
  const itemId = state.inventory.equipped.hood;
  if (!itemId || interactionBusy || isTraveling(state.travel)) return;
  const item = itemCopy(ITEM_DEFINITIONS[itemId]);
  state.inventory = toggleEquipment(state.inventory, itemId).inventory;
  talk(state.language === "de"
    ? `${item.label} liegt wieder im Gear-Schrank. Frische Luft für die Ohren!`
    : `${item.label} is back in the gear locker. Fresh air for those ears!`, { speak: false });
  playSound("tap");
  haptic(16);
  render();
}

function renderGarden(now = Date.now()) {
  state.garden = normalizeGarden(state.garden);
  const picker = $("#seed-picker");
  picker.replaceChildren();
  for (const baseCrop of Object.values(CROPS)) {
    const crop = cropCopy(baseCrop);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `seed-button${state.garden.selectedCrop === crop.id ? " is-active" : ""}`;
    button.dataset.cropId = crop.id;
    button.innerHTML = `<span>${crop.icon}</span><strong>${crop.label}</strong><small>× ${state.garden.seeds[crop.id]}</small>`;
    picker.append(button);
  }

  const ownsWateringCan = state.inventory.ownedItemIds.includes("watering_can");
  elements.gardenPlots.replaceChildren();
  state.garden.plots.forEach((plot, index) => {
    const card = document.createElement("article");
    if (!plot) {
      const crop = cropCopy(CROPS[state.garden.selectedCrop]);
      card.className = "garden-plot is-empty";
      card.innerHTML = state.language === "de"
        ? `<span>＋</span><strong>BEET ${index + 1} IST FREI</strong><small>${crop.label} auswählen</small><button type="button" data-garden-action="plant" data-plot="${index}" ${state.garden.seeds[crop.id] ? "" : "disabled"}>${crop.icon} EINPFLANZEN</button>`
        : `<span>＋</span><strong>PLOT ${index + 1} IS EMPTY</strong><small>Select ${crop.label}</small><button type="button" data-garden-action="plant" data-plot="${index}" ${state.garden.seeds[crop.id] ? "" : "disabled"}>${crop.icon} PLANT</button>`;
    } else {
      const crop = cropCopy(CROPS[plot.cropId]);
      const ready = now >= plot.readyAt;
      card.className = `garden-plot${ready ? " is-ready" : ""}`;
      card.innerHTML = `<span>${crop.icon}</span><strong>${crop.label.toUpperCase()}</strong><small>${cropTimeLabel(plot, now, state.language)}${plot.watered ? (state.language === "de" ? " · GEGOSSEN" : " · WATERED") : ""}</small><div class="crop-progress"><span style="--value:${cropProgress(plot, now)}%"></span></div>`;
      const action = document.createElement("button");
      action.type = "button";
      action.dataset.plot = String(index);
      action.dataset.gardenAction = ready ? "harvest" : "water";
      action.disabled = !ready && (!ownsWateringCan || plot.watered);
      action.textContent = state.language === "de"
        ? (ready ? "JETZT ERNTEN" : plot.watered ? "WÄCHST SCHNELLER" : ownsWateringCan ? "MIT GIESSKANNE GIESSEN" : "GIESSKANNE AUF REISE FINDEN")
        : (ready ? "HARVEST NOW" : plot.watered ? "GROWING FASTER" : ownsWateringCan ? "WATER" : "FIND A WATERING CAN ON A PARTY");
      card.append(action);
    }
    elements.gardenPlots.append(card);
  });
  $("#harvest-pantry").innerHTML = `<strong>${state.language === "de" ? "DEIN ERNTEVORRAT · BEIM FÜTTERN VERFÜGBAR" : "YOUR HARVEST · AVAILABLE WHILE FEEDING"}</strong><div class="pantry-row">${Object.values(CROPS).map((crop) => `<span>${crop.icon}<b>× ${state.garden.harvest[crop.id]}</b></span>`).join("")}</div>`;
}

function openGarden() {
  if (!hasStoredState || isTraveling(state.travel)) {
    if (isTraveling(state.travel)) showToast(state.language === "de" ? "Der Garten wartet, bis dein Kinkybara wieder zu Hause ist." : "The garden will wait until your Kinkybara is home.");
    return;
  }
  if (elements.inventoryDialog.open) elements.inventoryDialog.close();
  renderGarden();
  openDialog(elements.gardenDialog);
}

function performGardenAction(action, plotIndex) {
  const now = Date.now();
  if (action === "plant") {
    const result = plantCrop(state.garden, plotIndex, now);
    state.garden = result.garden;
    const crop = cropCopy(result.crop);
    if (result.planted) {
      state = awardChanges({ curiosity: 1, xp: 1 }, now);
      talk(state.language === "de" ? `${crop.label} ist eingepflanzt. Sie wächst auch weiter, wenn du die App schließt.` : `${crop.label} is planted. It keeps growing while the app is closed.`, { speak: false });
    }
    else showToast(state.language === "de" ? "Für dieses Beet fehlt gerade Saatgut." : "You need more seeds for this plot.");
  } else if (action === "water") {
    if (!state.inventory.ownedItemIds.includes("watering_can")) {
      showToast(state.language === "de" ? "Die Gießkanne kann dein Kinkybara von einer Party mitbringen." : "Your Kinkybara may bring a watering can home from a party.");
      return;
    }
    const result = waterCrop(state.garden, plotIndex, now);
    state.garden = result.garden;
    if (result.watered) {
      state = awardChanges({ curiosity: 0.5, xp: 1 }, now);
      talk(state.language === "de" ? "Gluck, gluck – jetzt wächst das Gemüse deutlich schneller!" : "Glug, glug — now the vegetables will grow much faster!", { speak: false });
    }
  } else if (action === "harvest") {
    const result = harvestCrop(state.garden, plotIndex, now);
    state.garden = result.garden;
    if (result.harvested) {
      state = awardChanges({ curiosity: 3, fun: 2, xp: 6 }, now);
      const crop = cropCopy(result.crop);
      remember(state.language === "de" ? `${state.name} hat mit dir ${result.amount} × ${crop.label} geerntet.` : `${state.name} harvested ${result.amount} × ${crop.label} with you.`, result.crop.icon);
      talk(state.language === "de" ? `${result.amount} ${crop.label}! Die können wir jetzt direkt aus dem Futterfach geben.` : `${result.amount} ${crop.label}! We can serve them straight from the food tray now.`);
      showToast(state.language === "de" ? `ERNTE: ${result.amount} × ${crop.label.toUpperCase()}` : `HARVEST: ${result.amount} × ${crop.label.toUpperCase()}`, 3200);
    }
  }
  playSound("tap");
  haptic(14);
  renderGarden(now);
  render(now);
}

function scheduleQuestWake(now = Date.now()) {
  window.clearTimeout(questWakeTimer);
  questWakeTimer = 0;
  if (!hasStoredState || !state.questProgress) return;
  const quest = questCopy(currentQuest(state.questProgress));
  if (!quest || state.questProgress.activeId || state.questProgress.nextAt <= now) return;
  const delay = Math.min(2_147_000_000, Math.max(25, state.questProgress.nextAt - now + 25));
  questWakeTimer = window.setTimeout(() => {
    questWakeTimer = 0;
    render(Date.now());
  }, delay);
}

function questNoticeKey(quest) {
  return quest && state.questProgress
    ? `${activePetId}:${state.questProgress.dayKey}:${quest.id}`
    : "";
}

function dismissQuestIndicator() {
  const quest = currentQuest(state.questProgress);
  const noticeKey = questNoticeKey(quest);
  if (!noticeKey) return;
  state.questProgress = { ...state.questProgress, dismissedNotice: noticeKey };
  elements.questAlert.hidden = true;
  saveState();
  playSound("tap");
  haptic(10);
}

function renderQuestIndicator(now = Date.now()) {
  if (!hasStoredState || !state.questProgress) {
    elements.questAlert.hidden = true;
    elements.questBadge.hidden = true;
    scheduleQuestWake(now);
    return;
  }
  const quest = currentQuest(state.questProgress);
  const due = questIsDue(state.questProgress, now) && !isTraveling(state.travel, now);
  const noticeKey = questNoticeKey(quest);
  const dismissed = Boolean(due && noticeKey && state.questProgress.dismissedNotice === noticeKey);
  elements.questAlert.hidden = !due || dismissed;
  elements.questBadge.hidden = !due;
  if (quest) $("#quest-alert-title").textContent = quest.title;
  if (due && quest) {
    if (noticeKey !== lastQuestNotice && !document.hidden && !interactionBusy && !elements.welcomeDialog.open && !elements.dedicationDialog.open) {
      lastQuestNotice = noticeKey;
      talk(state.questProgress.activeId
        ? (state.language === "de" ? `Unsere Quest „${quest.title}“ wartet auf uns.` : `Our quest “${quest.title}” is waiting for us.`)
        : quest.intro);
      playSound("happy");
      haptic([12, 35, 12]);
    }
  }
  scheduleQuestWake(now);
}

function renderQuestBoard(now = Date.now()) {
  if (!state.questProgress) return;
  state.questProgress = normalizeQuestProgress(state.questProgress, state.adoptedAt, now, `${activePetId}:${state.name}`);
  const progress = state.questProgress;
  const completedById = new Map(progress.completed.map((entry) => [entry.id, entry]));
  const nextQuest = currentQuest(progress);
  $("#quest-summary").innerHTML = state.language === "de" ? `
    <div><strong>${progress.completed.length}/5</strong><small>HEUTE</small></div>
    <div><strong>✦ ${progress.glitter}</strong><small>GLITZER</small></div>
    <div><strong>${progress.streak || 0}</strong><small>TAGES-SERIE</small></div>` : `
    <div><strong>${progress.completed.length}/5</strong><small>TODAY</small></div>
    <div><strong>✦ ${progress.glitter}</strong><small>GLITTER</small></div>
    <div><strong>${progress.streak || 0}</strong><small>DAY STREAK</small></div>`;
  const list = $("#quest-list");
  list.replaceChildren();
  progress.queue.forEach((id, index) => {
    const quest = questCopy(QUEST_DEFINITIONS[id]);
    const completed = completedById.get(id);
    const active = progress.activeId === id;
    const current = nextQuest?.id === id;
    const due = current && questIsDue(progress, now) && !active;
    const card = document.createElement("article");
    card.className = `quest-card ${completed ? "is-done" : active ? "is-active" : due ? "is-due" : "is-locked"}`;
    const icon = document.createElement("span");
    icon.className = "quest-card-icon";
    icon.textContent = completed ? "✓" : quest.icon;
    const info = document.createElement("div");
    info.className = "quest-card-info";
    const title = document.createElement("strong");
    title.textContent = `${index + 1}. ${quest.title}`;
    const description = document.createElement("small");
    description.textContent = quest.short;
    const meta = document.createElement("span");
    meta.textContent = completed
      ? `${"★".repeat(completed.stars)} · +${completed.reward} ${state.language === "de" ? "GLITZER" : "GLITTER"}`
      : active ? (state.language === "de" ? "QUEST AKTIV" : "QUEST ACTIVE")
        : current ? questTimeLabel(progress, now, state.language)
          : (state.language === "de" ? "WIRD SPÄTER FREIGESCHALTET" : "UNLOCKS LATER");
    info.append(title, description, meta);
    const action = document.createElement("button");
    action.type = "button";
    action.className = "quest-card-action";
    action.dataset.questId = id;
    action.disabled = Boolean(completed || (!active && !due));
    action.textContent = state.language === "de"
      ? (completed ? "FERTIG" : active ? (quest.type === "task" ? "ANSEHEN" : "SPIELEN") : due ? "STARTEN" : "GESPERRT")
      : (completed ? "DONE" : active ? (quest.type === "task" ? "VIEW" : "PLAY") : due ? "START" : "LOCKED");
    card.append(icon, info, action);
    if (active && quest.type === "task") {
      const goals = document.createElement("div");
      goals.className = "quest-goals";
      quest.goals.forEach((goal) => {
        const row = document.createElement("div");
        const done = progress.taskDone.includes(goal.action);
        row.className = `quest-goal${done ? " is-done" : ""}`;
        row.textContent = `${done ? "✓" : "○"} ${goal.label}`;
        goals.append(row);
      });
      card.append(goals);
    }
    list.append(card);
  });
}

function openQuestBoard() {
  if (!hasStoredState) return;
  if (interactionBusy) {
    showToast(state.language === "de" ? "Lass die aktuelle Aktion kurz zu Ende gehen." : "Let the current activity finish first.");
    return;
  }
  closeTray();
  renderQuestBoard();
  openDialog(elements.questDialog);
}

function startQuestById(id) {
  if (isTraveling(state.travel)) {
    const destination = destinationCopy(destinationById(state.travel.destinationId));
    showToast(state.language === "de" ? `${state.name} ist gerade bei ${destination?.title || "einer Party"}. Die Quest wartet.` : `${state.name} is at ${destination?.title || "a party"}. The quest will wait.`);
    return;
  }
  if (state.sleeping) {
    showToast(state.language === "de" ? `Weck ${state.name} zuerst ganz sanft auf.` : `Gently wake ${state.name} first.`);
    return;
  }
  const quest = questCopy(QUEST_DEFINITIONS[id]);
  if (!quest) return;
  state.questProgress = activateQuest(state.questProgress, id);
  if (state.questProgress.activeId !== id) {
    showToast(state.language === "de" ? "Diese Quest ist noch nicht freigeschaltet." : "This quest is not unlocked yet.");
    return;
  }
  saveState();
  if (quest.type === "task") {
    if (elements.questDialog.open) elements.questDialog.close();
    talk(quest.intro);
    showToast(state.language === "de" ? "Die Quest läuft – nutze unten die normalen Aktionen." : "Quest active — use the regular actions below.", 3600);
    render();
    return;
  }
  if (elements.questDialog.open) elements.questDialog.close();
  activeGameCleanup?.();
  activeGameCleanup = null;
  packCardsCleanup?.();
  packCardsCleanup = null;
  $("#quest-game-kicker").textContent = `${quest.icon} ${state.language === "de" ? "GEMEINSAME QUEST" : "SHARED QUEST"}`;
  $("#quest-game-title").textContent = quest.title;
  $("#quest-game-instruction").textContent = quest.instruction;
  elements.questGameStatus.textContent = state.language === "de" ? "BEREIT?" : "READY?";
  openDialog(elements.questGameDialog);
  activeGameCleanup = startQuestGame({
    quest,
    language: state.language,
    stage: elements.questStage,
    status: elements.questGameStatus,
    onMessage: (message) => talk(message, { speak: false }),
    onFinish: (score) => finishQuestGame(score),
  });
  render();
}

function finishQuestGame(score) {
  const quest = questCopy(currentQuest(state.questProgress));
  if (!quest || quest.type !== "minigame" || state.questProgress.activeId !== quest.id) return;
  activeGameCleanup?.();
  activeGameCleanup = null;
  state.questProgress = completeQuest(state.questProgress, quest.id, score);
  const result = state.questProgress.completed.find((entry) => entry.id === quest.id);
  state = awardChanges(quest.reward);
  remember(state.language === "de" ? `${state.name} hat die Quest „${quest.title}“ mit ${result.stars} Sternen gemeistert.` : `${state.name} mastered the quest “${quest.title}” with ${result.stars} stars.`, "✦");
  if (elements.questGameDialog.open) elements.questGameDialog.close();
  talk(state.language === "de" ? `${"Stern! ".repeat(result.stars)}Wir haben „${quest.title}“ geschafft. Mit dir sind Abenteuer noch schöner!` : `${"Star! ".repeat(result.stars)}We completed “${quest.title}”. Adventures are even better with you!`);
  animateCapy("is-loved", 1700);
  playSound("happy");
  haptic([18, 25, 18, 25, 30]);
  showToast(state.language === "de" ? `QUEST GESCHAFFT · +${result.reward} GLITZER · ${result.score} PUNKTE` : `QUEST COMPLETE · +${result.reward} GLITTER · ${result.score} POINTS`, 4200);
  render();
}

function cancelQuestGame() {
  activeGameCleanup?.();
  activeGameCleanup = null;
  if (elements.questGameDialog.open) elements.questGameDialog.close();
  talk(state.language === "de" ? "Kein Problem. Unsere Quest wartet hier auf uns." : "No problem. Our quest will wait for us here.", { speak: false });
  render();
}

function closePackCards() {
  packCardsCleanup?.();
  packCardsCleanup = null;
  if (elements.packCardsDialog.open) elements.packCardsDialog.close();
}

function openPackCards() {
  if (state.sleeping || isTraveling(state.travel) || state.world.activity) {
    showToast(state.language === "de" ? "Pack Cards warten, bis dein Kinkybara zurück und wach ist." : "Pack Cards will wait until your Kinkybara is home and awake.");
    return;
  }
  closeTray();
  packCardsCleanup?.();
  packCardsCleanup = null;
  $("#pack-difficulty").hidden = false;
  $("#pack-difficulty-label").textContent = state.language === "de" ? "SCHWIERIGKEIT" : "DIFFICULTY";
  const difficultyCopy = state.language === "de"
    ? { soft: "SOFT<br><small>5 · OHNE SPECIALS</small>", switch: "SWITCH<br><small>7 · SELTENE TWISTS</small>", alpha: "ALPHA<br><small>7 · SCHLAUE RIVALEN</small>" }
    : { soft: "SOFT<br><small>5 · NO SPECIALS</small>", switch: "SWITCH<br><small>7 · RARE TWISTS</small>", alpha: "ALPHA<br><small>7 · SMART RIVALS</small>" };
  $$("button[data-pack-difficulty]", $("#pack-difficulty")).forEach((button) => { button.innerHTML = difficultyCopy[button.dataset.packDifficulty]; });
  $("#pack-cards-start").textContent = state.language === "de" ? "KARTEN GEBEN" : "DEAL THE CARDS";
  const stage = $("#pack-cards-stage");
  const status = $("#pack-cards-status");
  const message = $("#pack-cards-message");
  status.hidden = true;
  message.hidden = true;
  stage.hidden = true;
  stage.replaceChildren();
  $$("button[data-pack-difficulty]", $("#pack-difficulty")).forEach((button) => {
    const active = button.dataset.packDifficulty === packCardsDifficulty;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  openDialog(elements.packCardsDialog);
}

function beginPackCards() {
  packCardsCleanup?.();
  const stage = $("#pack-cards-stage");
  const status = $("#pack-cards-status");
  const message = $("#pack-cards-message");
  $("#pack-difficulty").hidden = true;
  status.hidden = false;
  message.hidden = false;
  stage.hidden = false;
  packCardsCleanup = startPackCards({
    stage,
    status,
    message,
    language: state.language,
    difficulty: packCardsDifficulty,
    seed: `${state.name}:${state.interactions}:${Date.now()}`,
    onFinish: ({ playerWins, rivalPackWins = 0, rivals = [], score, xp }) => {
      packCardsCleanup = null;
      const rivalScore = rivals.map((rival) => `${rival.name} ${rival.wins}`).join(" · ");
      const result = playerWins > rivalPackWins ? "win" : playerWins < rivalPackWins ? "loss" : "tie";
      const earnedXp = Math.max(2, Math.round(xp * (result === "win" ? 1 : result === "tie" ? 0.6 : 0.35)));
      state = awardChanges({ fun: 10, social: 6, curiosity: 4, xp: earnedXp });
      remember(state.language === "de"
        ? `${state.name} hat mit dir gegen Roxy und Jinx Pack Cards gespielt (DU ${playerWins} · PACK ${rivalPackWins} · ${rivalScore} · ${score} Punkte · +${earnedXp} XP).`
        : `${state.name} played Pack Cards with you against Roxy and Jinx (YOU ${playerWins} · PACK ${rivalPackWins} · ${rivalScore} · ${score} points · +${earnedXp} XP).`, "▦");
      status.textContent = state.language === "de"
        ? `FERTIG · DU ${playerWins} · PACK ${rivalPackWins} · ${score} PUNKTE · +${earnedXp} XP`
        : `FINISHED · YOU ${playerWins} · PACK ${rivalPackWins} · ${score} POINTS · +${earnedXp} XP`;
      message.textContent = playerWins > rivalPackWins
        ? (state.language === "de" ? "Oh. Du liegst oben. Genieß es, solange es hält." : "Oh. You’re on top. Enjoy it while it lasts.")
        : playerWins < rivalPackWins
          ? (state.language === "de" ? "Das Rivalen-Pack liegt oben. Lust auf noch eine Runde?" : "The rival pack is on top. Want another go?")
          : (state.language === "de" ? "Gleich heiß. Das verlangt nach einer Revanche." : "Same heat. That calls for a rematch.");
      const again = document.createElement("button");
      again.type = "button";
      again.className = "primary-button pack-card-next";
      again.textContent = state.language === "de" ? "NOCH EIN SPIEL" : "PLAY AGAIN";
      again.addEventListener("click", openPackCards, { once: true });
      stage.replaceChildren(again);
      again.focus();
      playSound("happy");
      haptic([18, 25, 18]);
      render();
    },
  });
}

function trackQuestAction() {
  const action = pendingQuestAction;
  pendingQuestAction = null;
  if (!action || !state.questProgress) return null;
  const quest = questCopy(currentQuest(state.questProgress));
  if (!quest || quest.type !== "task") return null;
  const updated = recordQuestAction(state.questProgress, action);
  if (updated === state.questProgress) return null;
  state.questProgress = updated;
  if (!taskQuestComplete(updated)) {
    showToast(state.language === "de" ? `QUEST: ${updated.taskDone.length}/${quest.goals.length} AUFGABEN ERLEDIGT` : `QUEST: ${updated.taskDone.length}/${quest.goals.length} TASKS COMPLETE`, 3200);
    return null;
  }
  state.questProgress = completeQuest(updated, quest.id, 100);
  const result = state.questProgress.completed.find((entry) => entry.id === quest.id);
  state = awardChanges(quest.reward);
  remember(state.language === "de" ? `${state.name} hat mit dir die Quest „${quest.title}“ vollständig erlebt.` : `${state.name} completed the whole quest “${quest.title}” with you.`, "✦");
  showToast(state.language === "de" ? `QUEST GESCHAFFT · +${result.reward} GLITZER` : `QUEST COMPLETE · +${result.reward} GLITTER`, 4200);
  return { quest, result };
}

function buildPixelCapy() {
  elements.capy.style.setProperty("--capy-cols", CAPY_WIDTH);
  elements.capy.style.setProperty("--capy-rows", CAPY_HEIGHT);
  const fragment = document.createDocumentFragment();
  CAPY_PIXELS.forEach((row, y) => {
    [...row].forEach((code, x) => {
      if (code === ".") return;
      const pixel = document.createElement("span");
      pixel.className = `pixel pixel-${code} pixel-x-${x} pixel-y-${y}`;
      pixel.dataset.x = String(x);
      pixel.dataset.y = String(y);
      pixel.style.gridColumnStart = String(x + 1);
      pixel.style.gridRowStart = String(y + 1);
      fragment.append(pixel);
    });
  });
  elements.capy.replaceChildren(fragment, elements.outfitLayer);
}

function render(now = Date.now()) {
  state = advanceState(state, now);
  applyTheme();
  const traveling = syncTravelState(now);
  syncWorldState(now, traveling);
  if (hasStoredState) state.questProgress = normalizeQuestProgress(state.questProgress, state.adoptedAt, now, `${activePetId}:${state.name}`);
  const mood = moodFor(state);
  const level = levelInfo(state.xp);
  const hour = new Date(now).getHours();
  const period = hour < 6 || hour >= 21 ? "night" : hour < 9 || hour >= 18 ? "dusk" : "day";
  const solar = berlinSolarScene(now);

  elements.day.textContent = `${ui().day} ${dayNumber(state, now)}`;
  elements.clock.textContent = new Intl.DateTimeFormat(state.language === "de" ? "de-DE" : "en-GB", { hour: "2-digit", minute: "2-digit" }).format(now);
  elements.habitat.dataset.period = state.sleeping ? "night" : period;
  elements.habitat.dataset.solar = state.sleeping ? "night" : solar.phase;
  elements.habitat.style.setProperty("--sun-x", solar.sunX);
  elements.habitat.style.setProperty("--sun-y", solar.sunY);
  elements.habitat.style.setProperty("--moon-x", solar.moonX);
  elements.habitat.classList.toggle("is-sleeping", state.sleeping);
  elements.capy.dataset.mood = mood.tone;
  elements.capy.dataset.variant = state.furVariant;
  elements.capy.classList.toggle("is-dirty", state.clean < 38);
  elements.capy.classList.toggle("is-tired", state.energy < 25 && !state.sleeping);
  elements.name.textContent = state.name.toUpperCase();
  elements.level.textContent = `LV. ${level.level}`;
  elements.xp.style.setProperty("--value", `${level.progress}%`);
  elements.xpCaption.textContent = state.language === "de"
    ? `${Math.round(level.xp)} / ${level.nextLevelXp} XP · NOCH ${Math.ceil(level.toNext)} BIS LEVEL ${level.level + 1}`
    : `${Math.round(level.xp)} / ${level.nextLevelXp} XP · ${Math.ceil(level.toNext)} TO LEVEL ${level.level + 1}`;
  elements.mood.className = `mood mood-${mood.tone}`;
  elements.mood.innerHTML = traveling
    ? `<span aria-hidden="true">⌁</span> ${ui().traveling}`
    : `<span aria-hidden="true">${state.sleeping ? "☾" : "♥"}</span> ${ui().mood[mood.tone]}`;
  elements.speech.textContent = currentPhrase;
  const collection = inventoryCompletion(state.inventory);
  $("#inventory-count").textContent = `${collection.owned} / ${collection.total} ${ui().items}`;

  for (const key of NEED_KEYS) {
    const rounded = Math.round(state[key]);
    const output = $(`[data-value="${key}"]`);
    const meter = $(`[data-meter="${key}"]`);
    output.textContent = `${rounded}%`;
    meter.style.setProperty("--value", `${rounded}%`);
    meter.dataset.level = rounded < 25 ? "low" : rounded < 55 ? "mid" : "good";
    meter.classList.toggle("is-boosted", key === "social" && state.world.socialGlowUntil > now);
    meter.setAttribute("aria-valuenow", String(rounded));
  }

  elements.sleepLabel.textContent = state.sleeping ? ui().wake : t(state.language, "action.sleep");
  elements.sleepAction.querySelector("small").textContent = state.sleeping ? ui().wakeHint : t(state.language, "action.sleepHint");
  const inWorldSession = Boolean(state.world.activity);
  $$('button[data-action]:not([data-action="sleep"])', elements.actions).forEach((button) => {
    button.disabled = state.sleeping || interactionBusy || inWorldSession || (traveling && button.dataset.action !== "travel");
  });
  const travelAction = $('button[data-action="travel"]', elements.actions);
  travelAction.querySelector("strong").textContent = t(state.language, traveling ? "action.travelAway" : "action.travel");
  travelAction.querySelector("small").textContent = t(state.language, traveling ? "action.travelAwayHint" : "action.travelHint");
  elements.sleepAction.disabled = interactionBusy || traveling || inWorldSession;
  renderLandscape(now, traveling);
  renderWeather();
  renderQuestIndicator(now);
  if (elements.inventoryDialog.open) renderInventory();
  if (elements.gardenDialog.open) renderGarden(now);
  if (elements.areaSessionDialog.open) renderAreaSessionDialog(now);
  saveState();
}

function talk(phrase, { speak = true } = {}) {
  currentPhrase = phrase;
  elements.speech.textContent = phrase;
  if (speak && state.voice && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = state.language === "de" ? "de-DE" : "en-GB";
    utterance.rate = 0.96;
    utterance.pitch = 1.08;
    const languagePrefix = state.language === "de" ? "de" : "en";
    const voice = window.speechSynthesis.getVoices().find((item) => item.lang?.toLowerCase().startsWith(languagePrefix));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  }
}

function playSound(kind = "happy") {
  if (!state.sound) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    audioContext ||= new AudioContext();
    const notes = kind === "sleep" ? [330, 262]
      : kind === "splash" ? [392, 523, 392]
        : kind === "sad" ? [330, 247, 196]
          : kind === "tap" ? [440]
            : [523, 659];
    notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "square";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.032, audioContext.currentTime + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + index * 0.08 + 0.1);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(audioContext.currentTime + index * 0.08);
      oscillator.stop(audioContext.currentTime + index * 0.08 + 0.11);
    });
  } catch {
    // Audio is optional; Safari may reject it before the first gesture.
  }
}

function haptic(pattern = 18) {
  if (state.haptics && navigator.vibrate) navigator.vibrate(pattern);
}

function showToast(message, duration = 2400) {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.hidden = false;
  toastTimer = window.setTimeout(() => { elements.toast.hidden = true; }, duration);
}

function openDialog(dialog) {
  if (dialog && !dialog.open) dialog.showModal();
}

function animateCapy(className, duration = 1400) {
  elements.capy.classList.remove(...CAPY_ANIMATIONS);
  void elements.capy.offsetWidth;
  elements.capy.classList.add(className);
  window.setTimeout(() => elements.capy.classList.remove(className), duration);
}

function itemSprite(key, extra = "") {
  const sprite = document.createElement("span");
  sprite.className = `item-sprite sprite-${key} ${extra}`.trim();
  return sprite;
}

function itemFor(category, key) {
  if (category === "feed" && key.startsWith("harvest-")) {
    const cropId = key.slice("harvest-".length);
    const crop = cropCopy(CROPS[cropId]);
    if (!crop) return null;
    return {
      ...crop.food,
      label: crop.label,
      detail: state.language === "de"
        ? `Eigene Ernte · noch ${state.garden.harvest[cropId]} Stück`
        : `Home-grown · ${state.garden.harvest[cropId]} left`,
      harvest: true,
      cropId,
    };
  }
  const item = groupFor(category)?.items[key];
  if (!item) return null;
  return state.language === "de" && item.de ? { ...item, ...item.de } : item;
}

function trayEntries(category, group) {
  const entries = Object.keys(group.items).map((key) => [key, itemFor(category, key)]);
  if (category !== "feed") return entries;
  const harvest = Object.values(CROPS)
    .filter((crop) => state.garden.harvest[crop.id] > 0)
    .map((crop) => [`harvest-${crop.id}`, itemFor("feed", `harvest-${crop.id}`)]);
  return [...harvest, ...entries];
}

function sceneObject(key, x, y, className = "") {
  const object = itemSprite(key, `scene-object ${className}`);
  object.style.left = `${x}px`;
  object.style.top = `${y}px`;
  elements.sceneLayer.append(object);
  return object;
}

function remember(text, icon) {
  state = addMemory(state, text, icon);
}

function finishInteraction(changes, phrase, memory, icon = "♥", reaction = "happy") {
  state = awardChanges(changes);
  remember(memory, icon);
  const questCompletion = trackQuestAction();
  interactionBusy = false;
  talk(questCompletion
    ? (state.language === "de" ? `Geschafft! „${questCompletion.quest.title}“ war richtig schön mit dir. Schau, wie viel es glitzert!` : `Done! “${questCompletion.quest.title}” was wonderful with you. Look at all that glitter!`)
    : phrase);
  playSound(questCompletion || reaction !== "hate" ? "happy" : "sad");
  haptic(questCompletion ? [18, 25, 18, 25, 30] : reaction === "hate" ? [40, 22, 40] : [18, 30, 18]);
  if (questCompletion || reaction === "love") animateCapy("is-loved", 1700);
  else if (reaction === "hate") animateCapy("is-disgusted", 1900);
  render();
}

function openTray(category) {
  if (isTraveling(state.travel)) {
    const destination = destinationCopy(destinationById(state.travel.destinationId));
    showToast(state.language === "de" ? `${state.name} ist gerade bei ${destination?.title || "einer Party"}.` : `${state.name} is at ${destination?.title || "a party"}.`);
    return;
  }
  if (state.sleeping || interactionBusy) return;
  const group = groupFor(category);
  if (!group) return;
  activeTray = category;
  selectedItem = null;
  elements.trayKicker.textContent = group.kicker;
  elements.trayTitle.textContent = group.title.replace("{name}", state.name);
  elements.trayInstruction.textContent = category === "feed"
    ? `${group.instruction} ${state.language === "de" ? "Drei Snacks und ein Saft wechseln regelmäßig; selten taucht ein Markt-Special auf." : "Three staples and one juice rotate regularly; a rare market special sometimes joins them."}`
    : group.instruction;
  elements.trayProgress.hidden = true;
  elements.trayProgress.querySelector("span").style.width = "0%";
  elements.trayItems.replaceChildren();

  const questId = state.questProgress?.activeId || "";
  for (const [key, item] of trayEntries(category, group)) {
    const availability = category === "feed" && !item.harvest ? foodAvailability(key, state, Date.now(), questId) : { available: true };
    if (!availability.available) continue;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `tray-item${item.temporary ? " is-limited" : ""}${item.harvest ? " is-harvest" : ""}`;
    button.dataset.category = category;
    button.dataset.key = key;
    button.setAttribute("aria-label", `${item.label}: ${item.detail}. ${state.language === "de" ? "Ziehen oder auswählen." : "Drag or select."}`);
    button.append(itemSprite(key));
    const text = document.createElement("span");
    text.innerHTML = `<strong>${item.label}</strong><small>${item.detail}</small>`;
    button.append(text);
    if (item.temporary) {
      const badge = document.createElement("em");
      badge.className = "tray-item-badge";
      badge.textContent = availability.reason === "QUEST FIND"
        ? (state.language === "de" ? "QUEST-FUND" : "QUEST FIND")
        : (state.language === "de" ? "NUR KURZ DA" : "LIMITED TIME");
      button.append(badge);
    }
    elements.trayItems.append(button);
  }

  elements.tray.hidden = false;
  $$('[data-action]', elements.actions).forEach((button) => button.classList.toggle("is-active", button.dataset.action === category));
  window.setTimeout(() => elements.tray.classList.add("is-open"), 0);
}

function closeTray() {
  activeTray = null;
  selectedItem = null;
  elements.tray.classList.remove("is-open");
  elements.tray.hidden = true;
  hideDropHint();
  $$('[data-action]', elements.actions).forEach((button) => button.classList.remove("is-active"));
}

function showDropHint(category, key, ready = false) {
  elements.dropHint.textContent = targetFor(category, key) === "capy"
    ? `${state.language === "de" ? "ZU" : "TO"} ${state.name.toUpperCase()}`
    : (state.language === "de" ? "IN DIE WELT" : "INTO THE WORLD");
  elements.dropHint.hidden = false;
  elements.dropHint.classList.toggle("is-ready", ready);
}

function hideDropHint() {
  elements.dropHint.hidden = true;
  elements.dropHint.classList.remove("is-ready");
}

function selectItem(category, key) {
  selectedItem = { category, key };
  $$(".tray-item", elements.trayItems).forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.category === category && button.dataset.key === key);
  });
  const item = itemFor(category, key);
  if (!item) return;
  showDropHint(category, key);
  const target = targetFor(category, key) === "capy" ? state.name : (state.language === "de" ? "das Gehege" : "the yard");
  talk(state.language === "de"
    ? `${item.label} ausgewählt. Tippe jetzt auf ${target} – oder zieh es direkt hin.`
    : `${item.label} selected. Tap ${target} — or drag it right over.`, { speak: false });
  showToast(state.language === "de" ? `${item.label} ausgewählt` : `${item.label} selected`, 1700);
}

function targetFor(category, key) {
  if (category === "feed") return "capy";
  if (category === "care") return "capy";
  if (category === "play" && key === "rope") return "capy";
  if (category === "together" && ["cuddle", "talk"].includes(key)) return "capy";
  return "habitat";
}

function inside(point, rect, inset = 0) {
  return point.x >= rect.left + inset && point.x <= rect.right - inset && point.y >= rect.top + inset && point.y <= rect.bottom - inset;
}

function hitTarget(category, key, point) {
  const target = targetFor(category, key);
  if (target === "capy") return inside(point, elements.capy.getBoundingClientRect(), -8);
  return inside(point, elements.habitat.getBoundingClientRect(), 8);
}

function showDragGhost(clientX, clientY, key) {
  elements.ghost.replaceChildren(itemSprite(key));
  elements.ghost.hidden = false;
  elements.ghost.style.transform = `translate3d(${clientX - 34}px, ${clientY - 34}px, 0)`;
}

function startDrag(event) {
  const button = event.target.closest(".tray-item");
  if (!button || interactionBusy || state.sleeping || isTraveling(state.travel)) return;
  event.preventDefault();
  selectItem(button.dataset.category, button.dataset.key);
  drag = {
    pointerId: event.pointerId,
    category: button.dataset.category,
    key: button.dataset.key,
    startX: event.clientX,
    startY: event.clientY,
    lastX: event.clientX,
    lastY: event.clientY,
    moved: false,
    work: 0,
    lastSparkle: 0,
  };
  button.setPointerCapture?.(event.pointerId);
  showDragGhost(event.clientX, event.clientY, drag.key);
  showDropHint(drag.category, drag.key);
  if (["brush", "rope"].includes(drag.key)) elements.trayProgress.hidden = false;
  haptic(9);
}

function addCareSparkle(clientX, clientY) {
  const habitatRect = elements.habitat.getBoundingClientRect();
  const sparkle = document.createElement("i");
  sparkle.className = "care-sparkle";
  sparkle.textContent = "✦";
  sparkle.style.left = `${clientX - habitatRect.left}px`;
  sparkle.style.top = `${clientY - habitatRect.top}px`;
  elements.sceneLayer.append(sparkle);
  window.setTimeout(() => sparkle.remove(), 650);
}

function moveDrag(event) {
  if (!drag || event.pointerId !== drag.pointerId) return;
  event.preventDefault();
  const segment = Math.hypot(event.clientX - drag.lastX, event.clientY - drag.lastY);
  drag.moved ||= Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 9;
  const point = { x: event.clientX, y: event.clientY };
  const onTarget = hitTarget(drag.category, drag.key, point);
  if (onTarget && ["brush", "rope"].includes(drag.key)) {
    drag.work += segment;
    const goal = drag.key === "brush" ? 145 : 180;
    elements.trayProgress.querySelector("span").style.width = `${Math.min(100, drag.work / goal * 100)}%`;
    if (drag.work - drag.lastSparkle > 28) {
      drag.lastSparkle = drag.work;
      addCareSparkle(event.clientX, event.clientY);
      haptic(5);
    }
  }
  elements.capy.classList.toggle("drop-ready", onTarget && targetFor(drag.category, drag.key) === "capy");
  elements.habitat.classList.toggle("drop-ready", onTarget && targetFor(drag.category, drag.key) === "habitat");
  elements.dropHint.classList.toggle("is-ready", onTarget);
  showDragGhost(event.clientX, event.clientY, drag.key);
  drag.lastX = event.clientX;
  drag.lastY = event.clientY;
}

function endDrag(event) {
  if (!drag || event.pointerId !== drag.pointerId) return;
  event.preventDefault();
  const finished = drag;
  drag = null;
  elements.ghost.hidden = true;
  hideDropHint();
  elements.capy.classList.remove("drop-ready");
  elements.habitat.classList.remove("drop-ready");
  const point = { x: event.clientX, y: event.clientY };
  if (!finished.moved) return;
  suppressClickUntil = Date.now() + 450;
  if (!hitTarget(finished.category, finished.key, point)) {
    showToast(targetFor(finished.category, finished.key) === "capy"
      ? (state.language === "de" ? `Noch näher zu ${state.name} ziehen!` : `Move it closer to ${state.name}!`)
      : (state.language === "de" ? "Wirf es weiter nach oben in die Welt!" : "Toss it farther into the world!"));
    return;
  }
  if (finished.key === "brush" && finished.work < 90) {
    showToast(state.language === "de" ? "Noch ein paar Bürstenstriche durchs Fell!" : "A few more brush strokes through the fur!");
    return;
  }
  if (finished.key === "rope" && finished.work < 110) {
    showToast(state.language === "de" ? "Zieh das Seil kräftig über dem Kinkybara hin und her!" : "Move the rope firmly back and forth over your Kinkybara!");
    return;
  }
  performItem(finished.category, finished.key, point);
}

async function performItem(category, key, clientPoint) {
  if (interactionBusy || state.sleeping || isTraveling(state.travel)) return;
  const item = itemFor(category, key);
  if (!item) return;
  if (category === "play" && key === "packCards") {
    openPackCards();
    return;
  }
  if (category === "feed" && !item.harvest) {
    const availability = foodAvailability(key, state, Date.now(), state.questProgress?.activeId || "");
    if (!availability.available) {
      showToast(state.language === "de" ? `${item.label} ist gerade nicht mehr auf dem Markt.` : `${item.label} is no longer at the market.`);
      closeTray();
      return;
    }
  }
  if (item.harvest) {
    const result = consumeHarvest(state.garden, item.cropId);
    if (!result.consumed) {
      showToast(state.language === "de" ? `${item.label} ist nicht mehr im Erntevorrat.` : `${item.label} is no longer in the pantry.`);
      closeTray();
      return;
    }
    state.garden = result.garden;
  }
  interactionBusy = true;
  pendingQuestAction = `${category}:${key}`;
  selectedItem = null;
  hideDropHint();
  render();

  if (category === "feed") await feedAnimation(key, item);
  else if (category === "play" && ["ball", "frisbee"].includes(key)) await fetchAnimation(key, item, clientPoint);
  else if (category === "play" && key === "bubbles") startBubbles(item);
  else if (category === "play" && key === "rope") await simpleAnimation("is-tugging", 1800, item, state.language === "de" ? `Mit ${state.name} am Zerrseil gespielt.` : `Played tug with ${state.name}.`, "⚽");
  else if (category === "care" && key === "brush") await simpleAnimation("is-brushed", 1900, item, state.language === "de" ? `${state.name}s Fell gründlich gebürstet.` : `Brushed ${state.name}'s fur thoroughly.`, "✦");
  else if (category === "care" && key === "bath") await bathAnimation(item);
  else if (category === "care" && key === "towel") await simpleAnimation("is-drying", 1900, item, state.language === "de" ? `${state.name} flauschig trocken gerubbelt.` : `Rubbed ${state.name} dry and fluffy.`, "☁");
  else if (category === "together" && key === "cuddle") await cuddleAnimation(item);
  else if (category === "together" && key === "talk") await talkAnimation(item);
  else if (category === "together" && key === "explore") await exploreAnimation(item, clientPoint);
  else if (category === "together" && key === "sunbathe") await simpleAnimation("is-sunbathing", 2700, item, state.language === "de" ? `Mit ${state.name} in der Sonne gedöst.` : `Dozed in the sunshine with ${state.name}.`, "☀");
}

async function feedAnimation(key, item) {
  const habitatRect = elements.habitat.getBoundingClientRect();
  const capyRect = elements.capy.getBoundingClientRect();
  const food = sceneObject(key, capyRect.right - habitatRect.left - 17, capyRect.top - habitatRect.top + capyRect.height * 0.57, "is-feeding");
  animateCapy("is-eating", 2100);
  talk(item.reaction === "hate"
    ? (state.language === "de" ? "Moment … ist das etwa eine Zwiebel?" : "Wait … is that an onion?")
    : (state.language === "de" ? `Oh! ${item.label}! Gib her …` : `Oh! ${item.label}! Hand it over …`), { speak: false });
  playSound("tap");
  await wait(2100);
  food.remove();
  const memory = state.language === "de"
    ? (item.reaction === "hate" ? `${state.name} hat mutig an einer Zwiebel probiert und sehr deutlich gezeigt, dass es sie hasst.` : `${state.name} hat ${item.label} aus deiner Hand gefuttert.`)
    : (item.reaction === "hate" ? `${state.name} bravely tried an onion and made its dislike very clear.` : `${state.name} ate ${item.label} from your hand.`);
  const icon = key === "melon" ? "🍉" : key === "pickle" ? "▰" : key === "onion" ? "◉" : "●";
  if (key === "pineappleJuice") state.world = prepareWorldActivity(state.world, "pineapple", Date.now(), worldSeed());
  finishInteraction(
    item,
    item.reaction === "hate" ? item.phrase : state.satiety + item.satiety > 112 ? (state.language === "de" ? "Puh, mein Bauch ist jetzt kugelrund!" : "Phew, my belly is perfectly round now!") : item.phrase,
    memory,
    icon,
    item.reaction,
  );
}

async function fetchAnimation(key, item, clientPoint) {
  const habitatRect = elements.habitat.getBoundingClientRect();
  const x = Math.max(24, Math.min(habitatRect.width - 45, clientPoint.x - habitatRect.left));
  const y = Math.max(105, Math.min(habitatRect.height - 72, clientPoint.y - habitatRect.top));
  const toy = sceneObject(key, x, y, "is-landed");
  const fetchX = Math.max(-105, Math.min(105, x - habitatRect.width / 2));
  elements.capy.style.setProperty("--fetch-x", `${fetchX}px`);
  animateCapy("is-fetching", 2500);
  talk(state.language === "de" ? `${item.label} entdeckt – ich komme!` : `${item.label} spotted — here I come!`, { speak: false });
  playSound("tap");
  await wait(1250);
  toy.classList.add("is-returning");
  await wait(1300);
  toy.remove();
  finishInteraction(item, item.phrase, state.language === "de" ? `${state.name} hat ${item.label === "Ball" ? "den Ball" : "die Wurfscheibe"} apportiert.` : `${state.name} fetched the ${item.label.toLowerCase()}.`, "⚽");
}

function startBubbles(item) {
  elements.bubbleLayer.replaceChildren();
  const positions = [[12, 46], [34, 34], [59, 49], [79, 30], [21, 67], [48, 69], [72, 62], [87, 78]];
  positions.forEach(([left, top], index) => {
    const bubble = document.createElement("button");
    bubble.type = "button";
    bubble.className = "bubble";
    bubble.style.left = `${left}%`;
    bubble.style.top = `${top}%`;
    bubble.style.setProperty("--delay", `${index * -0.17}s`);
    bubble.setAttribute("aria-label", state.language === "de" ? "Seifenblase zerplatzen lassen" : "Pop bubble");
    elements.bubbleLayer.append(bubble);
  });
  bubbleSession = { item, popped: 0, total: positions.length, timer: window.setTimeout(() => finishBubbles(), 14_000) };
  animateCapy("is-playing", 14_000);
  talk(state.language === "de" ? "Hilf mir! Tipp die Seifenblasen kaputt!" : "Help me! Pop the bubbles!", { speak: false });
  showToast(state.language === "de" ? "Tippe alle 8 Seifenblasen!" : "Pop all 8 bubbles!", 2800);
}

function popBubble(button) {
  if (!bubbleSession || button.classList.contains("is-popped")) return;
  button.classList.add("is-popped");
  bubbleSession.popped += 1;
  playSound("tap");
  haptic(8);
  animateCapy("is-playing", 550);
  window.setTimeout(() => button.remove(), 280);
  if (bubbleSession.popped >= bubbleSession.total) finishBubbles();
}

function finishBubbles() {
  if (!bubbleSession) return;
  window.clearTimeout(bubbleSession.timer);
  const { item, popped, total } = bubbleSession;
  bubbleSession = null;
  elements.bubbleLayer.replaceChildren();
  elements.capy.classList.remove("is-playing");
  const factor = Math.max(0.35, popped / total);
  const changes = { ...item, fun: item.fun * factor, curiosity: item.curiosity * factor, xp: item.xp * factor };
  finishInteraction(changes,
    popped === total ? item.phrase : (state.language === "de" ? `${popped} Blasen! Die anderen fangen wir beim nächsten Mal.` : `${popped} bubbles! We will catch the others next time.`),
    state.language === "de" ? `${state.name} hat ${popped} Seifenblasen gejagt.` : `${state.name} chased ${popped} bubbles.`, "○");
}

async function bathAnimation(item) {
  const habitatRect = elements.habitat.getBoundingClientRect();
  const pondRect = elements.pond.getBoundingClientRect();
  const bathX = pondRect.left + pondRect.width / 2 - habitatRect.left;
  const duck = sceneObject("bath", bathX, pondRect.top - habitatRect.top + 2, "is-floating");
  elements.habitat.classList.add("bath-time");
  animateCapy("is-bathing", 3800);
  talk(state.language === "de" ? "Ab in den Teich – KINKYBARA-SPLASH!" : "Into the pond — KINKYBARA SPLASH!", { speak: false });
  await wait(1050);
  playSound("splash");
  haptic([15, 40, 25]);
  await wait(1300);
  talk(state.language === "de" ? "Schau mal, ich kann richtig gut schwimmen!" : "Look, I can swim really well!", { speak: false });
  await wait(1500);
  duck.remove();
  elements.habitat.classList.remove("bath-time");
  finishInteraction(item, item.phrase, state.language === "de" ? `${state.name} ist in den Teich gesprungen und geschwommen.` : `${state.name} jumped into the pond and went swimming.`, "≈");
}

async function simpleAnimation(className, duration, item, memory, icon) {
  animateCapy(className, duration);
  talk(item.detail, { speak: false });
  playSound("tap");
  await wait(duration);
  finishInteraction(item, item.phrase, memory, icon);
}

async function cuddleAnimation(item) {
  animateCapy("is-cuddling", 2400);
  for (let index = 0; index < 5; index += 1) {
    window.setTimeout(() => spawnHeart(), index * 260);
  }
  talk(state.language === "de" ? "Mmmh … ich rücke ganz nah zu dir." : "Mmmh … I am snuggling very close to you.", { speak: false });
  await wait(2400);
  finishInteraction(item, item.phrase, state.language === "de" ? `${state.name} hat ganz lange mit dir gekuschelt.` : `${state.name} shared a long cuddle with you.`, "♥");
}

async function talkAnimation(item) {
  animateCapy("is-talking", 1200);
  talk(state.language === "de" ? "Oh ja! Ich wollte dich sowieso etwas fragen …" : "Oh yes! I wanted to ask you something anyway …", { speak: false });
  await wait(850);
  startConversation(item);
}

function startConversation(item) {
  const dialogue = localizedDialogue(dialogueFor(state), state.language);
  currentConversation = { dialogue, item, turn: 0, changes: {}, answers: [] };
  $("#dialogue-topic").textContent = state.language === "de" ? "ECHTES KINKYBARA-GESPRÄCH" : "A REAL KINKYBARA TALK";
  $("#dialogue-title").textContent = dialogue.title;
  renderConversationTurn();
  openDialog(elements.dialogueDialog);
}

function renderConversationTurn() {
  if (!currentConversation) return;
  const turn = currentConversation.dialogue.turns[currentConversation.turn];
  $("#dialogue-message").innerHTML = `<strong>${state.name}</strong><p>${turn.prompt}</p>`;
  const choices = $("#dialogue-choices");
  choices.replaceChildren();
  turn.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dialogue-choice";
    button.textContent = choice.label;
    button.addEventListener("click", () => chooseDialogueAnswer(choice));
    choices.append(button);
  });
  talk(turn.prompt);
}

function chooseDialogueAnswer(choice) {
  if (!currentConversation) return;
  currentConversation.answers.push(choice.label);
  for (const [key, value] of Object.entries(choice.changes || {})) {
    currentConversation.changes[key] = (currentConversation.changes[key] || 0) + value;
  }
  $("#dialogue-message").innerHTML = `<span class="your-answer">${state.language === "de" ? "DU" : "YOU"}: ${choice.label}</span><strong>${state.name}</strong><p>${choice.response}</p>`;
  talk(choice.response);
  animateCapy("is-talking", 1500);
  const choices = $("#dialogue-choices");
  choices.replaceChildren();
  const next = document.createElement("button");
  next.type = "button";
  next.className = "dialogue-next";
  const hasNext = currentConversation.turn + 1 < currentConversation.dialogue.turns.length;
  next.textContent = state.language === "de" ? (hasNext ? "WEITERREDEN" : "GESPRÄCH BEENDEN") : (hasNext ? "KEEP TALKING" : "END CONVERSATION");
  next.addEventListener("click", () => {
    if (hasNext) {
      currentConversation.turn += 1;
      renderConversationTurn();
    } else {
      finishConversation();
    }
  });
  choices.append(next);
}

function finishConversation() {
  if (!currentConversation) return;
  const { dialogue, item, changes, answers } = currentConversation;
  currentConversation = null;
  elements.dialogueDialog.close();
  const totalChanges = { ...item };
  for (const [key, value] of Object.entries(changes)) totalChanges[key] = (Number(totalChanges[key]) || 0) + value;
  finishInteraction(totalChanges,
    state.language === "de" ? "Danke, dass du mit mir geredet hast. Jetzt fühle ich mich dir noch näher." : "Thank you for talking with me. I feel even closer to you now.",
    state.language === "de" ? `${dialogue.memory} Deine Antworten: ${answers.join(" · ")}` : `${dialogue.memory} Your answers: ${answers.join(" · ")}`, "…");
}

async function exploreAnimation(item, clientPoint) {
  const habitatRect = elements.habitat.getBoundingClientRect();
  const x = Math.max(24, Math.min(habitatRect.width - 40, clientPoint.x - habitatRect.left));
  const y = Math.max(120, Math.min(habitatRect.height - 60, clientPoint.y - habitatRect.top));
  const leaf = sceneObject("explore", x, y, "is-landed");
  elements.capy.style.setProperty("--fetch-x", `${Math.max(-100, Math.min(100, x - habitatRect.width / 2))}px`);
  animateCapy("is-exploring", 3000);
  talk(state.language === "de" ? "Warte – da raschelt etwas!" : "Wait — something is rustling!", { speak: false });
  await wait(3000);
  leaf.remove();
  finishInteraction(item, item.phrase, state.language === "de" ? `${state.name} hat eine neue Ecke der Welt erkundet.` : `${state.name} explored a new corner of the world.`, "⌁");
}

function performSelectedOnCapy() {
  if (!selectedItem || targetFor(selectedItem.category, selectedItem.key) !== "capy") return false;
  performItem(selectedItem.category, selectedItem.key, { x: elements.capy.getBoundingClientRect().left, y: elements.capy.getBoundingClientRect().top });
  return true;
}

function performSelectedInHabitat(event) {
  if (!selectedItem || targetFor(selectedItem.category, selectedItem.key) !== "habitat") return false;
  performItem(selectedItem.category, selectedItem.key, { x: event.clientX, y: event.clientY });
  return true;
}

function toggleSleep() {
  if (interactionBusy) return;
  if (isTraveling(state.travel)) {
    showToast(state.language === "de" ? `${state.name} schläft nach der Rückkehr wieder in der Höhle.` : `${state.name} will sleep in the den after returning.`);
    return;
  }
  closeTray();
  if (state.sleeping) {
    state = advanceState(state);
    state.sleeping = false;
    remember(state.language === "de" ? `${state.name} ist gut erholt aufgewacht.` : `${state.name} woke up well rested.`, "☀");
    talk(state.language === "de" ? (state.energy > 88 ? "Morgen. Heute führe ich zuerst." : "Huch – schon wach. Wer hat das erlaubt?") : (state.energy > 88 ? "Morning. I’m leading first today." : "Oh — awake already. Who allowed that?"));
    playSound("happy");
  } else {
    state.sleeping = true;
    state.updatedAt = Date.now();
    remember(state.language === "de" ? `${state.name} ist gemütlich eingeschlafen.` : `${state.name} fell asleep comfortably.`, "☾");
    talk(state.language === "de" ? "Halsband ab, Licht runter. Bleib brav, bis ich wieder wach bin." : "Collar off, lights low. Be good until I’m awake again.");
    playSound("sleep");
  }
  state.interactions += 1;
  haptic(24);
  render();
}

function petCapy(event) {
  event.stopPropagation();
  if (Date.now() < suppressClickUntil || interactionBusy) return;
  if (isTraveling(state.travel)) {
    openTravelDetails();
    return;
  }
  if (performSelectedOnCapy()) return;
  if (Date.now() - lastPetAt < 500) return;
  lastPetAt = Date.now();
  if (state.sleeping) {
    talk(state.language === "de" ? "Mmmh … noch fünf Minuten. Selbst ein Dom braucht Schönheitsschlaf." : "Mmmh … five more minutes. Even a dom needs beauty sleep.", { speak: false });
    return;
  }
  petTapCount += 1;
  const petPhrases = PET_PHRASES[languageFor(state.language)];
  talk(petPhrases[petTapCount % petPhrases.length], { speak: petTapCount % 5 === 0 });
  animateCapy("is-loved", 1050);
  playSound("tap");
  haptic(12);
  spawnHeart(event);
}

function spawnHeart(event) {
  const rect = elements.petButton.getBoundingClientRect();
  const heart = document.createElement("span");
  heart.className = "float-heart";
  heart.textContent = "♥";
  heart.style.left = `${event?.clientX ? event.clientX - rect.left : rect.width * (0.35 + Math.random() * 0.3)}px`;
  heart.style.top = `${event?.clientY ? event.clientY - rect.top : rect.height * 0.5}px`;
  elements.heartLayer.append(heart);
  window.setTimeout(() => heart.remove(), 1000);
}

function formatDuration(milliseconds) {
  const minutes = Math.max(1, Math.round(milliseconds / 60_000));
  if (minutes < 60) return state.language === "de" ? `${minutes} MINUTEN` : `${minutes} MINUTES`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return state.language === "de" ? `${hours} ${hours === 1 ? "STUNDE" : "STUNDEN"}` : `${hours} ${hours === 1 ? "HOUR" : "HOURS"}`;
  const days = Math.round(hours / 24);
  return state.language === "de" ? `${days} ${days === 1 ? "TAG" : "TAGE"}` : `${days} ${days === 1 ? "DAY" : "DAYS"}`;
}

function showAwayReport() {
  if (isTraveling(state.travel)) return;
  if (!awayInfo || awayInfo.elapsedMs < 5 * 60_000) return;
  $("#away-title").textContent = state.language === "de" ? `${state.name} hat auf dich gewartet` : `${state.name} waited for you`;
  $("#away-clock").textContent = formatDuration(awayInfo.elapsedMs);
  $("#away-text").textContent = state.language === "de"
    ? (awayInfo.sleeping ? `${state.name} hat weitergeschlafen und dabei neue Energie gesammelt.` : `${state.name} hat seinen Rhythmus behalten. Bedürfnisse haben sich verändert – aber dein Kinkybara kann nicht sterben.`)
    : (awayInfo.sleeping ? `${state.name} kept sleeping and gathered new energy.` : `${state.name} kept its rhythm. Needs changed over time — but your Kinkybara can never die.`);
  const changes = $("#away-changes");
  changes.replaceChildren();
  NEED_KEYS.forEach((key) => {
    const delta = Math.round(awayInfo.changes[key]);
    if (delta === 0) return;
    const item = document.createElement("div");
    item.innerHTML = `<span>${t(state.language, NEED_LABEL_KEYS[key])}</span><strong class="${delta > 0 ? "positive" : "negative"}">${delta > 0 ? "+" : ""}${delta}</strong>`;
    changes.append(item);
  });
  openDialog(elements.awayDialog);
}

function renderJournal() {
  $("#journal-dialog .sheet-title h2").textContent = state.language === "de" ? `${state.name}s Tagebuch` : `${state.name}'s journal`;
  $("#journal-summary").innerHTML = state.language === "de" ? `<strong>TAG ${dayNumber(state)}</strong><span>${state.interactions} gemeinsame Momente · Level ${levelInfo(state.xp).level}</span>` : `<strong>DAY ${dayNumber(state)}</strong><span>${state.interactions} moments together · Level ${levelInfo(state.xp).level}</span>`;
  const list = $("#memory-list");
  list.replaceChildren();
  const memories = [...state.memories].reverse();
  if (!memories.length) {
    const empty = document.createElement("li");
    empty.className = "memory-empty";
    empty.textContent = state.language === "de" ? "Euer nächstes gemeinsames Erlebnis wird hier festgehalten." : "Your next shared moment will be recorded here.";
    list.append(empty);
    return;
  }
  memories.forEach((memory) => {
    const row = document.createElement("li");
    const date = memory.at ? new Intl.DateTimeFormat(state.language === "de" ? "de-DE" : "en-GB", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(memory.at) : (state.language === "de" ? "Früher" : "Earlier");
    row.innerHTML = `<span class="memory-icon">${memory.icon}</span><div><strong>${memory.text}</strong><small>${date}</small></div>`;
    list.append(row);
  });
}

function relativeVisit(timestamp) {
  const minutes = Math.max(0, Math.round((Date.now() - timestamp) / 60_000));
  if (minutes < 2) return state.language === "de" ? "gerade aktiv" : "active now";
  if (minutes < 60) return state.language === "de" ? `vor ${minutes} Min.` : `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return state.language === "de" ? `vor ${hours} Std.` : `${hours} hr ago`;
  const days = Math.round(hours / 24);
  return state.language === "de" ? `vor ${days} ${days === 1 ? "Tag" : "Tagen"}` : `${days} ${days === 1 ? "day" : "days"} ago`;
}

function renderLibrary() {
  saveState();
  $("#library-count").textContent = state.language === "de" ? `${library.profiles.length} ${library.profiles.length === 1 ? "KINKYBARA" : "KINKYBARAS"} IN DEINER FAMILIE` : `${library.profiles.length} ${library.profiles.length === 1 ? "KINKYBARA" : "KINKYBARAS"} IN YOUR FAMILY`;
  const list = $("#library-list");
  list.replaceChildren();
  library.profiles.forEach((profile) => {
    const preview = advanceState(profile.state);
    const previewTravel = normalizeTravel(preview.travel, preview.adoptedAt, Date.now(), `${profile.id}:${preview.name}:${preview.adoptedAt}`);
    const mood = moodFor(preview);
    const card = document.createElement("article");
    card.className = `library-card${profile.id === activePetId ? " is-active" : ""}`;
    card.dataset.profileId = profile.id;

    const avatar = document.createElement("span");
    avatar.className = `library-capy fur-${preview.furVariant}`;
    avatar.setAttribute("aria-hidden", "true");
    const info = document.createElement("div");
    info.className = "library-pet-info";
    const name = document.createElement("strong");
    name.textContent = preview.name;
    const meta = document.createElement("small");
    meta.textContent = `${state.language === "de" ? "TAG" : "DAY"} ${dayNumber(preview)} · LV. ${levelInfo(preview.xp).level} · ${mood.label}`;
    const visit = document.createElement("span");
    const previewQuests = normalizeQuestProgress(preview.questProgress, preview.adoptedAt, Date.now(), `${profile.id}:${preview.name}`);
    const destination = isTraveling(previewTravel) ? destinationCopy(destinationById(previewTravel.destinationId)) : null;
    visit.textContent = destination
      ? `${state.language === "de" ? "Unterwegs" : "Away"}: ${destination.title} · ${travelTimeLabel(previewTravel, Date.now(), state.language)} · ✦ ${previewQuests.glitter}`
      : `${profile.id === activePetId ? (state.language === "de" ? "Gerade bei dir" : "With you now") : relativeVisit(profile.lastPlayedAt)} · ✦ ${previewQuests.glitter}`;
    info.append(name, meta, visit);

    const actions = document.createElement("div");
    actions.className = "library-card-actions";
    const open = document.createElement("button");
    open.type = "button";
    open.dataset.libraryAction = "switch";
    open.textContent = profile.id === activePetId ? (state.language === "de" ? "AKTIV" : "ACTIVE") : (state.language === "de" ? "ÖFFNEN" : "OPEN");
    open.disabled = profile.id === activePetId;
    open.setAttribute("aria-label", state.language === "de" ? `${preview.name} öffnen` : `Open ${preview.name}`);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.dataset.libraryAction = "remove";
    remove.className = "library-remove";
    remove.textContent = "×";
    remove.setAttribute("aria-label", state.language === "de" ? `${preview.name} aus der Bibliothek löschen` : `Delete ${preview.name} from the library`);
    actions.append(open, remove);
    card.append(avatar, info, actions);
    list.append(card);
  });
}

function openLibrary() {
  if (interactionBusy) {
    showToast(state.language === "de" ? "Lass die aktuelle Aktion kurz zu Ende gehen." : "Let the current activity finish first.");
    return;
  }
  closeTray();
  renderLibrary();
  openDialog(elements.libraryDialog);
}

function resetSceneForSwitch() {
  window.clearTimeout(questWakeTimer);
  questWakeTimer = 0;
  activeGameCleanup?.();
  activeGameCleanup = null;
  packCardsCleanup?.();
  packCardsCleanup = null;
  if (elements.questGameDialog.open) elements.questGameDialog.close();
  if (elements.questDialog.open) elements.questDialog.close();
  if (elements.travelDialog.open) elements.travelDialog.close();
  if (elements.journeyDialog.open) elements.journeyDialog.close();
  if (elements.inventoryDialog.open) elements.inventoryDialog.close();
  if (elements.gardenDialog.open) elements.gardenDialog.close();
  if (elements.packCardsDialog.open) elements.packCardsDialog.close();
  closeTray();
  if (bubbleSession) window.clearTimeout(bubbleSession.timer);
  bubbleSession = null;
  currentConversation = null;
  interactionBusy = false;
  selectedItem = null;
  pendingQuestAction = null;
  lastQuestNotice = "";
  pendingAreaSessionArea = null;
  pendingAreaCompanionId = null;
  pendingJourneyCompanionId = null;
  elements.sceneLayer.replaceChildren();
  elements.bubbleLayer.replaceChildren();
  elements.habitat.classList.remove("bath-time", "drop-ready");
  elements.capy.classList.remove(...CAPY_ANIMATIONS, "drop-ready");
}

function switchToPet(id) {
  if (id === activePetId) {
    elements.libraryDialog.close();
    return;
  }
  saveState();
  library = selectProfile(library, id);
  const profile = activeProfile(library);
  if (!profile) return;
  activePetId = profile.id;
  const report = absenceReport(profile.state);
  state = report.state;
  awayInfo = report;
  library = updateProfile(library, activePetId, state);
  applyLanguage(state.language);
  applyTheme(state.primaryAccent, state.secondaryAccent);
  currentPhrase = localizedStatusPhrase(state);
  resetSceneForSwitch();
  elements.libraryDialog.close();
  render();
  saveState();
  if (report.elapsedMs >= 5 * 60_000) window.setTimeout(showAwayReport, 160);
  else talk(state.language === "de"
    ? `Da bist du ja. ${state.name} wollte gerade brav werden. Fast.`
    : `There you are. ${state.name} was about to behave. Almost.`, { speak: false });
}

function prepareAdoption(mode = "new") {
  adoptionMode = mode;
  const form = $("#welcome-form");
  form.reset();
  const suggestion = mode === "first" ? "Thron" : NAME_SUGGESTIONS[library.profiles.length % NAME_SUGGESTIONS.length];
  $("#welcome-name").value = suggestion;
  $("#welcome-kicker").textContent = mode === "first"
    ? t(state.language, "welcome.kicker")
    : (state.language === "de" ? "NOCH EIN KINKYBARA" : "ANOTHER KINKYBARA");
  $("#welcome-title").textContent = mode === "first"
    ? t(state.language, "welcome.title")
    : (state.language === "de" ? "Wer kommt als Nächstes in den Pack?" : "Who joins the pack next?");
  $("#welcome-copy").textContent = mode === "first"
    ? t(state.language, "welcome.copy")
    : (state.language === "de" ? "Jedes Kinkybara bekommt einen eigenen lokalen Spielstand." : "Every Kinkybara gets its own local save.");
  $("#welcome-cancel").hidden = mode !== "new";
  renderAccentOptions();
  if (mode === "new") {
    if (form.elements.voice) form.elements.voice.checked = state.voice;
    if (form.elements.sound?.type === "checkbox") form.elements.sound.checked = state.sound;
    const furInputs = [...form.elements.fur];
    furInputs[library.profiles.length % furInputs.length].checked = true;
  }
  syncAccentPreview();
}

function deletePet(id) {
  const profile = library.profiles.find((item) => item.id === id);
  if (!profile) return;
  if (!window.confirm(state.language === "de" ? `Möchtest du ${profile.state.name} und diesen gesamten Spielstand wirklich löschen?` : `Delete ${profile.state.name} and this entire save?`)) return;
  const wasActive = id === activePetId;
  if (wasActive) saveState();
  library = removeProfile(library, id);
  try { localStorage.setItem(LIBRARY_KEY, JSON.stringify(library)); } catch { showToast(state.language === "de" ? "Löschen fehlgeschlagen." : "Delete failed."); return; }
  if (!wasActive) {
    renderLibrary();
    return;
  }
  const next = activeProfile(library);
  if (next) {
    if (elements.settingsDialog.open) elements.settingsDialog.close();
    activePetId = null;
    switchToPet(next.id);
    showToast(state.language === "de" ? `${profile.state.name} wurde aus der Bibliothek gelöscht.` : `${profile.state.name} was deleted from the library.`);
    return;
  }
  activePetId = null;
  hasStoredState = false;
  awayInfo = null;
  state = makeState();
  currentPhrase = localizedStatusPhrase(state);
  elements.libraryDialog.close();
  elements.settingsDialog.close();
  resetSceneForSwitch();
  render();
  prepareAdoption("empty");
  openDialog(elements.welcomeDialog);
}

function syncSettingsForm() {
  $("#settings-name").value = state.name;
  renderAccentOptions();
  const languageInput = $(`#settings-form input[name="settingsLanguage"][value="${state.language}"]`);
  if (languageInput) languageInput.checked = true;
  $("#setting-voice").checked = state.voice;
  $("#setting-sound").checked = state.sound;
  $("#setting-haptics").checked = state.haptics;
}

function runBootStep(name, step) {
  try {
    return step();
  } catch (error) {
    markBootFailure(new Error(`${name}: ${error instanceof Error ? error.message : String(error)}`));
    throw error;
  }
}

currentPhrase = runBootStep("status", () => localizedStatusPhrase(state));
runBootStep("pixel-art", buildPixelCapy);
runBootStep("language", applyLanguage);
runBootStep("theme", applyTheme);
runBootStep("accent-options", renderAccentOptions);
runBootStep("render", render);
runBootStep("weather", refreshWeather);

if (!hasStoredState) {
  prepareAdoption("first");
  window.setTimeout(() => openDialog(elements.dedicationDialog), 180);
} else {
  window.setTimeout(showAwayReport, 280);
}

elements.actions.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  if (button.dataset.action === "sleep") toggleSleep();
  else if (button.dataset.action === "travel") openJourneyDialog();
  else if (activeTray === button.dataset.action) closeTray();
  else openTray(button.dataset.action);
});

elements.trayItems.addEventListener("pointerdown", startDrag);
elements.trayItems.addEventListener("click", (event) => {
  if (Date.now() < suppressClickUntil) return;
  const button = event.target.closest(".tray-item");
  if (button) selectItem(button.dataset.category, button.dataset.key);
});
document.addEventListener("pointermove", moveDrag, { passive: false });
document.addEventListener("pointerup", endDrag, { passive: false });
document.addEventListener("pointercancel", endDrag, { passive: false });

elements.petButton.addEventListener("click", petCapy);
elements.hoodToggle.addEventListener("click", removeEquippedHood);
elements.habitat.addEventListener("click", (event) => {
  if (Date.now() < suppressClickUntil || event.target.closest("button")) return;
  performSelectedInHabitat(event);
});
elements.bubbleLayer.addEventListener("click", (event) => {
  const bubble = event.target.closest(".bubble");
  if (bubble) popBubble(bubble);
});

$("#tray-close").addEventListener("click", closeTray);
$("#speech-button").addEventListener("click", () => talk(currentPhrase));
$("#library-button").addEventListener("click", openLibrary);
$("#quest-button").addEventListener("click", openQuestBoard);
elements.questAlertOpen.addEventListener("click", openQuestBoard);
elements.questAlertDismiss.addEventListener("click", dismissQuestIndicator);
$("#journal-button").addEventListener("click", () => { renderJournal(); openDialog(elements.journalDialog); });
$("#settings-button").addEventListener("click", () => { syncSettingsForm(); openDialog(elements.settingsDialog); });
$("#weather-button").addEventListener("click", openWeatherDetails);
elements.travelPostcard.addEventListener("click", openTravelDetails);
$("#inventory-button").addEventListener("click", () => openInventory("all"));
$("#pack-cards-button").addEventListener("click", openPackCards);
$("#pack-cards-close").addEventListener("click", closePackCards);
$("#pack-difficulty").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-pack-difficulty]");
  if (!button) return;
  packCardsDifficulty = button.dataset.packDifficulty;
  $$("button[data-pack-difficulty]", $("#pack-difficulty")).forEach((item) => {
    const active = item === button;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-pressed", String(active));
  });
});
$("#pack-cards-start").addEventListener("click", beginPackCards);
$("#area-session-primary").addEventListener("click", () => {
  if (state.world.activity) recallAreaStay();
  else startAreaStay();
});
elements.packCardsDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closePackCards();
});
$("#start-journey-button").addEventListener("click", startManualJourney);
$("#recall-travel-button").addEventListener("click", recallFromParty);

$("#inventory-tabs").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-filter]");
  if (button) renderInventory(button.dataset.filter);
});

$("#world-navigation").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-area]");
  if (!button) return;
  if (state.world.activity) {
    showToast(state.language === "de" ? "Die laufende 40-Minuten-Session endet zuerst." : "Finish the current 40-minute session first.");
    return;
  }
  if (isTraveling(state.travel)) {
    showToast(state.language === "de" ? "Nach der Party kannst du wieder frei durch die Welt ziehen." : "You can roam freely again after the party.");
    return;
  }
  if (state.sleeping) {
    showToast(state.language === "de" ? `Weck ${state.name} erst sanft auf.` : `Wake ${state.name} gently first.`);
    return;
  }
  state.world = selectWorldArea(state.world, button.dataset.area, Date.now(), worldSeed());
  state.landscapeArea = state.world.area;
  const area = ui().area[state.landscapeArea];
  talk(state.language === "de" ? `Auf geht’s zum ${area}.` : `Off we go to ${area}.`, { speak: false });
  render();
});

elements.inventoryGrid.addEventListener("click", (event) => {
  const itemButton = event.target.closest("button[data-inventory-item]");
  if (itemButton && !itemButton.disabled) useInventoryItem(itemButton.dataset.inventoryItem);
  if (event.target.closest("button[data-open-garden]")) openGarden();
  const harvestButton = event.target.closest("button[data-feed-harvest]");
  if (harvestButton && !harvestButton.disabled) {
    elements.inventoryDialog.close();
    openTray("feed");
    selectItem("feed", `harvest-${harvestButton.dataset.feedHarvest}`);
  }
});

$("#gear-locker-grid").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-locker-item]");
  if (button && !button.disabled) useInventoryItem(button.dataset.lockerItem);
});

$("#seed-picker").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-crop-id]");
  if (!button) return;
  state.garden = selectCrop(state.garden, button.dataset.cropId);
  renderGarden();
});

elements.gardenPlots.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-garden-action]");
  if (button && !button.disabled) performGardenAction(button.dataset.gardenAction, Number(button.dataset.plot));
});

elements.animalVisitor.addEventListener("click", () => {
  const friend = friendCopy(ANIMAL_FRIENDS[state.world.friendId]);
  if (!friend) return;
  const now = Date.now();
  const previousMeetings = Number(state.world.friendRecords?.[friend.id]?.meetings) || 0;
  state.world = recordFriendMeeting(state.world, friend.id, now, worldSeed(), { kind: "world", area: state.world.area });
  const newEncounter = (Number(state.world.friendRecords?.[friend.id]?.meetings) || 0) > previousMeetings;
  if (newEncounter) state = awardChanges({ social: 3, fun: 2, xp: 1 }, now);
  talk(friend.phrase);
  animateCapy("is-loved", 950);
  haptic(12);
  render();
});

elements.placedItemsLayer.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-item-id]");
  if (!button) return;
  if (button.dataset.worldActivity) {
    openAreaSessionDialog(button.dataset.worldActivity);
    return;
  }
  const item = itemCopy(ITEM_DEFINITIONS[button.dataset.itemId]);
  if (!item) return;
  if (item.id === "card_table") {
    openPackCards();
    return;
  }
  talk(`${item.label}: ${item.detail}`, { speak: false });
  showToast(state.language === "de" ? "In der Sammlung kannst du den Gegenstand wieder einpacken." : "You can pack this item away from the collection.");
});

elements.habitat.addEventListener("click", (event) => {
  const landmark = event.target.closest("button[data-landmark]");
  if (!landmark || isTraveling(state.travel)) return;
  if (landmark.dataset.landmark === "cabin") {
    talk(state.sleeping
      ? (state.language === "de" ? "Pssst … hier schlafe ich gerade ganz warm und sicher." : "Shh … I am sleeping here, warm and safe.")
      : (state.language === "de" ? "Das ist meine Höhle. Abends rolle ich mich dort ein – mit dem Schlafen-Knopf bringst du mich hinein." : "This is my den. I curl up here at night — the sleep button brings me inside."), { speak: false });
  } else if (landmark.dataset.landmark === "garden") openGarden();
  else talk(state.language === "de" ? "Meine Pack Lounge! Hier passen Saft, Karten, Pflanzen und Tierfreunde perfekt zusammen." : "My Pack Lounge! Juice, cards, plants and animal friends fit perfectly here.", { speak: false });
});

$("#dedication-next").addEventListener("click", () => {
  elements.dedicationDialog.close();
  prepareAdoption("first");
  window.setTimeout(() => openDialog(elements.welcomeDialog), 120);
});

$("#language-picker").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-language]");
  if (!button) return;
  applyLanguage(button.dataset.language);
  prepareAdoption(adoptionMode);
  if (hasStoredState) saveState();
  render();
});

$("#welcome-form").addEventListener("change", (event) => {
  if (event.target.matches('input[name="primaryAccent"], input[name="secondaryAccent"]')) syncAccentPreview();
});

$("#new-pet-button").addEventListener("click", () => {
  saveState();
  elements.libraryDialog.close();
  prepareAdoption("new");
  window.setTimeout(() => openDialog(elements.welcomeDialog), 100);
});

$("#welcome-cancel").addEventListener("click", () => elements.welcomeDialog.close());

$("#library-list").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-library-action]");
  const card = event.target.closest(".library-card");
  if (!button || !card) return;
  if (button.dataset.libraryAction === "switch") switchToPet(card.dataset.profileId);
  if (button.dataset.libraryAction === "remove") deletePet(card.dataset.profileId);
});

$("#quest-list").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-quest-id]");
  if (button && !button.disabled) startQuestById(button.dataset.questId);
});

$("#quest-game-close").addEventListener("click", cancelQuestGame);
$("#quest-game-cancel").addEventListener("click", cancelQuestGame);
elements.questGameDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  cancelQuestGame();
});

$("#welcome-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  state = makeState(Date.now(), form.get("name"), form.get("fur"), {
    language: state.language,
    primaryAccent: form.get("primaryAccent"),
    secondaryAccent: form.get("secondaryAccent"),
  });
  state.voice = form.get("voice") === "on";
  state.sound = form.get("sound") === "on";
  state = addMemory(state, adoptionMode === "first"
    ? (state.language === "de" ? `Heute ist ${state.name} bei dir eingezogen – ein Geschenk von Thron.` : `${state.name} joined you today — a gift from Thron.`)
    : (state.language === "de" ? `${state.name} ist als neues Mitglied deines Packs eingezogen.` : `${state.name} joined your pack.`), "♥");
  library = addProfile(library, state);
  activePetId = library.activeId;
  hasStoredState = true;
  saveState();
  elements.welcomeDialog.close();
  applyLanguage();
  applyTheme();
  talk(state.language === "de"
    ? `Hi! Ich bin ${state.name}. Starte mit Füttern, Spielen oder Nähe. Ich kann lieb sein. Den Rest handeln wir aus.`
    : `Hi! I’m ${state.name}. Start with food, play or getting close. I can be sweet. We’ll negotiate the rest.`);
  animateCapy("is-loved", 1600);
  playSound("happy");
  render();
});

$("#away-close").addEventListener("click", () => elements.awayDialog.close());
elements.dialogueDialog.addEventListener("cancel", (event) => event.preventDefault());

$("#settings-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  state.name = cleanName($("#settings-name").value);
  state.language = languageFor(form.get("settingsLanguage"));
  state.primaryAccent = ACCENT_COLORS[form.get("settingsPrimaryAccent")] ? form.get("settingsPrimaryAccent") : state.primaryAccent;
  state.secondaryAccent = ACCENT_COLORS[form.get("settingsSecondaryAccent")] ? form.get("settingsSecondaryAccent") : state.secondaryAccent;
  if (state.primaryAccent === state.secondaryAccent) {
    state.secondaryAccent = Object.keys(ACCENT_COLORS).find((key) => key !== state.primaryAccent);
  }
  state.voice = $("#setting-voice").checked;
  state.sound = $("#setting-sound").checked;
  state.haptics = $("#setting-haptics").checked;
  saveState();
  elements.settingsDialog.close();
  applyLanguage();
  applyTheme();
  talk(state.language === "de" ? `Alles klar. Du darfst mich ${state.name} nennen. Wenn du nett fragst.` : `All set. You may call me ${state.name}. If you ask nicely.`, { speak: false });
  showToast(state.language === "de" ? "Einstellungen gespeichert" : "Settings saved");
  render();
});

$("#reset-button").addEventListener("click", () => {
  deletePet(activePetId);
});

$("#install-help-button").addEventListener("click", async () => {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    return;
  }
  const help = $("#install-help");
  help.hidden = !help.hidden;
});

$$('[data-close]').forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  $("#install-help-button").textContent = state.language === "de" ? "APP INSTALLIEREN" : "INSTALL APP";
});

window.addEventListener("online", () => {
  showToast(state.language === "de" ? "Wieder online – dein Kinkybara ist bereit." : "Back online — your Kinkybara is ready.");
  refreshWeather(true);
});
window.addEventListener("offline", () => showToast(state.language === "de" ? "Offline-Modus – dein Spielstand bleibt erhalten." : "Offline mode — your save stays safe."));
window.addEventListener("pagehide", saveState);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    const report = absenceReport(state);
    state = report.state;
    currentPhrase = localizedStatusPhrase(state);
    render();
    if (report.elapsedMs >= 5 * 60_000) {
      awayInfo = report;
      showAwayReport();
    }
  } else {
    saveState();
  }
});

window.setInterval(() => {
  if (!document.hidden) render();
}, 30_000);
window.setInterval(() => {
  if (!document.hidden) refreshWeather(true);
}, 30 * 60_000);
window.setInterval(() => {
  if (!state.sleeping && !interactionBusy && !document.hidden && !isTraveling(state.travel)) {
    currentPhrase = localizedStatusPhrase(state);
    elements.speech.textContent = currentPhrase;
  }
}, 90_000);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" });
      await registration.update();
    } catch {
      // The app remains fully usable; only offline installation is unavailable.
    }
  });
}

document.documentElement.dataset.appState = "ready";
delete document.documentElement.dataset.bootError;

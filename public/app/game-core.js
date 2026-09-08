import { createInventory, normalizeInventory } from "./inventory-core.js";
import { createGarden, createWorld, normalizeGarden, normalizeWorld } from "./world-core.js";

export const STORAGE_KEY = "kinkybara-state-v1";
export const FUR_VARIANTS = Object.freeze(["classic", "golden", "chocolate", "cream"]);
export const ACCENT_COLORS = Object.freeze({
  black: { label: "Black", de: "Schwarz", hex: "#161218", ink: "#ffffff" },
  white: { label: "White", de: "Weiß", hex: "#f7f3f0", ink: "#171019" },
  red: { label: "Red", de: "Rot", hex: "#e45b70", ink: "#171019" },
  orange: { label: "Orange", de: "Orange", hex: "#ef884e", ink: "#171019" },
  yellow: { label: "Yellow", de: "Gelb", hex: "#eec653", ink: "#171019" },
  green: { label: "Green", de: "Grün", hex: "#55bd82", ink: "#171019" },
  blue: { label: "Blue", de: "Blau", hex: "#6687ee", ink: "#171019" },
  violet: { label: "Violet", de: "Violett", hex: "#9a70e5", ink: "#171019" },
});

export const NEED_KEYS = Object.freeze(["satiety", "fun", "clean", "energy", "social", "curiosity"]);

export const DEFAULT_STATE = Object.freeze({
  version: 7,
  name: "Thron",
  furVariant: "classic",
  language: "en",
  primaryAccent: "violet",
  secondaryAccent: "red",
  adoptedAt: 0,
  updatedAt: 0,
  satiety: 82,
  fun: 78,
  clean: 90,
  energy: 88,
  social: 84,
  curiosity: 76,
  xp: 0,
  interactions: 0,
  sleeping: false,
  voice: true,
  sound: true,
  haptics: true,
  memories: [],
  questProgress: null,
  travel: null,
  landscapeArea: "home",
  inventory: null,
  garden: null,
  world: null,
});

export const FOODS = Object.freeze({
  carrot: { label: "Carrot", detail: "+18 full · crunchy", satiety: 18, fun: 2, clean: 0, xp: 3, phrase: "Good crunch. Again?", de: { label: "Karotte", detail: "+18 satt · knackig", phrase: "Guter Knack. Nochmal?" } },
  apple: { label: "Apple", detail: "+14 full · juicy", satiety: 14, fun: 1, energy: 3, xp: 3, phrase: "Juicy. Approved.", de: { label: "Apfel", detail: "+14 satt · saftig", phrase: "Saftig. Genehmigt." } },
  melon: { label: "Melon", detail: "+24 full · favorite", satiety: 24, fun: 5, clean: -3, xp: 5, phrase: "Melon. Now we’re talking.", de: { label: "Melone", detail: "+24 satt · Lieblingsfutter", phrase: "Melone. Jetzt reden wir." } },
  pumpkin: { label: "Pumpkin", detail: "+20 full · curious", satiety: 20, curiosity: 4, xp: 4, phrase: "Soft, orange, gone.", de: { label: "Kürbis", detail: "+20 satt · macht neugierig", phrase: "Weich, orange, weg." } },
  pickle: { label: "Pickle", detail: "Rare · loves it", temporary: true, reaction: "love", satiety: 9, fun: 13, social: 3, clean: -2, xp: 7, phrase: "That crunch was worth the wait.", de: { label: "Gewürzgurke", detail: "Selten · liebt es!", phrase: "Der Knack war das Warten wert." } },
  onion: { label: "Onion", detail: "Rare · hates it", temporary: true, reaction: "hate", satiety: 2, fun: -18, social: -5, energy: -2, xp: 1, phrase: "No. Take it away.", de: { label: "Zwiebel", detail: "Selten · hasst es", phrase: "Nein. Nimm sie weg." } },
  peach: { label: "Peach", detail: "+16 full · sweet", satiety: 16, fun: 5, clean: -2, xp: 4, phrase: "Soft, juicy … behave.", de: { label: "Pfirsich", detail: "+16 satt · süß", phrase: "Weich, saftig … benimm dich." } },
  eggplant: { label: "Eggplant", detail: "+20 full · curious", satiety: 20, curiosity: 5, xp: 5, phrase: "Nice shape. Moving on.", de: { label: "Aubergine", detail: "+20 satt · neugierig", phrase: "Schöne Form. Weiter." } },
  orangeJuice: { label: "Orange juice", detail: "+10 energy · fresh", satiety: 5, energy: 10, fun: 3, clean: -1, xp: 4, phrase: "Bright, sharp, gone.", de: { label: "Orangensaft", detail: "+10 Energie · frisch", phrase: "Frisch, spritzig, weg." } },
  pineappleJuice: { label: "Pineapple juice", detail: "+12 fun · tropical", satiety: 5, fun: 12, curiosity: 4, clean: -1, xp: 5, phrase: "Sweet, sharp, dangerous timing.", de: { label: "Ananassaft", detail: "+12 Spaß · tropisch", phrase: "Süß, scharf, gefährliches Timing." } },
});

export const FOOD_MARKET_GROUPS = Object.freeze({
  standards: Object.freeze(["carrot", "apple", "melon", "pumpkin", "peach", "eggplant"]),
  juices: Object.freeze(["orangeJuice", "pineappleJuice"]),
  specials: Object.freeze(["pickle", "onion"]),
});

export const FOOD_MARKET_WINDOW_MS = 90 * 60_000;

export const TOYS = Object.freeze({
  ball: { label: "Ball", detail: "Toss it into the world", fun: 18, social: 5, energy: -5, satiety: -2, xp: 7, phrase: "Again. Farther.", de: { label: "Ball", detail: "Wirf ihn in die Welt", phrase: "Nochmal. Weiter." } },
  frisbee: { label: "Flying disc", detail: "Toss far and fetch", fun: 22, curiosity: 4, energy: -7, satiety: -3, xp: 9, phrase: "Almost made me work for it.", de: { label: "Wurfscheibe", detail: "Weit werfen und apportieren", phrase: "Fast hätte ich mich anstrengen müssen." } },
  bubbles: { label: "Bubbles", detail: "Pop every bubble", fun: 20, curiosity: 8, energy: -4, xp: 8, phrase: "Blow … bubbles. What did you think I meant?", de: { label: "Seifenblasen", detail: "Lass alle Blasen platzen", phrase: "Blow … bubbles. Was dachtest du denn?" } },
  rope: { label: "Tug rope", detail: "Move it over Kinkybara", fun: 17, social: 8, energy: -5, xp: 7, phrase: "Pull harder. I can take it.", de: { label: "Zerrseil", detail: "Zieh es über Kinkybara", phrase: "Zieh fester. Ich halte das aus." } },
  packCards: { label: "Pack Cards", detail: "One round against Roxy and Jinx.", fun: 18, social: 8, curiosity: 7, xp: 9, phrase: "Rematch?", de: { label: "Pack Cards", detail: "Eine Runde gegen Roxy und Jinx.", phrase: "Revanche?" } },
});

export const CARE = Object.freeze({
  brush: { label: "Brush", detail: "Brush the fur a few times", clean: 18, fun: 4, social: 5, xp: 6, phrase: "Slower. Right there.", de: { label: "Bürste", detail: "Mehrfach durchs Fell ziehen", phrase: "Langsamer. Genau da." } },
  bath: { label: "Bath duck", detail: "Drag to Kinkybara for a swim", clean: 35, fun: 8, energy: -3, curiosity: 3, xp: 9, phrase: "Get me wet and call it self-care.", de: { label: "Badeente", detail: "Zu Kinkybara ziehen: ab ins Wasser", phrase: "Mach mich nass und nenn es Wellness." } },
  towel: { label: "Towel", detail: "Dry, fluff and cuddle", clean: 8, social: 8, fun: 3, xp: 5, phrase: "Firm hands. Warm towel.", de: { label: "Handtuch", detail: "Trockenrubbeln und kuscheln", phrase: "Feste Hände. Warmes Handtuch." } },
});

export const TOGETHER = Object.freeze({
  cuddle: { label: "Cuddle", detail: "Drag the heart to Kinkybara", social: 22, fun: 5, energy: 2, xp: 7, phrase: "Stay. That was almost an order.", de: { label: "Kuscheln", detail: "Das Herz zu Kinkybara ziehen", phrase: "Bleib. Das war fast ein Befehl." } },
  talk: { label: "Talk", detail: "Time for a real check-in", social: 16, curiosity: 5, xp: 6, phrase: "Say what you want. I like clear words.", de: { label: "Reden", detail: "Zeit für ein echtes Gespräch", phrase: "Sag, was du willst. Ich mag klare Worte." } },
  explore: { label: "Explore", detail: "Drag the leaf into the world", curiosity: 24, fun: 8, energy: -6, satiety: -2, xp: 9, phrase: "Lead the way. Or let me.", de: { label: "Entdecken", detail: "Das Blatt in die Welt ziehen", phrase: "Geh vor. Oder lass mich." } },
  sunbathe: { label: "Chill", detail: "Slow down together", energy: 10, social: 7, clean: -2, xp: 5, phrase: "No leash, no rush, just heat.", de: { label: "Chill", detail: "Gemeinsam runterkommen", phrase: "Keine Leine, keine Eile, nur Wärme." } },
});

export function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function makeState(now = Date.now(), name = "Thron", furVariant = "classic", customization = {}) {
  return {
    ...DEFAULT_STATE,
    name: cleanName(name),
    furVariant: FUR_VARIANTS.includes(furVariant) ? furVariant : "classic",
    language: customization.language === "de" ? "de" : "en",
    primaryAccent: cleanAccent(customization.primaryAccent, "violet"),
    secondaryAccent: cleanAccent(customization.secondaryAccent, "red", cleanAccent(customization.primaryAccent, "violet")),
    adoptedAt: now,
    updatedAt: now,
    memories: [],
    inventory: createInventory(),
    garden: createGarden(),
    world: createWorld(now, "home", name),
  };
}

export function cleanName(value) {
  const name = Array.from(String(value ?? "")
    .normalize("NFKC")
    .replace(/[\u0000-\u001F\u007F\u202A-\u202E\u2066-\u2069<>&"'`=]/g, "")
    .trim()
    .replace(/\s+/g, " "))
    .slice(0, 14)
    .join("");
  return name || "Thron";
}

function cleanLocalText(value, maxLength) {
  return Array.from(String(value ?? "")
    .normalize("NFKC")
    .replace(/[\u0000-\u001F\u007F\u202A-\u202E\u2066-\u2069<>&]/g, "")
    .trim())
    .slice(0, maxLength)
    .join("");
}

function cleanAccent(value, fallback, disallowed = "") {
  const safeFallback = Object.hasOwn(ACCENT_COLORS, fallback) ? fallback : "violet";
  const accent = Object.hasOwn(ACCENT_COLORS, value) ? value : safeFallback;
  if (accent !== disallowed) return accent;
  return Object.keys(ACCENT_COLORS).find((key) => key !== disallowed) || safeFallback;
}

function normalizeMemories(candidate) {
  if (!Array.isArray(candidate)) return [];
  return candidate
    .filter((entry) => entry && typeof entry.text === "string")
    .slice(-24)
    .map((entry) => ({
      at: Number.isFinite(Number(entry.at)) ? Number(entry.at) : 0,
      icon: cleanLocalText(entry.icon || "♥", 3) || "♥",
      text: cleanLocalText(entry.text, 120),
    }));
}

export function normalizeState(candidate, now = Date.now()) {
  const base = makeState(now);
  if (!candidate || typeof candidate !== "object") return base;
  const need = (key) => {
    const value = Number(candidate[key]);
    return Number.isFinite(value) ? clamp(value) : base[key];
  };
  return {
    ...base,
    ...candidate,
    version: 7,
    name: cleanName(candidate.name),
    furVariant: FUR_VARIANTS.includes(candidate.furVariant) ? candidate.furVariant : "classic",
    language: candidate.language === "de" ? "de" : "en",
    primaryAccent: cleanAccent(candidate.primaryAccent, "violet"),
    secondaryAccent: cleanAccent(candidate.secondaryAccent, "red", cleanAccent(candidate.primaryAccent, "violet")),
    adoptedAt: Number.isFinite(candidate.adoptedAt) && candidate.adoptedAt > 0 ? candidate.adoptedAt : now,
    updatedAt: Number.isFinite(candidate.updatedAt) && candidate.updatedAt > 0 ? candidate.updatedAt : now,
    satiety: need("satiety"),
    fun: need("fun"),
    clean: need("clean"),
    energy: need("energy"),
    social: need("social"),
    curiosity: need("curiosity"),
    xp: Math.max(0, Number(candidate.xp) || 0),
    interactions: Math.max(0, Number(candidate.interactions) || 0),
    sleeping: Boolean(candidate.sleeping),
    voice: candidate.voice !== false,
    sound: candidate.sound !== false,
    haptics: candidate.haptics !== false,
    memories: normalizeMemories(candidate.memories),
    questProgress: candidate.questProgress && typeof candidate.questProgress === "object" ? candidate.questProgress : null,
    travel: candidate.travel && typeof candidate.travel === "object" ? candidate.travel : null,
    landscapeArea: ["home", "meadow", "garden", "wintergarden"].includes(candidate.landscapeArea) ? candidate.landscapeArea : "home",
    inventory: normalizeInventory(candidate.inventory),
    garden: normalizeGarden(candidate.garden),
    world: normalizeWorld(candidate.world || { area: candidate.landscapeArea }, now, `${candidate.name || base.name}:${candidate.adoptedAt || now}`),
  };
}

function foodSeed(state) {
  return [...`${state?.name || "capy"}:${Number(state?.adoptedAt) || 0}`]
    .reduce((sum, character) => ((sum * 33) ^ character.charCodeAt(0)) >>> 0, 2_166_136_261);
}

function positiveModulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function rotatingSelection(keys, start, count) {
  return Array.from({ length: Math.min(count, keys.length) }, (_, index) => keys[positiveModulo(start + index, keys.length)]);
}

export function foodMarketRotation(state, now = Date.now(), questId = "") {
  const timestamp = Number.isFinite(Number(now)) ? Math.max(0, Number(now)) : 0;
  const bucket = Math.floor(timestamp / FOOD_MARKET_WINDOW_MS);
  const rotation = bucket + foodSeed(state);
  const standardKeys = rotatingSelection(FOOD_MARKET_GROUPS.standards, rotation, 3);
  const juiceKey = FOOD_MARKET_GROUPS.juices[positiveModulo(rotation, FOOD_MARKET_GROUPS.juices.length)];
  const scheduledSpecial = positiveModulo(rotation, 3) === 0
    ? FOOD_MARKET_GROUPS.specials[positiveModulo(Math.floor(rotation / 3), FOOD_MARKET_GROUPS.specials.length)]
    : null;
  const specialKey = questId === "pickle-picnic" ? "pickle" : scheduledSpecial;
  return {
    standardKeys,
    juiceKey,
    specialKey,
    availableKeys: [...standardKeys, juiceKey, ...(specialKey ? [specialKey] : [])],
    nextChangeAt: (bucket + 1) * FOOD_MARKET_WINDOW_MS,
  };
}

export function foodAvailability(key, state, now = Date.now(), questId = "") {
  const item = FOODS[key];
  const rotation = foodMarketRotation(state, now, questId);
  if (!item) return { available: false, limited: false, reason: "UNKNOWN FOOD", nextChangeAt: rotation.nextChangeAt };
  const available = rotation.availableKeys.includes(key);
  const limited = FOOD_MARKET_GROUPS.specials.includes(key);
  return {
    available,
    limited,
    reason: available
      ? (limited ? (key === "pickle" && questId === "pickle-picnic" ? "QUEST FIND" : "LIMITED TIME") : "IN ROTATION")
      : (limited ? "NOT AT THE MARKET" : "ROTATES LATER"),
    nextChangeAt: rotation.nextChangeAt,
  };
}

export function growthFor(state) {
  const { level } = levelInfo(state?.xp || 0);
  if (level >= 10) return { id: "majestic", label: "PRÄCHTIGES CAPY", level };
  if (level >= 6) return { id: "grown", label: "ERWACHSENES CAPY", level };
  if (level >= 3) return { id: "young", label: "JUNGES CAPY", level };
  return { id: "baby", label: "KLEINES CAPY", level };
}

export function advanceState(input, now = Date.now()) {
  const state = normalizeState(input, now);
  const elapsedHours = clamp((now - state.updatedAt) / 3_600_000, 0, 24 * 30);
  if (elapsedHours <= 0) return state;

  const rates = state.sleeping
    ? { satiety: -2.2, fun: -0.5, clean: -0.8, energy: 15, social: -0.6, curiosity: -0.3 }
    : { satiety: -4.2, fun: -3.1, clean: -2.1, energy: -2.8, social: -2.4, curiosity: -1.7 };

  for (const key of NEED_KEYS) state[key] = clamp(state[key] + rates[key] * elapsedHours);
  state.updatedAt = now;
  return state;
}

export function absenceReport(input, now = Date.now()) {
  const before = normalizeState(input, now);
  const elapsedMs = clamp(now - before.updatedAt, 0, 30 * 86_400_000);
  const state = advanceState(before, now);
  return {
    state,
    elapsedMs,
    sleeping: before.sleeping,
    changes: Object.fromEntries(NEED_KEYS.map((key) => [key, state[key] - before[key]])),
  };
}

export function applyChanges(input, changes, now = Date.now()) {
  const state = advanceState(input, now);
  for (const key of NEED_KEYS) {
    if (Number.isFinite(changes[key])) state[key] = clamp(state[key] + changes[key]);
  }
  state.xp = Math.max(0, state.xp + (Number(changes.xp) || 0));
  state.interactions += Number(changes.interactions) || 1;
  state.updatedAt = now;
  return state;
}

export function addMemory(input, text, icon = "♥", now = Date.now()) {
  const state = normalizeState(input, now);
  const memories = [...state.memories, { at: now, icon: String(icon).slice(0, 3), text: String(text).slice(0, 120) }].slice(-24);
  return { ...state, memories };
}

export function levelInfo(xp) {
  const safeXp = Math.max(0, Number(xp) || 0);
  const level = Math.floor(Math.sqrt(safeXp / 22)) + 1;
  const levelStart = 22 * (level - 1) ** 2;
  const levelEnd = 22 * level ** 2;
  return {
    level,
    xp: safeXp,
    levelStart,
    levelEnd,
    nextLevelXp: levelEnd,
    toNext: Math.max(0, levelEnd - safeXp),
    progress: clamp(((safeXp - levelStart) / (levelEnd - levelStart)) * 100),
  };
}

export function dayNumber(state, now = Date.now()) {
  return Math.max(1, Math.floor((now - state.adoptedAt) / 86_400_000) + 1);
}

export function moodFor(state) {
  if (state.sleeping) return { label: "SCHLÄFT", tone: "sleeping" };
  const needs = NEED_KEYS.map((key) => Number(state[key]));
  const average = needs.reduce((sum, value) => sum + value, 0) / needs.length;
  const minimum = Math.min(...needs);
  if (minimum < 12) return { label: "BRAUCHT DICH", tone: "urgent" };
  if (average < 38) return { label: "MÜRRISCH", tone: "sad" };
  if (average < 62) return { label: "GANZ OKAY", tone: "okay" };
  if (average >= 88) return { label: "SEELIG", tone: "great" };
  return { label: "GLÜCKLICH", tone: "happy" };
}

function phraseFrom(options, state, now, salt = 0) {
  const bucket = Math.floor(now / 900_000);
  const seed = Math.abs(Math.floor(state.interactions * 7 + state.xp * 3 + dayNumber(state, now) * 11 + bucket + salt));
  return options[seed % options.length];
}

const URGENT_PHRASES = Object.freeze({
  satiety: [
    "Ich hab richtig Hunger. Futter, bitte.",
    "Meine Schnute will etwas Saftiges. Jetzt.",
    "Noch ein Knurren aus dem Bauch, dann werde ich ungemütlich.",
  ],
  fun: [
    "Mir ist langweilig. Spiel mit mir.",
    "Wirf etwas. Ich fang den Ärger.",
    "Zu viel Unfug, zu wenig Spielzeug.",
  ],
  clean: [
    "Ich brauche Bürste oder Bad. Dringend.",
    "Ich rieche nach letzter Nacht. Hilf mir.",
    "Warmes Wasser. Feste Hände. Los.",
  ],
  energy: [
    "Ich kippe gleich um. Licht aus.",
    "Auch ein bossy Pup muss schlafen.",
    "Mein Akku ist leer. Ich komme kuscheln.",
  ],
  social: [
    "Komm näher. Ich brauche deine Nähe.",
    "Bleib kurz bei mir. Bitte.",
    "Ich vermisse deine Aufmerksamkeit.",
  ],
  curiosity: [
    "Ich muss raus. Meine Nase hat etwas.",
    "Irgendwo wartet Ärger. Komm mit.",
    "Ich brauche etwas Neues zum Beschnuppern.",
  ],
});

const LOW_PHRASES = Object.freeze({
  satiety: ["Ein Apfel wäre gut.", "Ich hätte Platz für Melone.", "Etwas Saftiges?"],
  fun: ["Eine Runde?", "Das Zerrseil langweilt sich.", "Ich könnte brav sein. Oder spielen."],
  clean: ["Ein paar Bürstenstriche?", "Mein Fell trägt noch gestern.", "Langsam bürsten. Klingt gut."],
  energy: ["Noch wach. Knapp.", "Ich werde weich und müde.", "Mach mir einen Platz."],
  social: ["Ein bisschen Nähe wäre schön.", "Bleibst du kurz bei mir?", "Ich vermisse deine Hände. Die lieben."],
  curiosity: ["Zeig mir etwas Neues.", "Ich bin bereit für gute Fehler.", "Eine kleine Runde raus?"],
});

const TIME_PHRASES = Object.freeze({
  morning: [
    "Guten Morgen. Kaffee zuerst, Kommandos danach.",
    "Ich bin noch weich. Nutz es nicht aus – oder frag höflich.",
    "Guten Morgen, guter Pup. Entscheide selbst, wen ich meine.",
  ],
  day: [
    "Ich war heute viel zu brav. Verdächtig, oder?",
    "Klare Ansage: erst spielen, dann kuscheln. Oder wir switchen.",
    "Tageslicht lässt das Gear fast unschuldig aussehen.",
  ],
  dusk: [
    "Abendlicht, blankes Gear und ein Blick zu viel. Gefährliche Mischung.",
    "Es wird dunkel – perfekte Zeit für schlechte Ideen und gute Absprachen.",
    "Goldene Stunde. Sogar meine Attitude wirkt plötzlich weich.",
  ],
  night: [
    "Halsband dran, Licht runter. Der Rest ist Verhandlungssache.",
    "Nachts bin ich entweder sehr kuschelig oder sehr überzeugend.",
    "Der Mond ist oben. Der Unfug auch.",
  ],
});

const HAPPY_PHRASES = Object.freeze([
  "Brav sein kann ich. Aber frech steht mir besser.",
  "Heute bin ich Top. Morgen verhandeln wir.",
  "Die Leine ist Deko, bis jemand höflich fragt.",
  "Komm näher. Langsam. Ich mag die Spannung.",
  "Ich kann Sitz, Platz und Grenzen setzen. Vielseitig, oder?",
  "Ich bin Switch: eben noch Schoß-Pup, gleich schon Ansage.",
  "Dom, Sub, Alpha, Switch – Labels später. Snacks jetzt.",
  "Erst sniffen, dann worshippen. Sauberer Ablauf.",
  "Netflix and chill? Ich halte die Fernbedienung. Den Rest handeln wir aus.",
  "Rubber, Furry oder nur Hood – ich ziehe mich nach Stimmung an.",
  "Edging? Ich nenne es perfektes Timing.",
  "Blow … bubbles. Was dachtest du denn?",
  "Cuddles, Snuggles, dann eine sehr schlechte Idee.",
  "Alpha-Energie ist süß. Ich hätte gern Beweise.",
  "Braver Sub, guter Dom, großartiger Switch. Ich bin flexibel.",
  "Worship ist ein großes Wort. Mach weiter.",
  "Kraul die richtige Stelle und ich überlege, ob ich brav bleibe.",
  "Das Halsband passt. Dein Blick dazu auch.",
  "Ich mag klare Worte, weiche Hände und sehr schlechte Ausreden.",
  "Wenn ich Platz sage, meine ich vielleicht nicht das Körbchen.",
  "Heute wird gewedelt, provoziert und anschließend gekuschelt.",
  "Ich beiße nicht. Außer die Pointe verlangt es.",
  "Wer führt hier wen? Falsche Frage. Wechselnde Antwort.",
  "Guter Pup. Das galt mir. Oder dir. Such’s dir aus.",
  "Ich habe meine Grenzen im Blick. Und deine.",
  "Heute bekommst du die weiche Seite. Werd nicht übermütig.",
  "Deine Hosentasche sieht einladend aus. Dein Schoß noch mehr.",
  "Bleib nah. Das war fast ein Befehl.",
  "Liebes Gesicht, scharfe Attitude. Nennt sich Bandbreite.",
  "Schön, dass du da bist.",
  "Rück näher. Hier ist Platz.",
  "Heute weich. Morgen sehen wir weiter.",
  "Bleib kurz. Ich mag gerade dein Dasein.",
  "Wenn die Ohren wackeln, freue ich mich. So einfach.",
  "Wir müssen nichts tun. Komm nur näher.",
  "Du kümmerst dich um mich. Ich merke das.",
  "Warme Schnute, vertrauter Mensch. Reicht.",
  "Ich hab deinen Platz freigehalten.",
  "Heute vielleicht nur Melone und Nähe.",
  "Ruhiger Tag? Kann ich.",
  "Ich sehe dich. Das ist gut.",
  "Schön, dass du wiederkommst.",
]);

export function statusPhrase(state, now = Date.now()) {
  if (state.sleeping) return "Pssst … ich träume von einem warmen Teich.";
  const needs = NEED_KEYS.map((key) => [key, state[key]]).sort((a, b) => a[1] - b[1]);
  const [lowest, value] = needs[0];
  if (value < 25) return phraseFrom(URGENT_PHRASES[lowest], state, now, 17);
  if (value < 48) return phraseFrom(LOW_PHRASES[lowest], state, now, 29);
  const hour = new Date(now).getHours();
  const period = hour < 7 ? "morning" : hour < 17 ? "day" : hour < 21 ? "dusk" : "night";
  if ((Math.floor(now / 900_000) + state.interactions) % 3 === 0) return phraseFrom(TIME_PHRASES[period], state, now, 41);
  return phraseFrom(HAPPY_PHRASES, state, now, 53);
}

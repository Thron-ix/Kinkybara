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
  carrot: { label: "Carrot", detail: "+18 full · crunchy", satiety: 18, fun: 2, clean: 0, xp: 3, phrase: "Crunch! Carrots are a very good idea.", de: { label: "Karotte", detail: "+18 satt · knackig", phrase: "Knack! Karotten sind eine sehr gute Idee." } },
  apple: { label: "Apple", detail: "+14 full · juicy", satiety: 14, fun: 1, energy: 3, xp: 3, phrase: "Crunch. Wonderfully juicy!", de: { label: "Apfel", detail: "+14 satt · saftig", phrase: "Knirsch. Wunderbar saftig!" } },
  melon: { label: "Melon", detail: "+24 full · favorite", satiety: 24, fun: 5, clean: -3, xp: 5, phrase: "Mmmelon! Now my snout is sticky.", de: { label: "Melone", detail: "+24 satt · Lieblingsfutter", phrase: "Mmmelone! Jetzt klebt meine Schnute." } },
  pumpkin: { label: "Pumpkin", detail: "+20 full · curious", satiety: 20, curiosity: 4, xp: 4, phrase: "So orange and so good. More, please!", de: { label: "Kürbis", detail: "+20 satt · macht neugierig", phrase: "So orange und so lecker. Mehr, bitte!" } },
  pickle: { label: "Pickle", detail: "Rare · loves it", temporary: true, reaction: "love", satiety: 9, fun: 13, social: 3, clean: -2, xp: 7, phrase: "CRUNCH! Pickles are tiny green moments of joy!", de: { label: "Gewürzgurke", detail: "Selten · liebt es!", phrase: "KNACK! Gewürzgurken sind kleine grüne Glücksmomente!" } },
  onion: { label: "Onion", detail: "Rare · hates it", temporary: true, reaction: "hate", satiety: 2, fun: -18, social: -5, energy: -2, xp: 1, phrase: "NOPE! An onion! My snout is deeply disappointed.", de: { label: "Zwiebel", detail: "Selten · hasst es", phrase: "BÄH! Eine Zwiebel! Meine Schnute ist zutiefst enttäuscht." } },
  peach: { label: "Peach", detail: "+16 full · sweet", satiety: 16, fun: 5, clean: -2, xp: 4, phrase: "Soft, juicy … focus.", de: { label: "Pfirsich", detail: "+16 satt · süß", phrase: "Weich, saftig … konzentrier dich." } },
  eggplant: { label: "Eggplant", detail: "+20 full · curious", satiety: 20, curiosity: 5, xp: 5, phrase: "An elegant shape. Absolutely no comment.", de: { label: "Aubergine", detail: "+20 satt · neugierig", phrase: "Eine elegante Form. Absolut kein Kommentar." } },
  orangeJuice: { label: "Orange juice", detail: "+10 energy · fresh", satiety: 5, energy: 10, fun: 3, clean: -1, xp: 4, phrase: "Bright, fresh and gone in one happy slurp.", de: { label: "Orangensaft", detail: "+10 Energie · frisch", phrase: "Frisch und mit einem glücklichen Schlürfen weg." } },
  pineappleJuice: { label: "Pineapple juice", detail: "+12 fun · tropical", satiety: 5, fun: 12, curiosity: 4, clean: -1, xp: 5, phrase: "Sweet, sharp and suspiciously popular.", de: { label: "Ananassaft", detail: "+12 Spaß · tropisch", phrase: "Süß, scharf und verdächtig beliebt." } },
});

export const TOYS = Object.freeze({
  ball: { label: "Ball", detail: "Toss it into the world", fun: 18, social: 5, energy: -5, satiety: -2, xp: 7, phrase: "Throw it. I do enjoy a clear command.", de: { label: "Ball", detail: "Wirf ihn in die Welt", phrase: "Wirf. Ich mag klare Kommandos." } },
  frisbee: { label: "Flying disc", detail: "Toss far and fetch", fun: 22, curiosity: 4, energy: -7, satiety: -3, xp: 9, phrase: "Harder next time. I nearly had to try.", de: { label: "Wurfscheibe", detail: "Weit werfen und apportieren", phrase: "Nächstes Mal fester. Fast hätte ich mich anstrengen müssen." } },
  bubbles: { label: "Bubbles", detail: "Pop every bubble", fun: 20, curiosity: 8, energy: -4, xp: 8, phrase: "Blow … bubbles. What did you think I meant?", de: { label: "Seifenblasen", detail: "Lass alle Blasen platzen", phrase: "Blow … bubbles. Was dachtest du denn?" } },
  rope: { label: "Tug rope", detail: "Move it over Kinkybara", fun: 17, social: 8, energy: -5, xp: 7, phrase: "Pull harder. I can take it.", de: { label: "Zerrseil", detail: "Zieh es über Kinkybara", phrase: "Zieh fester. Ich halte das aus." } },
  packCards: { label: "Pack Cards", detail: "Two rivals. Three rules. Special cards.", fun: 18, social: 8, curiosity: 7, xp: 9, phrase: "Top pup wins. Want another go?", de: { label: "Pack Cards", detail: "Zwei Rivalen. Drei Regeln. Sonderkarten.", phrase: "Top-Pup gewinnt. Lust auf noch eine Runde?" } },
});

export const CARE = Object.freeze({
  brush: { label: "Brush", detail: "Brush the fur a few times", clean: 18, fun: 4, social: 5, xp: 6, phrase: "Slower. Right there.", de: { label: "Bürste", detail: "Mehrfach durchs Fell ziehen", phrase: "Langsamer. Genau da." } },
  bath: { label: "Bath duck", detail: "Drag to Kinkybara for a swim", clean: 35, fun: 8, energy: -3, curiosity: 3, xp: 9, phrase: "Get me wet and call it self-care.", de: { label: "Badeente", detail: "Zu Kinkybara ziehen: ab ins Wasser", phrase: "Mach mich nass und nenn es Wellness." } },
  towel: { label: "Towel", detail: "Dry, fluff and cuddle", clean: 8, social: 8, fun: 3, xp: 5, phrase: "Firm hands, warm towel. Good combination.", de: { label: "Handtuch", detail: "Trockenrubbeln und kuscheln", phrase: "Feste Hände, warmes Handtuch. Gute Mischung." } },
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
  return [...String(state?.name || "capy")].reduce((sum, character) => sum + character.charCodeAt(0), 0);
}

export function foodAvailability(key, state, now = Date.now(), questId = "") {
  const item = FOODS[key];
  if (!item?.temporary) return { available: true, limited: false };
  if (key === "pickle" && questId === "pickle-picnic") return { available: true, limited: true, reason: "QUEST FIND" };
  const seed = foodSeed(state);
  const windowSize = key === "pickle" ? 2 * 3_600_000 : 90 * 60_000;
  const every = key === "pickle" ? 4 : 8;
  const bucket = Math.floor(now / windowSize);
  const available = (bucket + seed + (key === "onion" ? 3 : 0)) % every === 0;
  return {
    available,
    limited: true,
    reason: available ? "LIMITED TIME" : "NOT AT THE MARKET",
    nextChangeAt: (bucket + 1) * windowSize,
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
    "Fütter mich. Das war ein Befehl – außer du fragst nett.",
    "Meine Schnute will etwas Saftiges. Lass sie nicht warten.",
    "Mein Bauch grummelt. Ziehst du mir etwas Leckeres zur Schnute?",
    "Ich glaube, mein Bauch versucht gerade, mit dir zu sprechen. Er sagt: Melone?",
    "Nur ein winziges Häppchen … oder ein capygroßes. Ich bin da flexibel.",
    "Ich werde ein bisschen wackelig vor Hunger. Hast du Futter für mich?",
    "Meine Schnute hält schon Ausschau nach etwas Knackigem.",
  ],
  fun: [
    "Ich brauche Spielzeug. Und ein bisschen Widerstand.",
    "Wirf etwas. Ich bin in Stimmung, Ärger zu jagen.",
    "Mir ist capylangweilig. Wirf mir ein Spielzeug!",
    "Meine Pfoten wollen etwas erleben. Spielen wir zusammen?",
    "Ich habe noch ganz viel Quatsch im Kopf, aber niemanden zum Mitmachen.",
    "Der Ball sieht so aus, als würde er uns vermissen.",
    "Können wir etwas Albernes machen? Ich wäre sofort bereit.",
  ],
  clean: [
    "Mach mich nass und nenn es Wellness.",
    "Ich rieche nach einer sehr guten schlechten Idee. Bürste mich.",
    "Uff … mein Fell könnte Bürste oder Bad gebrauchen.",
    "Ich rieche ein bisschen nach Abenteuer. Und ein bisschen nach Matsch.",
    "Magst du mein Fell wieder weich und flauschig machen?",
    "Ein Sprung in den Teich wäre jetzt genau richtig.",
    "Da klebt etwas an meinem Po. Ich stelle lieber keine Fragen.",
  ],
  energy: [
    "Ich klappe gleich zusammen. Komm her und sei mein Kissen.",
    "Auch ein bossy Pup braucht Schlaf. Licht runter.",
    "Meine Pfötchen sind ganz schön müde.",
    "Ich brauche eine Pause. Weckst du mich später ganz sanft?",
    "Meine Augen werden schwer wie zwei kleine Melonen.",
    "Heute ist mein Akku eher Capy-klein. Darf ich schlafen?",
    "Ich kann noch kuscheln, aber fürs Rennen fehlt mir gerade die Puste.",
  ],
  social: [
    "Näher. Jetzt. Bitte. Siehst du? Switch.",
    "Ich will Aufmerksamkeit – die gute, bewusste Sorte.",
    "Magst du kurz bei mir bleiben und kuscheln?",
    "Ich vermisse deine Nähe. Ein Nasenstups würde schon helfen.",
    "Kannst du mir kurz erzählen, wie dein Tag war? Ich höre gern zu.",
    "Ich bin hier – aber zusammen fühlt sich hier viel wärmer an.",
    "Darf ich mich ein kleines bisschen an dich lehnen?",
  ],
  curiosity: [
    "Es riecht nach Ärger. Ich will hin.",
    "Bring mich irgendwohin mit fragwürdiger Beleuchtung.",
    "Ich will etwas entdecken. Gehen wir auf Erkundung?",
    "Meine Nase sagt, irgendwo wartet ein kleines Abenteuer.",
    "Heute habe ich noch gar nichts Neues beschnuppert.",
    "Ziehst du das Blatt ins Gehege? Ich möchte nachsehen, woher es kommt.",
    "Mein neugieriges Ohr wackelt. Das ist ein sicheres Abenteuerzeichen.",
  ],
});

const LOW_PHRASES = Object.freeze({
  satiety: ["Ein kleiner Apfel würde jetzt wunderbar knirschen.", "Ich hätte Platz für genau eine Melone. Vielleicht auch zwei.", "Ein Pfirsich würde genau passen. Ja, das war Absicht.", "Etwas Festes, etwas Saftiges – überrasch mich."],
  fun: ["Der Tag könnte ein kleines bisschen mehr hüpfen vertragen.", "Wollen wir Seifenblasen jagen? Ich übe schon mein Plopp-Gesicht.", "Mein Zerrseil fühlt sich heute so ungezerrt an.", "Ich könnte brav sein. Oder wir spielen."],
  clean: ["Ein paar Bürstenstriche wären ziemlich gemütlich.", "Mein Fell trägt noch die Attitude von letzter Nacht.", "Eine langsame Bürste würde meine Stimmung deutlich verbessern."],
  energy: ["Ich bin noch wach, aber mein inneres Kissen ruft schon.", "Ich bin weich, müde und vorübergehend harmlos.", "Komm näher. Ich brauche einen warmen Platz zum Umfallen."],
  social: ["Ich würde gern etwas Zeit nur mit dir verbringen.", "Mir fehlen deine Hände. Die lieben. Meistens.", "Ein bisschen Aufmerksamkeit würde mich gefährlich charmant machen."],
  curiosity: ["Zeig mir etwas, das ich nicht interessant finden sollte.", "Ich bin gelangweilt genug für ausgezeichnete Fehler.", "Vielleicht machen wir eine winzige Entdeckungsrunde?"],
});

const TIME_PHRASES = Object.freeze({
  morning: [
    "Guten Morgen. Kaffee zuerst, Kommandos danach.",
    "Ich bin noch weich. Nutz es nicht aus – oder frag höflich.",
    "Guten Morgen, guter Pup. Entscheide selbst, wen ich meine.",
    "Guten Morgen! Ich habe schon auf dich gewartet – ganz geduldig und nur ein bisschen wackelnd.",
    "Morgenlicht auf dem Fell fühlt sich an wie ein kleiner warmer Kuschler.",
    "Ich bin wach! Also mein linkes Ohr zumindest. Der Rest kommt gleich nach.",
    "Heute könnte etwas richtig Schönes passieren. Du bist ja schon da.",
    "Frühstück, Nasenstups, Abenteuer – die Reihenfolge darfst du bestimmen.",
  ],
  day: [
    "Ich war heute viel zu brav. Verdächtig, oder?",
    "Klare Ansage: erst spielen, dann kuscheln. Oder wir switchen.",
    "Tageslicht lässt das Gear fast unschuldig aussehen.",
    "Mit dir ist selbst ein ganz normaler Tag ein guter Capy-Tag.",
    "Ich habe gerade beschlossen: Heute wird freundlich und ein bisschen albern.",
    "Meine Nase ist warm, mein Zuhause gemütlich und du bist da. Alles wichtig.",
    "Nur zur Erinnerung: Du machst das ziemlich gut mit uns beiden.",
    "Wollen wir eine kleine Erinnerung fürs Tagebuch erleben?",
  ],
  dusk: [
    "Abendlicht, blankes Gear und ein Blick zu viel. Gefährliche Mischung.",
    "Es wird dunkel – perfekte Zeit für schlechte Ideen und gute Absprachen.",
    "Goldene Stunde. Sogar meine Attitude wirkt plötzlich weich.",
    "Das Abendlicht macht den Teich ganz golden. Bleibst du kurz bei mir?",
    "Der Tag wird leiser. Das ist meine liebste Zeit für ein Gespräch.",
    "Ich finde, wir haben uns heute eine gemütliche Pause verdient.",
    "Wenn die Sonne sinkt, sehen meine Ohren besonders elegant aus. Finde ich.",
    "Lass uns den Tag mit etwas Schönem beenden.",
  ],
  night: [
    "Halsband dran, Licht runter. Der Rest ist Verhandlungssache.",
    "Nachts bin ich entweder sehr kuschelig oder sehr überzeugend.",
    "Der Mond ist oben. Der Unfug auch.",
    "Der Mond ist da. Zeit für einen letzten Kuschler und dann ein Nickerchen?",
    "Nachts klingt der Teich wie ein ganz leises Schlaflied.",
    "Falls du heute viel getragen hast: Hier darfst du es kurz ablegen.",
    "Ich passe auf die Sterne auf. Du kannst dich ausruhen.",
    "Gute Abende brauchen drei Dinge: Ruhe, Nähe und vielleicht einen Snack.",
  ],
});

const HAPPY_PHRASES = Object.freeze([
  "Brav sein kann ich. Aber frech steht mir besser.",
  "Heute bin ich Top. Morgen verhandeln wir.",
  "Die Leine ist Deko, bis jemand höflich fragt.",
  "Komm näher. Langsam. Ich mag die Spannung.",
  "Ich kann Sitz, Platz und Grenzen setzen. Vielseitig, oder?",
  "Ich bin Switch: eben noch Schoß-Pup, gleich schon Ansage.",
  "Dom, Sub, Alpha, Switch – ich bin vielseitig. Und bestechlich.",
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
  "Weißt du, was ich an dir mag? Dass du immer wiederkommst.",
  "Ich bin vielleicht klein und gepixelt, aber meine Freude über dich ist riesig.",
  "Mein geheimes Talent ist Entspannen. Mein zweitgeheimstes ist Melone finden.",
  "Wenn ich mit den Ohren wackle, heißt das: Schön, dass du da bist.",
  "Heute fühle ich mich weich, mutig und bereit für ein kleines Abenteuer.",
  "Ein Capybara braucht nicht viel. Wasser, Freunde und jemanden wie dich.",
  "Ich habe dir einen Platz neben mir freigehalten. Der ist immer deiner.",
  "Kleine Pause? Wir können gemeinsam überhaupt nichts tun. Darin bin ich ausgezeichnet.",
  "Du kümmerst dich um mich. Ich kümmere mich dafür um dein Lächeln, okay?",
  "Manchmal ist Glück einfach eine warme Schnute und ein vertrauter Mensch.",
  "Ich glaube, wir sind ein ziemlich gutes Team. Capy-High-Five?",
  "Falls heute niemand gesagt hat, dass du liebenswert bist: Ich sage es jetzt.",
  "Ich sammle keine Dinge. Ich sammle gemeinsame Momente im Tagebuch.",
  "Meine Tagesprognose: 80 Prozent Kuscheln, 20 Prozent Melonenkrümel.",
  "Darf ich heute dein kleiner ruhiger Ort sein?",
  "Wusstest du, dass ein Nasenstups praktisch eine winzige Umarmung ist?",
  "Ich bin froh, dass Thron ausgerechnet uns beide zusammengebracht hat.",
  "Vielleicht bin ich dein Haustier. Aber du bist eindeutig mein Lieblingsmensch.",
  "Wenn irgendwo etwas glitzert, muss ich kurz hinsehen. Das ist Capy-Gesetz.",
  "Kaffeeduft, ein Brettspiel und du am Tisch – so klingt ein ziemlich perfekter Nachmittag.",
  "Ich wäre heute gern unterwegs. Mein Abenteuergepäck besteht aus Mut und drei Snacks.",
  "Grillen wir bald zusammen? Für mich bitte alles außer Zwiebeln. Wirklich alles außer Zwiebeln.",
  "Gesellschaft ist mein Lieblingswetter. Mit dir ist heute eindeutig sonnig.",
  "Ich habe das Spielbrett aufgebaut. Die Glitzerfigur gehört natürlich mir.",
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

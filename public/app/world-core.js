const MINUTE = 60_000;
const PINEAPPLE_PREP_WINDOW = 90 * MINUTE;
const SECRET_BONUSES = new Set(["pineapple", "spotless"]);

export const WORLD_AREAS = Object.freeze({
  home: { id: "home", label: "THE DEN", short: "DEN", icon: "⌂" },
  meadow: { id: "meadow", label: "KENNEL CLUB", short: "KENNEL", icon: "K" },
  garden: { id: "garden", label: "PLAY AREA", short: "PLAY AREA", icon: "P" },
  wintergarden: { id: "wintergarden", label: "PACK LOUNGE", short: "LOUNGE", icon: "L" },
});

export const ANIMAL_FRIENDS = Object.freeze({
  chicken: {
    id: "chicken", label: "Hilda", species: "Chicken", icon: "H",
    phrase: "Hilda checks every corner of the Play Area. Nothing escapes her.",
    personality: "Sharp-eyed, brisk and cheerfully nosy.",
    trait: { id: "keen_eye", label: "Keen eye", detail: "Spots extra discoveries, especially in the Play Area.", effects: { travel: { curiosity: 5, xp: 2 }, meadow: { curiosity: 2 }, garden: { curiosity: 7 } } },
  },
  rabbit: {
    id: "rabbit", label: "Fips", species: "Rabbit", icon: "F",
    phrase: "Fips came over for a bounce. I am doing my best to keep up.",
    personality: "Restless, playful and always ready for one more lap.",
    trait: { id: "second_wind", label: "Second wind", detail: "Keeps the pace up and turns exertion into more fun.", effects: { travel: { energy: 4, fun: 2 }, meadow: { energy: 3 }, garden: { fun: 7, energy: -3 } } },
  },
  duck: {
    id: "duck", label: "Lotte", species: "Duck", icon: "L",
    phrase: "Lotte tells the loudest and friendliest stories in the whole pack.",
    personality: "Talkative, warm and incapable of letting a room stay quiet.",
    trait: { id: "social_spark", label: "Social spark", detail: "Makes every outing feel more connected and lively.", effects: { travel: { social: 7, fun: 2 }, meadow: { fun: 6, social: 5 }, garden: { social: 4 } } },
  },
  hedgehog: {
    id: "hedgehog", label: "Piek", species: "Hedgehog", icon: "P",
    phrase: "Piek is visiting today. Hugs require particularly careful consent.",
    personality: "Dry-witted, observant and wonderfully clear about boundaries.",
    trait: { id: "soft_boundaries", label: "Soft boundaries", detail: "Keeps intense plans grounded, cleaner and less draining.", effects: { travel: { social: 4, energy: 3 }, meadow: { energy: 5, clean: 2 }, garden: { clean: 6 } } },
  },
  alpaca: {
    id: "alpaca", label: "Wolke", species: "Alpaca", icon: "W",
    phrase: "Wolke and I are comparing fluffiness. It remains a draw.",
    personality: "Unhurried, cuddly and gifted at finding the soft landing.",
    trait: { id: "soft_landing", label: "Soft landing", detail: "Takes the hard edge off hunger and exhaustion.", effects: { travel: { energy: 6, satiety: 3 }, meadow: { satiety: 7, fun: 2 }, garden: { energy: 7 } } },
  },
  goose: {
    id: "goose", label: "Greta", species: "Goose", icon: "G",
    phrase: "Greta walks through the Kennel Club with very important little steps.",
    personality: "Bold, bossy and absolutely certain she knows the way.",
    trait: { id: "bold_lead", label: "Bold lead", detail: "Finds bolder routes and brings a little extra experience home.", effects: { travel: { curiosity: 4, xp: 3 }, meadow: { fun: 4, xp: 2 }, garden: { curiosity: 4, xp: 3 } } },
  },
});

const FRIEND_COPY_DE = Object.freeze({
  chicken: { species: "Huhn", phrase: "Hilda prüft jede Ecke in der Play Area. Ihr entgeht nichts.", personality: "Scharfäugig, flott und auf sehr charmante Weise neugierig.", traitLabel: "Scharfer Blick", traitDetail: "Entdeckt mehr, besonders in der Play Area." },
  rabbit: { species: "Hase", phrase: "Fips ist zum Herumhüpfen vorbeigekommen. Ich versuche mitzuhalten.", personality: "Rastlos, verspielt und jederzeit bereit für eine Extrarunde.", traitLabel: "Zweite Luft", traitDetail: "Hält das Tempo hoch und macht aus Anstrengung mehr Spaß." },
  duck: { species: "Ente", phrase: "Lotte erzählt die lautesten und freundlichsten Geschichten im ganzen Pack.", personality: "Redselig, herzlich und unfähig, einen Raum still zu lassen.", traitLabel: "Sozialer Funke", traitDetail: "Macht jeden Ausflug verbundener und lebendiger." },
  hedgehog: { species: "Igel", phrase: "Piek ist heute zu Besuch. Umarmungen brauchen besonders vorsichtigen Konsens.", personality: "Trocken im Humor, aufmerksam und wunderbar klar bei Grenzen.", traitLabel: "Sanfte Grenzen", traitDetail: "Hält intensive Pläne geerdet, sauberer und weniger kräftezehrend." },
  alpaca: { species: "Alpaka", phrase: "Wolke und ich vergleichen unsere Flauschigkeit. Es bleibt unentschieden.", personality: "Unaufgeregt, kuschelig und begabt darin, weich zu landen.", traitLabel: "Weiche Landung", traitDetail: "Nimmt Hunger und Erschöpfung die harte Kante." },
  goose: { species: "Gans", phrase: "Greta läuft mit sehr wichtigen kleinen Schritten durch den Kennel Club.", personality: "Mutig, bossy und vollkommen sicher, den Weg zu kennen.", traitLabel: "Klare Führung", traitDetail: "Findet mutigere Wege und bringt etwas Extra-Erfahrung mit heim." },
});

export function localizedFriend(friend, language = "en") {
  if (!friend || language !== "de") return friend;
  const copy = FRIEND_COPY_DE[friend.id];
  return copy ? {
    ...friend,
    species: copy.species,
    phrase: copy.phrase,
    personality: copy.personality,
    trait: { ...friend.trait, label: copy.traitLabel, detail: copy.traitDetail },
  } : friend;
}

export const CROPS = Object.freeze({
  carrot: { id: "carrot", label: "Gartenkarotte", seedLabel: "Karottensamen", icon: "▲", growMs: 2 * MINUTE, yield: 2, food: { satiety: 19, fun: 3, curiosity: 2, xp: 5, phrase: "Selbst angebaut schmeckt die Karotte doppelt knackig!" } },
  tomato: { id: "tomato", label: "Sonnentomate", seedLabel: "Tomatensamen", icon: "●", growMs: 4 * MINUTE, yield: 2, food: { satiety: 15, fun: 5, clean: -2, xp: 6, phrase: "Plopp – diese Tomate schmeckt nach Gartensonne!" } },
  cucumber: { id: "cucumber", label: "Gartengurke", seedLabel: "Gurkensamen", icon: "▰", growMs: 6 * MINUTE, yield: 3, food: { satiety: 13, fun: 9, social: 2, xp: 7, phrase: "KNACK! Fast so gut wie Gewürzgurke – und selbst gezogen!" } },
  pumpkin: { id: "pumpkin", label: "Minikürbis", seedLabel: "Kürbissamen", icon: "◉", growMs: 10 * MINUTE, yield: 2, food: { satiety: 23, curiosity: 5, xp: 8, phrase: "Unser eigener Kürbis! Der ist capygroßartig." } },
});

const CROP_COPY_EN = Object.freeze({
  carrot: ["Garden carrot", "Carrot seeds", "Homegrown carrots taste twice as crunchy!"],
  tomato: ["Sun tomato", "Tomato seeds", "Pop — this tomato tastes like garden sunshine!"],
  cucumber: ["Garden cucumber", "Cucumber seeds", "CRUNCH! Almost as good as a pickle — and homegrown!"],
  pumpkin: ["Mini pumpkin", "Pumpkin seeds", "Our very own pumpkin! That is capy-tastic."],
});

export function localizedCrop(crop, language = "en") {
  if (!crop || language === "de") return crop;
  const copy = CROP_COPY_EN[crop.id];
  return copy ? { ...crop, label: copy[0], seedLabel: copy[1], food: { ...crop.food, phrase: copy[2] } } : crop;
}

function seedNumber(value) {
  return [...String(value)].reduce((sum, character) => ((sum * 33) ^ character.charCodeAt(0)) >>> 0, 2_166_136_261);
}

function nextMoveDelay(seed, at, visits) {
  return (3 + (seedNumber(`${seed}:move:${at}:${visits}`) % 6)) * MINUTE;
}

const FRIEND_MEETING_COOLDOWN = 2 * 60 * MINUTE;
const FRIEND_ACTIVITY_TYPES = new Set(["travel", "meadow", "garden"]);

function cleanOriginLabel(value) {
  return Array.from(String(value || "").normalize("NFKC").replace(/[<>\u0000-\u001f]/g, "").trim()).slice(0, 64).join("");
}

function normalizeFriendOrigin(candidate, fallbackArea = null) {
  const origin = candidate && typeof candidate === "object" ? candidate : {};
  const kind = origin.kind === "travel" ? "travel" : origin.kind === "world" ? "world" : "unknown";
  return {
    kind,
    area: WORLD_AREAS[origin.area] ? origin.area : (kind === "world" && WORLD_AREAS[fallbackArea] ? fallbackArea : null),
    destinationId: kind === "travel" && typeof origin.destinationId === "string" ? cleanOriginLabel(origin.destinationId) : null,
    label: cleanOriginLabel(origin.label),
  };
}

function normalizeFriendRecord(candidate, legacyAt = 0, fallbackArea = null) {
  const record = candidate && typeof candidate === "object" ? candidate : {};
  const firstMetAt = Math.max(0, Number(record.firstMetAt) || Number(legacyAt) || 0);
  const lastMetAt = Math.max(firstMetAt, Number(record.lastMetAt) || firstMetAt);
  return {
    firstMetAt,
    lastMetAt,
    meetings: Math.max(firstMetAt || lastMetAt ? 1 : 0, Math.floor(Number(record.meetings) || 0)),
    origin: normalizeFriendOrigin(record.origin, fallbackArea),
    tripsTogether: Math.max(0, Math.floor(Number(record.tripsTogether) || 0)),
    sessionsTogether: {
      meadow: Math.max(0, Math.floor(Number(record.sessionsTogether?.meadow) || 0)),
      garden: Math.max(0, Math.floor(Number(record.sessionsTogether?.garden) || 0)),
    },
    lastTogetherAt: Math.max(0, Number(record.lastTogetherAt) || 0),
  };
}

function friendRecordsFrom(candidate, metFriendIds, fallbackArea) {
  const source = candidate?.friendRecords && typeof candidate.friendRecords === "object" ? candidate.friendRecords : {};
  return Object.fromEntries(metFriendIds.map((id) => [id, normalizeFriendRecord(source[id], candidate?.friendMetAt?.[id], fallbackArea)]));
}

export function createWorld(now = Date.now(), area = "home", seed = "capy") {
  return {
    version: 4,
    area: WORLD_AREAS[area] ? area : "home",
    movedAt: now,
    nextMoveAt: now + nextMoveDelay(seed, now, 0),
    friendId: null,
    friendUntil: 0,
    visits: 0,
    metFriendIds: [],
    friendMetAt: {},
    friendRecords: {},
    activity: null,
    socialGlowUntil: 0,
    pineappleUntil: 0,
  };
}

export function normalizeWorld(candidate, now = Date.now(), seed = "capy") {
  const base = createWorld(now, candidate?.area, seed);
  const metFriendIds = [...new Set([
    ...(Array.isArray(candidate?.metFriendIds) ? candidate.metFriendIds : []),
    ...Object.keys(candidate?.friendMetAt && typeof candidate.friendMetAt === "object" ? candidate.friendMetAt : {}),
    ...Object.keys(candidate?.friendRecords && typeof candidate.friendRecords === "object" ? candidate.friendRecords : {}),
  ].filter((id) => ANIMAL_FRIENDS[id]))];
  const world = candidate && typeof candidate === "object" ? {
    ...base,
    ...candidate,
    version: 4,
    area: WORLD_AREAS[candidate.area] ? candidate.area : "home",
    movedAt: Math.max(0, Number(candidate.movedAt) || now),
    nextMoveAt: Math.max(now - 24 * 60 * MINUTE, Number(candidate.nextMoveAt) || base.nextMoveAt),
    friendId: ANIMAL_FRIENDS[candidate.friendId] ? candidate.friendId : null,
    friendUntil: Math.max(0, Number(candidate.friendUntil) || 0),
    visits: Math.max(0, Number(candidate.visits) || 0),
    metFriendIds,
    friendMetAt: Object.fromEntries(metFriendIds.map((id) => [id, Math.max(0, Number(candidate.friendMetAt?.[id]) || Number(candidate.friendRecords?.[id]?.firstMetAt) || 0)])),
    friendRecords: friendRecordsFrom(candidate, metFriendIds, candidate.area),
    activity: candidate.activity && ["meadow", "garden"].includes(candidate.activity.area)
      ? {
          area: candidate.activity.area,
          startedAt: Math.max(0, Number(candidate.activity.startedAt) || now),
          returnsAt: Math.max(now - 24 * 60 * MINUTE, Number(candidate.activity.returnsAt) || now),
          secretBonus: SECRET_BONUSES.has(candidate.activity.secretBonus) ? candidate.activity.secretBonus : null,
          companionId: metFriendIds.includes(candidate.activity.companionId) && ANIMAL_FRIENDS[candidate.activity.companionId] ? candidate.activity.companionId : null,
        }
      : null,
    socialGlowUntil: Math.max(0, Number(candidate.socialGlowUntil) || 0),
    pineappleUntil: Math.max(0, Number(candidate.pineappleUntil) || 0),
  } : base;

  let loops = 0;
  while (!world.activity && now >= world.nextMoveAt && loops < 96) {
    const movedAt = world.nextMoveAt;
    const areaIds = Object.keys(WORLD_AREAS).filter((id) => id !== world.area);
    const value = seedNumber(`${seed}:area:${movedAt}:${world.visits}`);
    world.area = areaIds[value % areaIds.length];
    world.movedAt = movedAt;
    world.visits += 1;
    const friends = Object.keys(ANIMAL_FRIENDS);
    world.friendId = value % 3 === 0 ? null : friends[(value >>> 4) % friends.length];
    world.friendUntil = world.friendId ? movedAt + (90 + (value % 121)) * 1000 : 0;
    world.nextMoveAt = movedAt + nextMoveDelay(seed, movedAt, world.visits);
    loops += 1;
  }
  if (loops >= 96 && now >= world.nextMoveAt) {
    world.nextMoveAt = now + nextMoveDelay(seed, now, world.visits);
    world.movedAt = now;
  }
  if (world.friendUntil <= now) {
    world.friendId = null;
    world.friendUntil = 0;
  }
  return world;
}

export function selectWorldArea(candidate, area, now = Date.now(), seed = "capy") {
  const world = normalizeWorld(candidate, now, seed);
  if (world.activity || !WORLD_AREAS[area] || area === world.area) return world;
  return {
    ...world,
    area,
    movedAt: now,
    nextMoveAt: Math.max(world.nextMoveAt, now + 5 * MINUTE),
    friendId: null,
    friendUntil: 0,
  };
}

export function recordFriendMeeting(candidate, friendId, now = Date.now(), seed = "capy", context = {}) {
  const world = normalizeWorld(candidate, now, seed);
  if (!ANIMAL_FRIENDS[friendId]) return world;
  const previous = world.friendRecords[friendId] || null;
  const sameEncounter = Boolean(previous?.lastMetAt && now - previous.lastMetAt < FRIEND_MEETING_COOLDOWN);
  const firstMetAt = previous?.firstMetAt || now;
  const origin = previous?.origin?.kind && previous.origin.kind !== "unknown"
    ? previous.origin
    : normalizeFriendOrigin({
        kind: context.kind === "travel" ? "travel" : "world",
        area: context.area || world.area,
        destinationId: context.destinationId,
        label: context.label,
      }, world.area);
  const record = {
    ...(previous || normalizeFriendRecord(null)),
    firstMetAt,
    lastMetAt: sameEncounter ? previous.lastMetAt : now,
    meetings: Math.max(1, Number(previous?.meetings) || 0) + (previous && !sameEncounter ? 1 : 0),
    origin,
  };
  return {
    ...world,
    metFriendIds: [...new Set([...world.metFriendIds, friendId])],
    friendMetAt: { ...world.friendMetAt, [friendId]: firstMetAt },
    friendRecords: { ...world.friendRecords, [friendId]: record },
  };
}

export function recordFriendCompanionActivity(candidate, friendId, activity, now = Date.now(), seed = "capy") {
  let world = normalizeWorld(candidate, now, seed);
  if (!ANIMAL_FRIENDS[friendId] || !FRIEND_ACTIVITY_TYPES.has(activity) || !world.metFriendIds.includes(friendId)) return world;
  const previous = world.friendRecords[friendId] || normalizeFriendRecord(null, world.friendMetAt[friendId]);
  const record = {
    ...previous,
    tripsTogether: previous.tripsTogether + (activity === "travel" ? 1 : 0),
    sessionsTogether: {
      ...previous.sessionsTogether,
      ...(activity === "meadow" ? { meadow: previous.sessionsTogether.meadow + 1 } : {}),
      ...(activity === "garden" ? { garden: previous.sessionsTogether.garden + 1 } : {}),
    },
    lastTogetherAt: now,
  };
  world = { ...world, friendRecords: { ...world.friendRecords, [friendId]: record } };
  return world;
}

function relationshipFor(record, language = "en") {
  const score = Math.max(1, Number(record?.meetings) || 1)
    + Math.max(0, Number(record?.tripsTogether) || 0) * 2
    + Math.max(0, Number(record?.sessionsTogether?.meadow) || 0) * 2
    + Math.max(0, Number(record?.sessionsTogether?.garden) || 0) * 2;
  const tiers = language === "de"
    ? [[10, "Herzensfreund"], [6, "Packfreund"], [3, "Vertrautes Gesicht"], [1, "Neue Bekanntschaft"]]
    : [[10, "Close companion"], [6, "Pack mate"], [3, "Friendly regular"], [1, "New acquaintance"]];
  const [threshold, label] = tiers.find(([minimum]) => score >= minimum) || tiers.at(-1);
  return { score, tier: threshold, label };
}

export function friendBookEntry(candidate, friendId, language = "en", now = Date.now(), seed = "capy") {
  const world = normalizeWorld(candidate, now, seed);
  const friend = localizedFriend(ANIMAL_FRIENDS[friendId], language);
  const met = Boolean(friend && world.metFriendIds.includes(friendId));
  const record = met ? world.friendRecords[friendId] || normalizeFriendRecord(null, world.friendMetAt[friendId]) : null;
  return friend ? { met, friend, record, relationship: met ? relationshipFor(record, language) : null } : null;
}

export function availableCompanions(candidate, language = "en", now = Date.now(), seed = "capy") {
  const world = normalizeWorld(candidate, now, seed);
  return world.metFriendIds
    .map((friendId) => friendBookEntry(world, friendId, language, now, seed))
    .filter((entry) => entry?.met);
}

export function companionActivityEffect(friendId, activity, progress = 1, language = "en") {
  const friend = localizedFriend(ANIMAL_FRIENDS[friendId], language);
  if (!friend || !FRIEND_ACTIVITY_TYPES.has(activity)) return null;
  const scale = Math.max(0, Math.min(1, Number(progress) || 0));
  const rawChanges = friend.trait.effects[activity] || {};
  const changes = Object.fromEntries(Object.entries(rawChanges).map(([key, value]) => [key, Math.round(value * scale)]).filter(([, value]) => value !== 0));
  return { friendId, activity, trait: friend.trait, changes };
}

export function prepareWorldActivity(candidate, preparation, now = Date.now(), seed = "capy") {
  const world = normalizeWorld(candidate, now, seed);
  if (preparation !== "pineapple") return world;
  return { ...world, pineappleUntil: now + PINEAPPLE_PREP_WINDOW };
}

export function startWorldActivity(candidate, area, now = Date.now(), seed = "capy", context = {}) {
  const world = normalizeWorld(candidate, now, seed);
  if (world.activity || !["meadow", "garden"].includes(area)) return { world, started: false };
  const companionId = ANIMAL_FRIENDS[context.companionId] && world.metFriendIds.includes(context.companionId) ? context.companionId : null;
  const secretBonus = area === "garden" && world.pineappleUntil > now
    ? "pineapple"
    : area === "meadow" && Number(context.clean) >= 99.5 ? "spotless" : null;
  return {
    started: true,
    world: {
      ...world,
      area,
      movedAt: now,
      friendId: null,
      friendUntil: 0,
      activity: { area, startedAt: now, returnsAt: now + 40 * MINUTE, secretBonus, companionId },
      nextMoveAt: Math.max(world.nextMoveAt, now + 45 * MINUTE),
      pineappleUntil: secretBonus === "pineapple" ? 0 : world.pineappleUntil,
    },
  };
}

export function settleWorldActivity(candidate, now = Date.now(), seed = "capy") {
  const world = normalizeWorld(candidate, now, seed);
  if (!world.activity || now < world.activity.returnsAt) return { world, completion: null };
  const completion = { ...world.activity };
  return {
    completion,
    world: {
      ...world,
      area: "home",
      movedAt: now,
      nextMoveAt: now + nextMoveDelay(seed, now, world.visits),
      activity: null,
      socialGlowUntil: completion.area === "meadow" ? now + (completion.secretBonus === "spotless" ? 4 : 2) * 60 * MINUTE : world.socialGlowUntil,
    },
  };
}

export function recallWorldActivity(candidate, now = Date.now(), seed = "capy") {
  const world = normalizeWorld(candidate, now, seed);
  if (!world.activity) return { world, completion: null };
  const activity = { ...world.activity };
  const duration = Math.max(1, activity.returnsAt - activity.startedAt);
  const progress = Math.max(0, Math.min(1, (now - activity.startedAt) / duration));
  return {
    completion: { ...activity, recalled: true, progress },
    world: {
      ...world,
      area: "home",
      movedAt: now,
      nextMoveAt: now + nextMoveDelay(seed, now, world.visits),
      activity: null,
    },
  };
}

export function worldActivityTimeLabel(candidate, now = Date.now(), language = "de", seed = "capy") {
  const activity = normalizeWorld(candidate, now, seed).activity;
  if (!activity) return "";
  const minutes = Math.max(1, Math.ceil((activity.returnsAt - now) / MINUTE));
  return language === "de" ? `NOCH ${minutes} MIN.` : `${minutes} MIN LEFT`;
}

export function createGarden() {
  return {
    version: 1,
    selectedCrop: "carrot",
    seeds: { carrot: 3, tomato: 3, cucumber: 3, pumpkin: 2 },
    harvest: { carrot: 0, tomato: 0, cucumber: 0, pumpkin: 0 },
    plots: [null, null, null, null],
    totalHarvests: 0,
  };
}

export function normalizeGarden(candidate) {
  const base = createGarden();
  if (!candidate || typeof candidate !== "object") return base;
  const counts = (source, fallback) => Object.fromEntries(Object.keys(CROPS).map((id) => [id, Math.max(0, Math.floor(Number(source?.[id]) || fallback[id] || 0))]));
  const plots = Array.from({ length: 4 }, (_, index) => {
    const plot = candidate.plots?.[index];
    if (!plot || !CROPS[plot.cropId]) return null;
    const plantedAt = Math.max(0, Number(plot.plantedAt) || 0);
    return {
      cropId: plot.cropId,
      plantedAt,
      readyAt: Math.max(plantedAt + 1000, Number(plot.readyAt) || plantedAt + CROPS[plot.cropId].growMs),
      watered: Boolean(plot.watered),
    };
  });
  return {
    version: 1,
    selectedCrop: CROPS[candidate.selectedCrop] ? candidate.selectedCrop : "carrot",
    seeds: counts(candidate.seeds, base.seeds),
    harvest: counts(candidate.harvest, base.harvest),
    plots,
    totalHarvests: Math.max(0, Math.floor(Number(candidate.totalHarvests) || 0)),
  };
}

export function selectCrop(candidate, cropId) {
  const garden = normalizeGarden(candidate);
  return CROPS[cropId] ? { ...garden, selectedCrop: cropId } : garden;
}

export function plantCrop(candidate, plotIndex, now = Date.now()) {
  const garden = normalizeGarden(candidate);
  const crop = CROPS[garden.selectedCrop];
  if (!crop || garden.plots[plotIndex] || garden.seeds[crop.id] < 1) return { garden, planted: false };
  const plots = [...garden.plots];
  plots[plotIndex] = { cropId: crop.id, plantedAt: now, readyAt: now + crop.growMs, watered: false };
  return {
    planted: true,
    crop,
    garden: { ...garden, plots, seeds: { ...garden.seeds, [crop.id]: garden.seeds[crop.id] - 1 } },
  };
}

export function waterCrop(candidate, plotIndex, now = Date.now()) {
  const garden = normalizeGarden(candidate);
  const plot = garden.plots[plotIndex];
  if (!plot || plot.watered || now >= plot.readyAt) return { garden, watered: false };
  const plots = [...garden.plots];
  plots[plotIndex] = { ...plot, watered: true, readyAt: now + Math.max(15_000, (plot.readyAt - now) * 0.6) };
  return { garden: { ...garden, plots }, watered: true };
}

export function harvestCrop(candidate, plotIndex, now = Date.now()) {
  const garden = normalizeGarden(candidate);
  const plot = garden.plots[plotIndex];
  if (!plot || now < plot.readyAt) return { garden, harvested: false };
  const crop = CROPS[plot.cropId];
  const amount = crop.yield + (plot.watered ? 1 : 0);
  const plots = [...garden.plots];
  plots[plotIndex] = null;
  return {
    harvested: true,
    crop,
    amount,
    garden: {
      ...garden,
      plots,
      seeds: { ...garden.seeds, [crop.id]: garden.seeds[crop.id] + 1 },
      harvest: { ...garden.harvest, [crop.id]: garden.harvest[crop.id] + amount },
      totalHarvests: garden.totalHarvests + 1,
    },
  };
}

export function consumeHarvest(candidate, cropId) {
  const garden = normalizeGarden(candidate);
  if (!CROPS[cropId] || garden.harvest[cropId] < 1) return { garden, consumed: false };
  return { garden: { ...garden, harvest: { ...garden.harvest, [cropId]: garden.harvest[cropId] - 1 } }, consumed: true };
}

export function cropProgress(plot, now = Date.now()) {
  if (!plot) return 0;
  const duration = Math.max(1, plot.readyAt - plot.plantedAt);
  return Math.max(0, Math.min(100, ((now - plot.plantedAt) / duration) * 100));
}

export function cropTimeLabel(plot, now = Date.now(), language = "de") {
  const en = language === "en";
  if (!plot) return en ? "EMPTY PLOT" : "FREIES BEET";
  if (now >= plot.readyAt) return en ? "READY TO HARVEST" : "ERNTEREIF";
  const seconds = Math.max(1, Math.ceil((plot.readyAt - now) / 1000));
  if (seconds < 60) return en ? `${seconds} SEC LEFT` : `NOCH ${seconds} SEK.`;
  return en ? `${Math.ceil(seconds / 60)} MIN LEFT` : `NOCH ${Math.ceil(seconds / 60)} MIN.`;
}

export function travelCompanion(world, seed = "capy") {
  if (world?.friendId && ANIMAL_FRIENDS[world.friendId]) return world.friendId;
  const value = seedNumber(`${seed}:companion`);
  if (value % 3 === 0) return null;
  const ids = Object.keys(ANIMAL_FRIENDS);
  return ids[(value >>> 3) % ids.length];
}

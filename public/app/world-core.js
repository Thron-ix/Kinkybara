const MINUTE = 60_000;

export const WORLD_AREAS = Object.freeze({
  home: { id: "home", label: "THE DEN", short: "DEN", icon: "⌂" },
  meadow: { id: "meadow", label: "KENNEL CLUB", short: "KENNEL", icon: "K" },
  garden: { id: "garden", label: "PLAY AREA", short: "PLAY AREA", icon: "P" },
  wintergarden: { id: "wintergarden", label: "PACK LOUNGE", short: "LOUNGE", icon: "L" },
});

export const ANIMAL_FRIENDS = Object.freeze({
  chicken: { id: "chicken", label: "Hilda", icon: "H", phrase: "Hilda checks every corner of the Play Area. Nothing escapes her." },
  rabbit: { id: "rabbit", label: "Fips", icon: "F", phrase: "Fips came over for a bounce. I am doing my best to keep up." },
  duck: { id: "duck", label: "Lotte", icon: "L", phrase: "Lotte tells the loudest and friendliest stories in the whole pack." },
  hedgehog: { id: "hedgehog", label: "Piek", icon: "P", phrase: "Piek is visiting today. Hugs require particularly careful consent." },
  alpaca: { id: "alpaca", label: "Wolke", icon: "W", phrase: "Wolke and I are comparing fluffiness. It remains a draw." },
  goose: { id: "goose", label: "Greta", icon: "G", phrase: "Greta walks through the Kennel Club with very important little steps." },
});

const FRIEND_COPY_DE = Object.freeze({
  chicken: "Hilda prüft jede Ecke in der Play Area. Ihr entgeht nichts.",
  rabbit: "Fips ist zum Herumhüpfen vorbeigekommen. Ich versuche mitzuhalten.",
  duck: "Lotte erzählt die lautesten und freundlichsten Geschichten im ganzen Pack.",
  hedgehog: "Piek ist heute zu Besuch. Umarmungen brauchen besonders vorsichtigen Konsens.",
  alpaca: "Wolke und ich vergleichen unsere Flauschigkeit. Es bleibt unentschieden.",
  goose: "Greta läuft mit sehr wichtigen kleinen Schritten durch den Kennel Club.",
});

export function localizedFriend(friend, language = "en") {
  return friend && language === "de" ? { ...friend, phrase: FRIEND_COPY_DE[friend.id] || friend.phrase } : friend;
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

export function createWorld(now = Date.now(), area = "home", seed = "capy") {
  return {
    version: 2,
    area: WORLD_AREAS[area] ? area : "home",
    movedAt: now,
    nextMoveAt: now + nextMoveDelay(seed, now, 0),
    friendId: null,
    friendUntil: 0,
    visits: 0,
    metFriendIds: [],
    friendMetAt: {},
    activity: null,
    socialGlowUntil: 0,
  };
}

export function normalizeWorld(candidate, now = Date.now(), seed = "capy") {
  const base = createWorld(now, candidate?.area, seed);
  const world = candidate && typeof candidate === "object" ? {
    ...base,
    ...candidate,
    version: 2,
    area: WORLD_AREAS[candidate.area] ? candidate.area : "home",
    movedAt: Math.max(0, Number(candidate.movedAt) || now),
    nextMoveAt: Math.max(now - 24 * 60 * MINUTE, Number(candidate.nextMoveAt) || base.nextMoveAt),
    friendId: ANIMAL_FRIENDS[candidate.friendId] ? candidate.friendId : null,
    friendUntil: Math.max(0, Number(candidate.friendUntil) || 0),
    visits: Math.max(0, Number(candidate.visits) || 0),
    metFriendIds: [...new Set(Array.isArray(candidate.metFriendIds) ? candidate.metFriendIds.filter((id) => ANIMAL_FRIENDS[id]) : [])],
    friendMetAt: candidate.friendMetAt && typeof candidate.friendMetAt === "object" ? Object.fromEntries(Object.entries(candidate.friendMetAt).filter(([id]) => ANIMAL_FRIENDS[id])) : {},
    activity: candidate.activity && ["meadow", "garden"].includes(candidate.activity.area)
      ? { area: candidate.activity.area, startedAt: Math.max(0, Number(candidate.activity.startedAt) || now), returnsAt: Math.max(now - 24 * 60 * MINUTE, Number(candidate.activity.returnsAt) || now) }
      : null,
    socialGlowUntil: Math.max(0, Number(candidate.socialGlowUntil) || 0),
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

export function recordFriendMeeting(candidate, friendId, now = Date.now(), seed = "capy") {
  const world = normalizeWorld(candidate, now, seed);
  if (!ANIMAL_FRIENDS[friendId]) return world;
  return {
    ...world,
    metFriendIds: [...new Set([...world.metFriendIds, friendId])],
    friendMetAt: { ...world.friendMetAt, [friendId]: now },
  };
}

export function startWorldActivity(candidate, area, now = Date.now(), seed = "capy") {
  const world = normalizeWorld(candidate, now, seed);
  if (world.activity || !["meadow", "garden"].includes(area)) return { world, started: false };
  return {
    started: true,
    world: {
      ...world,
      area,
      movedAt: now,
      friendId: null,
      friendUntil: 0,
      activity: { area, startedAt: now, returnsAt: now + 40 * MINUTE },
      nextMoveAt: Math.max(world.nextMoveAt, now + 45 * MINUTE),
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
      socialGlowUntil: completion.area === "meadow" ? now + 2 * 60 * MINUTE : world.socialGlowUntil,
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

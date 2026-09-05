import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  ACCENT_COLORS,
  FOODS,
  absenceReport,
  addMemory,
  advanceState,
  applyChanges,
  cleanName,
  FOOD_MARKET_GROUPS,
  FOOD_MARKET_WINDOW_MS,
  foodAvailability,
  foodMarketRotation,
  growthFor,
  levelInfo,
  makeState,
  moodFor,
  normalizeState,
  statusPhrase,
} from "../public/app/game-core.js";
import { DIALOGUES, dialogueFor } from "../public/app/dialogues.js";
import { CAPY_HEIGHT, CAPY_PIXELS, CAPY_WIDTH } from "../public/app/pet-art.js";
import {
  LIBRARY_KEY,
  activeProfile,
  addProfile,
  emptyLibrary,
  normalizeLibrary,
  removeProfile,
  selectProfile,
  updateProfile,
} from "../public/app/pet-library.js";
import {
  QUEST_DEFINITIONS,
  activateQuest,
  completeQuest,
  currentQuest,
  dailyQuestQueue,
  normalizeQuestProgress,
  questIsDue,
  recordQuestAction,
  taskQuestComplete,
} from "../public/app/quest-core.js";
import {
  TRAVEL_DESTINATIONS,
  departNow,
  destinationById,
  isTraveling,
  normalizeTravel,
  recallTravel,
  travelProgress,
} from "../public/app/travel-core.js";
import {
  EQUIPMENT_SLOTS,
  ITEM_DEFINITIONS,
  addInventoryItem,
  createInventory,
  normalizeInventory,
  rewardForDestination,
  toggleEquipment,
  togglePlacedItem,
} from "../public/app/inventory-core.js";
import {
  ANIMAL_FRIENDS,
  CROPS,
  WORLD_AREAS,
  availableCompanions,
  companionActivityEffect,
  consumeHarvest,
  createGarden,
  createWorld,
  friendBookEntry,
  harvestCrop,
  normalizeWorld,
  prepareWorldActivity,
  recordFriendCompanionActivity,
  recordFriendMeeting,
  recallWorldActivity,
  selectWorldArea,
  settleWorldActivity,
  startWorldActivity,
  plantCrop,
  selectCrop,
  travelCompanion,
  waterCrop,
} from "../public/app/world-core.js";
import { localAmbience } from "../public/app/weather.js";
import { PACK_CARD_DECK, PACK_CARD_DIFFICULTIES, choosePackCardRival, resolvePackCardRound } from "../public/app/pack-cards.js";

function contrastRatio(foreground, background) {
  const luminance = (hex) => {
    const value = hex.replace("#", "");
    const normalized = value.length === 3 ? [...value].map((part) => part + part).join("") : value;
    const channels = [0, 2, 4].map((index) => Number.parseInt(normalized.slice(index, index + 2), 16) / 255);
    const linear = channels.map((channel) => channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4);
    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
  };
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("semantic text colors remain readable without signature colors", () => {
  const pairs = [
    ["#ffffff", "#302235"],
    ["#251c27", "#f4edf1"],
    ["#584a54", "#f4edf1"],
    ["#61545c", "#f4edf1"],
    ["#5b4e56", "#ffffff"],
    ["#3d343a", "#d8d1d5"],
    ["#5d5359", "#f0ebee"],
    ["#ffffff", "#5a5056"],
    ["#251c27", "#dff3bc"],
    ["#51464d", "#d8d1d5"],
  ];
  for (const [foreground, background] of pairs) {
    assert.ok(contrastRatio(foreground, background) >= 4.5, `${foreground} on ${background} must reach 4.5:1`);
  }
});

test("six needs continue changing while the app is closed", () => {
  const start = Date.UTC(2026, 7, 21, 12);
  const state = makeState(start, "Nox");
  const later = advanceState(state, start + 3_600_000);

  assert.equal(later.satiety, 77.8);
  assert.equal(later.fun, 74.9);
  assert.equal(later.clean, 87.9);
  assert.equal(later.energy, 85.2);
  assert.equal(later.social, 81.6);
  assert.equal(later.curiosity, 74.3);
});

test("sleep restores energy and slows all other needs", () => {
  const start = Date.UTC(2026, 7, 21, 12);
  const state = { ...makeState(start), sleeping: true, energy: 40 };
  const later = advanceState(state, start + 2 * 3_600_000);

  assert.equal(later.energy, 70);
  assert.equal(later.satiety, 77.6);
  assert.equal(later.fun, 77);
  assert.equal(later.social, 82.8);
  assert.equal(later.curiosity, 75.4);
});

test("absence report explains offline progress without killing the pet", () => {
  const start = Date.UTC(2026, 7, 21, 12);
  const report = absenceReport(makeState(start), start + 6 * 3_600_000);

  assert.equal(report.elapsedMs, 6 * 3_600_000);
  assert.ok(report.changes.satiety < 0);
  assert.ok(report.state.satiety >= 0);
  assert.equal(report.state.version, 7);
});

test("interactions stay within healthy stat limits", () => {
  const state = { ...makeState(1), satiety: 98, fun: 2, social: 99 };
  const changed = applyChanges(state, { satiety: 20, fun: -12, social: 9, xp: 5 }, 1);

  assert.equal(changed.satiety, 100);
  assert.equal(changed.fun, 0);
  assert.equal(changed.social, 100);
  assert.equal(changed.xp, 5);
});

test("casual pet taps stay cosmetic and cannot farm saved progress", async () => {
  const app = await readFile(new URL("../public/app/app.js", import.meta.url), "utf8");
  const petTapHandler = app.match(/function petCapy\(event\) \{[\s\S]*?\n\}\n\nfunction spawnHeart/)?.[0] || "";

  assert.match(petTapHandler, /petTapCount \+= 1/);
  assert.match(petTapHandler, /animateCapy\("is-loved"/);
  assert.match(petTapHandler, /spawnHeart\(event\)/);
  assert.doesNotMatch(petTapHandler, /awardChanges|remember\(|addMemory|trackQuestAction|pendingQuestAction|render\(\)|state\.(?:xp|interactions)/);
});

test("departures and area-session starts do not grant repeatable start XP", async () => {
  const app = await readFile(new URL("../public/app/app.js", import.meta.url), "utf8");
  const journeyStart = app.match(/function startManualJourney\(\) \{[\s\S]*?\n\}\n\nfunction recallFromParty/)?.[0] || "";
  const areaStart = app.match(/function startAreaStay\([^)]*\) \{[\s\S]*?\n\}\n\nfunction recallAreaStay/)?.[0] || "";

  assert.match(journeyStart, /departNow/);
  assert.match(areaStart, /startWorldActivity/);
  assert.doesNotMatch(journeyStart, /awardChanges/);
  assert.doesNotMatch(areaStart, /awardChanges/);
});

test("pet state remains valid, names stay compact, and Thron is the default", () => {
  const state = normalizeState({ version: 1, name: "  Frau   Flauschpfote mit Hut  ", satiety: 900, fun: -20 }, 12);
  assert.equal(state.name, cleanName("Frau Flauschpfote mit Hut"));
  assert.ok(state.name.length <= 14);
  assert.equal(state.satiety, 100);
  assert.equal(state.fun, 0);
  assert.equal(state.version, 7);
  assert.equal(state.social, 84);
  assert.equal(makeState(1).name, "Thron");
  assert.equal(makeState(1).language, "en");
  assert.equal(Object.keys(ACCENT_COLORS).length, 8);
  const customized = makeState(1, "Nox", "classic", { language: "de", primaryAccent: "black", secondaryAccent: "white" });
  assert.equal(customized.language, "de");
  assert.equal(customized.primaryAccent, "black");
  assert.equal(customized.secondaryAccent, "white");
  assert.ok(ACCENT_COLORS.black);
  assert.ok(ACCENT_COLORS.white);
  assert.equal(makeState(1, "Goldie", "golden").furVariant, "golden");
  assert.equal(normalizeState({ furVariant: "unknown" }, 12).furVariant, "classic");
  const hostileName = cleanName('  <img src=x onerror="open(1)"> Nox & Co  ');
  assert.doesNotMatch(hostileName, /[<>&"'`=]/);
  assert.ok(hostileName.length <= 14);
  const sanitizedMemory = normalizeState({ memories: [{ icon: "<b>", text: "hello <script>alert(1)</script> & bye" }] }, 12).memories[0];
  assert.doesNotMatch(sanitizedMemory.icon, /[<>&]/);
  assert.doesNotMatch(sanitizedMemory.text, /[<>&]/);
});

test("the library keeps multiple independent capy saves and switches safely", () => {
  const nox = { ...makeState(100, "Nox", "classic"), satiety: 91 };
  const pino = { ...makeState(200, "Pino", "golden"), satiety: 23 };
  let library = addProfile(emptyLibrary(), nox, 100, "nox");
  library = addProfile(library, pino, 200, "pino");

  assert.equal(LIBRARY_KEY, "kinkybara-library-v1");
  assert.equal(library.profiles.length, 2);
  assert.equal(activeProfile(library, 200).state.name, "Pino");
  library = updateProfile(library, "pino", { ...pino, satiety: 55 }, 220);
  library = selectProfile(library, "nox", 220);
  assert.equal(activeProfile(library, 220).state.satiety, 91);
  assert.equal(library.profiles.find((profile) => profile.id === "pino").state.satiety, 55);
  library = removeProfile(library, "nox", 230);
  assert.equal(library.profiles.length, 1);
  assert.equal(library.activeId, "pino");
  assert.equal(normalizeLibrary({ ...library, activeId: "fehlt" }, 230).activeId, "pino");
});

test("mood, level, memories, and situation-aware phrases respond to care", () => {
  assert.equal(moodFor({ ...makeState(1), satiety: 4 }).tone, "urgent");
  assert.equal(moodFor({ ...makeState(1), sleeping: true }).tone, "sleeping");
  assert.equal(levelInfo(0).level, 1);
  assert.ok(levelInfo(220).level > 1);
  const remembered = addMemory(makeState(1), "Kinkybara hat Melone gegessen.", "♥", 2);
  assert.equal(remembered.memories.length, 1);
  assert.match(statusPhrase({ ...makeState(1), social: 4 }, Date.UTC(2026, 7, 21, 12)), /(Nähe|bei mir|vermiss|bleiben|an dich|lehnen|zusammen|Aufmerksamkeit)/i);
});

test("the finer capybara uses a consistent image-free pixel grid", () => {
  assert.equal(CAPY_WIDTH, 56);
  assert.equal(CAPY_HEIGHT, 34);
  assert.equal(CAPY_PIXELS.length, CAPY_HEIGHT);
  assert.ok(CAPY_PIXELS.every((row) => row.length === CAPY_WIDTH));
  assert.ok(CAPY_PIXELS.join("").includes("e"));
  assert.ok(CAPY_PIXELS.join("").includes("b"));
  assert.ok(CAPY_PIXELS.join("").includes("h"));
});

test("the pup hood uses high-resolution layered raster assets", async () => {
  for (const name of ["pup-hood-base.png", "pup-hood-primary-mask.png", "pup-hood-secondary-mask.png"]) {
    const image = await readFile(new URL(`../public/app/assets/${name}`, import.meta.url));
    assert.equal(image.subarray(1, 4).toString(), "PNG");
    assert.ok(image.readUInt32BE(16) >= 300);
    assert.ok(image.readUInt32BE(20) >= 300);
  }
});

test("growth follows levels without changing the saved pet identity", () => {
  assert.equal(growthFor({ ...makeState(1, "Nox"), xp: 0 }).id, "baby");
  assert.equal(growthFor({ ...makeState(1, "Nox"), xp: 22 * 5 ** 2 }).id, "grown");
  assert.equal(growthFor({ ...makeState(1, "Nox"), xp: 22 * 9 ** 2 }).id, "majestic");
});

test("pickles and onions are temporary foods with opposite emotional effects", () => {
  const state = makeState(Date.UTC(2026, 7, 22, 12), "Nox");
  const forcedPickle = foodAvailability("pickle", state, state.adoptedAt, "pickle-picnic");
  assert.equal(forcedPickle.available, true);
  assert.equal(forcedPickle.limited, true);
  const windows = Array.from({ length: 16 }, (_, index) => foodAvailability("onion", state, state.adoptedAt + index * 90 * 60_000));
  assert.ok(windows.some((entry) => entry.available));
  assert.ok(windows.some((entry) => !entry.available));
  const pickle = applyChanges(state, { satiety: 9, fun: 13 }, state.updatedAt);
  const onion = applyChanges(state, { satiety: 2, fun: -18 }, state.updatedAt);
  assert.ok(pickle.fun > state.fun);
  assert.ok(onion.fun < state.fun);
});

test("the food market always offers three staples and one juice per rotation", () => {
  const state = makeState(Date.UTC(2026, 7, 22, 12), "Nox");
  const seenStandards = new Set();
  const seenJuices = new Set();

  for (let index = 0; index < 18; index += 1) {
    const now = state.adoptedAt + index * FOOD_MARKET_WINDOW_MS;
    const rotation = foodMarketRotation(state, now);
    const available = Object.keys(FOODS).filter((key) => foodAvailability(key, state, now).available);
    const standards = available.filter((key) => FOOD_MARKET_GROUPS.standards.includes(key));
    const juices = available.filter((key) => FOOD_MARKET_GROUPS.juices.includes(key));
    const specials = available.filter((key) => FOOD_MARKET_GROUPS.specials.includes(key));

    assert.equal(standards.length, 3);
    assert.equal(new Set(standards).size, 3);
    assert.equal(juices.length, 1);
    assert.ok(specials.length <= 1);
    assert.deepEqual(new Set(available), new Set(rotation.availableKeys));
    standards.forEach((key) => seenStandards.add(key));
    juices.forEach((key) => seenJuices.add(key));
  }

  assert.deepEqual(seenStandards, new Set(FOOD_MARKET_GROUPS.standards));
  assert.deepEqual(seenJuices, new Set(FOOD_MARKET_GROUPS.juices));
});

test("temporary food highlights recur one at a time and quests reserve the pickle slot", () => {
  const state = makeState(Date.UTC(2026, 7, 22, 12), "Nox");
  const highlights = Array.from({ length: 24 }, (_, index) => foodMarketRotation(state, state.adoptedAt + index * FOOD_MARKET_WINDOW_MS).specialKey);
  assert.ok(highlights.includes(null));
  assert.ok(highlights.includes("pickle"));
  assert.ok(highlights.includes("onion"));

  const questRotation = foodMarketRotation(state, state.adoptedAt, "pickle-picnic");
  assert.equal(questRotation.specialKey, "pickle");
  assert.equal(foodAvailability("pickle", state, state.adoptedAt, "pickle-picnic").reason, "QUEST FIND");
  assert.equal(foodAvailability("onion", state, state.adoptedAt, "pickle-picnic").available, false);
});

test("autonomous trips are deterministic, visible for three to four hours, and return with a souvenir", () => {
  const adoptedAt = Date.UTC(2026, 7, 1, 9);
  const seed = "nox:reise";
  let travel = normalizeTravel(null, adoptedAt, adoptedAt, seed);
  const departure = travel.nextDepartureAt;
  travel = normalizeTravel(travel, adoptedAt, departure + 1, seed);
  assert.equal(isTraveling(travel, departure + 1), true);
  assert.ok(travel.returnsAt - travel.departedAt >= 180 * 60_000);
  assert.ok(travel.returnsAt - travel.departedAt <= 240 * 60_000);
  assert.ok(destinationById(travel.destinationId));
  assert.ok(travelProgress(travel, departure + 1) < 1);
  travel = normalizeTravel(travel, adoptedAt, travel.returnsAt + 1, seed);
  assert.equal(isTraveling(travel, travel.returnsAt + 1), false);
  assert.equal(travel.completedTrips, 1);
  assert.ok(travel.lastSouvenir);
  assert.ok(travel.nextDepartureAt - travel.lastReturnAt >= 6 * 60 * 60_000);
  assert.ok(travel.nextDepartureAt - travel.lastReturnAt <= 10 * 60 * 60_000);
  assert.ok(TRAVEL_DESTINATIONS.length >= 8);
});

test("an autonomous trip missed while closed starts visibly on reopen without catch-up loops", () => {
  const adoptedAt = Date.UTC(2026, 7, 1, 9);
  const seed = "nox:offline-auto";
  const initial = normalizeTravel(null, adoptedAt, adoptedAt, seed);
  const reopenedAt = initial.nextDepartureAt + 3 * 24 * 60 * 60_000;
  const reopened = normalizeTravel(initial, adoptedAt, reopenedAt, seed);

  assert.equal(reopened.status, "away");
  assert.equal(reopened.initiatedBy, "auto");
  assert.equal(reopened.departedAt, reopenedAt);
  assert.ok(reopened.returnsAt - reopenedAt >= 180 * 60_000);
  assert.ok(reopened.returnsAt - reopenedAt <= 240 * 60_000);
  assert.equal(reopened.completedTrips, 0);

  const stable = normalizeTravel(reopened, adoptedAt, reopenedAt + 1000, seed);
  assert.equal(stable.destinationId, reopened.destinationId);
  assert.equal(stable.departedAt, reopenedAt);
});

test("a player can send the Capy on a destination-blind surprise trip", () => {
  const now = Date.UTC(2026, 7, 29, 10);
  const travel = departNow(null, now, now, "nox:surprise");

  assert.equal(travel.status, "away");
  assert.equal(travel.initiatedBy, "player");
  assert.ok(destinationById(travel.destinationId));
  assert.ok(travel.returnsAt - travel.departedAt >= 120 * 60_000);
  assert.ok(travel.returnsAt - travel.departedAt <= 180 * 60_000);
  const stillAway = departNow(travel, now, now + 1, "nox:surprise");
  assert.equal(stillAway.destinationId, travel.destinationId);
  assert.equal(stillAway.departedAt, travel.departedAt);
  assert.equal(stillAway.returnsAt, travel.returnsAt);
});

test("a manual trip preserves a chosen friend or an explicit solo choice", () => {
  const now = Date.UTC(2026, 7, 29, 10);
  const chosen = departNow(null, now, now, "nox:chosen", { companionId: "hedgehog" });
  assert.equal(chosen.companionChoice, "chosen");
  assert.equal(chosen.companionId, "hedgehog");

  const solo = departNow(null, now, now, "nox:solo", { companionId: null });
  assert.equal(solo.companionChoice, "solo");
  assert.equal(solo.companionId, null);
});

test("a manual departure wins a race with a due autonomous departure", () => {
  const adoptedAt = Date.UTC(2026, 7, 29, 6);
  const seed = "nox:due-manual";
  const waiting = normalizeTravel(null, adoptedAt, adoptedAt, seed);
  const now = waiting.nextDepartureAt + 1;
  const travel = departNow(waiting, adoptedAt, now, seed, { companionId: "hedgehog" });

  assert.equal(travel.status, "away");
  assert.equal(travel.initiatedBy, "player");
  assert.equal(travel.companionChoice, "chosen");
  assert.equal(travel.companionId, "hedgehog");
  assert.ok(travel.returnsAt - travel.departedAt >= 120 * 60_000);
  assert.ok(travel.returnsAt - travel.departedAt <= 180 * 60_000);
});

test("an expired trip must settle before another manual departure", () => {
  const adoptedAt = Date.UTC(2026, 7, 29, 6);
  const seed = "nox:expired-manual";
  const departedAt = Date.UTC(2026, 7, 29, 10);
  const away = departNow(null, adoptedAt, departedAt, seed, { companionId: "hedgehog" });
  const afterReturn = away.returnsAt + 1;
  const pending = departNow(away, adoptedAt, afterReturn, seed, { companionId: null });

  assert.equal(pending.status, "home");
  assert.equal(pending.returnPending, true);
  assert.equal(pending.completedTrips, 1);
  assert.equal(pending.lastDestinationId, away.destinationId);
  assert.equal(pending.lastCompanionId, "hedgehog");
  assert.equal(pending.departedAt, 0);
});

test("a player can call the Kinkybara home from a party", () => {
  const now = Date.UTC(2026, 7, 29, 10);
  const adoptedAt = now - 86_400_000;
  const travel = departNow(null, adoptedAt, now, "nox:recall");
  const recalled = recallTravel(travel, adoptedAt, now + 1, "nox:recall");

  assert.equal(recalled.status, "home");
  assert.equal(recalled.returnPending, true);
  assert.equal(recalled.lastDestinationId, travel.destinationId);
  assert.equal(recalled.lastReturnAt, now + 1);
  assert.equal(recalled.lastRecalled, true);
  assert.ok(recalled.lastTripProgress < 0.001);
  assert.equal(recalled.completedTrips, 0);
  assert.equal(recalled.lastRewardId, null);
});

test("the collection has exclusive clothing slots and placeable finds", () => {
  let inventory = createInventory();
  assert.deepEqual(inventory.ownedItemIds, ["gear_locker", "signature_hood", "card_table"]);
  assert.equal(inventory.equipped.hood, "signature_hood");
  assert.equal(inventory.equipped.neck, null);
  assert.equal(inventory.equipped.harness, null);
  assert.deepEqual(inventory.placedItemIds, ["card_table"]);
  for (const id of ["cross_harness", "reflective_harness", "neon_lamp"]) {
    inventory = addInventoryItem(inventory, id, 100).inventory;
  }

  inventory = toggleEquipment(inventory, "cross_harness").inventory;
  const swapped = toggleEquipment(inventory, "reflective_harness");
  assert.equal(swapped.replacedId, "cross_harness");
  assert.equal(swapped.inventory.equipped.harness, "reflective_harness");
  assert.equal(Object.values(swapped.inventory.equipped).filter(Boolean).length, 2);

  const hoodOff = toggleEquipment(createInventory(), "signature_hood").inventory;
  assert.equal(hoodOff.equipped.hood, null);
  assert.equal(normalizeInventory(hoodOff).equipped.hood, null);

  const placed = togglePlacedItem(swapped.inventory, "neon_lamp");
  assert.equal(placed.placed, true);
  assert.deepEqual(placed.inventory.placedItemIds, ["card_table", "neon_lamp"]);
  assert.equal(togglePlacedItem(placed.inventory, "neon_lamp").placed, false);
  assert.ok(Object.keys(ITEM_DEFINITIONS).length >= 20);
  assert.ok(Object.values(ITEM_DEFINITIONS).filter((item) => item.type === "wearable").every((item) => EQUIPMENT_SLOTS[item.slot]));
  assert.equal(ITEM_DEFINITIONS.gear_locker.type, "container");
  assert.equal(ITEM_DEFINITIONS.friend_book.type, "container");
  assert.equal(ITEM_DEFINITIONS.play_mat.area, "home");
  assert.equal(ITEM_DEFINITIONS.kennel_sign.asset, undefined);
  assert.equal(inventory.ownedItemIds.includes("gear_locker"), true);
  assert.equal(inventory.ownedItemIds.includes("friend_book"), false);
  assert.equal(togglePlacedItem(addInventoryItem(placed.inventory, "gear_locker").inventory, "gear_locker").placed, false);

  const migratedStarter = normalizeInventory({
    ownedItemIds: ["soft_harness", "card_table"],
    equipped: { hood: null, eyes: null, neck: null, harness: "soft_harness", paws: null },
    placedItemIds: ["card_table"],
  });
  assert.equal(migratedStarter.equipped.hood, "signature_hood");
  assert.equal(migratedStarter.equipped.neck, null);
  assert.equal(migratedStarter.equipped.harness, null);
});

test("travel finds prefer an unowned destination reward and never duplicate", () => {
  let inventory = createInventory();
  const rewardId = rewardForDestination(inventory, "folsom", "nox:first");
  assert.ok(rewardId);
  assert.equal(inventory.ownedItemIds.includes(rewardId), false);
  const first = addInventoryItem(inventory, rewardId, 100);
  assert.equal(first.added, true);
  const duplicate = addInventoryItem(first.inventory, rewardId, 200);
  assert.equal(duplicate.added, false);
  assert.equal(duplicate.inventory.ownedItemIds.filter((id) => id === rewardId).length, 1);
});

test("the Capy changes between four living areas and can meet travel companions", () => {
  const now = Date.UTC(2026, 7, 29, 10);
  const initial = createWorld(now, "home", "nox");
  const moved = normalizeWorld(initial, initial.nextMoveAt + 1, "nox");
  assert.notEqual(moved.area, "home");
  assert.ok(WORLD_AREAS[moved.area]);
  assert.ok(Object.keys(WORLD_AREAS).includes("wintergarden"));
  assert.equal(selectWorldArea(moved, "wintergarden", now + 1, "Mika").area, "wintergarden");
  assert.ok(!moved.friendId || ANIMAL_FRIENDS[moved.friendId]);
  const companion = travelCompanion({ ...moved, friendId: "duck" }, "nox");
  assert.equal(companion, "duck");
});

test("friends are recorded and 40-minute area sessions settle exactly once", () => {
  const now = Date.UTC(2026, 7, 29, 10);
  let world = recordFriendMeeting(createWorld(now, "home", "nox"), "duck", now + 10, "nox");
  assert.deepEqual(world.metFriendIds, ["duck"]);
  assert.equal(world.friendMetAt.duck, now + 10);
  const started = startWorldActivity(world, "meadow", now + 20, "nox");
  assert.equal(started.started, true);
  assert.equal(started.world.activity.returnsAt - started.world.activity.startedAt, 40 * 60_000);
  assert.equal(selectWorldArea(started.world, "garden", now + 30, "nox").area, "meadow");
  assert.equal(settleWorldActivity(started.world, started.world.activity.returnsAt - 1, "nox").completion, null);
  const finished = settleWorldActivity(started.world, started.world.activity.returnsAt + 1, "nox");
  assert.equal(finished.completion.area, "meadow");
  assert.equal(finished.world.area, "home");
  assert.ok(finished.world.socialGlowUntil > started.world.activity.returnsAt);
  assert.equal(settleWorldActivity(finished.world, started.world.activity.returnsAt + 2, "nox").completion, null);

  const recalledStart = startWorldActivity(createWorld(now, "garden", "nox"), "garden", now, "nox").world;
  const recalled = recallWorldActivity(recalledStart, now + 10 * 60_000, "nox");
  assert.equal(recalled.completion.recalled, true);
  assert.equal(Math.round(recalled.completion.progress * 100), 25);
  assert.equal(recalled.world.area, "home");
  assert.equal(recalled.world.activity, null);
});

test("friend-book entries migrate legacy meetings and grow into distinct companion histories", () => {
  const now = Date.UTC(2026, 7, 29, 10);
  const legacy = normalizeWorld({
    version: 3,
    area: "home",
    metFriendIds: ["hedgehog"],
    friendMetAt: { hedgehog: now - 86_400_000 },
  }, now, "nox");
  const migrated = friendBookEntry(legacy, "hedgehog", "de", now, "nox");
  assert.equal(migrated.met, true);
  assert.equal(migrated.friend.label, "Piek");
  assert.equal(migrated.friend.species, "Igel");
  assert.equal(migrated.record.firstMetAt, now - 86_400_000);
  assert.equal(migrated.relationship.label, "Neue Bekanntschaft");

  let world = recordFriendMeeting(createWorld(now, "garden", "nox"), "duck", now, "nox", { area: "garden" });
  world = recordFriendMeeting(world, "duck", now + 1000, "nox", { area: "garden" });
  assert.equal(world.friendRecords.duck.meetings, 1, "repeated taps during one visit must not farm friendship");
  assert.equal(world.friendRecords.duck.origin.area, "garden");
  world = recordFriendMeeting(world, "duck", now + 3 * 60 * 60_000, "nox", { area: "wintergarden" });
  world = recordFriendCompanionActivity(world, "duck", "travel", now + 4 * 60 * 60_000, "nox");
  world = recordFriendCompanionActivity(world, "duck", "meadow", now + 5 * 60 * 60_000, "nox");
  const entry = friendBookEntry(world, "duck", "en", now + 5 * 60 * 60_000, "nox");
  assert.equal(entry.record.meetings, 2);
  assert.equal(entry.record.tripsTogether, 1);
  assert.equal(entry.record.sessionsTogether.meadow, 1);
  assert.equal(entry.relationship.label, "Pack mate");
  assert.deepEqual(availableCompanions(world, "en", now, "nox").map(({ friend }) => friend.id), ["duck"]);
});

test("all six friends have localized, mechanically distinct companion traits", () => {
  const friends = Object.values(ANIMAL_FRIENDS);
  assert.equal(friends.length, 6);
  assert.equal(new Set(friends.map((friend) => friend.trait.id)).size, 6);
  assert.ok(friends.every((friend) => friend.personality && friend.trait.label && friend.trait.detail));
  const travelEffects = friends.map((friend) => JSON.stringify(companionActivityEffect(friend.id, "travel")?.changes));
  assert.equal(new Set(travelEffects).size, 6);
  assert.equal(companionActivityEffect("chicken", "garden").changes.curiosity, 7);
  assert.equal(companionActivityEffect("rabbit", "garden", 0.5).changes.fun, 4);
  assert.equal(companionActivityEffect("missing", "travel"), null);
});

test("only unlocked friends can be captured as area-session companions", () => {
  const now = Date.UTC(2026, 7, 29, 10);
  const world = recordFriendMeeting(createWorld(now, "meadow", "nox"), "alpaca", now, "nox");
  const chosen = startWorldActivity(world, "meadow", now + 10, "nox", { companionId: "alpaca", clean: 40 });
  assert.equal(chosen.world.activity.companionId, "alpaca");
  const locked = startWorldActivity(createWorld(now, "garden", "nox"), "garden", now + 10, "nox", { companionId: "alpaca" });
  assert.equal(locked.world.activity.companionId, null);
});

test("secret session preparations are captured quietly and revealed only on return", () => {
  const now = Date.UTC(2026, 8, 4, 18);
  const prepared = prepareWorldActivity(createWorld(now, "garden", "nox"), "pineapple", now, "nox");
  const juicy = startWorldActivity(prepared, "garden", now + 20 * 60_000, "nox", { clean: 42 });
  assert.equal(juicy.world.activity.secretBonus, "pineapple");
  assert.equal(juicy.world.pineappleUntil, 0);
  assert.equal(settleWorldActivity(juicy.world, juicy.world.activity.returnsAt, "nox").completion.secretBonus, "pineapple");

  const expired = startWorldActivity(prepareWorldActivity(createWorld(now, "garden", "nox"), "pineapple", now, "nox"), "garden", now + 91 * 60_000, "nox", { clean: 100 });
  assert.equal(expired.world.activity.secretBonus, null);

  const spotless = startWorldActivity(createWorld(now, "meadow", "nox"), "meadow", now, "nox", { clean: 100 });
  assert.equal(spotless.world.activity.secretBonus, "spotless");
  const spotlessReturn = settleWorldActivity(spotless.world, spotless.world.activity.returnsAt, "nox");
  assert.equal(spotlessReturn.completion.secretBonus, "spotless");
  assert.equal(spotlessReturn.world.socialGlowUntil, spotless.world.activity.returnsAt + 4 * 60 * 60_000);
});

test("Pack Cards keeps elite values and specials rare while rival hands stay challenging and transparent", () => {
  const values = PACK_CARD_DECK.flatMap((card) => Object.values(card.stats));
  assert.equal(Math.max(...values), 89);
  assert.equal(values.filter((value) => value > 90).length, 0);
  assert.ok(values.filter((value) => value >= 85).length / values.length <= 0.25);
  assert.ok(PACK_CARD_DECK.every((card) => Math.max(...Object.values(card.stats)) - Math.min(...Object.values(card.stats)) >= 15));
  assert.equal(PACK_CARD_DECK.filter((card) => card.special).length, 3);
  assert.equal(PACK_CARD_DIFFICULTIES.soft.rounds, 5);
  assert.equal(PACK_CARD_DIFFICULTIES.alpha.rounds, 7);
  assert.equal(PACK_CARD_DIFFICULTIES.switch.rivalChoices, 3);
  assert.equal(PACK_CARD_DIFFICULTIES.alpha.rivalChoices, 4);
  const playerCard = { stats: { trust: 80, style: 80, energy: 80, pack: 80 } };
  const rivalCard = { stats: { trust: 80, style: 80, energy: 80, pack: 80 } };
  assert.equal(resolvePackCardRound({ playerCard, rivalCard, stat: "trust", difficulty: "soft" }).winner, "tie");
  assert.equal(resolvePackCardRound({ playerCard, rivalCard, stat: "trust", difficulty: "alpha" }).winner, "tie");
  assert.equal(resolvePackCardRound({ playerCard, rivalCard: { stats: { trust: 72, style: 72, energy: 72, pack: 72 } }, stat: "trust", previousStat: "trust", difficulty: "alpha" }).winner, "rival");
  const counter = choosePackCardRival({
    playerCard,
    rivalCards: [
      { id: "weak", stats: { trust: 50, style: 50, energy: 50, pack: 50 } },
      { id: "counter", stats: { trust: 84, style: 50, energy: 50, pack: 50 } },
      { id: "extra", stats: { trust: 60, style: 60, energy: 60, pack: 60 } },
    ],
    stat: "trust",
    difficulty: "switch",
  });
  assert.equal(counter.card.id, "counter");
  assert.equal(counter.result.winner, "rival");
});

test("vegetables grow offline, watering helps, and harvest becomes food", () => {
  const now = Date.UTC(2026, 7, 29, 10);
  let garden = selectCrop(createGarden(), "cucumber");
  const planted = plantCrop(garden, 0, now);
  assert.equal(planted.planted, true);
  assert.equal(planted.garden.seeds.cucumber, 2);
  const originalReadyAt = planted.garden.plots[0].readyAt;
  const watered = waterCrop(planted.garden, 0, now + 30_000);
  assert.equal(watered.watered, true);
  assert.ok(watered.garden.plots[0].readyAt < originalReadyAt);
  const harvested = harvestCrop(watered.garden, 0, watered.garden.plots[0].readyAt + 1);
  assert.equal(harvested.harvested, true);
  assert.equal(harvested.amount, CROPS.cucumber.yield + 1);
  assert.equal(harvested.garden.plots[0], null);
  const eaten = consumeHarvest(harvested.garden, "cucumber");
  assert.equal(eaten.consumed, true);
  assert.equal(eaten.garden.harvest.cucumber, harvested.amount - 1);
});

test("world ambience is generated locally without a network source", () => {
  const ambience = localAmbience(Date.UTC(2026, 0, 15, 12));
  assert.equal(ambience.source, "local");
  assert.equal(ambience.reference, "Berlin");
  assert.ok(Number.isFinite(ambience.temperature));
  assert.equal(ambience.precipitation, 0);
  assert.doesNotMatch(ambience.label, /light|mood/i);
});

test("dialogues offer multiple two-step conversations and adapt to needs", () => {
  assert.ok(DIALOGUES.length >= 7);
  assert.ok(DIALOGUES.every((dialogue) => dialogue.turns.length >= 2));
  assert.ok(DIALOGUES.every((dialogue) => dialogue.turns.every((turn) => turn.choices.length >= 3)));
  assert.equal(dialogueFor({ ...makeState(1), social: 10 }).id, "missing-you");
  assert.equal(dialogueFor({ ...makeState(1), curiosity: 10 }).id, "brave-capy");
});

test("the first quest becomes due exactly one minute after adoption", () => {
  const adoptedAt = Date.UTC(2026, 7, 21, 12);
  const progress = normalizeQuestProgress(null, adoptedAt, adoptedAt, "Nox");
  assert.equal(progress.queue[0], "glitter-hunt");
  assert.equal(progress.nextAt, adoptedAt + 60_000);
  assert.equal(questIsDue(progress, adoptedAt + 59_999), false);
  assert.equal(questIsDue(progress, adoptedAt + 60_000), true);
  assert.equal(currentQuest(progress).title, "Glitzer im Schilf");
});

test("daily quest plans mix complex games and shared pet-care tasks", () => {
  const queue = dailyQuestQueue("2026-08-21", "Nox", false);
  assert.equal(queue.length, 5);
  assert.ok(queue.filter((id) => QUEST_DEFINITIONS[id].type === "minigame").length >= 3);
  assert.ok(queue.filter((id) => QUEST_DEFINITIONS[id].type === "task").length >= 2);
  assert.ok(Object.values(QUEST_DEFINITIONS).filter((quest) => quest.type === "minigame").length >= 6);
});

test("shared tasks progress only through matching completed interactions", () => {
  const now = Date.UTC(2026, 7, 21, 12);
  const progress = {
    ...normalizeQuestProgress(null, now - 60_000, now, "Nox"),
    queue: ["social-circle", "glitter-hunt", "day-trip", "board-memory", "city-tour"],
    nextAt: now,
  };
  let active = activateQuest(progress, "social-circle", now);
  active = recordQuestAction(active, "feed:melon");
  assert.equal(active.taskDone.length, 0);
  active = recordQuestAction(active, "together:cuddle");
  active = recordQuestAction(active, "together:talk");
  active = recordQuestAction(active, "play:rope");
  assert.equal(taskQuestComplete(active), true);
  const finished = completeQuest(active, "social-circle", 100, now + 1);
  assert.equal(finished.completed[0].stars, 3);
  assert.equal(finished.glitter, 9);
  assert.equal(finished.lifetimeCompleted, 1);
});

test("state migration preserves Capys and adds quests, inventory, garden, and world without a reset", () => {
  const now = Date.UTC(2026, 7, 21, 12);
  const old = { ...makeState(now - 120_000, "Lotti"), version: 3, xp: 77, questProgress: null };
  const migrated = normalizeState(old, now);
  const quests = normalizeQuestProgress(migrated.questProgress, migrated.adoptedAt, now, "Lotti");
  assert.equal(migrated.name, "Lotti");
  assert.equal(migrated.xp, 77);
  assert.equal(migrated.version, 7);
  assert.deepEqual(migrated.inventory.ownedItemIds, ["gear_locker", "signature_hood", "card_table"]);
  assert.equal(migrated.garden.plots.length, 4);
  assert.ok(WORLD_AREAS[migrated.world.area]);
  assert.equal(quests.nextAt, migrated.adoptedAt + 60_000);
  assert.equal(questIsDue(quests, now), true);
});

test("the published app is English-first, private, installable, and Kinkybara-branded", async () => {
  const [html, styles, app, i18n, gameCoreSource, dialogueSource, packCardsSource, manifest, serviceWorker, serverSource, readme, license] = await Promise.all([
    readFile(new URL("../public/app/index.html", import.meta.url), "utf8"),
    readFile(new URL("../public/app/styles.css", import.meta.url), "utf8"),
    readFile(new URL("../public/app/app.js", import.meta.url), "utf8"),
    readFile(new URL("../public/app/i18n.js", import.meta.url), "utf8"),
    readFile(new URL("../public/app/game-core.js", import.meta.url), "utf8"),
    readFile(new URL("../public/app/dialogues.js", import.meta.url), "utf8"),
    readFile(new URL("../public/app/pack-cards.js", import.meta.url), "utf8"),
    readFile(new URL("../public/app/manifest.webmanifest", import.meta.url), "utf8"),
    readFile(new URL("../public/app/sw.js", import.meta.url), "utf8"),
    readFile(new URL("../scripts/serve.mjs", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../LICENSE", import.meta.url), "utf8"),
  ]);

  assert.match(html, /<html lang="en" data-app-state="booting">/);
  assert.match(html, /A GIFT FROM THRON/);
  assert.match(html, /value="Thron"/);
  assert.match(html, /data-language="de"/);
  assert.match(html, /A little friend in your pocket — friendly, curious, a little kinky\./);
  assert.match(html, /A simple web app/);
  assert.match(html, /connect-src 'none'/);
  assert.match(html, /name="referrer" content="no-referrer"/);
  assert.match(html, /rel="noopener noreferrer external"/);
  assert.match(html, /id="boot-cover"/);
  const externalUrls = [...html.matchAll(/https:\/\/[^"\s]+/g)].map((match) => match[0]);
  assert.deepEqual(externalUrls, [
    "https://github.com/Thron-ix/Kinkybara",
    "https://github.com/Thron-ix/Kinkybara/blob/main/LICENSE",
    "https://www.instagram.com/thron.ix/",
  ]);
  assert.match(html, /Instagram @thron\.ix/);
  assert.match(i18n, /Ein kleiner Freund in deiner Hosentasche – freundlich, neugierig, ein bisschen kinky\./);
  assert.match(i18n, /Eine einfache Web-App/);
  assert.match(i18n, /Ein Geschenk von Thron\./);
  assert.doesNotMatch(i18n, /Ein verspieltes Geschenk von Thron/);
  assert.match(html, /dialogue-dialog/);
  assert.match(html, /library-dialog/);
  assert.match(html, /quest-dialog/);
  assert.match(html, /quest-game-dialog/);
  assert.match(html, /pack-cards-dialog/);
  assert.match(html, /quest-alert/);
  assert.match(html, /quest-alert-dismiss/);
  assert.match(html, /travel-dialog/);
  assert.match(html, /recall-travel-button/);
  assert.match(html, /journey-dialog/);
  assert.match(html, /area-session-dialog/);
  assert.match(html, /area-session-primary/);
  assert.match(html, /inventory-dialog/);
  assert.match(html, /garden-dialog/);
  assert.match(html, /PACK LOUNGE/);
  assert.match(html, /PLAY AREA/);
  assert.match(html, /animal-visitor/);
  assert.match(html, /weather-dialog/);
  assert.match(html, /world-navigation/);
  assert.match(html, /hood-toggle/);
  assert.ok(html.indexOf('id="placed-background-items-layer"') < html.indexOf('id="pet-button"'));
  assert.doesNotMatch(html, /area-stay-panel/);
  assert.match(html, /data-filter="container"/);
  assert.match(app, /activity-sign-badge/);
  assert.match(app, /is-container-card/);
  assert.match(app, /placedBackgroundItemsLayer/);
  assert.match(app, /id: "play_area_sign"/);
  assert.match(app, /asset: "\.\/assets\/kennel-fruit-pair\.png"/);
  assert.ok(app.indexOf("if (button.dataset.worldActivity)") < app.indexOf("const item = itemCopy(ITEM_DEFINITIONS[button.dataset.itemId])"));
  assert.match(html, /gear-locker-dialog/);
  assert.match(html, /friend-book-dialog/);
  assert.match(html, /pack-difficulty/);
  assert.doesNotMatch(html, /id="area-name"|id="area-choice"|id="growth-label"|FRIENDS' YARD/);
  assert.match(html, /id="weather-icon"[^>]*>BERLIN</);
  assert.match(html, /value="golden"/);
  assert.doesNotMatch(html, /<(img|svg)\b/i);
  assert.match(app, /pointermove/);
  assert.match(app, /if \(code === "\."\) return/);
  assert.match(app, /currentPhrase = runBootStep\("status"/);
  assert.ok(app.indexOf("const ENGLISH_STATUS_COPY") < app.indexOf('currentPhrase = runBootStep("status"'));
  assert.match(app, /dataset\.appState = "ready"/);
  assert.match(app, /traveling && button\.dataset\.action !== "travel"/);
  assert.match(app, /updateViaCache: "none"/);
  assert.match(i18n, /PARTY POST/);
  assert.match(i18n, /REISEPOST/);
  assert.match(app, /bathAnimation/);
  assert.match(app, /startBubbles/);
  assert.doesNotMatch(app, /localStorage\.removeItem/);
  assert.doesNotMatch(app, /capygotchi-library-v1/);
  assert.match(app, /normalizeQuestProgress/);
  assert.match(app, /dismissedNotice/);
  assert.match(app, /startQuestGame/);
  assert.match(app, /switchToPet/);
  assert.match(app, /normalizeTravel/);
  assert.match(app, /departNow/);
  assert.match(app, /recallTravel/);
  assert.match(app, /toggleEquipment/);
  assert.match(app, /removeEquippedHood/);
  assert.match(app, /plantCrop/);
  assert.match(app, /normalizeWorld/);
  assert.doesNotMatch(app, /selectLandscapeArea/);
  assert.match(app, /foodAvailability/);
  assert.match(app, /createItemArtwork/);
  assert.match(styles, /Need bars read like reserves/);
  assert.match(styles, /\.placed-world-icon/);
  assert.match(styles, /\.placed-background-items-layer \{ z-index: 4; \}/);
  assert.match(styles, /\.inventory-card\.is-container-card/);
  assert.doesNotMatch(app, /loadGermanyWeather|api\.open-meteo|navigator\.geolocation/);
  assert.match(app, /startPackCards/);
  assert.match(app, /Dom, sub, alpha, switch/);
  assert.match(gameCoreSource, /Dom, Sub, Alpha, Switch/);
  assert.match(gameCoreSource, /Blow … bubbles/);
  assert.match(dialogueSource, /switch-energy/);
  assert.match(dialogueSource, /Netflix & chill/);
  assert.match(packCardsSource, /BARK/);
  assert.match(packCardsSource, /FRECHHEIT/);
  assert.doesNotMatch(packCardsSource, /PACK SPIRIT|PACKGEIST/);
  assert.equal(JSON.parse(manifest).display, "standalone");
  assert.equal(JSON.parse(manifest).lang, "en");
  assert.match(serviceWorker, /kinkybara-shell-v41/);
  assert.match(serviceWorker, /cache: "reload"/);
  assert.match(serviceWorker, /cachedShellResponse/);
  assert.match(serviceWorker, /if \(url\.origin !== self\.location\.origin\) return/);
  assert.match(serviceWorker, /pup-hood-base\.png/);
  assert.match(serviceWorker, /pack-cards-joker\.png/);
  assert.match(serviceWorker, /kennel-fruit-pair\.png/);
  assert.match(serviceWorker, /gear-locker\.png/);
  assert.match(serviceWorker, /friend-book\.png/);
  assert.match(serviceWorker, /dialogues\.js/);
  assert.match(serviceWorker, /pet-library\.js/);
  assert.match(serviceWorker, /quest-core\.js/);
  assert.match(serviceWorker, /quest-games\.js/);
  assert.match(serviceWorker, /travel-core\.js/);
  assert.match(serviceWorker, /inventory-core\.js/);
  assert.match(serviceWorker, /world-core\.js/);
  assert.match(serviceWorker, /weather\.js/);
  assert.match(serviceWorker, /pack-cards\.js/);
  assert.match(serviceWorker, /i18n\.js/);
  const shellBlock = serviceWorker.match(/const APP_SHELL = Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1] || "";
  const shellFiles = [...shellBlock.matchAll(/"\.\/([^"?]+)"/g)].map((match) => match[1]);
  assert.ok(shellFiles.length >= 18);
  for (const file of shellFiles) {
    const contents = await readFile(new URL(`../public/app/${file}`, import.meta.url));
    assert.ok(contents.length > 0, `${file} must exist and be non-empty`);
  }
  assert.doesNotMatch(html + styles + app + serviceWorker, /\?v=\d+/);
  assert.doesNotMatch(styles, /(?:^|[;{]\s*)color:\s*var\(--accent-(?:primary|secondary)/m);
  assert.doesNotMatch(app, /accent-(?:primary|secondary)-ink/);
  assert.match(serverSource, /content-security-policy/);
  assert.match(serverSource, /connect-src 'self'/);
  assert.match(serverSource, /x-content-type-options/);
  assert.match(serverSource, /permissions-policy/);
  assert.match(serverSource, /"\.png": "image\/png"/);
  assert.equal(PACK_CARD_DECK.length, 21);
  assert.ok(PACK_CARD_DECK.some((card) => card.name === "Switch Hitter"));
  assert.ok(PACK_CARD_DECK.some((card) => card.name === "Soft Dom"));
  assert.match(readme, /MIT No Attribution/);
  assert.match(license, /Copyright 2026 Thron/);
  for (const content of [html, app, gameCoreSource, dialogueSource, packCardsSource, readme, license]) {
    assert.doesNotMatch(content, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  }
});

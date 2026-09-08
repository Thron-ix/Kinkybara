import { GEAR_ART } from "./gear-art.js";

export const EQUIPMENT_SLOTS = Object.freeze({
  hood: "HOOD",
  eyes: "EYES",
  neck: "NECK",
  harness: "HARNESS",
  paws: "PAWS",
  cuffs: "CUFFS",
  tail: "TAIL",
});

export const ITEM_DEFINITIONS = Object.freeze({
  signature_hood: { id: "signature_hood", type: "wearable", slot: "hood", label: "Signature pup hood", icon: "▰", asset: "./assets/pup-hood-base.png", detail: "The hood that started it all: soft ears, open snout, your colors." },
  night_hood: { id: "night_hood", type: "wearable", slot: "hood", label: "Night hood", icon: "◆", asset: "./assets/pup-hood-base.png", detail: "Dark all over, with bright ears after midnight." },
  prism_hood: { id: "prism_hood", type: "wearable", slot: "hood", label: "Prism hood", icon: "◇", asset: "./assets/pup-hood-base.png", detail: "Made for club lights." },
  round_glasses: { id: "round_glasses", type: "wearable", slot: "eyes", label: "Round glasses", icon: "◎", ...GEAR_ART.round_glasses, detail: "For a quiet look across the lounge." },
  neon_visors: { id: "neon_visors", type: "wearable", slot: "eyes", label: "Neon visor", icon: "═", ...GEAR_ART.neon_visors, detail: "A little neon for a long night." },
  soft_collar: { id: "soft_collar", type: "wearable", slot: "neck", label: "Soft collar", icon: "○", ...GEAR_ART.soft_collar, detail: "Soft leather. One very shiny ring." },
  pack_bandana: { id: "pack_bandana", type: "wearable", slot: "neck", label: "Pack bandana", icon: "▽", ...GEAR_ART.pack_bandana, detail: "Quiet signal. The pack gets it." },
  soft_harness: { id: "soft_harness", type: "wearable", slot: "harness", label: "Signature harness", icon: "H", ...GEAR_ART.soft_harness, detail: "Soft leather, silver rings. Fits just right." },
  cross_harness: { id: "cross_harness", type: "wearable", slot: "harness", label: "Cross harness", icon: "X", ...GEAR_ART.cross_harness, detail: "Crossed straps and a ring worth a second look." },
  reflective_harness: { id: "reflective_harness", type: "wearable", slot: "harness", label: "Reflective harness", icon: "H", ...GEAR_ART.reflective_harness, detail: "Catches the light when the room goes dark." },
  paw_warmers: { id: "paw_warmers", type: "wearable", slot: "paws", label: "Paw warmers", icon: "∥", ...GEAR_ART.paw_warmers, detail: "Warm paws. Ridiculously soft." },
  sturdy_boots: { id: "sturdy_boots", type: "wearable", slot: "paws", label: "Sturdy boots", icon: "▰", ...GEAR_ART.sturdy_boots, detail: "For concrete floors and long nights." },
  ankle_cuffs: { id: "ankle_cuffs", type: "wearable", slot: "cuffs", label: "Ankle cuffs", icon: "○", ...GEAR_ART.ankle_cuffs, detail: "Padded leather around the ankles. A little jingle with every step." },
  thigh_cuffs: { id: "thigh_cuffs", type: "wearable", slot: "cuffs", label: "Thigh cuffs", icon: "○", ...GEAR_ART.thigh_cuffs, detail: "A pair of snug straps, worn a little higher." },
  sport_socks: { id: "sport_socks", type: "wearable", slot: "paws", label: "White sports socks", icon: "∥", ...GEAR_ART.sport_socks, detail: "Fresh white cotton, ribbed cuffs and three little stripes." },
  signature_socks: { id: "signature_socks", type: "wearable", slot: "paws", label: "Signature socks", icon: "∥", ...GEAR_ART.signature_socks, detail: "Your favorite pair. Your favorite color." },
  signature_tail: { id: "signature_tail", type: "wearable", slot: "tail", label: "Signature pup tail", icon: "⌁", ...GEAR_ART.signature_tail, detail: "A little wag in your colors. Hard to keep still." },
  card_table: { id: "card_table", type: "placeable", area: "wintergarden", label: "Pack Cards table", icon: "▦", asset: "./assets/pack-cards-joker.png", detail: "Roxy and Jinx are always up for one more round." },
  karaoke_mic: { id: "karaoke_mic", type: "placeable", area: "wintergarden", label: "Karaoke mic", icon: "♪", detail: "For solos, duets and questionable encores." },
  juice_bar: { id: "juice_bar", type: "placeable", area: "wintergarden", label: "Juice bar", icon: "▥", detail: "Orange, pineapple, enough for the pack." },
  gear_locker: { id: "gear_locker", type: "container", label: "Gear locker", icon: "▣", asset: "./assets/gear-locker.png", detail: "Everything you have found, in one place." },
  friend_book: { id: "friend_book", type: "container", label: "Friend book", icon: "♥", asset: "./assets/friend-book.png", detail: "Every friend your Kinkybara has met, page by page." },
  kennel_sign: { id: "kennel_sign", type: "placeable", area: "meadow", label: "Kennel sign", icon: "▰", asset: "./assets/kennel-sofa.png", detail: "A sofa says: come closer." },
  play_mat: { id: "play_mat", type: "placeable", area: "home", label: "Signature play mat", icon: "▤", detail: "A soft spot beside the den, in your colors." },
  neon_lamp: { id: "neon_lamp", type: "placeable", area: "garden", label: "Neon lamp", icon: "✦", detail: "Your colors, lighting the Play Area." },
  tiny_speaker: { id: "tiny_speaker", type: "placeable", area: "meadow", label: "Tiny speaker", icon: "♫", detail: "Small box. Plenty of noise." },
  memory_camera: { id: "memory_camera", type: "placeable", area: "home", label: "Memory camera", icon: "◉", detail: "Keeps the moment here, just for you." },
});

const ITEM_COPY_DE = Object.freeze({
  signature_hood: ["Signatur-Pup-Hood", "Die Hood, mit der alles begann: weiche Ohren, freie Schnute, deine Farben."],
  night_hood: ["Nacht-Hood", "Dunkel rundum, mit hellen Ohren nach Mitternacht."],
  prism_hood: ["Prisma-Hood", "Gemacht fürs Clublicht."],
  round_glasses: ["Runde Brille", "Für den stillen Blick durch die Lounge."],
  neon_visors: ["Neon-Visier", "Ein bisschen Neon für eine lange Nacht."],
  soft_collar: ["Weiches Halsband", "Weiches Leder. Ein ziemlich glänzender Ring."],
  pack_bandana: ["Pack-Bandana", "Stilles Zeichen. Das Pack versteht es."],
  soft_harness: ["Signatur-Harness", "Weiches Leder, silberne Ringe. Sitzt genau richtig."],
  cross_harness: ["Kreuz-Harness", "Gekreuzte Riemen und ein Ring, der Blicke fängt."],
  reflective_harness: ["Reflektor-Harness", "Fängt das Licht, wenn der Raum dunkel wird."],
  paw_warmers: ["Pfotenwärmer", "Warme Pfoten. Unverschämt weich."],
  sturdy_boots: ["Feste Boots", "Für Betonböden und lange Nächte."],
  ankle_cuffs: ["Knöchel-Cuffs", "Gepolstertes Leder an den Knöcheln. Klimpert bei jedem Schritt."],
  thigh_cuffs: ["Oberschenkel-Cuffs", "Zwei weiche Riemen, ein Stück höher getragen."],
  sport_socks: ["Weiße Sportsocken", "Frische Baumwolle, gerippter Bund und drei kleine Streifen."],
  signature_socks: ["Signatur-Socken", "Dein Lieblingspaar. Deine Lieblingsfarbe."],
  signature_tail: ["Signatur-Pup-Tail", "Ein kleines Wedeln in deiner Farbe. Hält selten still."],
  card_table: ["Pack-Cards-Tisch", "Roxy und Jinx sind immer für eine Revanche zu haben."],
  karaoke_mic: ["Karaoke-Mikro", "Für Soli, Duette und fragwürdige Zugaben."],
  juice_bar: ["Saftbar", "Orange, Ananas, genug fürs Pack."],
  gear_locker: ["Gear-Schrank", "Alles Gefundene an einem Ort."],
  friend_book: ["Freundebuch", "Alle Freunde deines Kinkybaras, Seite für Seite."],
  kennel_sign: ["Kennel-Schild", "Ein Sofa sagt: rück näher."],
  play_mat: ["Signatur-Spielmatte", "Ein weicher Platz neben der Höhle, in deinen Farben."],
  neon_lamp: ["Neonlampe", "Deine Farben, als Licht in der Play Area."],
  tiny_speaker: ["Kleiner Lautsprecher", "Kleine Box. Genug Lärm."],
  memory_camera: ["Erinnerungskamera", "Hält den Moment hier fest – nur für dich."],
});

const SLOT_COPY_DE = Object.freeze({ hood: "HOOD", eyes: "AUGEN", neck: "HALS", harness: "HARNESS", paws: "PFOTEN", cuffs: "CUFFS", tail: "TAIL" });

export function localizedItem(item, language = "en") {
  if (!item || language !== "de") return item;
  const copy = ITEM_COPY_DE[item.id];
  return copy ? { ...item, label: copy[0], detail: copy[1] } : item;
}

export function localizedSlot(slot, language = "en") {
  return language === "de" ? SLOT_COPY_DE[slot] || EQUIPMENT_SLOTS[slot] : EQUIPMENT_SLOTS[slot];
}

export const DESTINATION_REWARDS = Object.freeze({
  folsom: ["signature_hood", "soft_collar", "friend_book", "signature_tail"],
  laboratory: ["night_hood", "reflective_harness", "neon_lamp", "thigh_cuffs"],
  berghain: ["neon_visors", "cross_harness", "tiny_speaker", "ankle_cuffs"],
  ruhr_pack: ["sturdy_boots", "kennel_sign", "memory_camera", "sport_socks", "signature_tail"],
  mannheim: ["pack_bandana", "karaoke_mic", "juice_bar", "friend_book"],
  csd_berlin: ["prism_hood", "card_table", "memory_camera", "signature_socks"],
  csd_cologne: ["paw_warmers", "play_mat", "juice_bar", "friend_book"],
  csd_hamburg: ["round_glasses", "tiny_speaker", "neon_lamp"],
});

// The locker is collection navigation, not a lucky travel drop. Keeping it in
// every save makes the wardrobe reliably findable while the friend book stays
// a real souvenir to discover.
const STARTER_ITEMS = Object.freeze(["gear_locker", "signature_hood", "card_table"]);

function uniqueKnown(values) {
  return [...new Set(Array.isArray(values) ? values.filter((id) => ITEM_DEFINITIONS[id]) : [])];
}

export function createInventory() {
  return {
    version: 1,
    ownedItemIds: [...STARTER_ITEMS],
    equipped: { hood: "signature_hood", eyes: null, neck: null, harness: null, paws: null, cuffs: null, tail: null },
    placedItemIds: ["card_table"],
    discoveredAt: {},
  };
}

export function normalizeInventory(candidate) {
  const base = createInventory();
  if (!candidate || typeof candidate !== "object") return base;
  const previousOwnedItemIds = uniqueKnown(candidate.ownedItemIds);
  const legacyStarterHarness = previousOwnedItemIds.includes("soft_harness")
    && !previousOwnedItemIds.includes("signature_hood")
    && candidate.equipped?.harness === "soft_harness"
    && !candidate.equipped?.hood;
  const ownedItemIds = uniqueKnown([...STARTER_ITEMS, ...(candidate.ownedItemIds || [])]);
  const hasExplicitEquipment = candidate.equipped && typeof candidate.equipped === "object";
  const equipped = hasExplicitEquipment
    ? Object.fromEntries(Object.keys(EQUIPMENT_SLOTS).map((slot) => [slot, null]))
    : { ...base.equipped };
  for (const slot of Object.keys(EQUIPMENT_SLOTS)) {
    const id = candidate.equipped?.[slot];
    if (ownedItemIds.includes(id) && ITEM_DEFINITIONS[id]?.slot === slot) equipped[slot] = id;
  }
  if (legacyStarterHarness) {
    equipped.hood = "signature_hood";
    equipped.neck = null;
    equipped.harness = null;
  }
  const placedItemIds = uniqueKnown(candidate.placedItemIds)
    .filter((id) => ownedItemIds.includes(id) && ITEM_DEFINITIONS[id].type === "placeable");
  return {
    version: 1,
    ownedItemIds,
    equipped,
    placedItemIds,
    discoveredAt: candidate.discoveredAt && typeof candidate.discoveredAt === "object" ? { ...candidate.discoveredAt } : {},
  };
}

export function addInventoryItem(candidate, itemId, now = Date.now()) {
  const inventory = normalizeInventory(candidate);
  if (!ITEM_DEFINITIONS[itemId] || inventory.ownedItemIds.includes(itemId)) return { inventory, added: false };
  return {
    added: true,
    inventory: {
      ...inventory,
      ownedItemIds: [...inventory.ownedItemIds, itemId],
      discoveredAt: { ...inventory.discoveredAt, [itemId]: now },
    },
  };
}

export function toggleEquipment(candidate, itemId) {
  const inventory = normalizeInventory(candidate);
  const item = ITEM_DEFINITIONS[itemId];
  if (!item || item.type !== "wearable" || !inventory.ownedItemIds.includes(itemId)) return { inventory, equipped: false, replacedId: null };
  const alreadyEquipped = inventory.equipped[item.slot] === itemId;
  const replacedId = alreadyEquipped ? null : inventory.equipped[item.slot];
  return {
    equipped: !alreadyEquipped,
    replacedId,
    inventory: {
      ...inventory,
      equipped: { ...inventory.equipped, [item.slot]: alreadyEquipped ? null : itemId },
    },
  };
}

export function togglePlacedItem(candidate, itemId) {
  const inventory = normalizeInventory(candidate);
  const item = ITEM_DEFINITIONS[itemId];
  if (!item || item.type !== "placeable" || !inventory.ownedItemIds.includes(itemId)) return { inventory, placed: false };
  const alreadyPlaced = inventory.placedItemIds.includes(itemId);
  return {
    placed: !alreadyPlaced,
    inventory: {
      ...inventory,
      placedItemIds: alreadyPlaced
        ? inventory.placedItemIds.filter((id) => id !== itemId)
        : [...inventory.placedItemIds, itemId],
    },
  };
}

function seedNumber(value) {
  return [...String(value)].reduce((sum, character) => ((sum * 31) + character.charCodeAt(0)) >>> 0, 17);
}

export function rewardForDestination(candidate, destinationId, seed = "capy") {
  const inventory = normalizeInventory(candidate);
  const preferred = DESTINATION_REWARDS[destinationId] || [];
  const allItems = Object.keys(ITEM_DEFINITIONS);
  const available = [...preferred, ...allItems].filter((id, index, list) => list.indexOf(id) === index && !inventory.ownedItemIds.includes(id));
  if (!available.length) return null;
  return available[seedNumber(`${seed}:${destinationId}:${inventory.ownedItemIds.length}`) % available.length];
}

export function inventoryCompletion(candidate) {
  const inventory = normalizeInventory(candidate);
  return { owned: inventory.ownedItemIds.length, total: Object.keys(ITEM_DEFINITIONS).length };
}

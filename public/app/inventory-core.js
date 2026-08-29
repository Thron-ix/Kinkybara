export const EQUIPMENT_SLOTS = Object.freeze({
  hood: "HOOD",
  eyes: "EYES",
  neck: "NECK",
  harness: "HARNESS",
  paws: "PAWS",
});

export const ITEM_DEFINITIONS = Object.freeze({
  signature_hood: { id: "signature_hood", type: "wearable", slot: "hood", label: "Signature pup hood", icon: "▰", detail: "Soft ears, an open snout and both of your pack colors." },
  night_hood: { id: "night_hood", type: "wearable", slot: "hood", label: "Night hood", icon: "◆", detail: "A dark hood with bright ear panels." },
  prism_hood: { id: "prism_hood", type: "wearable", slot: "hood", label: "Prism hood", icon: "◇", detail: "Catches every bit of club light." },
  round_glasses: { id: "round_glasses", type: "wearable", slot: "eyes", label: "Round glasses", icon: "◎", detail: "For thoughtful looks across the lounge." },
  neon_visors: { id: "neon_visors", type: "wearable", slot: "eyes", label: "Neon visors", icon: "═", detail: "Two bright lines for late-night adventures." },
  soft_collar: { id: "soft_collar", type: "wearable", slot: "neck", label: "Soft collar", icon: "○", detail: "Soft enough to cuddle. Firm enough to make a point." },
  pack_bandana: { id: "pack_bandana", type: "wearable", slot: "neck", label: "Pack bandana", icon: "▽", detail: "A quiet signal for those who know." },
  soft_harness: { id: "soft_harness", type: "wearable", slot: "harness", label: "Signature harness", icon: "H", detail: "Your two colors. Your rules." },
  cross_harness: { id: "cross_harness", type: "wearable", slot: "harness", label: "Cross harness", icon: "X", detail: "Bold straps for a confident party look." },
  reflective_harness: { id: "reflective_harness", type: "wearable", slot: "harness", label: "Reflective harness", icon: "H", detail: "Glows softly when the room gets darker." },
  paw_warmers: { id: "paw_warmers", type: "wearable", slot: "paws", label: "Paw warmers", icon: "∥", detail: "Cozy bands in your secondary color." },
  sturdy_boots: { id: "sturdy_boots", type: "wearable", slot: "paws", label: "Sturdy boots", icon: "▰", detail: "Ready for concrete floors and long nights." },
  card_table: { id: "card_table", type: "placeable", area: "wintergarden", label: "Pack Cards table", icon: "▦", detail: "Five shameless draws are always ready here." },
  karaoke_mic: { id: "karaoke_mic", type: "placeable", area: "wintergarden", label: "Karaoke mic", icon: "♪", detail: "For brave solos and louder group choruses." },
  juice_bar: { id: "juice_bar", type: "placeable", area: "wintergarden", label: "Juice bar", icon: "▥", detail: "Orange and pineapple juice for the whole pack." },
  gear_locker: { id: "gear_locker", type: "placeable", area: "home", label: "Gear locker", icon: "▣", detail: "Keeps every carefully designed look together." },
  kennel_sign: { id: "kennel_sign", type: "placeable", area: "meadow", label: "Kennel sign", icon: "K", detail: "Warm welcome. Sharp attitude." },
  play_mat: { id: "play_mat", type: "placeable", area: "garden", label: "Play mat", icon: "▤", detail: "Ask first. Then play rough." },
  neon_lamp: { id: "neon_lamp", type: "placeable", area: "garden", label: "Neon lamp", icon: "✦", detail: "Paints the Play Area in your signature colors." },
  tiny_speaker: { id: "tiny_speaker", type: "placeable", area: "meadow", label: "Tiny speaker", icon: "♫", detail: "Keeps the Kennel Club moving after dark." },
  memory_camera: { id: "memory_camera", type: "placeable", area: "home", label: "Memory camera", icon: "◉", detail: "For snapshots that never leave this browser." },
});

const ITEM_COPY_DE = Object.freeze({
  signature_hood: ["Signatur-Pup-Hood", "Weiche Ohren, eine freie Schnute und beide Pack-Farben."],
  night_hood: ["Nacht-Hood", "Eine dunkle Hood mit leuchtenden Ohrenflächen."],
  prism_hood: ["Prisma-Hood", "Fängt jedes bisschen Clublicht ein."],
  round_glasses: ["Runde Brille", "Für nachdenkliche Blicke durch die Lounge."],
  neon_visors: ["Neon-Visier", "Zwei helle Linien für Abenteuer bis spät in die Nacht."],
  soft_collar: ["Weiches Halsband", "Weich genug zum Kuscheln. Fest genug für eine Ansage."],
  pack_bandana: ["Pack-Bandana", "Ein stilles Zeichen für alle, die Bescheid wissen."],
  soft_harness: ["Signatur-Harness", "Deine beiden Farben. Deine Regeln."],
  cross_harness: ["Kreuz-Harness", "Klare Riemen für einen selbstbewussten Partylook."],
  reflective_harness: ["Reflektor-Harness", "Leuchtet sanft, wenn der Raum dunkler wird."],
  paw_warmers: ["Pfotenwärmer", "Gemütliche Bänder in deiner Sekundärfarbe."],
  sturdy_boots: ["Feste Boots", "Bereit für Betonböden und lange Nächte."],
  card_table: ["Pack-Cards-Tisch", "Fünf schamlose Züge sind hier jederzeit bereit."],
  karaoke_mic: ["Karaoke-Mikro", "Für mutige Soli und noch lautere Gruppenrefrains."],
  juice_bar: ["Saftbar", "Orangen- und Ananassaft für das ganze Pack."],
  gear_locker: ["Gear-Schrank", "Hält jeden sorgfältig gestalteten Look zusammen."],
  kennel_sign: ["Kennel-Schild", "Warmer Empfang. Scharfe Attitude."],
  play_mat: ["Spielmatte", "Erst fragen. Dann rough spielen."],
  neon_lamp: ["Neonlampe", "Taucht die Play Area in deine Signaturfarben."],
  tiny_speaker: ["Kleiner Lautsprecher", "Hält den Kennel Club auch nach Einbruch der Dunkelheit in Bewegung."],
  memory_camera: ["Erinnerungskamera", "Für Schnappschüsse, die diesen Browser nie verlassen."],
});

const SLOT_COPY_DE = Object.freeze({ hood: "HOOD", eyes: "AUGEN", neck: "HALS", harness: "HARNESS", paws: "PFOTEN" });

export function localizedItem(item, language = "en") {
  if (!item || language !== "de") return item;
  const copy = ITEM_COPY_DE[item.id];
  return copy ? { ...item, label: copy[0], detail: copy[1] } : item;
}

export function localizedSlot(slot, language = "en") {
  return language === "de" ? SLOT_COPY_DE[slot] || EQUIPMENT_SLOTS[slot] : EQUIPMENT_SLOTS[slot];
}

export const DESTINATION_REWARDS = Object.freeze({
  folsom: ["signature_hood", "soft_collar", "memory_camera"],
  laboratory: ["night_hood", "reflective_harness", "neon_lamp"],
  berghain: ["neon_visors", "cross_harness", "tiny_speaker"],
  ruhr_pack: ["sturdy_boots", "kennel_sign", "gear_locker"],
  mannheim: ["pack_bandana", "karaoke_mic", "juice_bar"],
  csd_berlin: ["prism_hood", "card_table", "memory_camera"],
  csd_cologne: ["paw_warmers", "play_mat", "juice_bar"],
  csd_hamburg: ["round_glasses", "tiny_speaker", "neon_lamp"],
});

const STARTER_ITEMS = Object.freeze(["signature_hood", "card_table"]);

function uniqueKnown(values) {
  return [...new Set(Array.isArray(values) ? values.filter((id) => ITEM_DEFINITIONS[id]) : [])];
}

export function createInventory() {
  return {
    version: 1,
    ownedItemIds: [...STARTER_ITEMS],
    equipped: { hood: "signature_hood", eyes: null, neck: null, harness: null, paws: null },
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
  const automaticStarterCollar = candidate.equipped?.hood === "signature_hood"
    && candidate.equipped?.neck === "soft_collar"
    && !candidate.equipped?.harness;
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
  if (automaticStarterCollar) equipped.neck = null;
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

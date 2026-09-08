import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { STORY_SIZE, captureStoryAppearance, storyAssetPaths } from "../public/app/story-card.js";
import { CAPY_PIXELS } from "../public/app/pet-art.js";
import { t } from "../public/app/i18n.js";
import { createInventory, addInventoryItem, normalizeInventory, toggleEquipment, DESTINATION_REWARDS } from "../public/app/inventory-core.js";

test("Story export is 9:16 and captures appearance without leaking save data", () => {
  assert.deepEqual(STORY_SIZE, { width: 1080, height: 1920 });
  const state = { name: "Thron", language: "de", social: 24, memories: ["private"], inventory: { equipped: { paws: "sport_socks", tail: "signature_tail", hood: null } } };
  const before = JSON.stringify(state);
  const previous = globalThis.getComputedStyle;
  globalThis.getComputedStyle = () => ({ backgroundColor: "#a86f43", getPropertyValue: () => "#55bd82" });
  try {
    const appearance = captureStoryAppearance(state, { querySelector: (selector) => selector.startsWith(".pixel-") ? {} : null });
    assert.deepEqual(Object.keys(appearance).sort(), ["name", "language", "primary", "secondary", "palette", "hood", "gear"].sort());
    assert.equal(appearance.name, "Thron");
    assert.equal(appearance.hood, null);
    assert.ok(!Object.hasOwn(appearance.palette, "."));
    for (const code of new Set(CAPY_PIXELS.join("").replaceAll(".", ""))) assert.ok(appearance.palette[code]);
    assert.equal(JSON.stringify(state), before, "creating a portrait must not change XP, needs or equipment");
  } finally {
    if (previous) globalThis.getComputedStyle = previous;
    else delete globalThis.getComputedStyle;
  }
});

test("Story assets are local, deduplicated and precached, including tintable gear", async () => {
  const shell = await readFile(new URL("../public/app/sw.js", import.meta.url), "utf8");
  const paths = storyAssetPaths({ hood: {}, gear: ["sport_socks", "signature_socks", "signature_tail", "soft_collar"] });
  assert.equal(paths.length, new Set(paths).size);
  for (const path of paths) {
    assert.ok(path.startsWith("./assets/"));
    assert.ok(shell.includes(`"${path}"`));
    await readFile(new URL(`../public/app/${path}`, import.meta.url));
  }
  assert.ok(shell.includes('"./story-card.js"'));
});

test("all Story controls have natural German and English copy", () => {
  for (const key of ["open", "title", "hint", "eyebrow", "image", "share", "save", "loading", "error", "shareError"]) {
    const id = `story.${key}`;
    assert.notEqual(t("de", id), id);
    assert.notEqual(t("en", id), id);
    assert.notEqual(t("de", id), t("en", id));
  }
});

test("socks replace footwear, tail has its own slot, and both survive old saves", () => {
  let inventory = createInventory();
  delete inventory.equipped.tail;
  for (const id of ["sport_socks", "signature_socks", "signature_tail", "sturdy_boots"]) {
    assert.ok(Object.values(DESTINATION_REWARDS).flat().includes(id), `${id} can be found`);
    inventory = addInventoryItem(inventory, id).inventory;
  }
  for (const id of ["sturdy_boots", "signature_tail", "sport_socks"]) inventory = toggleEquipment(inventory, id).inventory;
  assert.equal(inventory.equipped.paws, "sport_socks");
  const replacement = toggleEquipment(inventory, "signature_socks");
  assert.equal(replacement.replacedId, "sport_socks");
  inventory = normalizeInventory(JSON.parse(JSON.stringify(replacement.inventory)));
  assert.equal(inventory.equipped.paws, "signature_socks");
  assert.equal(inventory.equipped.tail, "signature_tail");
  assert.equal(inventory.equipped.hood, "signature_hood");
  assert.equal(normalizeInventory({}).equipped.tail, null);
});

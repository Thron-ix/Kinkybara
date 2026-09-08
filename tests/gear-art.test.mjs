import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { GEAR_ART } from "../public/app/gear-art.js";
import { CAPY_WIDTH, CAPY_HEIGHT } from "../public/app/pet-art.js";
import { ITEM_DEFINITIONS, createInventory, addInventoryItem, normalizeInventory, toggleEquipment, localizedItem, localizedSlot } from "../public/app/inventory-core.js";

test("every fitted accessory has transparent local artwork and stays on the sprite grid", async () => {
  const shell = await readFile(new URL("../public/app/sw.js", import.meta.url), "utf8");
  for (const [id, art] of Object.entries(GEAR_ART)) {
    assert.equal(ITEM_DEFINITIONS[id].asset, art.asset);
    assert.ok(shell.includes(`"${art.asset}"`), `${id} must work offline`);
    const png = await readFile(new URL(`../public/app/${art.asset}`, import.meta.url));
    assert.equal(png.toString("hex", 0, 8), "89504e470d0a1a0a");
    assert.equal(png[25], 6, `${id} needs RGBA, not a baked-in checkerboard`);
    for (const fit of art.wear) {
      assert.ok(fit.width > 0 && fit.height > 0);
      assert.ok(fit.x >= (art.gearLayer === "back" ? -8 : 0) && fit.x + fit.width <= CAPY_WIDTH);
      assert.ok(fit.y >= 0 && fit.y + fit.height <= CAPY_HEIGHT);
    }
  }
});

test("new cuffs survive old saves, replace only cuffs, and have German copy", () => {
  const legacy = createInventory();
  delete legacy.equipped.cuffs;
  let inventory = normalizeInventory(legacy);
  assert.equal(inventory.equipped.cuffs, null);
  assert.equal(toggleEquipment(inventory, "ankle_cuffs").equipped, false);
  for (const id of ["ankle_cuffs", "thigh_cuffs", "soft_collar", "sturdy_boots"]) {
    inventory = addInventoryItem(inventory, id).inventory;
    assert.notEqual(localizedItem(ITEM_DEFINITIONS[id], "de").label, ITEM_DEFINITIONS[id].label);
  }
  for (const id of ["soft_collar", "sturdy_boots", "ankle_cuffs"]) inventory = toggleEquipment(inventory, id).inventory;
  const swapped = toggleEquipment(inventory, "thigh_cuffs");
  assert.equal(swapped.replacedId, "ankle_cuffs");
  const restored = normalizeInventory(JSON.parse(JSON.stringify(swapped.inventory)));
  assert.equal(restored.equipped.hood, "signature_hood");
  assert.equal(restored.equipped.neck, "soft_collar", "a chosen collar must not disappear on reload");
  assert.equal(restored.equipped.paws, "sturdy_boots");
  assert.equal(restored.equipped.cuffs, "thigh_cuffs");
  assert.equal(localizedSlot("cuffs", "de"), "CUFFS");
  assert.equal(normalizeInventory(toggleEquipment(restored, "thigh_cuffs").inventory).equipped.cuffs, null);
});

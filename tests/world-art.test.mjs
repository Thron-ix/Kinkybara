import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { WORLD_ART, availableStoryDecorations, selectedStoryDecoration } from "../public/app/world-art.js";
import { ITEM_DEFINITIONS, normalizeInventory } from "../public/app/inventory-core.js";
import { CAPY_PIXELS, drawCapyFur, furCellAt } from "../public/app/pet-art.js";
import { storyAssetPaths } from "../public/app/story-card.js";

test("world trophies retain saved ownership and get stable, local scene anchors", async () => {
  const shell = await readFile(new URL("../public/app/sw.js", import.meta.url), "utf8");
  const ids = Object.keys(WORLD_ART);
  const inventory = normalizeInventory({ ownedItemIds: ids, placedItemIds: ids });
  for (const id of ids) {
    assert.ok(inventory.ownedItemIds.includes(id));
    assert.ok(inventory.placedItemIds.includes(id));
    assert.equal(ITEM_DEFINITIONS[id].area, WORLD_ART[id].area);
    assert.ok(shell.includes(`"${WORLD_ART[id].asset}"`));
    await readFile(new URL(`../public/app/${WORLD_ART[id].asset}`, import.meta.url));
  }
  assert.equal(WORLD_ART.neon_lamp.area, "home");
  assert.equal(WORLD_ART.tiny_speaker.area, "wintergarden");
  assert.equal(WORLD_ART.juice_bar.area, "garden");
  assert.equal(WORLD_ART.memory_camera.area, "home");
});

test("Story decorations are limited to owned trophies, never borrowed from another profile", () => {
  assert.deepEqual(availableStoryDecorations({ ownedItemIds: ["tiny_speaker", "soft_collar"] }), ["tiny_speaker"]);
  const appearance = { gear: [], decorations: ["tiny_speaker"] };
  assert.equal(selectedStoryDecoration(appearance, { decoration: "memory_camera" }), null);
  assert.equal(selectedStoryDecoration(appearance, { decoration: "tiny_speaker" }), "tiny_speaker");
  assert.equal(selectedStoryDecoration(appearance, { decoration: "__proto__" }), null);
  assert.deepEqual(storyAssetPaths(appearance, { decoration: "memory_camera" }), []);
  assert.deepEqual(storyAssetPaths(appearance, { decoration: "tiny_speaker" }), [WORLD_ART.tiny_speaker.asset]);
});

test("clean and ruffled fur preserve the exact silhouette, eyes, nose, mouth and blush", () => {
  const before = CAPY_PIXELS.join("");
  const palette = Object.fromEntries([...new Set(before)].map(code => [code, code]));
  const renders = [];
  for (const dirty of [false, true]) {
    const marks = [];
    const ctx = { save() {}, restore() {}, fillRect(x, y, w, h) {
      for (let sy = y; sy < y + h; sy += .25) for (let sx = x; sx < x + w; sx += .25) {
        assert.ok(furCellAt(sx, sy), `Fur escaped the mask at ${sx}, ${sy}`);
      }
      marks.push([x, y, w, h, this.fillStyle, this.globalAlpha]);
    } };
    drawCapyFur(ctx, palette, dirty);
    assert.ok(marks.length > 5000);
    renders.push(marks);
  }
  assert.notDeepEqual(renders[0], renders[1]);
  assert.equal(CAPY_PIXELS.join(""), before);
  for (const [x, y] of [[45,10],[46,11],[54,18],[51,22],[45,15],[-1,0]]) assert.equal(furCellAt(x,y), null);
});

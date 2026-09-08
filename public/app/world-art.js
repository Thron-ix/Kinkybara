// Small props sit in the near lawn, below the body rather than over the face.
export const WORLD_ART = Object.freeze({
  juice_bar: { asset: "./assets/world-juice-bar.png", area: "garden", left: "83%", bottom: "55px", width: 62, height: 44 },
  tiny_speaker: { asset: "./assets/world-boombox.png", area: "wintergarden", left: "81%", bottom: "55px", width: 77, height: 42 },
  memory_camera: { asset: "./assets/world-memory-camera.png", area: "home", left: "86%", bottom: "55px", width: 44, height: 44 },
  neon_lamp: { asset: "./assets/world-neon.svg", area: "home", effect: "neon" },
});

export function availableStoryDecorations(inventory) {
  return Object.keys(WORLD_ART).filter((id) => inventory?.ownedItemIds?.includes(id));
}

export function selectedStoryDecoration(appearance, options) {
  return Object.hasOwn(WORLD_ART, options?.decoration) && appearance.decorations?.includes(options.decoration) ? options.decoration : null;
}

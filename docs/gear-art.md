# Gear artwork · September 2026

Created with the built-in Imagegen tool (not the API/CLI fallback). The existing `public/app/assets/gear-locker.png` was the style reference; `IMG_2983.jpg` supplied the fitting problem, not an in-app asset. New images were generated separately. The two harness variants and transparency corrections used the generated source sprites as edit targets.

## Saved assets

All ten transparent PNGs live in `public/app/assets/`, use the `gear-` prefix, and are precached for offline play. Selected outputs are downscaled to a maximum dimension of 512 pixels, preserving alpha. The original generated files remain untouched. `public/app/gear-art.js` defines their wearable placements in the capy's 56 × 34 coordinate grid. Hood geometry is unchanged.

The leather-cuff sprite is worn in pairs: ankle cuffs and thigh cuffs share the dedicated cuffs slot. Both are discoverable travel souvenirs. Existing ownership and equipment are retained.

## Final prompt set

Verification: 50 automated game/public-file tests passed. Browser checks covered all ten sprites, hood/eyewear/body layering, separate ankle and thigh cuffs, wardrobe layout, saved equipment, image reuse between renders, offline reload and play, and 320/390/768 px screen widths. Pack Cards checks covered player/rival wins, ties, two-point tricks, direction of movement, duplicate taps, next-round reset, close/finish cleanup and reduced motion in German and English. Reproducible first-round feedback seeds: `feedback-1` / `style` (player), `feedback-0` / `trust` (rival), `feedback-0` / `energy` (tie), `feedback-14` / `trust` (two points).

### ring-harness

Saved: [gear-ring-harness.png](../public/app/assets/gear-ring-harness.png)

Create one production game equipment sprite, transparent RGBA background, no scene, no animal or mannequin, no text. Polished chunky pixel-art with dark plum-black outlines, carefully shaded black leather/chrome hardware and restrained cream highlights, matching the attached gear-locker illustration. Crisp shapes readable at 60–130 screen pixels. Isolated tightly framed with 6% transparent padding. All gaps between straps and inside rings must be truly transparent, not filled. This is an overlay worn on a right-facing capybara seen from its left side.
A fitted side-view leather body harness: two gently curved vertical girth straps at left and right, connecting top back strap and bottom belly strap, with two diagonal shoulder straps meeting a shiny silver O-ring toward the right third. Strong recognizable leather strapwork, buckles, tiny rivets, open transparent center. Silhouette wider than tall, width:height 1.45. Not a flat cross, not a solid vest. No cast shadow outside the object.

### cross-harness

Saved: [gear-cross-harness.png](../public/app/assets/gear-cross-harness.png)

Create a distinct leather X-HARNESS side-view sprite for a right-facing capybara, in the pixel-art style of the reference. Exactly FOUR diagonal black leather straps lead from the FOUR CORNERS to ONE silver O-ring IN THE GEOMETRIC CENTER OF THE IMAGE. They form a clear symmetric X around the central ring. Small buckles on each diagonal, curved short girth bands joining the top and bottom on the left and right, no horizontal belt across the center. Transparent gaps between all straps. This is worn clothing overlay, no animal or mannequin. Wide rectangle 1.45:1. Reference is STYLE ONLY; do NOT keep its off-center ring or Y layout. Output genuine transparent RGBA PNG alpha, no checkerboard.

Cut out this leather X harness from its background. Preserve the object. Deliver a clean, genuinely transparent PNG sprite with alpha in the background and all open spaces between straps, so another image is visible behind the harness.

### reflective-harness

Saved: [gear-reflective-harness.png](../public/app/assets/gear-reflective-harness.png)

Create a reflective variant of this exact harness game sprite. Preserve the same silhouette, straps, rings, side-view direction and framing. Add a NARROW silver-white reflective strip running down the center of the black leather straps, leaving clear black leather borders and silver buckles visible. Reflective material is a crisp inset strip, NOT a floating cross or glow. No outer shadow. Open spaces and background must remain truly transparent RGBA alpha, never checkerboard.

Background extraction for a game sprite. Remove the solid BLACK BACKGROUND and all black negative-space interiors between the harness straps from this image, replacing them with a genuinely transparent ALPHA channel. Keep the black leather STRAPS, buckles, reflective silver inset strips and ring untouched. Only retain actual equipment pixels. NO opaque black/white/gray background, NO checkerboard image. Export RGBA PNG. The fur of a game animal must be visible THROUGH the large central opening. Preserve size, crop and placement exactly.

### round-glasses

Saved: [gear-round-glasses.png](../public/app/assets/gear-round-glasses.png)

Create one production game equipment sprite, transparent RGBA background, no scene, no animal or mannequin, no text. Polished chunky pixel-art with dark plum-black outlines, carefully shaded black leather/chrome hardware and restrained cream highlights, matching the attached gear-locker illustration. Crisp shapes readable at 60–130 screen pixels. Isolated tightly framed with 6% transparent padding. All gaps between straps and inside rings must be truly transparent, not filled. This is an overlay worn on a right-facing capybara seen from its left side.
Round black glasses in three-quarter SIDE view looking RIGHT: one main round transparent clear lens on the right, thin silver inner rim, a small foreshortened far lens at far right, long elegant temple arm reaching to the LEFT. Transparent lenses with only tiny light glints, eyes must remain visible underneath. Width:height 2.4. No face.

### neon-visor

Saved: [gear-neon-visor.png](../public/app/assets/gear-neon-visor.png)

Create one production game equipment sprite, transparent RGBA background, no scene, no animal or mannequin, no text. Polished chunky pixel-art with dark plum-black outlines, carefully shaded black leather/chrome hardware and restrained cream highlights, matching the attached gear-locker illustration. Crisp shapes readable at 60–130 screen pixels. Isolated tightly framed with 6% transparent padding. All gaps between straps and inside rings must be truly transparent, not filled. This is an overlay worn on a right-facing capybara seen from its left side.
A sleek wraparound single-lens neon club visor seen from the SIDE looking RIGHT. Long black temple reaches LEFT, a curved translucent cyan-to-magenta lens on the right, thick black leather-like upper rim, small chrome hinge. Tiny crisp glow on the lens ONLY, no outer haze. Width:height 2.7.

### leather-collar

Saved: [gear-leather-collar.png](../public/app/assets/gear-leather-collar.png)

Create ONE production game-equipment sprite on a truly transparent RGBA background. Isolated, no animal, mannequin, scene, text, framing or floor shadow. Polished chunky pixel-art matching the attached gear-locker: dark plum-black outlines, black leather, chrome hardware, tiny restrained cream highlights. Strong shapes readable when reduced to 50 screen pixels. Tight composition with 6% transparent padding. This will be worn on a right-facing capybara viewed from its left side; all openings must be transparent.
A black padded leather collar SIDE VIEW as a curved slanted neck band: top left behind neck, curves down toward bottom right under jaw. Silver buckle near top, stitching, hanging polished O-ring at bottom right. A narrow curved band, not a flat horizontal belt. Width:height 0.65. Short chrome hanging ring, no chain.

### pack-bandana

Saved: [gear-pack-bandana.png](../public/app/assets/gear-pack-bandana.png)

Create ONE production game-equipment sprite on a truly transparent RGBA background. Isolated, no animal, mannequin, scene, text, framing or floor shadow. Polished chunky pixel-art matching the attached gear-locker: dark plum-black outlines, black leather, chrome hardware, tiny restrained cream highlights. Strong shapes readable when reduced to 50 screen pixels. Tight composition with 6% transparent padding. This will be worn on a right-facing capybara viewed from its left side; all openings must be transparent.
A deep plum bandana tied at the LEFT of a right-facing animal neck, with a short loose knot and a folded triangle hanging toward bottom right. Small cream paw embroidered at the corner, carefully shaded folds, visible textile texture. Width:height 1.2.

### leather-cuff

Saved: [gear-leather-cuff.png](../public/app/assets/gear-leather-cuff.png)

A single small black leather ankle cuff for a pixel-art game. Three-quarter side view, chunky dark outlines, silver buckle on the left, two rivets and a silver O-ring on the right, plum padded lining. Compact horizontal band. Isolated actual RGBA cutout, empty alpha background; no scene, no ground, no cast shadow. Output one transparent sprite, NOT a picture of a transparency checkerboard. Style reference: the polished leather and silver in the attached harness. Do not draw harness. Only one cuff. Tightly frame the cuff.

### leather-boot

Saved: [gear-leather-boot.png](../public/app/assets/gear-leather-boot.png)

Create ONE production game-equipment sprite on a truly transparent RGBA background. Isolated, no animal, mannequin, scene, text, framing or floor shadow. Polished chunky pixel-art matching the attached gear-locker: dark plum-black outlines, black leather, chrome hardware, tiny restrained cream highlights. Strong shapes readable when reduced to 50 screen pixels. Tight composition with 6% transparent padding. This will be worn on a right-facing capybara viewed from its left side; all openings must be transparent.
One short sturdy black leather boot for a capybara's stubby foot, SIDE view toe facing RIGHT, rounded square toe, short shaft, two tiny silver buckles, substantial dark sole with cream highlights. No leg, no human long foot. Squat nearly square silhouette.

### paw-warmer

Saved: [gear-paw-warmer.png](../public/app/assets/gear-paw-warmer.png)

Create ONE production game-equipment sprite on a truly transparent RGBA background. Isolated, no animal, mannequin, scene, text, framing or floor shadow. Polished chunky pixel-art matching the attached gear-locker: dark plum-black outlines, black leather, chrome hardware, tiny restrained cream highlights. Strong shapes readable when reduced to 50 screen pixels. Tight composition with 6% transparent padding. This will be worn on a right-facing capybara viewed from its left side; all openings must be transparent.
One small plush ribbed violet/plum leg warmer for a very short capybara leg. Cylindrical knit band with rolled top, visible alternating chunky stitches, darker side shading, cream knit edging. No foot/leg, nearly square squat silhouette, no buckle.

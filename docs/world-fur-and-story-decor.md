# Weltobjekte, Fell und Story-Deko

## Umsetzung

- Saftbar: kleine Theke in der Play Area; Antippen öffnet die vorhandene Futterauswahl.
- Boombox: Pack Lounge, mit aufsteigenden Noten und kurzem optischen Beat beim Antippen. Kein neuer Sound, keine XP oder Bedürfnisse durch Deko-Klicks.
- Erinnerungskamera: neben der Höhle, öffnet direkt das bestehende Story Studio.
- Neonlampe: rahmt die Höhle in der Signaturfarbe; beim Schlafen erlischt der Schein.
- Feste, bodennahe Positionen statt zufällig verteilter weißer Boxen. Vorhandene Freischaltungen und Platzierungen bleiben erhalten. Das benachbarte Karaoke-Mikro ist nun ein schmaler Mikrofonständer.
- Schlaf: dunkelblaues Fenster und drei aufsteigende Zs an der Hütte. Reduzierte Bewegung wird berücksichtigt.
- Halsband: schmalere, diagonale Außenansicht ohne Innenfutter. Pfotenwärmer: flache Strick-Außenseite, auf den beiden ursprünglichen Pfoten verankert.
- Fell: gemeinsame Canvas-Zeichenfunktion für Welt und Story, 224 × 136 Detailraster innerhalb der unveränderten 56 × 34 Silhouette. Feine Strähnen und Schattierungen; unter 38 Sauberkeit dunklere, zerzauste Büschel. Augen, Nase, Mund, Wangen, Hood und Ausrüstungsanker bleiben unverändert.
- Story: ein optionales Auswahlfeld für ein freigeschaltetes Weltstück oder „Ohne“. Keine zusätzlichen Erklärungen. Drei Looks und Spiegelung bleiben erhalten; y=1180…1610 bleibt frei für eigenen Text. Auswahl lokal gespeichert, bei nicht mehr verfügbarem Objekt zurückgesetzt. Kein Upload, keine Kontoverbindung.

## Bildherkunft und finale Prompts

Modus: integriertes Imagegen, kein CLI/API-Fallback. Transparente Alpha-Originale blieben erhalten; App-Kopien wurden ausschließlich transparent beschnitten und per Nearest-Neighbor auf die unten genannte Breite verkleinert. Der Imagegen-Skill wurde für die Einzel-Sprites genutzt. Fell, Neon-Effekt und Mikrofonständer erweitern die bestehende codebasierte Darstellung.

### Boombox

Finale App-Datei: `/Users/johanneskoch/Documents/Codex/Kinkybara/public/app/assets/world-boombox.png` (256 px breit).

Original: `/Users/johanneskoch/.codex/generated_images/01a04cb3-bd64-7833-9c69-5679f1b63427/exec-a5d7b8df-a6d7-4cd7-8ca8-335a5a9643c5.png`.

```text
Use case: stylized-concept. Create ONE transparent pixel-art game sprite: a compact 1980s boombox / ghetto blaster, front view, wide squat rectangular charcoal-black body, two recognizable round dark speaker cones with silver pixel rims, central cassette deck, a few buttons on top, a short carrying handle. Small aubergine and warm cream details. Sophisticated retro game style, clean chunky square pixels, conceptual 64x40 grid, few colors, readable at 70 pixels across. No high-resolution textures, no photorealism, no text, no logos, no loose notes, no surrounding objects, no backdrop or floor. Full object, close framing, real transparent alpha PNG, no checkerboard.
```

### Saftbar

Finale App-Datei: `/Users/johanneskoch/Documents/Codex/Kinkybara/public/app/assets/world-juice-bar.png` (256 px breit).

Original: `/Users/johanneskoch/.codex/generated_images/01a04cb3-bd64-7833-9c69-5679f1b63427/exec-f8ea20c2-a94b-4c27-bc77-6febc2848817.png`.

```text
Use case: stylized-concept. Create ONE transparent pixel-art game sprite of a tiny juice counter for a retro pet-game garden. Compact low warm timber counter, aubergine front panel with a simple peach and pineapple icon (no lettering), cream counter top with TWO colored juice bottles and one glass with a straw, a single tiny leaf. Front view with only slight depth, wide squat silhouette, no roof, no awning, no background, no characters, no extra stand or signs. Adult stylish little juice bar, limited warm wood, plum, cream, orange and pale green palette. Chunky readable pixel art, conceptual 72x56 grid, no fine textures, not photorealistic. Full object tightly framed on genuine transparent alpha PNG, no checkerboard, no ground shadow.
```

### Erinnerungskamera

Finale App-Datei: `/Users/johanneskoch/Documents/Codex/Kinkybara/public/app/assets/world-memory-camera.png` (192 px breit).

Original: `/Users/johanneskoch/.codex/generated_images/01a04cb3-bd64-7833-9c69-5679f1b63427/exec-b71ad273-66a6-4a8f-8983-399c02b3425d.png`.

```text
Use case: stylized-concept. Create ONE transparent game sprite of a small retro instant-film camera on a SHORT compact three-leg tabletop tripod. Camera cream and dark aubergine, large round black lens with tiny blue glass highlight, a little flash in upper corner and one peach shutter button, recognizable film ejection slot below lens. Front-facing with barely any perspective, crisp chunky 64x64 conceptual pixel grid. Compact stylish object fitting a cozy pixel-world porch, warm charcoal outline, no text, no people, no scenery, no paper photograph, no photorealism, no tiny fiddly details. Full camera and tripod entirely visible, tight crop, genuine transparent alpha PNG, no checkerboard, no ground.
```

### Pfotenwärmer

Finale App-Datei: `/Users/johanneskoch/Documents/Codex/Kinkybara/public/app/assets/gear-paw-warmer-v2.png` (128 px breit).

Original: `/Users/johanneskoch/.codex/generated_images/01a04cb3-bd64-7833-9c69-5679f1b63427/exec-9019653c-e758-425b-9c5f-bd92d96267ee.png`.

```text
Use case: precise-object-edit. Edit target: attached purple paw warmer. Keep aubergine cable-knit material and cream edge bands. Change from a hollow cylinder to ONLY the visible FRONT exterior of a knitted sleeve fitted around a chunky rectangular animal leg. Absolutely NO opening, NO inside fabric, NO back rim, NO ellipse or rolled cuff at the top. Top and bottom are flat near-horizontal edges, sides almost straight, shape is a squat rectangle, fits a square capybara paw, not a bracelet floating in space. Four or five bold vertical knitted ribs, chunky clean pixels, conceptual 32x24 grid, no intricate microtexture. One single sleeve front panel, centered and cropped close, transparent alpha PNG, no legs, no background, no checkerboard.
```

### Halsband

Finale App-Datei: `/Users/johanneskoch/Documents/Codex/Kinkybara/public/app/assets/gear-leather-collar-v4.png` (192 px breit).

Original: `/Users/johanneskoch/.codex/generated_images/01a04cb3-bd64-7833-9c69-5679f1b63427/exec-1fd9a5d1-5c8b-4510-b72c-977f367ae522.png`.

```text
Use case: stylized-concept. Create ONE thin fitted leather collar exterior sprite for a RIGHT-facing side-view capybara. ONLY the near exterior panel of a collar worn diagonally around the neck: an upper-left end at shoulder height curves DOWN and RIGHT toward the lower-right underside of the neck. Overall slope 50 degrees, almost a diagonal slash with slight gentle curve, NOT a horizontal U or smile. The black leather strap has consistent modest thickness (about one fifth the total width), neat bold stitching, one small silver square buckle near upper-left and one small silver O-ring hanging at lower-right. Both ends disappear behind the animal: NO interior, NO rolled or upturned ends, NO ellipse, NO rear band, NO open bowl. No animal or neck in image. Polished but restrained pixel game sprite, limited charcoal, warm black and silver palette, conceptual 48x56 grid. Full sprite with transparent alpha PNG, no backdrop, no checkerboard, no shadows, no text.
```

## Prüfung

61 Node-Tests inklusive Besitz-/Save-Kompatibilität, Deko-Freischaltung und viertelpixelgenauer Maskenprüfung. Isolierte Browserchecks für Weltplätze, Kamera-Zugang, Schlaf, alle Fellfarben, sauberes/verschmutztes Fell und Hood-Kombination. Story in drei Looks, optionaler Deko, Spiegelung, DE/EN und 320/390/768 px Breite; Offline-Start und Export mit 46 Cache-Dateien; native Share-Schnittstelle mit Test-Ersatz, kein echter Social-Media-Post. Vorhandene Pack-Cards-Regeln und Minispiel-Varianten unverändert.


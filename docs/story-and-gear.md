# Story-Ansicht und Gear-Ergänzungen

## Neue Grafiken

Erstellt mit dem integrierten Imagegen-Werkzeug (kein CLI/API-Fallback). Die Alpha-Kanäle bleiben erhalten. Die Web-Dateien wurden auf höchstens 512 Pixel verkleinert und transparent beschnitten. Die Originalausgaben bleiben unverändert erhalten.

### Weiße Sportsocken / Signatur-Socken

Datei: `public/app/assets/gear-sport-sock.png`

Prompt:

```text
Use case: stylized-concept. Asset type: transparent wearable sprite for a side-view pixel capybara game. Subject: ONE short chunky white ribbed cotton athletic tennis sock, upright cuff, rounded paw-shaped foot with toe pointing RIGHT, three thin black horizontal stripes near the cuff, visible ribbing, stitched heel and toe, dark charcoal outline. Retro pixel illustration with clean detailed material shading and crisp silhouette, consistent with a polished 16-bit leather-gear inventory. Three-quarter side view but mostly flat side-on, no leg inside. Centered full object, tight generous transparent margin, genuinely transparent alpha background. No shoe, no pair, no human, no logo, no letters, no watermark. White and neutral gray fabric only, black stripes; palette designed for runtime recoloring. Output one square PNG.
```

### Signatur-Pup-Tail

Datei: `public/app/assets/gear-pup-tail.png`

Prompt:

```text
Use case: stylized-concept. Asset type: transparent wearable costume tail sprite for a side-view capybara game facing RIGHT. Subject: ONE curved soft padded puppy costume tail, rounded base on the RIGHT edge near lower right, tail arcs up toward upper left and curls to a blunt rounded tip on the LEFT. Not furry, smooth matte fabric/rubber with a subtle seam. A friendly wagging C-shape, thick compact silhouette, neutral white and gray surface with dark charcoal outlines and rich retro pixel shading. Matching polished detailed 16-bit game gear. Centered full object on genuinely transparent alpha background, tightly framed, square image. No body, no person, no attachment plug, no text, no logo, no shadow on background. Grayscale only for runtime signature-color tint.
```

### Huhn

Datei: `public/app/assets/visitor-chicken.png`

Prompt:

```text
Use case: stylized-concept. Asset type: transparent small walking animal sprite for a pixel-art capybara pet game. Subject: ONE instantly recognizable happy plump white hen facing RIGHT in side view, bright red comb and wattle, yellow-orange pointed beak, small bright eye, layered cream-white feather wing, upright little tail feathers on left, TWO clear orange feet mid-step. Polished detailed retro pixel art, dark warm outline, friendly lively character, matching 16-bit farm game sprite, readable at just 55 pixels wide. Full body, centered on genuinely transparent alpha background, no ground, no scenery, no text, no watermark, no extra animals.
```

### Halsband, zweite Fassung

Datei: `public/app/assets/gear-leather-collar-v2.png`

Prompt:

```text
Use case: precise-object-edit. Edit target: the attached isolated black leather collar sprite. Preserve the black padded leather, silver buckle on the left, silver O-ring at lower right, stitching, retro pixel shading, transparent alpha background and no other objects. Change only its shape and perspective: make the band a more convincing gently sloping curved oval wrapping around a thick capybara neck seen side-on facing RIGHT, with the near band descending from upper left to lower right and both edges of the band following the same smooth arc. Less deeply sagging U, slightly wider fitting arc and short foreshortened far band, keeping the center hollow transparent. Entire object visible, clean silhouette, no neck or body, no text, no background.
```

Die erste Halsband-Neufassung enthielt ein Schachbrettmuster. Dieses wurde in einem zweiten Imagegen-Schritt entfernt:

```text
Use case: background-extraction. Edit the attached collar image ONLY to remove the entire gray-and-white checkerboard backdrop and all checkerboard inside the hollow collar and O-ring. Output a genuinely transparent alpha-channel PNG, not a picture of a transparency checkerboard. Keep every black leather strap, buckle, stitch, ring, shape and perspective unchanged. Entire collar retained. No new background, no checkerboard pixels, no shadow on background.
```

## Einbindung

- Socken ersetzen Boots/Pfotenwärmer im vorhandenen Pfoten-Slot. Der Tail hat einen eigenen Slot und liegt hinter dem Körper.
- Signatur-Socken und Tail werden im Browser per Canvas-Multiply eingefärbt; Alpha, Nähte und Konturen bleiben erhalten. Die Story benutzt dieselben Bilder.
- Die störende zusätzliche Augen-Animation und der direkte Hood-Knopf wurden entfernt. Die bestehenden Hood-Basis- und Farblayer bleiben unverändert.
- Gäste zeigen ein passendes Tier statt eines Buchstabens, mit kleinem Namensschild und Herz beim Begrüßen. Hilda und das laufende Huhn verwenden die neue Pixelgrafik.

## Story

Die Ansicht wird unter ⋯ → Zeig dein Kinkybara geöffnet. Der 1080×1920-PNG-Export zeichnet die tatsächlichen Fellfarben, Hood-Masken und angezogenen Teile mit ihren aktuellen Positionen. Er enthält nur Name, Outfit, Farben und die öffentliche App-Adresse, keine Bedürfnisse, Freunde, Reise- oder Tagebuchdaten. Der Bereich y=1110 bis 1640 bleibt frei für Text/Sticker. Vorschau und Download benutzen dasselbe Bild. Teilen öffnet nur nach einem Klick die Geräteauswahl; kein automatischer Upload.

## Prüfung

54 Node-Tests. Isolierte Chrome-Tests für DE/EN, Hood/ohne Hood, weißen und farbigen Tail/Socken, Download, nativen Datei-Share-Aufruf mit Test-Ersatz, Offline-Start samt Export, 320/390/768 Pixel breite Ansichten, schnelles Schließen/Öffnen, Aufnahme bei ausgeblendetem Capy und Outfit-Persistenz. Kein echter Social-Media-Post wurde ausgelöst.


# Story Studio und Pixel-Feinschliff

## Gestaltung

- Halsband: kleinere Außenansicht ohne sichtbares Innenfutter oder hochgezogene Enden. Boots und Socken sind kantiger; die vorhandenen Item-IDs und Freischaltungen bleiben erhalten.
- Drei Story-Looks (Studio, Neon, Print), Signaturfarben und Spiegelung. Name und Outfit bleiben individuell. Keine Erklärung und kein „Mein/My“. KINKYBARA und öffentliche App-Adresse bleiben unten. Die Fläche y=1180…1610 bleibt unbeschriftet. Optionen werden nur lokal gespeichert, der Spielstand wird beim Export nicht verändert.
- Hütte mit Holzbohlen, Schindeldach, kleinem Kamin und Fensterrahmen. Damwild als kleines natives 48×40-SVG mit Flecken, Ohren, Schnauze und Beinen. Keine zusätzlichen Bilddienste oder Fonts.
- Hood und Pack Cards unverändert.

## Bildherkunft

Integriertes Imagegen (kein API-/CLI-Fallback). Transparente Originale bleiben unverändert im Ausgabeordner. Für die App wurden sie mechanisch transparent beschnitten und per Nearest-Neighbor auf 128 / 80 / 64 Pixel Breite verkleinert. Echte Alpha-Kanäle sind geprüft. Frühere Halsband-Versuche mit eingebranntem Schachbrettmuster wurden nicht eingebunden. Der Imagegen-Skill führte hier zu gröberen, spielgerechten Einzel-Sprites statt hochaufgelösten Illustrationen.

### Halsband, dritte Fassung

App-Datei: `public/app/assets/gear-leather-collar-v3.png`

Original: `/Users/johanneskoch/.codex/generated_images/01a04cb3-bd64-7833-9c69-5679f1b63427/exec-c2510d61-b1b5-4114-9076-82af9767bf09.png`

Prompt:

```text
Create ONE pixel-art game equipment sprite on a truly transparent background (alpha channel). A thin black leather collar as worn by a right-facing animal. Show ONLY the near exterior side: a single narrow strap sweeping diagonally from upper left to lower right, then nearly horizontal at right. Silver buckle near its left end, tiny rivets, small hanging silver O-ring near the right end. NO neck, NO animal, NO inside lining, NO back half, NO curled ends. This is not an open three-dimensional U; it is a very slim 2D side-view exterior strap whose far side is hidden. The strap itself is only 6 pixels thick on a conceptual 64x40 pixel canvas. Large chunky crisp square pixel steps, limited palette, black ink outline, silver hardware. Compact, understated, flat game sprite. Full silhouette within frame. Output transparent alpha PNG with NO checkerboard, NO backdrop, NO floor, NO cast shadow. Black and silver object only with actual alpha everywhere else, including the O-ring hole.
```

### Kantige Boots

App-Datei: `public/app/assets/gear-pixel-boot.png`

Original: `/Users/johanneskoch/.codex/generated_images/01a04cb3-bd64-7833-9c69-5679f1b63427/exec-c1ab5f89-b1a3-40cf-bb18-4be386ffd2e0.png`

Prompt:

```text
Use case: precise-object-edit. Edit target: the attached leather boot sprite. Redesign it for the SHORT BOXY PAW of a side-view pixel capybara facing right. ONE squat chunky black leather boot, short rectangular shaft, square block toe pointing RIGHT, thick flat horizontal block sole, nearly rectangular overall silhouette, two small silver buckle details. Approximately 32 by 28 pixel art grid with very visible square pixels, dark charcoal outline and just 5 flat shaded leather tones. Do not look like a miniature human motorcycle shoe with a long curved toe. Flat side view, no hollow oval opening at top, no foot inside, no visible inner lining. Centered complete single boot, minimal transparent margin, genuinely transparent alpha background. No glow, no gradient, no scene, no labels, no text, no checkerboard.
```

### Kantige Sportsocken / Signatur-Socken

App-Datei: `public/app/assets/gear-pixel-sock.png`

Original: `/Users/johanneskoch/.codex/generated_images/01a04cb3-bd64-7833-9c69-5679f1b63427/exec-27b0f6b9-6ae1-4fd6-9882-88af6f49acda.png`

Prompt:

```text
Use case: precise-object-edit. Edit target: the attached white sports sock game sprite. Simplify and reshape for the short BOXY PAW of a side-view pixel capybara facing RIGHT. ONE short chunky almost rectangular white cotton sock, square bottom toe pointing right, flat sole, short ribbed cuff with three black horizontal stripes, NO oval hollow opening at top. This is a sock worn on a box-shaped paw that is not drawn. Approximately 32 by 28 pixel art grid, obvious coarse square pixels, just white plus three gray tones, dark pixel outline and minimal ribbing. No photographic texture, no long human sock, no curved human heel, no gradients, no fine stippling. Entire sock isolated on genuinely transparent alpha background, tightly framed. No body, no boot, no text, no checkerboard.
```

## Minispiel-Varianten

Drei begrenzte Abstufungen: 25 % ruhiger, 55 % normal, 20 % flotter. Gleiche Regeln, keine zusätzlichen Erklärungsfelder.

| Spiel | Variation |
| --- | --- |
| Funkelsterne | Erscheinungstempo, Sichtbarkeit, Zielmenge |
| Merkspiel | 4 / 6 / 8 Paare, zufällige Symbole und Anordnung |
| Kaffee | Tempo, Breite und Position des goldenen Bereichs; kurze Pause zwischen Mischungen |
| Grillfest | 8 / 10 / 12 gemischte Zutaten, 8 / 6 / 4,5 Sekunden pro Entscheidung |
| Stadtroute | 3 / 4 / 5 Ziele und 1 / 2 / 3 Ablenkungen; wechselnde Reihenfolge |
| Seerosen | 4 / 5 / 6 Runden und unterschiedlich schnelles Vorspielen |

Alle Zeitgeber werden bei Abschluss oder Abbruch aufgeräumt. Ergebnisse bleiben zwischen 0 und 100; XP-Vergabe und Tagesquest-Fortschritt werden nicht verändert. Deutsche und englische Regeln nennen keine veralteten festen Kartenzahlen.

## Prüfung

58 Node-Tests. Zusätzlich alle 18 Minispiel-Varianten im isolierten Browser perfekt durchgespielt, Abbrüche/Restzeitgeber geprüft, Grillzeit ablaufen lassen und Kaffee-Mehrfachklicks getestet. Story in DE/EN, drei Looks, Spiegelung und gespeicherte Auswahl, 320/390/768 Pixel Breite, PNG-Download, Share-Aufruf mit Test-Ersatz, Offline-Start/Export, verdecktes Capy, schnelles Schließen/Öffnen und Outfit-Persistenz. Visuelle Prüfung von Spielansicht, Halsband mit/ohne Hood, Boots, Socken, Story-Export und Kulissen. Keine echten Social-Media-Posts ausgelöst.

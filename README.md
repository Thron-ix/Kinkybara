# Kinkybara

Kinkybara is a playful, installable pocket companion and a gift from **Thron**. It builds on a virtual-pet loop with a darker, friendly, pup-inspired world.

## Open Kinkybara

**[Play Kinkybara on GitHub Pages](https://thron-ix.github.io/Kinkybara/)**

The interface starts in English and can switch to German. On first launch, the one-minute setup asks for a name, fur and two signature colors that shape the interface, world and accessories.

## Highlights

- Six needs that continue locally over time without punishment or death
- A wardrobe with hoods, harnesses, collars and color-linked accessories
- The Den, Kennel Club, Play Area and Pack Lounge
- Party and Pride outings, including Folsom Weekend and CSD destinations
- Pack Cards, a fictional five-round stat-card game
- Peaches, eggplants, orange juice and pineapple juice
- Offline-ready Progressive Web App, optimized for small portrait screens

## Privacy

Kinkybara has no account, ads, analytics, tracking, cloud save, location request or external gameplay API. Names, colors, progress and memories stay in the current browser. A static host necessarily receives normal request metadata when serving the app files; Kinkybara adds no tracking to those requests.

After one complete load, the app shell is cached for offline starts. Kinkybara does not run in the background; when reopened, it catches up from the device clock. Keeping the tab or installed app preserves the local save unless browser data is cleared.

A restrictive content policy blocks analytics, network APIs, embedded pages, plug-ins and remote scripts. Player-entered names and restored memories are sanitized before display. The Repository, License and optional Instagram links are the only external destinations; they open only when tapped and send no referrer.

No personal identity is published with this project. The creator is identified only as **Thron** and through this repository: [github.com/Thron-ix/Kinkybara](https://github.com/Thron-ix/Kinkybara).

Instagram: [@thron.ix](https://www.instagram.com/thron.ix/)

## Development

Requires Node.js 22 or newer.

```bash
npm test
npm run dev
```

The static app lives in `public/app`. The GitHub Pages workflow tests and publishes that folder.

## License and names

Released under the [MIT No Attribution license](LICENSE) (`MIT-0`). Reuse does not require creator attribution. The optional public creator name is **Thron**.

Kinkybara is an unofficial community gift. Named events, venues and other marks belong to their respective owners; no affiliation or endorsement is claimed.

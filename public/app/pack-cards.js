export const PACK_CARD_DECK = Object.freeze([
  { id: "neon-scout", name: "Neon Sniffer", role: "Nose down. Tail up.", stats: { trust: 82, style: 76, energy: 68, pack: 88 } },
  { id: "gentle-guard", name: "Leash Tease", role: "Pulls just hard enough.", stats: { trust: 96, style: 64, energy: 72, pack: 90 } },
  { id: "karaoke-pup", name: "Karaoke Pup", role: "Howls till the collars jingle.", stats: { trust: 78, style: 86, energy: 94, pack: 84 } },
  { id: "night-runner", name: "Night Runner", role: "Still bouncing at sunrise.", stats: { trust: 70, style: 88, energy: 98, pack: 72 } },
  { id: "juice-mixer", name: "Juicy Pup", role: "Brings pineapple. Keeps it juicy.", stats: { trust: 88, style: 72, energy: 76, pack: 96 } },
  { id: "gear-maker", name: "Gear Gremlin", role: "More straps. Better silhouette.", stats: { trust: 84, style: 99, energy: 66, pack: 80 } },
  { id: "quiet-friend", name: "Shy Biter", role: "Quiet stare. Cheeky teeth.", stats: { trust: 99, style: 70, energy: 58, pack: 94 } },
  { id: "pack-host", name: "Pack Flirt", role: "Wags first. Steals the room.", stats: { trust: 92, style: 82, energy: 84, pack: 99 } },
  { id: "soft-dom", name: "Soft Dom", role: "Firm voice. Soft landing.", stats: { trust: 91, style: 85, energy: 74, pack: 89 } },
  { id: "bratty-sub", name: "Bratty Sub", role: "Says ‘make me’ with excellent posture.", stats: { trust: 73, style: 92, energy: 89, pack: 97 } },
  { id: "switch-hitter", name: "Switch Hitter", role: "Changes sides before you blink.", stats: { trust: 87, style: 90, energy: 91, pack: 93 } },
  { id: "rubber-rascal", name: "Rubber Rascal", role: "Shines louder than the strobes.", stats: { trust: 68, style: 98, energy: 86, pack: 81 } },
  { id: "furry-menace", name: "Furry Menace", role: "All fluff. Questionable intentions.", stats: { trust: 89, style: 78, energy: 83, pack: 95 } },
  { id: "worship-pup", name: "Worship Pup", role: "Devotion with dramatic eye contact.", stats: { trust: 98, style: 87, energy: 62, pack: 92 } },
  { id: "edge-runner", name: "Edge Runner", role: "Stops one beat before the drop.", stats: { trust: 76, style: 91, energy: 97, pack: 85 } },
  { id: "chill-handler", name: "Chill Handler", role: "Owns the remote. Negotiates the rest.", stats: { trust: 94, style: 80, energy: 69, pack: 96 } },
  { id: "bubble-blower", name: "Bubble Blower", role: "Blow … bubbles. Obviously.", stats: { trust: 79, style: 84, energy: 88, pack: 90 } },
]);

const LABELS = Object.freeze({
  en: { trust: "BARK", style: "GEAR", energy: "STAMINA", pack: "CHEEK", choose: "Show me your best number", next: "DEAL ANOTHER", draw: "SHOW THE SCORE", win: "You’re on top", lose: "Kinkybara is on top", tie: "Same heat. Again?", you: "YOU" },
  de: { trust: "WUFF", style: "GEAR", energy: "AUSDAUER", pack: "FRECHHEIT", choose: "Zeig deinen stärksten Wert", next: "NOCH EINE KARTE", draw: "ZEIG DEN ENDSCORE", win: "Du liegst oben", lose: "Kinkybara liegt oben", tie: "Gleich heiß. Nochmal?", you: "DU" },
});

const CARD_COPY_DE = Object.freeze({
  "neon-scout": ["Neon-Schnüffler", "Nase runter. Rute hoch."],
  "gentle-guard": ["Leinen-Tease", "Zieht genau stark genug."],
  "karaoke-pup": ["Karaoke-Pup", "Heult, bis die Halsbänder klingeln."],
  "night-runner": ["Nachtläufer", "Hüpft noch bei Sonnenaufgang."],
  "juice-mixer": ["Saftiger Pup", "Bringt Ananas. Macht’s extra saftig."],
  "gear-maker": ["Gear-Gremlin", "Mehr Riemen. Bessere Silhouette."],
  "quiet-friend": ["Schüchterner Beißer", "Leiser Blick. Freche Zähne."],
  "pack-host": ["Pack-Flirt", "Wedelt zuerst. Klaut die Show."],
  "soft-dom": ["Soft Dom", "Feste Stimme. Weiche Landung."],
  "bratty-sub": ["Bratty Sub", "Sagt ‚zwing mich‘ in perfekter Haltung."],
  "switch-hitter": ["Switch Hitter", "Wechselt die Seite, bevor du blinzelst."],
  "rubber-rascal": ["Rubber-Racker", "Glänzt lauter als das Stroboskop."],
  "furry-menace": ["Furry-Bedrohung", "Nur Flausch. Fragwürdige Absichten."],
  "worship-pup": ["Worship-Pup", "Hingabe mit dramatischem Blickkontakt."],
  "edge-runner": ["Edge Runner", "Stoppt einen Beat vor dem Drop."],
  "chill-handler": ["Chill-Handler", "Hat die Fernbedienung. Verhandelt den Rest."],
  "bubble-blower": ["Bubble Blower", "Blow … bubbles. Natürlich."],
});

function seededIndex(seed, offset, length) {
  const value = [...`${seed}:${offset}`].reduce((sum, character) => ((sum * 33) ^ character.charCodeAt(0)) >>> 0, 2_166_136_261);
  return value % length;
}

function cardView(card, owner, labels, language, hidden = false) {
  const article = document.createElement("article");
  article.className = `pack-card ${hidden ? "is-hidden" : ""}`;
  article.dataset.owner = owner;
  if (hidden) {
    article.innerHTML = '<div class="pack-card-back"><strong>KINKYBARA</strong><span>PACK CARDS</span></div>';
    return article;
  }
  const displayCard = language === "de" && CARD_COPY_DE[card.id]
    ? { ...card, name: CARD_COPY_DE[card.id][0], role: CARD_COPY_DE[card.id][1] }
    : card;
  const portrait = document.createElement("div");
  portrait.className = "pack-card-portrait";
  portrait.textContent = displayCard.name.split(" ").map((part) => part[0]).join("");
  const title = document.createElement("div");
  title.className = "pack-card-title";
  title.innerHTML = `<strong>${displayCard.name}</strong><small>${displayCard.role}</small>`;
  const stats = document.createElement("div");
  stats.className = "pack-card-stats";
  Object.entries(card.stats).forEach(([key, value]) => {
    const row = document.createElement(owner === "you" ? "button" : "div");
    if (row instanceof HTMLButtonElement) row.type = "button";
    row.dataset.stat = key;
    row.innerHTML = `<span>${labels[key]}</span><strong>${value}</strong>`;
    stats.append(row);
  });
  article.append(portrait, title, stats);
  return article;
}

export function startPackCards({ stage, status, message, language = "en", seed = Date.now(), onFinish }) {
  const lang = language === "de" ? "de" : "en";
  const labels = LABELS[lang];
  const deck = PACK_CARD_DECK.map((card, index) => PACK_CARD_DECK[seededIndex(seed, index, PACK_CARD_DECK.length)]);
  let round = 0;
  let playerWins = 0;
  let kinkybaraWins = 0;
  let stopped = false;

  const updateStatus = () => {
    status.textContent = `${Math.min(round + 1, 5)}/5 · ${labels.you} ${playerWins} · KINKYBARA ${kinkybaraWins}`;
  };

  const renderRound = () => {
    if (stopped) return;
    stage.replaceChildren();
    stage.className = "pack-cards-stage";
    const playerCard = deck[(round * 2) % deck.length];
    const rivalCard = deck[(round * 2 + 3) % deck.length];
    const cards = document.createElement("div");
    cards.className = "pack-card-table";
    const playerView = cardView(playerCard, "you", labels, lang);
    let rivalView = cardView(rivalCard, "kinkybara", labels, lang, true);
    cards.append(playerView, rivalView);
    message.textContent = labels.choose;
    updateStatus();

    playerView.querySelectorAll("button[data-stat]").forEach((button) => {
      button.addEventListener("click", () => {
        if (stopped || playerView.classList.contains("is-played")) return;
        const stat = button.dataset.stat;
        playerView.classList.add("is-played");
        button.classList.add("is-chosen");
        const revealed = cardView(rivalCard, "kinkybara", labels, lang);
        rivalView.replaceWith(revealed);
        rivalView = revealed;
        revealed.querySelector(`[data-stat="${stat}"]`)?.classList.add("is-chosen");
        const playerValue = playerCard.stats[stat];
        const rivalValue = rivalCard.stats[stat];
        if (playerValue > rivalValue) { playerWins += 1; message.textContent = labels.win; }
        else if (playerValue < rivalValue) { kinkybaraWins += 1; message.textContent = labels.lose; }
        else message.textContent = labels.tie;
        updateStatus();

        const next = document.createElement("button");
        next.type = "button";
        next.className = "primary-button pack-card-next";
        next.textContent = round === 4 ? labels.draw : labels.next;
        next.addEventListener("click", () => {
          round += 1;
          if (round >= 5) {
            stopped = true;
            onFinish({ playerWins, kinkybaraWins, score: Math.max(35, 50 + (playerWins - kinkybaraWins) * 12) });
          } else renderRound();
        });
        stage.append(next);
      }, { once: true });
    });
    stage.append(cards);
  };

  renderRound();
  return () => { stopped = true; };
}

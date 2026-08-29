export const PACK_CARD_DECK = Object.freeze([
  { id: "neon-scout", name: "Neon Scout", role: "Finds the friendly corner", stats: { trust: 82, style: 76, energy: 68, pack: 88 } },
  { id: "gentle-guard", name: "Gentle Guard", role: "Keeps an eye on the pack", stats: { trust: 96, style: 64, energy: 72, pack: 90 } },
  { id: "karaoke-pup", name: "Karaoke Pup", role: "Always knows the chorus", stats: { trust: 78, style: 86, energy: 94, pack: 84 } },
  { id: "night-runner", name: "Night Runner", role: "Still dancing at sunrise", stats: { trust: 70, style: 88, energy: 98, pack: 72 } },
  { id: "juice-mixer", name: "Juice Mixer", role: "Pineapple for everyone", stats: { trust: 88, style: 72, energy: 76, pack: 96 } },
  { id: "gear-maker", name: "Gear Maker", role: "Two colors, one bold look", stats: { trust: 84, style: 99, energy: 66, pack: 80 } },
  { id: "quiet-friend", name: "Quiet Friend", role: "Makes breaks feel welcome", stats: { trust: 99, style: 70, energy: 58, pack: 94 } },
  { id: "pack-host", name: "Pack Host", role: "Introduces every newcomer", stats: { trust: 92, style: 82, energy: 84, pack: 99 } },
]);

const LABELS = Object.freeze({
  en: { trust: "TRUST", style: "STYLE", energy: "ENERGY", pack: "PACK SPIRIT", choose: "Choose a stat", next: "NEXT DRAW", draw: "DRAW", win: "You take the round", lose: "Kinkybara takes the round", tie: "Friendly tie" },
  de: { trust: "VERTRAUEN", style: "STYLE", energy: "ENERGIE", pack: "PACKGEIST", choose: "Wähle einen Wert", next: "NÄCHSTE RUNDE", draw: "ZIEHEN", win: "Du gewinnst die Runde", lose: "Kinkybara gewinnt die Runde", tie: "Freundliches Unentschieden" },
});

function seededIndex(seed, offset, length) {
  const value = [...`${seed}:${offset}`].reduce((sum, character) => ((sum * 33) ^ character.charCodeAt(0)) >>> 0, 2_166_136_261);
  return value % length;
}

function cardView(card, owner, labels, hidden = false) {
  const article = document.createElement("article");
  article.className = `pack-card ${hidden ? "is-hidden" : ""}`;
  article.dataset.owner = owner;
  if (hidden) {
    article.innerHTML = '<div class="pack-card-back"><strong>KINKYBARA</strong><span>PACK CARDS</span></div>';
    return article;
  }
  const portrait = document.createElement("div");
  portrait.className = "pack-card-portrait";
  portrait.textContent = card.name.split(" ").map((part) => part[0]).join("");
  const title = document.createElement("div");
  title.className = "pack-card-title";
  title.innerHTML = `<strong>${card.name}</strong><small>${card.role}</small>`;
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
    status.textContent = `${Math.min(round + 1, 5)}/5 · YOU ${playerWins} · KINKYBARA ${kinkybaraWins}`;
  };

  const renderRound = () => {
    if (stopped) return;
    stage.replaceChildren();
    stage.className = "pack-cards-stage";
    const playerCard = deck[(round * 2) % deck.length];
    const rivalCard = deck[(round * 2 + 3) % deck.length];
    const cards = document.createElement("div");
    cards.className = "pack-card-table";
    const playerView = cardView(playerCard, "you", labels);
    let rivalView = cardView(rivalCard, "kinkybara", labels, true);
    cards.append(playerView, rivalView);
    message.textContent = labels.choose;
    updateStatus();

    playerView.querySelectorAll("button[data-stat]").forEach((button) => {
      button.addEventListener("click", () => {
        if (stopped || playerView.classList.contains("is-played")) return;
        const stat = button.dataset.stat;
        playerView.classList.add("is-played");
        button.classList.add("is-chosen");
        const revealed = cardView(rivalCard, "kinkybara", labels);
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

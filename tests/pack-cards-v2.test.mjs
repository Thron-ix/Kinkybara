import assert from "node:assert/strict";
import test from "node:test";
import {
  PACK_CARD_DECK,
  PACK_CARD_DIFFICULTIES,
  PACK_CARD_RIVALS,
  packCardRuleForRound,
  resolvePackCardRound,
} from "../public/app/pack-cards.js";

test("elite Pack Card values are exceptional instead of appearing on every hand", () => {
  const values = PACK_CARD_DECK.flatMap((card) => Object.values(card.stats));
  const cardMaxima = PACK_CARD_DECK.map((card) => Math.max(...Object.values(card.stats)));

  assert.equal(Math.max(...values), 89);
  assert.ok(values.filter((value) => value > 85).length <= 3);
  assert.ok(cardMaxima.filter((value) => value > 85).length <= 3);
  assert.ok(cardMaxima.filter((value) => value <= 84).length / cardMaxima.length >= 0.7);
});

test("every match deals varied, visible scoring contracts", () => {
  const rules = Array.from({ length: 7 }, (_, round) => packCardRuleForRound("test-match", round, "switch"));
  const softRules = Array.from({ length: 5 }, (_, round) => packCardRuleForRound("soft-match", round, "soft"));

  assert.deepEqual(new Set(rules), new Set(["high", "low", "target"]));
  assert.deepEqual(new Set(softRules), new Set(["high", "low", "target"]));
});

test("blindly choosing the largest number loses under low and sweet-spot contracts", () => {
  const playerCard = { stats: { trust: 84, style: 61, energy: 47, pack: 79 } };
  const rivalCard = { stats: { trust: 80, style: 64, energy: 50, pack: 70 } };

  assert.equal(resolvePackCardRound({ playerCard, rivalCard, stat: "trust", difficulty: "soft", rule: "target" }).winner, "rival");
  assert.equal(resolvePackCardRound({ playerCard: { stats: { ...playerCard.stats, style: 60 } }, rivalCard: { stats: { ...rivalCard.stats, style: 70 } }, stat: "style", difficulty: "soft", rule: "target" }).winner, "player");
  assert.equal(resolvePackCardRound({ playerCard, rivalCard, stat: "trust", difficulty: "soft", rule: "low" }).winner, "rival");
  assert.equal(resolvePackCardRound({ playerCard: { stats: { ...playerCard.stats, energy: 40 } }, rivalCard, stat: "energy", difficulty: "soft", rule: "low" }).winner, "player");
});

test("repeat reads always reduce rank and reverse changes Switch direction", () => {
  const ordinary = { stats: { trust: 40, style: 55, energy: 70, pack: 80 } };
  const repeated = resolvePackCardRound({ playerCard: ordinary, rivalCard: ordinary, stat: "trust", previousStat: "trust", difficulty: "switch", rule: "low" });
  const fresh = resolvePackCardRound({ playerCard: ordinary, rivalCard: ordinary, stat: "trust", difficulty: "switch", rule: "low" });
  assert.equal(repeated.playerRank, fresh.playerRank - 6);

  const reverseCard = { special: "reverse", stats: ordinary.stats };
  const reversed = resolvePackCardRound({ playerCard: reverseCard, rivalCard: ordinary, stat: "style", difficulty: "switch", direction: 1 });
  assert.equal(reversed.reversed, true);
  assert.equal(reversed.nextDirection, -1);
  assert.equal(resolvePackCardRound({ playerCard: reverseCard, rivalCard: reverseCard, stat: "style", difficulty: "switch", direction: 1 }).nextDirection, 1);

  const switchCard = { special: "switch", stats: ordinary.stats };
  assert.equal(resolvePackCardRound({ playerCard: switchCard, rivalCard: ordinary, stat: "style", difficulty: "switch", direction: -1 }).comparisonStat, "trust");

  const doubleCard = { special: "double", stats: ordinary.stats };
  assert.equal(resolvePackCardRound({ playerCard: doubleCard, rivalCard: ordinary, stat: "style", difficulty: "switch" }).points, 2);
});

test("Pack Cards has two persistent named NPC rivals", () => {
  assert.deepEqual(PACK_CARD_RIVALS.map(({ id }) => id), ["roxy", "jinx"]);
  assert.equal(PACK_CARD_DIFFICULTIES.switch.counterChance, 60);
  assert.equal(PACK_CARD_DIFFICULTIES.alpha.counterChance, 80);
});

export const DIALOGUES = Object.freeze([
  {
    id: "favorite-things",
    title: "Was ich mag",
    memory: "Ihr habt Pläne für Glitzer, Ausgehen und einen Spieleabend gemacht.",
    turns: [
      {
        prompt: "Glitzer, Leute, rausgehen. Was machen wir als Nächstes?",
        choices: [
          { label: "Ein ruhiges Café suchen", response: "Gut. Hafermilchschaum und ein Platz mit Aussicht auf alle anderen.", changes: { social: 5, energy: 3 } },
          { label: "Am Teich nach Glitzer suchen", response: "Du hältst mich fest, ich finde die guten Stücke.", changes: { curiosity: 6, fun: 4 } },
          { label: "In einen Spieleladen gehen", response: "Ich nehme die Glitzerfigur. Verlieren kann ich später.", changes: { fun: 6, social: 4 } },
        ],
      },
      {
        prompt: "Danach könnten wir grillen. Du weißt hoffentlich, was niemals auf meinen Teller kommt?",
        choices: [
          { label: "Zwiebeln – auf keinen Fall", response: "Du kennst mich. Diese runden Betrüger bleiben weg.", changes: { social: 7, fun: 2 } },
          { label: "Nur Mais und Melone", response: "Knackig, süß, zwiebelfrei. Guter Plan.", changes: { satiety: 3, social: 5 } },
          { label: "Ein Überraschungsteller", response: "Einverstanden. Aber ich kontrolliere auf Zwiebeln.", changes: { curiosity: 4, fun: 4 } },
        ],
      },
    ],
  },
  {
    id: "perfect-day",
    title: "Ein ziemlich guter Tag",
    memory: "Ihr habt euren perfekten Tag geplant.",
    turns: [
      {
        prompt: "Perfekter Tag. Womit fangen wir an?",
        choices: [
          { label: "Mit Melone im Bett", response: "Frühstücksmelone. Du verstehst mich.", changes: { fun: 3, social: 4 } },
          { label: "Mit einem Abenteuer", response: "Gut. Ich packe Mut und eine Notfallkarotte.", changes: { curiosity: 6, fun: 2 } },
          { label: "Mit langem Kuscheln", response: "Dann rück näher. Üben schadet nicht.", changes: { social: 7, energy: 2 } },
        ],
      },
      {
        prompt: "Und wo schauen wir am Abend zusammen in den Himmel?",
        choices: [
          { label: "Am warmen Teich", response: "Glitzerndes Wasser, du daneben. Passt.", changes: { social: 5, curiosity: 2 } },
          { label: "Auf einer Kuscheldecke", response: "Mein Bauch taugt als Kopfkissen.", changes: { social: 6, energy: 2 } },
          { label: "In einem Melonenfeld", response: "Romantisch und essbar. Klare Wahl.", changes: { fun: 5, satiety: 2 } },
        ],
      },
    ],
  },
  {
    id: "missing-you",
    title: "Wenn du weg bist",
    memory: "Ihr habt darüber geredet, wie sich Wiederkommen anfühlt.",
    turns: [
      {
        prompt: "Wenn du weg bist, vermisse ich dich. Was hilft mir dann?",
        choices: [
          { label: "An mich zu denken?", response: "Genau. Ich denke an dich und halte hier die Stellung.", changes: { social: 7 } },
          { label: "Ein Nickerchen?", response: "Richtig. Im Traum findest du mich auch.", changes: { energy: 4, social: 3 } },
          { label: "Die Erinnerung an heute", response: "Die bleibt. Gute Momente halten eine Pause aus.", changes: { social: 6, curiosity: 2 } },
        ],
      },
      {
        prompt: "Was soll ich dir beim nächsten Wiedersehen zuerst sagen?",
        choices: [
          { label: "Ich hab dich vermisst", response: "Abgemacht. Dann komm her.", changes: { social: 8 } },
          { label: "Schön, dass du da bist", response: "Mein Lieblingssatz. Gleich nach: Hier ist Melone.", changes: { social: 6, fun: 2 } },
          { label: "Komm, wir spielen", response: "Bin schon da. Wirf.", changes: { fun: 6, energy: -1 } },
        ],
      },
    ],
  },
  {
    id: "brave-capy",
    title: "Mutig sein",
    memory: "Ihr habt über Mut und das richtige Tempo gesprochen.",
    turns: [
      {
        prompt: "Neue Dinge machen mich nervös. Was heißt mutig?",
        choices: [
          { label: "Es trotzdem versuchen", response: "Dann darf mein Herz klopfen. Ich gehe trotzdem einen Schritt.", changes: { curiosity: 7, social: 3 } },
          { label: "Jemanden dabeihaben", response: "Dann komm mit. Zusammen wirkt es kleiner.", changes: { social: 8 } },
          { label: "Sich Zeit lassen", response: "Kein Drängen. Ein Schritt, wenn er passt.", changes: { energy: 3, social: 4 } },
        ],
      },
      {
        prompt: "Welches kleine Abenteuer traust du uns heute zu?",
        choices: [
          { label: "Im Teich tauchen", response: "Ich suche unten. Du hältst Ausschau.", changes: { curiosity: 6, fun: 3 } },
          { label: "Einen neuen Weg nehmen", response: "Ich schnuppere voraus. Meine Nase kann das.", changes: { curiosity: 8 } },
          { label: "Heute einfach ausruhen", response: "Auch gut. Die Decke läuft nicht weg.", changes: { energy: 5, social: 3 } },
        ],
      },
    ],
  },
  {
    id: "dreams",
    title: "Capy-Träume",
    memory: "Ihr habt euch einen seltsamen, schönen Traum ausgedacht.",
    turns: [
      {
        prompt: "Letzte Nacht konnte ich im Traum fliegen. Was glaubst du, wie sahen meine Flügel aus?",
        choices: [
          { label: "Wie kleine Wolken", response: "Weich, rund, nicht besonders schnell. Passt zu mir.", changes: { fun: 5, energy: 3 } },
          { label: "Aus Melonenschalen", response: "Praktisch. Bei der Pause esse ich die Flügel.", changes: { fun: 7, satiety: 2 } },
          { label: "Golden und glitzernd", response: "Dann hat der ganze Teich mich gesehen.", changes: { curiosity: 5, fun: 3 } },
        ],
      },
      {
        prompt: "Wohin sollen wir heute Nacht im Traum reisen?",
        choices: [
          { label: "Zum Mond", response: "Die Krater sehen nach guten Badewannen aus.", changes: { curiosity: 7 } },
          { label: "Ans Meer", response: "Du, ich, viele Wellen. Ich nehme das Handtuch.", changes: { social: 5, curiosity: 3 } },
          { label: "In unser Zuhause", response: "Manchmal reicht der Ort, an dem man sicher ist.", changes: { social: 7, energy: 3 } },
        ],
      },
    ],
  },
  {
    id: "friendship",
    title: "Unser Ding",
    memory: "Ihr habt über eure Freundschaft gesprochen.",
    turns: [
      {
        prompt: "Was magst du am liebsten daran, dass wir Freunde sind?",
        choices: [
          { label: "Dass du mich zum Lachen bringst", response: "Gut. Das Wackelohr bleibt im Programm.", changes: { fun: 7, social: 3 } },
          { label: "Dass wir uns kümmern", response: "Du achtest auf mich und ich erinnere dich ans Durchatmen. Gutes Team.", changes: { social: 8 } },
          { label: "Dass wir Neues erleben", response: "Mit dir fühlt sich Neugier sicher an. Das ist selten.", changes: { curiosity: 6, social: 4 } },
        ],
      },
      {
        prompt: "Was soll unser geheimes Freundschaftszeichen sein?",
        choices: [
          { label: "Zweimal Nasenstups", response: "Stups, stups. Offiziell und streng geheim.", changes: { social: 6, fun: 3 } },
          { label: "Ein Melonen-Codewort", response: "Codewort: Mmmelone. Völlig unauffällig.", changes: { fun: 6, satiety: 1 } },
          { label: "Ein kleines Herz", response: "Kommt hinter mein linkes Ohr. Unsichtbar.", changes: { social: 8 } },
        ],
      },
    ],
  },
  {
    id: "feelings",
    title: "Wie war dein Tag?",
    memory: "Dein Kinkybara hat dir zugehört.",
    turns: [
      {
        prompt: "Wie war dein Tag? Ehrlich.",
        choices: [
          { label: "Leicht und schön", response: "Gut. Lass uns den Moment behalten.", changes: { fun: 5, social: 5 } },
          { label: "Ganz schön anstrengend", response: "Dann musst du hier nichts schaffen. Atme kurz mit mir.", changes: { energy: 4, social: 7 } },
          { label: "Irgendwie gemischt", response: "Darf alles nebeneinander sitzen. Hier ist Platz.", changes: { social: 7, curiosity: 2 } },
        ],
      },
      {
        prompt: "Was würde dir jetzt guttun?",
        choices: [
          { label: "Ein ruhiger Moment", response: "Dann sind wir kurz still. Ich bleibe.", changes: { energy: 5, social: 5 } },
          { label: "Etwas Albernes", response: "Gut. Dieser Po ist ab jetzt der rundeste des Tages.", changes: { fun: 8 } },
          { label: "Ein virtueller Kuschler", response: "Komm her. Warm, weich, ohne Eile.", changes: { social: 9 } },
        ],
      },
    ],
  },
  {
    id: "switch-energy",
    title: "Heute Switch?",
    memory: "Ihr habt Rollen, Grenzen und den Wechsel dazwischen ausgehandelt.",
    turns: [
      {
        prompt: "Heute fühle ich mich gleichzeitig nach ‚braver Pup‘ und ‚mach Platz, ich übernehme‘. Welche Seite willst du zuerst?",
        choices: [
          { label: "Zeig mir deinen Dom", response: "Klare Ansage. Ich höre zu – wenn ich will.", changes: { social: 6, fun: 4 } },
          { label: "Sei mein braver Sub", response: "Oh. Dann komm näher und tu nicht so unschuldig.", changes: { social: 5, fun: 6 } },
          { label: "Lass uns switchen", response: "Gut. Der Blick entscheidet, wer führt. Bis er wechselt.", changes: { social: 7, curiosity: 3 } },
        ],
      },
      {
        prompt: "Und wonach ist dir danach?",
        choices: [
          { label: "Cuddles & Snuggles", response: "Klare Ansage. Komm her, heute wird es weich.", changes: { social: 9, energy: 2 } },
          { label: "Netflix & Chill", response: "Ich nehme die Fernbedienung. Wer wen chillt, handeln wir später aus.", changes: { fun: 6, social: 5 } },
          { label: "Sniff & Worship", response: "Mutige Wahl. Nase runter, Blick hoch – und immer schön aufmerksam.", changes: { curiosity: 5, social: 6 } },
        ],
      },
    ],
  },
]);

const ENGLISH_DIALOGUES = Object.freeze({
  "favorite-things": {
    title: "Things I like",
    memory: "You made plans for glitter, going out and a game night.",
    turns: [
      ["Glitter, people, going out. What should we do next?", [["Find a quiet café", "Good. Oat-milk foam and a seat with a view of everyone else."], ["Look for glitter by the pond", "You hold on to me. I’ll find the good pieces."], ["Visit a game shop", "I’m taking the glitter piece. Losing can wait."]]],
      ["We could barbecue afterwards. You know what must never touch my plate, right?", [["Onions — absolutely not", "You know me. Keep those round impostors away."], ["Only corn and melon", "Crunchy, sweet, onion-free. Good plan."], ["A surprise plate", "Deal. But I’m checking for onions."]]],
    ],
  },
  "perfect-day": {
    title: "A pretty good day",
    memory: "You planned your perfect day.",
    turns: [
      ["Perfect day. Where do we start?", [["Melon in bed", "Breakfast melon. You understand me."], ["With an adventure", "Good. I’m packing courage and an emergency carrot."], ["With a long cuddle", "Move closer, then. Practice won’t hurt."]]],
      ["And where should we watch the sky together tonight?", [["By the warm pond", "Sparkling water, you beside me. Works."], ["On a cuddle blanket", "My belly makes a decent pillow."], ["In a melon field", "Romantic and edible. Easy choice."]]],
    ],
  },
  "missing-you": {
    title: "When you are away",
    memory: "You talked about what coming back feels like.",
    turns: [
      ["When you’re away, I miss you. What helps me then?", [["Thinking of me?", "Exactly. I think of you and hold the fort here."], ["A nap?", "Right. You can find me in a dream too."], ["Remembering today", "That stays. Good moments can handle a pause."]]],
      ["What should I say first when you return?", [["I missed you", "Deal. Then come here."], ["Good to see you", "My favorite sentence. Right after: here’s melon."], ["Come on, let's play", "Already here. Throw."]]],
    ],
  },
  "brave-capy": {
    title: "Being brave",
    memory: "You talked about courage and the right pace.",
    turns: [
      ["New things make me nervous. What does being brave mean?", [["Trying anyway", "My heart can race. I’ll still take one step."], ["Having someone with you", "Then come with me. Together it looks smaller."], ["Taking your time", "No pressure. One step when it feels right."]]],
      ["What small adventure should we dare today?", [["Dive into the pond", "I’ll search below. You keep watch."], ["Take a new path", "I’ll sniff ahead. My nose can handle it."], ["Simply rest today", "Also good. The blanket isn’t going anywhere."]]],
    ],
  },
  dreams: {
    title: "Capy dreams",
    memory: "You imagined a strange, lovely dream together.",
    turns: [
      ["Last night I could fly in my dream. What did my wings look like?", [["Like little clouds", "Soft, round, not very fast. Suits me."], ["Made of melon peel", "Practical. I’ll eat the wings during the break."], ["Golden and glittery", "Then the whole pond saw me."]]],
      ["Where should we travel in our dream tonight?", [["To the moon", "Those craters look like good bathtubs."], ["To the sea", "You, me, plenty of waves. I’ll bring the towel."], ["To our home", "Sometimes the place where you feel safe is enough."]]],
    ],
  },
  friendship: {
    title: "Our thing",
    memory: "You talked about your friendship.",
    turns: [
      ["What do you like best about us being friends?", [["You make me laugh", "Good. The wiggly ear stays in the act."], ["We care for each other", "You look after me, and I remind you to breathe. Good team."], ["We discover new things", "Curiosity feels safe with you. That’s rare."]]],
      ["What should our secret friendship sign be?", [["Two nose boops", "Boop, boop. Official and strictly secret."], ["A melon code word", "Code word: mmelon. Completely inconspicuous."], ["A little heart", "It goes behind my left ear. Invisible."]]],
    ],
  },
  feelings: {
    title: "How was your day?",
    memory: "Your Kinkybara listened to you.",
    turns: [
      ["How was your day? Honestly.", [["Light and lovely", "Good. Let’s keep the moment."], ["Pretty exhausting", "Then you don’t have to do anything here. Breathe with me."], ["Somehow mixed", "It can all sit side by side. There’s room here."]]],
      ["What would feel good right now?", [["A quiet moment", "Then we’ll be quiet. I’ll stay."], ["Something silly", "Good. This is officially the roundest butt of the day."], ["A virtual cuddle", "Come here. Warm, soft, no rush."]]],
    ],
  },
  "switch-energy": {
    title: "Switch energy",
    memory: "You negotiated roles, boundaries and the switch between them.",
    turns: [
      ["Today I feel like ‘good pup’ and ‘move over, I’m taking charge’ at the same time. Which side do you want first?", [["Show me your dom side", "Clear words. I listen — when I want to."], ["Be my good sub", "Oh. Then come closer and stop pretending to be innocent."], ["Let’s switch", "Good. The look decides who leads. Until it changes."]]],
      ["And what do you want afterwards?", [["Cuddles & snuggles", "Clear request. Come here, we’re going soft today."], ["Netflix & chill", "I get the remote. We’ll negotiate who chills whom later."], ["Sniff & worship", "Bold choice. Nose down, eyes up — and pay close attention."]]],
    ],
  },
});

export function localizedDialogue(dialogue, language = "de") {
  if (!dialogue || language !== "en") return dialogue;
  const copy = ENGLISH_DIALOGUES[dialogue.id];
  if (!copy) return dialogue;
  return {
    ...dialogue,
    title: copy.title,
    memory: copy.memory,
    turns: dialogue.turns.map((turn, turnIndex) => ({
      ...turn,
      prompt: copy.turns[turnIndex]?.[0] || turn.prompt,
      choices: turn.choices.map((choice, choiceIndex) => ({
        ...choice,
        label: copy.turns[turnIndex]?.[1]?.[choiceIndex]?.[0] || choice.label,
        response: copy.turns[turnIndex]?.[1]?.[choiceIndex]?.[1] || choice.response,
      })),
    })),
  };
}

export function dialogueFor(state) {
  if (state.social < 38) return DIALOGUES.find((dialogue) => dialogue.id === "missing-you");
  if (state.curiosity < 38) return DIALOGUES.find((dialogue) => dialogue.id === "brave-capy");
  if (state.energy < 32) return DIALOGUES.find((dialogue) => dialogue.id === "dreams");
  const index = Math.abs(Math.floor(state.interactions + state.xp)) % DIALOGUES.length;
  return DIALOGUES[index];
}

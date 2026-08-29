export const DIALOGUES = Object.freeze([
  {
    id: "favorite-things",
    title: "Capys Lieblingsdinge",
    memory: "Ihr habt über Glitzer, Ausflüge und einen perfekten Spieleabend gesprochen.",
    turns: [
      {
        prompt: "Ich mag Glitzer, Gesellschaft und unterwegs sein. Was machen wir bei unserem nächsten Ausflug?",
        choices: [
          { label: "Ein gemütliches Café suchen", response: "Oh ja! Ich nehme Hafer-Milchschaum und den Platz, an dem wir alle Leute sehen können.", changes: { social: 5, energy: 3 } },
          { label: "Glitzersteine am Teich sammeln", response: "Ich finde die funkelnden und du passt auf, dass ich vor Freude nicht hineinplumpse.", changes: { curiosity: 6, fun: 4 } },
          { label: "Einen Spieleladen besuchen", response: "Brettspiele! Ich wähle natürlich die glitzernde Figur und verliere ausgesprochen würdevoll.", changes: { fun: 6, social: 4 } },
        ],
      },
      {
        prompt: "Danach könnten wir grillen. Du weißt hoffentlich, was niemals auf meinen Teller kommt?",
        choices: [
          { label: "Zwiebeln – auf keinen Fall", response: "Du kennst mich! Diese runden Betrüger bleiben ganz weit weg von meiner Schnute.", changes: { social: 7, fun: 2 } },
          { label: "Nur Mais und Melone", response: "Knackig, süß und zwiebelfrei. Du bist eindeutig Grillmeister meines Herzens.", changes: { satiety: 3, social: 5 } },
          { label: "Ein Überraschungsteller", response: "Einverstanden – aber wir machen vorher gemeinsam die große Zwiebelkontrolle.", changes: { curiosity: 4, fun: 4 } },
        ],
      },
    ],
  },
  {
    id: "perfect-day",
    title: "Ein perfekter Capy-Tag",
    memory: "Ihr habt euren perfekten gemeinsamen Tag geplant.",
    turns: [
      {
        prompt: "Ich plane gerade unseren perfekten Tag. Womit sollen wir anfangen?",
        choices: [
          { label: "Mit Melone im Bett", response: "Du verstehst mich! Frühstücksmelone ist offiziell die gemütlichste Melone.", changes: { fun: 3, social: 4 } },
          { label: "Mit einem Abenteuer", response: "Jaaa! Ich packe Mut, Neugier und eine Notfallkarotte ein.", changes: { curiosity: 6, fun: 2 } },
          { label: "Mit langem Kuscheln", response: "Dann rücke ich jetzt schon mal ganz nah. Nur zum Üben.", changes: { social: 7, energy: 2 } },
        ],
      },
      {
        prompt: "Und wo schauen wir am Abend zusammen in den Himmel?",
        choices: [
          { label: "Am warmen Teich", response: "Das Wasser glitzert und du bist da. Besser kann ein Tag nicht enden.", changes: { social: 5, curiosity: 2 } },
          { label: "Auf einer Kuscheldecke", response: "Ich bringe meinen flauschigsten Bauch als Kopfkissen mit.", changes: { social: 6, energy: 2 } },
          { label: "In einem Melonenfeld", response: "Romantisch und essbar – das ist eindeutig die beste Art von Aussicht.", changes: { fun: 5, satiety: 2 } },
        ],
      },
    ],
  },
  {
    id: "missing-you",
    title: "Wenn du weg bist",
    memory: "Ihr habt darüber geredet, dass eure Freundschaft auch Pausen aushält.",
    turns: [
      {
        prompt: "Wenn du die App schließt, vermisse ich dich ein bisschen. Weißt du, was mir dann hilft?",
        choices: [
          { label: "An mich zu denken?", response: "Genau. Ich denke an dich und passe auf unser Zuhause auf.", changes: { social: 7 } },
          { label: "Ein Capy-Nickerchen?", response: "Sehr richtig. Im Traum kannst du mich jederzeit besuchen.", changes: { energy: 4, social: 3 } },
          { label: "Die Erinnerung an heute", response: "Die kommt direkt in mein Tagebuch. Gute Momente werden nicht kleiner, wenn man weggeht.", changes: { social: 6, curiosity: 2 } },
        ],
      },
      {
        prompt: "Was soll ich dir beim nächsten Wiedersehen zuerst sagen?",
        choices: [
          { label: "Ich hab dich vermisst", response: "Abgemacht. Und dann gibt es einen extra langen Willkommens-Kuschler.", changes: { social: 8 } },
          { label: "Schön, dass du da bist", response: "Das ist mein Lieblingssatz. Gleich nach: Hier ist deine Melone.", changes: { social: 6, fun: 2 } },
          { label: "Komm, wir spielen", response: "Dann stehe ich schon mit wackelnden Ohren am Start.", changes: { fun: 6, energy: -1 } },
        ],
      },
    ],
  },
  {
    id: "brave-capy",
    title: "Mutig sein",
    memory: "Dein Kinkybara hat dir ein kleines Geheimnis über Mut verraten.",
    turns: [
      {
        prompt: "Manchmal bin ich vor neuen Dingen aufgeregt. Was bedeutet mutig sein?",
        choices: [
          { label: "Es trotzdem versuchen", response: "Also darf mein Herz klopfen und ich kann trotzdem einen kleinen Schritt machen. Das gefällt mir.", changes: { curiosity: 7, social: 3 } },
          { label: "Jemanden dabeihaben", response: "Dann bist du mein Mut-Mensch. Zusammen sehen große Dinge gleich capy-klein aus.", changes: { social: 8 } },
          { label: "Sich Zeit lassen", response: "Sanfter Mut! Kein Rennen, kein Drängeln – nur ein Schritt, wenn er sich richtig anfühlt.", changes: { energy: 3, social: 4 } },
        ],
      },
      {
        prompt: "Welches kleine Abenteuer traust du uns heute zu?",
        choices: [
          { label: "Im Teich tauchen", response: "Blubb! Ich halte nach glitzernden Teichschätzen Ausschau.", changes: { curiosity: 6, fun: 3 } },
          { label: "Einen neuen Weg nehmen", response: "Ich schnuppere voraus. Meine Nase ist ein hervorragender Abenteuerkompass.", changes: { curiosity: 8 } },
          { label: "Heute einfach ausruhen", response: "Auch Pause machen kann mutig sein. Dann bewachen wir gemeinsam die Kuscheldecke.", changes: { energy: 5, social: 3 } },
        ],
      },
    ],
  },
  {
    id: "dreams",
    title: "Capy-Träume",
    memory: "Ihr habt euch einen besonders schönen Traum ausgedacht.",
    turns: [
      {
        prompt: "Letzte Nacht konnte ich im Traum fliegen. Was glaubst du, wie sahen meine Flügel aus?",
        choices: [
          { label: "Wie kleine Wolken", response: "Weich, rund und ein bisschen langsam – perfekte Capy-Flügel.", changes: { fun: 5, energy: 3 } },
          { label: "Aus Melonenschalen", response: "Praktisch! Bei einer Flugpause kann ich einfach meine Flügel aufessen.", changes: { fun: 7, satiety: 2 } },
          { label: "Golden und glitzernd", response: "Dann habe ich über dem Teich bestimmt wie ein kleiner Sonnenstrahl geleuchtet.", changes: { curiosity: 5, fun: 3 } },
        ],
      },
      {
        prompt: "Wohin sollen wir heute Nacht im Traum reisen?",
        choices: [
          { label: "Zum Mond", response: "Ich habe gehört, dort sind die Krater perfekte Capy-Badewannen.", changes: { curiosity: 7 } },
          { label: "Ans Meer", response: "Du, ich und tausend kleine Wellen. Ich nehme das Handtuch mit.", changes: { social: 5, curiosity: 3 } },
          { label: "In unser Zuhause", response: "Der schönste Traumort ist manchmal genau da, wo man sich sicher fühlt.", changes: { social: 7, energy: 3 } },
        ],
      },
    ],
  },
  {
    id: "friendship",
    title: "Was Freunde können",
    memory: "Dein Kinkybara und du habt besprochen, was eure Freundschaft besonders macht.",
    turns: [
      {
        prompt: "Was magst du am liebsten daran, dass wir Freunde sind?",
        choices: [
          { label: "Dass du mich zum Lachen bringst", response: "Dann trainiere ich weiter meinen berühmten Capy-Wackelohren-Witz.", changes: { fun: 7, social: 3 } },
          { label: "Dass wir uns kümmern", response: "Du achtest auf mich und ich erinnere dich ans Durchatmen. Gutes Team.", changes: { social: 8 } },
          { label: "Dass wir Neues erleben", response: "Mit dir fühlt sich Neugier warm und sicher an. Das ist ziemlich besonders.", changes: { curiosity: 6, social: 4 } },
        ],
      },
      {
        prompt: "Was soll unser geheimes Freundschaftszeichen sein?",
        choices: [
          { label: "Zweimal Nasenstups", response: "Stups, stups! Jetzt ist es offiziell und streng geheim.", changes: { social: 6, fun: 3 } },
          { label: "Ein Melonen-Codewort", response: "Codewort: Mmmelone. Unauffälliger geht es wirklich nicht.", changes: { fun: 6, satiety: 1 } },
          { label: "Ein kleines Herz", response: "Das trage ich ab jetzt unsichtbar hinter meinem linken Ohr.", changes: { social: 8 } },
        ],
      },
    ],
  },
  {
    id: "feelings",
    title: "Wie war dein Tag?",
    memory: "Dein Kinkybara hat dir zugehört und war einfach für dich da.",
    turns: [
      {
        prompt: "Wie fühlt sich dein Tag heute an? Ich höre zu, ohne zu urteilen.",
        choices: [
          { label: "Leicht und schön", response: "Dann freue ich mich mit dir! Lass uns den schönen Moment kurz festhalten.", changes: { fun: 5, social: 5 } },
          { label: "Ganz schön anstrengend", response: "Dann musst du hier nichts leisten. Atme kurz mit mir ein … und wieder aus.", changes: { energy: 4, social: 7 } },
          { label: "Irgendwie gemischt", response: "Gemischte Gefühle dürfen nebeneinander sitzen. Bei mir ist genug Platz für alle.", changes: { social: 7, curiosity: 2 } },
        ],
      },
      {
        prompt: "Was würde dir jetzt guttun?",
        choices: [
          { label: "Ein ruhiger Moment", response: "Dann sind wir einfach kurz still zusammen. Ich bleibe hier.", changes: { energy: 5, social: 5 } },
          { label: "Etwas Albernes", response: "Achtung: Ich erkläre diesen Po offiziell zum rundesten Po des Tages.", changes: { fun: 8 } },
          { label: "Ein virtueller Kuschler", response: "Kommt sofort – warm, weich und ohne Zeitlimit.", changes: { social: 9 } },
        ],
      },
    ],
  },
  {
    id: "switch-energy",
    title: "Heute Switch?",
    memory: "Ihr habt Rollen, Grenzen und die Kunst des guten Wechselns ausgehandelt.",
    turns: [
      {
        prompt: "Heute fühle ich mich gleichzeitig nach ‚braver Pup‘ und ‚mach Platz, ich übernehme‘. Welche Seite willst du zuerst?",
        choices: [
          { label: "Zeig mir deinen Dom", response: "Klare Ansage. Ich kann wunderschön zuhören – wenn ich will.", changes: { social: 6, fun: 4 } },
          { label: "Sei mein braver Sub", response: "Oh. Dann komm näher und tu nicht so unschuldig.", changes: { social: 5, fun: 6 } },
          { label: "Lass uns switchen", response: "Perfekt. Wer führt, entscheidet der Blick – und der darf jederzeit wechseln.", changes: { social: 7, curiosity: 3 } },
        ],
      },
      {
        prompt: "Und wonach ist dir danach?",
        choices: [
          { label: "Cuddles & Snuggles", response: "Endlich eine klare Ansage. Komm her – heute bekommst du die weiche Seite.", changes: { social: 9, energy: 2 } },
          { label: "Netflix & Chill", response: "Ich nehme die Fernbedienung. Wer wen chillt, handeln wir später aus.", changes: { fun: 6, social: 5 } },
          { label: "Sniff & Worship", response: "Mutige Wahl. Nase runter, Blick hoch – und immer schön aufmerksam.", changes: { curiosity: 5, social: 6 } },
        ],
      },
    ],
  },
]);

const ENGLISH_DIALOGUES = Object.freeze({
  "favorite-things": {
    title: "Capy's favorite things",
    memory: "You talked about glitter, outings and a perfect game night.",
    turns: [
      ["I like glitter, company and going out. What should we do on our next outing?", [["Find a cozy café", "Oh yes! Oat-milk foam and a seat where we can watch everyone."], ["Collect shiny stones by the pond", "I will find the sparkly ones, and you keep me from falling in with excitement."], ["Visit a game shop", "Board games! I choose the glittery piece and lose with remarkable dignity."]]],
      ["We could barbecue afterwards. You know what must never touch my plate, right?", [["Onions — absolutely not", "You know me! Those round impostors stay far away from my snout."], ["Only corn and melon", "Crunchy, sweet and onion-free. You are clearly the grill master of my heart."], ["A surprise plate", "Deal — but we do the big onion check together first."]]],
    ],
  },
  "perfect-day": {
    title: "A perfect Capy day",
    memory: "You planned your perfect day together.",
    turns: [
      ["I am planning our perfect day. How should we begin?", [["Melon in bed", "You understand me! Breakfast melon is officially the coziest melon."], ["With an adventure", "Yes! I am packing courage, curiosity and an emergency carrot."], ["With a long cuddle", "Then I am moving very close already. Just for practice."]]],
      ["And where should we watch the sky together tonight?", [["By the warm pond", "The water sparkles and you are here. A day cannot end better."], ["On a cuddle blanket", "I will bring my fluffiest belly as a pillow."], ["In a melon field", "Romantic and edible — clearly the best kind of view."]]],
    ],
  },
  "missing-you": {
    title: "When you are away",
    memory: "You talked about how friendship can hold a pause.",
    turns: [
      ["When you close the app, I miss you a little. Do you know what helps?", [["Thinking of me?", "Exactly. I think of you and look after our home."], ["A Capy nap?", "Quite right. You can visit me in a dream anytime."], ["Remembering today", "That goes straight into my journal. Good moments do not shrink when someone leaves."]]],
      ["What should I say first when you return?", [["I missed you", "Deal. Then you get an extra-long welcome cuddle."], ["Good to see you", "That is my favorite sentence. Right after: here is your melon."], ["Come on, let's play", "Then I will be ready with my ears wiggling."]]],
    ],
  },
  "brave-capy": {
    title: "Being brave",
    memory: "Your Kinkybara shared a little secret about courage.",
    turns: [
      ["New things make me nervous sometimes. What does being brave mean?", [["Trying anyway", "So my heart may race and I can still take one small step. I like that."], ["Having someone with you", "Then you are my courage person. Big things look capy-small together."], ["Taking your time", "Gentle courage! No racing, no pressure — just one step when it feels right."]]],
      ["What small adventure should we dare today?", [["Dive into the pond", "Blub! I will look for sparkling pond treasures."], ["Take a new path", "I will sniff ahead. My nose is an excellent adventure compass."], ["Simply rest today", "Rest can be brave too. We will guard the cuddle blanket together."]]],
    ],
  },
  dreams: {
    title: "Capy dreams",
    memory: "You imagined an especially lovely dream together.",
    turns: [
      ["Last night I could fly in my dream. What did my wings look like?", [["Like little clouds", "Soft, round and a little slow — perfect Capy wings."], ["Made of melon peel", "Practical! During a flying break I can simply eat my wings."], ["Golden and glittery", "Then I must have glowed over the pond like a little sunbeam."]]],
      ["Where should we travel in our dream tonight?", [["To the moon", "I hear its craters make perfect Capy bathtubs."], ["To the sea", "You, me and a thousand little waves. I will pack the towel."], ["To our home", "Sometimes the loveliest dream place is exactly where you feel safe."]]],
    ],
  },
  friendship: {
    title: "What friends can do",
    memory: "You talked about what makes your friendship special.",
    turns: [
      ["What do you like best about us being friends?", [["You make me laugh", "Then I will keep practicing my famous wiggly-ear joke."], ["We care for each other", "You look after me, and I remind you to breathe. Good team."], ["We discover new things", "Curiosity feels warm and safe with you. That is special."]]],
      ["What should our secret friendship sign be?", [["Two nose boops", "Boop, boop! Now it is official and strictly secret."], ["A melon code word", "Code word: mmelon. Truly impossible to detect."], ["A little heart", "I will wear it invisibly behind my left ear."]]],
    ],
  },
  feelings: {
    title: "How was your day?",
    memory: "Your Kinkybara listened and was simply there for you.",
    turns: [
      ["How does your day feel? I am listening without judging.", [["Light and lovely", "Then I am happy with you! Let us hold onto this good moment."], ["Pretty exhausting", "Then you do not have to achieve anything here. Breathe in with me … and out."], ["Somehow mixed", "Mixed feelings may sit next to each other. I have room for all of them."]]],
      ["What would feel good right now?", [["A quiet moment", "Then we will simply be quiet together for a bit. I am here."], ["Something silly", "Attention: I hereby declare this the roundest butt of the day."], ["A virtual cuddle", "Coming right up — warm, soft and without a time limit."]]],
    ],
  },
  "switch-energy": {
    title: "Switch energy",
    memory: "You negotiated roles, boundaries, and the fine art of switching.",
    turns: [
      ["Today I feel like ‘good pup’ and ‘move over, I’m taking charge’ at the same time. Which side do you want first?", [["Show me your dom side", "Clear words. I can listen beautifully — when I want to."], ["Be my good sub", "Oh. Then come closer and stop pretending to be innocent."], ["Let’s switch", "Perfect. The look decides who leads — and it may change anytime."]]],
      ["And what do you want afterwards?", [["Cuddles & snuggles", "Finally, a clear request. Come here — you get the soft side today."], ["Netflix & chill", "I get the remote. We’ll negotiate who chills whom later."], ["Sniff & worship", "Bold choice. Nose down, eyes up — and pay close attention."]]],
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

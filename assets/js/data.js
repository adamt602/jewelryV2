/* ─────────────────────────────────────────────────────────────
   data.js  — Jenny's Radiant Jewelry
   Edit products here.  Edit journal posts here.
   Everything else (behavior, styling) lives in app.js / styles.css.
   ───────────────────────────────────────────────────────────── */

/* ── PRODUCT CATALOG ──────────────────────────────────────── */
window.CATALOG = {
  esther:  {
    name:'The Esther',      coll:'The Amethyst Vigil', verse:'Esther 4:14',
    ins:'for such a time as this',    price:168, edN:12, edOf:25,
    img:'amethyst',     cat:'necklaces',
    desc:'Six rough amethyst points, each wrapped slow in oxidised copper. Set among sandalwood beads and a single pair of mother-of-pearl flecks. Named for the woman who walked into a room not built for her.',
    stones:['rough amethyst','sandalwood bead','mother-of-pearl','copper wire'],
    storyName:'Esther',
    story:'Esther \u2014 born Hadassah, renamed for a king\u2019s court \u2014 did not choose her moment. Her moment chose her. We made this piece for the woman who feels unready but shows up anyway.'
  },
  ruth:    {
    name:'The Ruth',        coll:'Fields of Jasper',   verse:'Ruth 1:16',
    ins:'wherever you go, I will go', price:184, edN:7,  edOf:30,
    img:'jasper',       cat:'necklaces',
    desc:'A central jasper drop, the colour of the field at harvest, flanked by two raw companions. Bone beads, brass accents, threaded with slow patience.',
    stones:['red jasper','fancy jasper','bone bead','brass accent'],
    storyName:'Ruth',
    story:'Ruth stayed when she did not have to. Her loyalty was not commanded \u2014 it was chosen, at cost, in grief. We made this piece for the woman who keeps choosing what she loves.'
  },
  hannah:  {
    name:'The Hannah Set',  coll:'Waters of Mercy',    verse:'1 Sam 1:27',
    ins:'for this child I prayed',    price:246, edN:4,  edOf:20,
    img:'turquoiseSet',  cat:'sets',
    desc:'A complete set \u2014 necklace and matching earrings \u2014 in turquoise and coral. The drops echo the tears of the woman who asked, and the joy of the woman who received. Sold together.',
    stones:['turquoise','coral','sterling silver','white bead'],
    storyName:'Hannah',
    story:'Hannah prayed in such anguish that the priest thought she was drunk. Her persistence was not a lack of faith \u2014 it was the fullest expression of it. We made this set for her.'
  },
  mary:    {
    name:'The Magnificat',  coll:'Waters of Mercy',    verse:'Luke 1:46',
    ins:'my soul magnifies',          price:210, edN:1,  edOf:15,
    img:'turquoiseSlab', cat:'necklaces',
    desc:'A single generous turquoise slab \u2014 wrapped in copper that crosses and crosses again. The longest cord we make. Wear it long over linen, or doubled at the throat.',
    stones:['turquoise slab','red jasper bead','amber glass','copper wire'],
    storyName:'Mary',
    story:'Mary did not say: I will think about it. She said: let it be. Her yes was the most consequential in history \u2014 spoken quietly, in an ordinary room, to an unexpected request.'
  },
  deborah: {
    name:'The Deborah',     coll:'The Amethyst Vigil', verse:'Judges 4:14',
    ins:'go! for this is the day',    price:94,  edN:18, edOf:30,
    img:'amethyst',     cat:'earrings',
    desc:'Drop earrings: a single small amethyst point per ear, wrapped in copper, hung from sterling hooks. Lightweight. Bold. Named for the only judge who was also a mother.',
    stones:['rough amethyst','copper wire','sterling hook'],
    storyName:'Deborah',
    story:'Deborah judged Israel under a palm tree, and then led an army into battle, and then sang about it. We made these for the woman who does too much and calls it obedience.'
  },
  abigail: {
    name:'The Abigail',     coll:'Fields of Jasper',   verse:'1 Sam 25:32',
    ins:'blessed be your discernment', price:128, edN:9, edOf:25,
    img:'jasper',       cat:'bracelets',
    desc:'A single-strand bracelet of jasper chips and bone beads, wire-clasp closure. The chips are unpolished \u2014 raw as the decision Abigail made before her husband woke.',
    stones:['jasper chips','bone disc bead','copper wire clasp'],
    storyName:'Abigail',
    story:'Abigail moved before she was asked. She saw what her husband could not, and she acted. Her quick wisdom saved her household. We made this for the woman who acts on what she knows.'
  },
  lydia:   {
    name:'The Lydia',       coll:'Waters of Mercy',    verse:'Acts 16:14',
    ins:'the Lord opened her heart',  price:156, edN:6,  edOf:20,
    img:'turquoiseSet',  cat:'necklaces',
    desc:'A shorter collar-length piece in turquoise and coral. Named for the first European convert \u2014 a merchant woman, already successful, who heard Paul by the river and believed.',
    stones:['turquoise','coral chip','white seed bead','silver accent'],
    storyName:'Lydia',
    story:'Lydia was a dealer in purple cloth \u2014 which meant she was wealthy, independent, and influential. Her conversion was not desperate. It was intelligent. We made this for her.'
  },
  naomi:   {
    name:'The Naomi',       coll:'Fields of Jasper',   verse:'Ruth 1:20',
    ins:'call me bitter; call me full', price:198, edN:3, edOf:20,
    img:'turquoiseSlab', cat:'necklaces',
    desc:'A layered piece \u2014 two strands, jasper and bone, worn together or separately. Named for the woman who renamed herself grief, and then watched grace arrive anyway.',
    stones:['fancy jasper','bone disc','amber glass','copper wire'],
    storyName:'Naomi',
    story:'Naomi told them to call her Mara \u2014 which means bitter \u2014 because she felt empty. She was not wrong about her loss. She was wrong about being alone. We made this for the woman who returns.'
  },
};

/* ── JOURNAL POSTS ────────────────────────────────────────── */
window.JOURNAL = [
  {
    id:'wrap', cat:'process notes', date:'Apr 14', read:'4 min',
    title:'Why we wrap by hand, slowly',
    exc:'A piece of wire is a record of a decision. Every loop is a choice, every cross is a thought. We do not use jigs \u2014 there is no template for intention.',
    body:`<p>A piece of wire is a record of a decision. Every loop is a choice made in real time, followed through, committed to before the next one begins. Every cross of wire over stone is a thought that landed and stayed.</p><h3>Why jigs are a shortcut we will not take</h3><p>A jig is a mould. It produces consistency, which is what manufacturing wants. What we want is the opposite. We want each piece to be the record of one person making one decision on one afternoon with one particular stone. That record cannot be templated.</p><p>The first time I tried to use a jig, the piece came out perfect. Symmetrical, even, replicable. I held it in my hand for a long time before I put it in a drawer and never used the jig again.</p><div class="post-pullquote">\u201cThe imperfection is not a flaw in the piece. It is the piece.\u201d</div><p>What the jig removed was the very thing that made the wire-wrapping worth anything: the evidence that a hand had been there, had decided, had followed through. The imperfection is not a flaw in the piece. It is the piece.</p><h3>Two to four hours</h3><p>Each piece takes somewhere between two and four hours to wrap. I cannot tell you in advance which it will be. It depends on the stone \u2014 how many edges, how the wire wants to move, how many times I have to start a section again because the tension was wrong.</p><p>I do not listen to podcasts while I wrap. I used to, and then I noticed that the pieces I made while distracted were slightly looser. The wire was technically correct but the energy was elsewhere. I stopped. Now I pray, or I sit quietly, or I listen to the kind of music that does not require anything of me.</p><p>The pieces know the difference.</p>`
  },
  {
    id:'esther', cat:'scripture studies', date:'Apr 02', read:'5 min',
    title:'On Esther, on hiddenness, on chosen names',
    exc:'Hadassah means myrtle \u2014 an evergreen tree. Esther means star. She had two names. Most of us do. The question is which one we answer to.',
    body:`<p>Her name was Hadassah. Then she became Esther.</p><p>Hadassah means myrtle \u2014 an evergreen tree, native to the Mediterranean, associated with peace and with the chosen. It does not lose its leaves in winter. It keeps its shape under pressure. It smells like something old and right.</p><h3>The second name</h3><p>Esther is harder to trace. Some scholars connect it to the Persian word for star. Some to the Hebrew root for hidden. Both seem true of her: she was a woman who shone, and a woman who concealed.</p><div class="post-pullquote">\u201cShe had two names because she lived in two worlds. Most of us do too.\u201d</div><p>Mordecai told her not to reveal her people or her kindred. She kept that instruction for years \u2014 at considerable cost, in considerable proximity to danger. Her hiddenness was not passivity. It was strategy. It was the long obedience of a woman who knew her moment had not yet come.</p><h3>For such a time as this</h3><p>When the moment came, she did not hesitate. She fasted three days, she put on her royal robes, she walked into the court of the king who had not summoned her. The penalty for that entrance, uninvited, was death. She went anyway.</p><p>We named our first piece after her not because she was brave \u2014 though she was \u2014 but because she was hidden first. Because she carried her real name in silence for years before her moment required it. The myrtle before the star. The Hadassah before the Esther.</p><p>I think a lot of the women who wear The Esther are in the Hadassah season. Still waiting. Still carrying their real name quietly. Still learning, in the hiding, what they will need to know when the court requires them.</p>`
  },
  {
    id:'shipping', cat:'reflections', date:'Mar 22', read:'3 min',
    title:'The patron saint of slow shipping',
    exc:'Some of you have written asking why your order took eleven days. The honest answer is that I held it for three. Sometimes I do.',
    body:`<p>Some of you have written asking why your order took eleven days. The honest answer is that I held it for three. Sometimes I do that.</p><p>Not because I forgot. Not because I was busy in the way that means distracted or lazy. Because the piece did not feel ready to leave yet, and I could not put my finger on the reason, and I have learned over four years of making things that this feeling is worth listening to.</p><h3>The thing I cannot explain to a shipping timeline</h3><p>Twice in the last year I held a piece past its expected ship date, and both times the customer wrote to me after receiving it to say something had arrived at exactly the right moment. Once it was the week of a funeral. Once it was the morning after a hard conversation that had been years in the making.</p><div class="post-pullquote">\u201cI am not claiming to be prophetic. I am claiming that sometimes a piece needs to wait.\u201d</div><p>I am not claiming to be prophetic. I am not claiming that I know things I cannot know. I am claiming that sometimes a piece needs to wait, and that when I honour that feeling, something about the timing of its arrival seems to have been right.</p><h3>What this costs and why it is worth it</h3><p>It costs me, occasionally, a message from someone who expected faster. I try to write back promptly and honestly. I say: I held it a few extra days. I do not always say why, because I am not always sure. I say: I am sorry for the wait, and I hope the piece is worth it when it comes.</p><p>So far, every single person has written back to say it was.</p>`
  },
  {
    id:'stone', cat:'process notes', date:'Mar 10', read:'4 min',
    title:'What every stone remembers',
    exc:'Turquoise forms slowly, under pressure, over decades. So does faith. This is not a metaphor I invented \u2014 it is geology.',
    body:`<p>Turquoise forms in arid regions, in the cracks of rock that has been under pressure for a very long time. The process takes decades. The colour comes from copper \u2014 which is exactly what I use to hold it.</p><p>I think about this when I am working with a turquoise piece. The stone has been under compression for thirty, fifty, a hundred years before it reached my table. And now I am wrapping copper around it. And the copper, in time, will patina \u2014 which is to say, it will change in the presence of air and moisture and the warmth of someone\u2019s skin.</p><h3>The theology of natural materials</h3><p>I am not a trained geologist. But I have come to understand something about stone over four years of working with it: it does not rush. It does not pretend to be something it is not. It holds its colour and its crack patterns and its imperfections with complete equanimity. It has no ego about its flaws.</p><div class="post-pullquote">\u201cThe stone does not apologise for its cracks. It is held together by them.\u201d</div><p>There is something in that for the woman who wears it. The stone does not apologise for its cracks. In turquoise, the dark veining is called the matrix \u2014 it is the rock that the turquoise grew inside. The stone is held together by what it grew through.</p>`
  },
  {
    id:'ruth-stone', cat:'scripture studies', date:'Feb 28', read:'4 min',
    title:'On choosing who to name a piece after',
    exc:'Ruth was not the obvious choice. She is not the heroine of her own book in the way Esther is. But she is the one who stays.',
    body:`<p>Ruth was not the obvious choice for a jasper piece. Jasper is a field stone \u2014 heavy, earthy, the colour of harvest and clay and turned soil. It is not a glamorous stone. It is not dramatic. It is the stone of someone who has been in the ground a long time and is not apologetic about it.</p><p>That felt like Ruth.</p><h3>The one who stays</h3><p>Esther is a heroine. She is summoned by the narrative to be heroic; the moment requires it and she rises to it. Ruth is different. Ruth does not have a dramatic moment of decision. She has a thousand small ones.</p><p>She stays when Orpah leaves. She gleans when she could ask for more. She sleeps at Boaz\u2019s feet and waits for morning. She is not passive \u2014 everything she does is deliberate \u2014 but none of it is spectacular. It is the unglamorous faithfulness of the woman who simply will not go.</p><div class="post-pullquote">\u201cWherever you go, I will go. This was not a speech. It was a decision about every subsequent day.\u201d</div><p>I made The Ruth for that woman. The one who is not in the dramatic act but in the sustained one. The one who shows up again tomorrow and the day after, not because it is easy but because she said she would.</p>`
  },
  {
    id:'first', cat:'reflections', date:'Feb 14', read:'3 min',
    title:'The first collection \u2014 what we kept, what we let go',
    exc:'Fourteen pieces were made for the first collection. Six were sold. Four were given away. Four are still here. I am not sure I will sell them.',
    body:`<p>Fourteen pieces were made for the first collection. I made them over six weeks in the autumn, at the same table where I have always worked, with a specific playlist and a specific candle and no plan for where they would go.</p><p>Six were sold in the first two days after we launched. I had not expected that. I had set up a website the week before, written the copy in one afternoon, taken photographs with my phone propped against a book. The six that sold went to people who found us through someone else\u2019s Instagram story. I still do not know whose.</p><h3>The ones that were given</h3><p>Four were given away \u2014 not as a marketing strategy, not as influencer seeding, but because I knew, for each of them, exactly who was supposed to have it. One went to my sister. One went to a woman I had been praying for. One went to a friend whose mother had just died. One I left on a stranger\u2019s doorstep with a handwritten note and the piece\u2019s verse.</p><div class="post-pullquote">\u201cI have not decided yet whether the four that are still here are mine, or whether they are waiting.\u201d</div><p>Four are still on the shelf in the studio. I look at them when I am working. They are all from the Amethyst Vigil \u2014 the deep purple pieces, wrapped in copper that has started to darken. They are, I think, the best four pieces I have ever made. I have not decided yet whether they are mine, or whether they are waiting for the right person, or whether some things are made to stay.</p>`
  },
];

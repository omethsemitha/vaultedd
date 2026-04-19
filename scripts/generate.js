// scripts/generate.js
// Runs daily via GitHub Actions
// Generates one high-quality 1500+ word mystery article

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import Groq from 'groq-sdk';
import fetch from 'node-fetch';

// ── Init ──────────────────────────────────────────────────────
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
initializeApp({ credential: cert(serviceAccount) });
const db   = getFirestore();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;

// ── Topics ────────────────────────────────────────────────────
const TOPICS = [
  { category: 'Cryptids',          topics: ['Bigfoot','Loch Ness Monster','Chupacabra','Mothman','Jersey Devil','Thunderbird','Dogman','Black Eyed Children','The Dover Demon','Yeti','Skunk Ape','The Flatwoods Monster','Lizard Man of Scape Ore Swamp','The Beast of Busco','Ogopogo'] },
  { category: 'UFOs',              topics: ['Roswell incident','Phoenix Lights','Belgian UFO wave','Rendlesham Forest incident','Travis Walton abduction','Bob Lazar Area 51','The Tic Tac UFO','Nimitz encounter','Skinwalker Ranch','Battle of Los Angeles 1942','The Kecksburg UFO','Tehran UFO incident','Shag Harbour incident','Lubbock Lights','The Westall UFO'] },
  { category: 'Ancient Mysteries', topics: ['The Nazca Lines','Stonehenge secrets','Lost city of Atlantis','The Antikythera Mechanism','Easter Island mysteries','Gobekli Tepe','The Voynich Manuscript','Egyptian pyramid secrets','The Baghdad Battery','Puma Punku','The Sacsayhuaman walls','Derinkuyu underground city','The Longyou Caves','Yonaguni Monument','The Plain of Jars'] },
  { category: 'Paranormal',        topics: ['The Amityville Horror','Shadow people','The Hat Man phenomenon','The Dyatlov Pass incident','The Bridgewater Triangle','The Sallie House haunting','Poltergeist phenomena','Near death experiences','Electronic Voice Phenomena','The Stone Tape theory','The Black Monk of Pontefract','The Bell Witch haunting','The Enfield Poltergeist','The Haunting of Borley Rectory','The Myrtles Plantation'] },
  { category: 'Mythic Creatures',  topics: ['Dragon mythology origins','The Kraken','Werewolf legends history','Vampire folklore origins','Kelpie water spirits','The Banshee','Wendigo legend','Medusa mythology','The Minotaur','Basilisk legend','The Djinn','Kitsune fox spirits','The Selkie','Baba Yaga','The Strigoi'] },
  { category: 'Unexplained',       topics: ['The Bermuda Triangle','The Philadelphia Experiment','The Taos Hum','The Wow signal','Oak Island mystery','The Tunguska event','The Mary Celeste','Green Children of Woolpit','The Hum phenomenon','The Dybbuk Box','The Oakville Blobs','The Hessdalen Lights','The Marfa Lights','The Betz Mystery Sphere','The Georgia Guidestones'] },
];

async function pickTopic() {
  const usedSnap = await db.collection('used_topics').orderBy('usedAt','desc').limit(60).get();
  const used = usedSnap.docs.map(d => d.data().topic);
  for (const group of TOPICS) {
    for (const topic of group.topics) {
      if (!used.includes(topic)) return { topic, category: group.category };
    }
  }
  // All used — start from beginning
  return { topic: TOPICS[0].topics[0], category: TOPICS[0].category };
}

async function generateArticle(topic, category) {
  console.log(`Generating article: ${topic} (${category})`);

  const prompt = `You are a senior investigative journalist for Vaultedd, a premium mystery and paranormal website.
Write a comprehensive, deeply researched article about: "${topic}" in the category "${category}".

CRITICAL: Respond with ONLY a valid JSON object. No markdown, no code blocks, no extra text before or after.
All string values must NOT contain literal newlines. Use the text \\n only where needed inside HTML.

Required JSON format (copy this structure exactly):
{"title":"Your Title Here","excerpt":"Your 2-3 sentence excerpt here.","content":"Your full HTML content here with h2 and p tags.","tags":["tag1","tag2","tag3","tag4","tag5"],"readTime":"9 min read","searchQuery":"dark forest atmospheric mystery"}

CONTENT REQUIREMENTS:
- Minimum 1500 words in the content field
- Must have at least 6 H2 subheadings
- Include documented historical accounts and real eyewitness reports
- Include a "Historical Background" section
- Include a "Key Evidence" section  
- Include a "Expert Opinions" section
- Include a "Most Notable Cases" or "Most Notable Accounts" section
- Include a "Theories and Explanations" section
- Include a "Why It Still Matters Today" section
- End with a thought-provoking conclusion paragraph
- Be factual about what is documented, clearly note what is speculation
- Do NOT make up specific names unless historically documented
- Write in an engaging, journalistic but mysterious tone
- Each paragraph should be 3-5 sentences minimum

EXCERPT: Write 2-3 compelling sentences that make people want to read more.
TAGS: 5 relevant lowercase tags
SEARCH QUERY: 2-4 atmospheric words for an Unsplash image (nature/dark/mysterious)
READ TIME: Calculate based on 1500+ words (should be "8 min read" or more)`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 4000,
  });

  const raw = completion.choices[0].message.content.trim();
  console.log('Response length:', raw.length, 'chars');

  // Clean the response
  let cleaned = raw;
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');

  const firstBrace = cleaned.indexOf('{');
  const lastBrace  = cleaned.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1) throw new Error('No JSON object found');
  cleaned = cleaned.substring(firstBrace, lastBrace + 1);

  // Fix control characters
  cleaned = cleaned.replace(/[\x00-\x09\x0b\x0c\x0e-\x1f]/g, ' ');

  // Fix literal newlines inside JSON strings
  cleaned = cleaned.replace(/("(?:[^"\\]|\\.)*")/g, (match) => {
    return match.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, ' ');
  });

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch(e) {
    console.error('JSON parse failed:', e.message);
    console.error('Cleaned preview:', cleaned.substring(0, 300));
    throw new Error(`JSON parse error: ${e.message}`);
  }

  // Convert \\n back in content
  if (parsed.content) {
    parsed.content = parsed.content.replace(/\\n/g, '\n');
  }

  // Log word count
  const wordCount = parsed.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
  console.log(`Word count: ~${wordCount} words`);

  return parsed;
}

async function fetchImage(searchQuery) {
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=5&orientation=landscape&client_id=${UNSPLASH_KEY}`;
    const res  = await fetch(url);
    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;
    const photo = data.results[Math.floor(Math.random() * Math.min(3, data.results.length))];
    await fetch(`${photo.links.download_location}&client_id=${UNSPLASH_KEY}`);
    return {
      imageUrl:       photo.urls.regular,
      imageThumb:     photo.urls.small,
      imageCredit:    photo.user.name,
      imageCreditUrl: photo.user.links.html,
    };
  } catch(e) {
    console.warn('Unsplash failed:', e.message);
    return null;
  }
}

async function saveArticle(article, imageData, topic, category) {
  const docRef = db.collection('articles').doc();
  await docRef.set({
    title:          article.title,
    excerpt:        article.excerpt,
    content:        article.content,
    category,
    tags:           article.tags || [],
    readTime:       article.readTime || '9 min read',
    publishedAt:    Timestamp.now(),
    imageUrl:       imageData?.imageUrl || null,
    imageThumb:     imageData?.imageThumb || null,
    imageCredit:    imageData?.imageCredit || null,
    imageCreditUrl: imageData?.imageCreditUrl || null,
    topic,
    generatedBy:    'groq/llama-3.3-70b-versatile',
  });
  await db.collection('used_topics').add({ topic, usedAt: Timestamp.now() });
  console.log(`✅ Saved: "${article.title}" (ID: ${docRef.id})`);
}

async function main() {
  try {
    console.log('🔮 Vaultedd Article Generator starting...');
    const { topic, category } = await pickTopic();
    const article   = await generateArticle(topic, category);
    const imageData = await fetchImage(article.searchQuery || topic);
    await saveArticle(article, imageData, topic, category);
    console.log('✨ Done! New article published.');
  } catch(e) {
    console.error('❌ Generator failed:', e);
    process.exit(1);
  }
}

main();

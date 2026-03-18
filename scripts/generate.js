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
  { category: 'Cryptids',          topics: ['Bigfoot','Loch Ness Monster','Chupacabra','Mothman','Jersey Devil','Thunderbird','Dogman','Black Eyed Children','The Dover Demon','Yeti'] },
  { category: 'UFOs',              topics: ['Roswell incident','Phoenix Lights','Belgian UFO wave','Rendlesham Forest incident','Travis Walton abduction','Bob Lazar Area 51','The Tic Tac UFO','Nimitz encounter','Skinwalker Ranch','Battle of Los Angeles 1942'] },
  { category: 'Ancient Mysteries', topics: ['The Nazca Lines','Stonehenge secrets','Lost city of Atlantis','The Antikythera Mechanism','Easter Island mysteries','Gobekli Tepe','The Voynich Manuscript','Egyptian pyramid secrets','The Baghdad Battery','Puma Punku'] },
  { category: 'Paranormal',        topics: ['The Amityville Horror','Shadow people','The Hat Man phenomenon','The Dyatlov Pass incident','The Bridgewater Triangle','The Sallie House haunting','Poltergeist phenomena','Near death experiences','Electronic Voice Phenomena','The Stone Tape theory'] },
  { category: 'Mythic Creatures',  topics: ['Dragon mythology origins','The Kraken','Werewolf legends history','Vampire folklore origins','Kelpie water spirits','The Banshee','Wendigo legend','Medusa mythology','The Minotaur','Basilisk legend'] },
  { category: 'Unexplained',       topics: ['The Bermuda Triangle','The Philadelphia Experiment','The Taos Hum','The Wow signal','Oak Island mystery','The Tungunga event','The Mary Celeste','Green Children of Woolpit','The Hum phenomenon','The Dybbuk Box'] },
];

async function pickTopic() {
  const usedSnap = await db.collection('used_topics').orderBy('usedAt','desc').limit(50).get();
  const used = usedSnap.docs.map(d => d.data().topic);
  for (const group of TOPICS) {
    for (const topic of group.topics) {
      if (!used.includes(topic)) return { topic, category: group.category };
    }
  }
  return { topic: TOPICS[0].topics[0], category: TOPICS[0].category };
}

async function generateArticle(topic, category) {
  console.log(`Generating article: ${topic} (${category})`);

  const prompt = `You are a journalist for Vaultedd, a mystery and paranormal website.
Write a detailed article about: "${topic}" in the category "${category}".

IMPORTANT: Respond with ONLY a valid JSON object. No markdown, no code blocks, no extra text.
All string values must be on single lines - no literal newlines inside strings.
Use \\n for line breaks within HTML content.

Required JSON format:
{"title":"compelling article title here","excerpt":"2-3 sentence teaser here","content":"<h2>Section One</h2><p>Paragraph one text here.</p><h2>Section Two</h2><p>Paragraph two text here.</p>","tags":["tag1","tag2","tag3","tag4","tag5"],"readTime":"6 min read","searchQuery":"atmospheric dark forest mist"}

Rules:
- title: engaging clickbait-style but factual
- excerpt: 2-3 sentences, no quotes inside
- content: valid HTML with h2 and p tags, minimum 500 words, NO newlines inside the JSON string
- tags: 5 relevant lowercase tags
- searchQuery: 2-4 words for Unsplash image search (nature/atmospheric/dark)`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 2500,
  });

  const raw = completion.choices[0].message.content.trim();
  console.log('Raw response preview:', raw.substring(0, 200));

  // Clean the response
  let cleaned = raw;

  // Remove markdown code blocks if present
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');

  // Extract JSON object
  const firstBrace = cleaned.indexOf('{');
  const lastBrace  = cleaned.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1) throw new Error('No JSON object found in response');
  cleaned = cleaned.substring(firstBrace, lastBrace + 1);

  // Fix control characters inside JSON strings
  // Replace literal newlines/tabs/carriage returns inside strings
  cleaned = cleaned.replace(/[\x00-\x09\x0b\x0c\x0e-\x1f]/g, ' ');

  // Fix literal newlines inside string values (between quotes)
  cleaned = cleaned.replace(/("(?:[^"\\]|\\.)*")/g, (match) => {
    return match.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
  });

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch(e) {
    console.error('JSON parse failed:', e.message);
    console.error('Cleaned JSON preview:', cleaned.substring(0, 500));
    throw new Error(`JSON parse error: ${e.message}`);
  }

  // Convert \\n back to actual newlines in content
  if (parsed.content) {
    parsed.content = parsed.content.replace(/\\n/g, '\n');
  }

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
    readTime:       article.readTime || '6 min read',
    publishedAt:    Timestamp.now(),
    imageUrl:       imageData?.imageUrl || null,
    imageThumb:     imageData?.imageThumb || null,
    imageCredit:    imageData?.imageCredit || null,
    imageCreditUrl: imageData?.imageCreditUrl || null,
    topic,
    generatedBy:    'groq/llama-3.3-70b-versatile',
  });
  await db.collection('used_topics').add({ topic, usedAt: Timestamp.now() });
  console.log(`✅ Article saved: "${article.title}" (ID: ${docRef.id})`);
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

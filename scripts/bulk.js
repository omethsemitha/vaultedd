// scripts/bulk.js
// Generates 20 articles at once to bulk up content
// Run once via GitHub Actions: "Bulk Generate Articles"

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import Groq from 'groq-sdk';
import fetch from 'node-fetch';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
initializeApp({ credential: cert(serviceAccount) });
const db   = getFirestore();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;

// How many articles to generate in one run
const BULK_COUNT = parseInt(process.env.BULK_COUNT || '20');

const TOPICS = [
  { category: 'Cryptids',          topics: ['Bigfoot','Loch Ness Monster','Chupacabra','Mothman','Jersey Devil','Thunderbird','Dogman','Black Eyed Children','The Dover Demon','Yeti','Skunk Ape','The Flatwoods Monster','Lizard Man','The Beast of Busco','Ogopogo'] },
  { category: 'UFOs',              topics: ['Roswell incident','Phoenix Lights','Belgian UFO wave','Rendlesham Forest incident','Travis Walton abduction','Bob Lazar Area 51','The Tic Tac UFO','Nimitz encounter','Skinwalker Ranch','Battle of Los Angeles 1942','The Kecksburg UFO','Tehran UFO incident','Shag Harbour incident','Lubbock Lights','The Westall UFO'] },
  { category: 'Ancient Mysteries', topics: ['The Nazca Lines','Stonehenge secrets','Lost city of Atlantis','The Antikythera Mechanism','Easter Island mysteries','Gobekli Tepe','The Voynich Manuscript','Egyptian pyramid secrets','The Baghdad Battery','Puma Punku','The Sacsayhuaman walls','Derinkuyu underground city','The Longyou Caves','Yonaguni Monument','The Plain of Jars'] },
  { category: 'Paranormal',        topics: ['The Amityville Horror','Shadow people','The Hat Man phenomenon','The Dyatlov Pass incident','The Bridgewater Triangle','The Sallie House haunting','Poltergeist phenomena','Near death experiences','Electronic Voice Phenomena','The Bell Witch haunting','The Enfield Poltergeist','The Haunting of Borley Rectory','The Myrtles Plantation','The Black Monk of Pontefract','The Stone Tape theory'] },
  { category: 'Mythic Creatures',  topics: ['Dragon mythology origins','The Kraken','Werewolf legends history','Vampire folklore origins','Kelpie water spirits','The Banshee','Wendigo legend','Medusa mythology','The Minotaur','Basilisk legend','The Djinn','Kitsune fox spirits','The Selkie','Baba Yaga','The Strigoi'] },
  { category: 'Unexplained',       topics: ['The Bermuda Triangle','The Philadelphia Experiment','The Taos Hum','The Wow signal','Oak Island mystery','The Tunguska event','The Mary Celeste','Green Children of Woolpit','The Hessdalen Lights','The Marfa Lights','The Betz Mystery Sphere','The Georgia Guidestones','The Oakville Blobs','The Hum phenomenon','The Dybbuk Box'] },
];

async function pickTopics(count) {
  const usedSnap = await db.collection('used_topics').orderBy('usedAt','desc').limit(100).get();
  const used = new Set(usedSnap.docs.map(d => d.data().topic));
  const available = [];
  for (const group of TOPICS) {
    for (const topic of group.topics) {
      if (!used.has(topic)) available.push({ topic, category: group.category });
    }
  }
  // Shuffle and pick
  available.sort(() => Math.random() - 0.5);
  return available.slice(0, count);
}

async function generateArticle(topic, category) {
  const prompt = `You are a senior investigative journalist for Vaultedd, a premium mystery and paranormal website.
Write a comprehensive, deeply researched article about: "${topic}" in the category "${category}".

CRITICAL: Respond with ONLY a valid JSON object. No markdown, no code blocks, no extra text.
All string values must NOT contain literal newlines.

Required JSON format:
{"title":"Your Title Here","excerpt":"Your 2-3 sentence excerpt here.","content":"Your full HTML content here.","tags":["tag1","tag2","tag3","tag4","tag5"],"readTime":"9 min read","searchQuery":"dark atmospheric mystery"}

CONTENT REQUIREMENTS:
- Minimum 1500 words
- At least 6 H2 subheadings
- Sections: Historical Background, Key Evidence, Expert Opinions, Notable Cases/Accounts, Theories and Explanations, Why It Still Matters Today, Conclusion
- Factual, journalistic, engaging tone
- Each paragraph 3-5 sentences minimum
- Do NOT make up names unless historically documented`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 4000,
  });

  let cleaned = completion.choices[0].message.content.trim();
  cleaned = cleaned.replace(/^```json\s*/i,'').replace(/^```\s*/i,'').replace(/\s*```$/i,'');
  const f = cleaned.indexOf('{'), l = cleaned.lastIndexOf('}');
  if (f === -1 || l === -1) throw new Error('No JSON found');
  cleaned = cleaned.substring(f, l+1);
  cleaned = cleaned.replace(/[\x00-\x09\x0b\x0c\x0e-\x1f]/g,' ');
  cleaned = cleaned.replace(/("(?:[^"\\]|\\.)*")/g, m =>
    m.replace(/\n/g,'\\n').replace(/\r/g,'\\r').replace(/\t/g,' ')
  );
  const parsed = JSON.parse(cleaned);
  if (parsed.content) parsed.content = parsed.content.replace(/\\n/g,'\n');
  return parsed;
}

async function fetchImage(searchQuery) {
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=5&orientation=landscape&client_id=${UNSPLASH_KEY}`;
    const res  = await fetch(url);
    const data = await res.json();
    if (!data.results?.length) return null;
    const photo = data.results[Math.floor(Math.random() * Math.min(3, data.results.length))];
    await fetch(`${photo.links.download_location}&client_id=${UNSPLASH_KEY}`);
    return { imageUrl: photo.urls.regular, imageThumb: photo.urls.small, imageCredit: photo.user.name, imageCreditUrl: photo.user.links.html };
  } catch(e) { return null; }
}

async function saveArticle(article, imageData, topic, category, daysAgo) {
  const pubDate = new Date();
  pubDate.setDate(pubDate.getDate() - daysAgo);
  const docRef = db.collection('articles').doc();
  await docRef.set({
    title: article.title, excerpt: article.excerpt, content: article.content,
    category, tags: article.tags || [], readTime: article.readTime || '9 min read',
    publishedAt: Timestamp.fromDate(pubDate),
    imageUrl: imageData?.imageUrl || null, imageThumb: imageData?.imageThumb || null,
    imageCredit: imageData?.imageCredit || null, imageCreditUrl: imageData?.imageCreditUrl || null,
    topic, generatedBy: 'groq/llama-3.3-70b-versatile',
  });
  await db.collection('used_topics').add({ topic, usedAt: Timestamp.fromDate(pubDate) });
  console.log(`✅ Saved: "${article.title}"`);
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log(`🔮 Vaultedd Bulk Generator — generating ${BULK_COUNT} articles...`);
  const topics = await pickTopics(BULK_COUNT);

  if (topics.length === 0) {
    console.log('No unused topics available!');
    process.exit(0);
  }

  console.log(`Found ${topics.length} unused topics. Starting generation...\n`);
  let success = 0, failed = 0;

  for (let i = 0; i < topics.length; i++) {
    const { topic, category } = topics[i];
    console.log(`\n[${i+1}/${topics.length}] ${topic} (${category})`);
    try {
      const article   = await generateArticle(topic, category);
      const imageData = await fetchImage(article.searchQuery || topic);
      // Space articles out — newest first, going back in time
      await saveArticle(article, imageData, topic, category, topics.length - 1 - i);
      success++;
      // Wait 3 seconds between requests to avoid rate limits
      if (i < topics.length - 1) {
        console.log('Waiting 3s before next article...');
        await sleep(3000);
      }
    } catch(e) {
      console.error(`❌ Failed: ${topic} — ${e.message}`);
      failed++;
      await sleep(5000); // longer wait after failure
    }
  }

  console.log(`\n🎉 Done! ${success} articles generated, ${failed} failed.`);
  process.exit(0);
}

main();

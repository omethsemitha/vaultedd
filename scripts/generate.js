// scripts/generate.js
// Runs daily via GitHub Actions
// Generates one mystery article using Groq AI + Unsplash images + saves to Firebase

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import Groq from 'groq-sdk';
import fetch from 'node-fetch';

// ── Init ──────────────────────────────────────────────────────
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
initializeApp({ credential: cert(serviceAccount) });
const db     = getFirestore();
const groq   = new Groq({ apiKey: process.env.GROQ_API_KEY });
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;

// ── Categories & topics ───────────────────────────────────────
const TOPICS = [
  { category: 'Cryptids',          topics: ['Bigfoot','Loch Ness Monster','Chupacabra','Mothman','Jersey Devil','Thunderbird','Megalodon sightings','Dogman','Black Eyed Children','The Dover Demon'] },
  { category: 'UFOs',              topics: ['Roswell incident','Phoenix Lights','The Belgian UFO wave','Rendlesham Forest incident','Travis Walton abduction','Bob Lazar Area 51','The Tic Tac UFO','Nimitz encounter','The Skinwalker Ranch','Battle of Los Angeles 1942'] },
  { category: 'Ancient Mysteries', topics: ['The Nazca Lines','Stonehenge secrets','Lost city of Atlantis','The Antikythera Mechanism','Easter Island mysteries','Gobekli Tepe','The Voynich Manuscript','Egyptian pyramid secrets','The Baghdad Battery','Puma Punku'] },
  { category: 'Paranormal',        topics: ['The Amityville Horror','Slenderman origins','Shadow people','The Hat Man phenomenon','Sleep paralysis demons','The Dyatlov Pass incident','The Bridgewater Triangle','Skinwalker legends','The Sallie House haunting','The Conjuring house'] },
  { category: 'Mythic Creatures',  topics: ['Dragon mythology origins','The Kraken','Werewolf legends history','Vampire folklore origins','The Basilisk','Kelpie water spirits','The Banshee','Wendigo Native American legend','Medusa mythology','The Minotaur'] },
  { category: 'Unexplained',       topics: ['The Bermuda Triangle','The Philadelphia Experiment','Time slips','The Taos Hum','The Wow! signal','Oak Island mystery','The Tunguska event','The Zodiac cipher','The Mary Celeste','The Green Children of Woolpit'] },
];

// ── Pick today's topic (rotates daily, never repeats in 30 days) ──
async function pickTopic() {
  const usedSnap = await db.collection('used_topics').orderBy('usedAt','desc').limit(40).get();
  const used = usedSnap.docs.map(d => d.data().topic);

  for (const group of TOPICS) {
    for (const topic of group.topics) {
      if (!used.includes(topic)) {
        return { topic, category: group.category };
      }
    }
  }
  // All used — reset
  return { topic: TOPICS[0].topics[0], category: TOPICS[0].category };
}

// ── Generate article with Groq ────────────────────────────────
async function generateArticle(topic, category) {
  console.log(`Generating article about: ${topic} (${category})`);

  const prompt = `You are a journalist for Vaultedd, a website about paranormal mysteries and unexplained phenomena. 
Write a detailed, engaging, well-researched article about: "${topic}"

Requirements:
- Title: Create a compelling, click-worthy title (not just the topic name)
- The article should be 600-900 words
- Tone: Journalistic but mysterious and engaging
- Include documented historical accounts and eyewitness reports where relevant
- Be factual about what is documented, clearly note what is speculation
- Structure with clear paragraphs, use H2 subheadings
- End with a thought-provoking conclusion
- Do NOT make up specific names of people unless historically documented

Respond in this exact JSON format:
{
  "title": "Article title here",
  "excerpt": "2-3 sentence teaser for the article",
  "content": "Full HTML article content with <h2> subheadings and <p> tags",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "readTime": "X min read",
  "searchQuery": "best unsplash search query for the cover image (2-4 words, nature/landscape/atmospheric)"
}`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.8,
    max_tokens: 2000,
  });

  const raw = completion.choices[0].message.content;

  // Extract JSON
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in response');
  return JSON.parse(jsonMatch[0]);
}

// ── Fetch image from Unsplash ─────────────────────────────────
async function fetchImage(searchQuery) {
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=5&orientation=landscape&client_id=${UNSPLASH_KEY}`;
    const res  = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) return null;

    // Pick a random one from top 5
    const photo = data.results[Math.floor(Math.random() * Math.min(3, data.results.length))];

    // Trigger download (required by Unsplash API guidelines)
    await fetch(`${photo.links.download_location}&client_id=${UNSPLASH_KEY}`);

    return {
      imageUrl:        photo.urls.regular,
      imageThumb:      photo.urls.small,
      imageCredit:     photo.user.name,
      imageCreditUrl:  photo.user.links.html,
    };
  } catch(e) {
    console.warn('Unsplash fetch failed:', e.message);
    return null;
  }
}

// ── Save to Firestore ─────────────────────────────────────────
async function saveArticle(article, imageData, topic, category) {
  const docRef = db.collection('articles').doc();
  await docRef.set({
    title:         article.title,
    excerpt:       article.excerpt,
    content:       article.content,
    category,
    tags:          article.tags || [],
    readTime:      article.readTime || '6 min read',
    publishedAt:   Timestamp.now(),
    imageUrl:      imageData?.imageUrl || null,
    imageThumb:    imageData?.imageThumb || null,
    imageCredit:   imageData?.imageCredit || null,
    imageCreditUrl:imageData?.imageCreditUrl || null,
    topic,
    generatedBy:   'groq/llama-3.3-70b-versatile',
  });

  // Mark topic as used
  await db.collection('used_topics').add({ topic, usedAt: Timestamp.now() });

  console.log(`✅ Article saved: "${article.title}" (ID: ${docRef.id})`);
  return docRef.id;
}

// ── Main ──────────────────────────────────────────────────────
async function main() {
  try {
    console.log('🔮 Vaultedd Article Generator starting...');

    const { topic, category } = await pickTopic();
    const article   = await generateArticle(topic, category);
    const imageData = await fetchImage(article.searchQuery || topic);
    await saveArticle(article, imageData, topic, category);

    console.log('✨ Done! New article published to Vaultedd.');
  } catch(e) {
    console.error('❌ Generator failed:', e);
    process.exit(1);
  }
}

main();

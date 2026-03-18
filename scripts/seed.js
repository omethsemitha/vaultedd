// scripts/seed.js
// Run once to populate Firebase with 10 starter articles
// Command: node scripts/seed.js

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const articles = [
  {
    title: "Bigfoot: The Legend That Refuses to Die",
    category: "Cryptids",
    excerpt: "For centuries, witnesses across North America have reported encounters with a massive, bipedal creature covered in dark hair. Known as Bigfoot or Sasquatch, this mysterious entity remains one of the most enduring mysteries in cryptozoology.",
    content: `<h2>A Legend Born From Ancient Roots</h2><p>Long before European settlers arrived in North America, Indigenous peoples across the continent told stories of enormous, hair-covered beings that walked upright through the forests. The Sts'ailes people of British Columbia called it Sasq'ets — meaning "wild man" — while dozens of other tribes had their own names and traditions surrounding this mysterious creature.</p><h2>The Patterson-Gimlin Film</h2><p>On October 20, 1967, Roger Patterson and Robert Gimlin captured what remains the most compelling piece of Bigfoot evidence ever recorded. Shot near Bluff Creek in Northern California, the 59-second film shows a large, bipedal figure walking through a clearing before glancing back at the camera. Decades of analysis by biomechanics experts, film specialists, and primatologists have failed to definitively prove the footage is a hoax.</p><h2>Physical Evidence</h2><p>Over the past century, thousands of footprint casts have been collected across North America. Many measure 15 to 24 inches in length and show dermal ridges — the equivalent of fingerprints — that would be nearly impossible to fake convincingly. In 1969, a series of tracks discovered near Bossburg, Washington showed one foot with a deformed toe, suggesting an actual biological entity rather than a hoax.</p><h2>Scientific Perspectives</h2><p>While mainstream science remains skeptical, a small but serious group of researchers continues to investigate. Jane Goodall, the renowned primatologist, has stated publicly that she believes large undiscovered primates could exist. The vast, roadless wilderness of the Pacific Northwest — spanning millions of acres — could theoretically support a small population of large primates that have learned to avoid human contact.</p><h2>Why The Mystery Endures</h2><p>What makes Bigfoot so compelling is the sheer consistency of reports across cultures and centuries. Witnesses range from experienced hunters and forestry workers to children and police officers. The descriptions remain remarkably consistent: seven to nine feet tall, covered in dark brown or black hair, with a distinctly human-like gait but inhuman proportions. Whether Bigfoot is flesh and blood, a remnant population of Gigantopithecus, or something stranger still, the legend shows no signs of disappearing.</p>`,
    tags: ["bigfoot","sasquatch","cryptids","paranormal","north america"],
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
    imageCredit: "Unsplash",
    imageCreditUrl: "https://unsplash.com",
    topic: "Bigfoot",
  },
  {
    title: "The Loch Ness Monster: Scotland's Ancient Secret",
    category: "Cryptids",
    excerpt: "Deep in the cold, peat-darkened waters of Loch Ness, Scotland, something has been lurking for over 1,500 years. The Loch Ness Monster — affectionately known as Nessie — is the world's most famous cryptid and the subject of one of history's greatest mysteries.",
    content: `<h2>The First Recorded Sighting</h2><p>The earliest written account of a strange creature in Loch Ness dates to 565 AD, when Saint Columba reportedly encountered a beast in the River Ness. According to the monk Adomnán's biography of Columba, the saint commanded the creature to retreat, and it obeyed. While this account is clearly influenced by religious narrative, it establishes a remarkably ancient tradition of unusual creature sightings in the area.</p><h2>The 1933 Phenomenon</h2><p>Modern interest in the Loch Ness Monster exploded on May 2, 1933, when the Inverness Courier published an account by John Mackay and his wife, who reported seeing an enormous animal disturbing the surface of the loch. The story captured the world's imagination. Within months, hundreds of additional witnesses came forward, and the legend of Nessie was born.</p><h2>The Surgeon's Photograph</h2><p>In 1934, a photograph purportedly taken by London surgeon Robert Kenneth Wilson showed what appeared to be a long-necked creature rising from the loch's surface. For decades, it was considered the most compelling evidence of Nessie's existence. In 1994, it was revealed to be a hoax — a toy submarine with a sculpted head attached — but the revelation did little to dampen public enthusiasm for the mystery.</p><h2>Scientific Investigations</h2><p>Loch Ness has been subjected to some of the most intensive scientific investigations ever conducted on a body of water. Sonar surveys have detected large, unidentified moving objects in the depths. A 2018 environmental DNA study found no evidence of large reptiles but did detect an unusually high concentration of eel DNA, suggesting giant eels as one possible explanation.</p><h2>What Lurks Below</h2><p>Loch Ness is 23 miles long, a mile wide, and in places over 750 feet deep. Its waters are so dark with peat that visibility is near zero beyond a few feet. The loch contains more fresh water than all the lakes in England and Wales combined. Whatever the truth behind the legend, the sheer scale and darkness of Loch Ness makes it easy to understand why the mystery has endured for over a millennium.</p>`,
    tags: ["loch ness","nessie","cryptids","scotland","lake monster"],
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    imageCredit: "Unsplash",
    imageCreditUrl: "https://unsplash.com",
    topic: "Loch Ness Monster",
  },
  {
    title: "Roswell 1947: The Crash That Changed Everything",
    category: "UFOs",
    excerpt: "In the summer of 1947, something crashed in the desert near Roswell, New Mexico. What followed was a chain of events that would spark decades of controversy, government cover-up allegations, and the birth of modern UFO culture.",
    content: `<h2>The Crash</h2><p>In late June or early July 1947, rancher W.W. Mac Brazel discovered a field of strange debris scattered across his property near Corona, New Mexico. The material was unlike anything he had ever seen — thin, metallic foil that returned to its original shape when crumpled, small beams marked with unusual symbols, and material that was extraordinarily strong yet lightweight. He reported his discovery to the local sheriff, who contacted Roswell Army Air Field.</p><h2>The Press Release Heard Around the World</h2><p>On July 8, 1947, public information officer Walter Haut issued a press release on behalf of RAAF stating that personnel had recovered a "flying disc." The story exploded internationally. Within hours, the military reversed course, claiming the debris was merely from a weather balloon. The sudden retraction only intensified suspicion.</p><h2>Project Mogul</h2><p>Decades later, the U.S. government revealed that the actual crash debris came from Project Mogul — a classified program using high-altitude balloons to monitor Soviet nuclear tests. This explanation, while plausible, failed to account for witness testimony describing non-conventional materials and alleged recovery of non-human bodies.</p><h2>The Witnesses</h2><p>Over the following decades, dozens of military personnel, nurses, and civilians came forward with accounts that went far beyond weather balloon debris. Mortician Glenn Dennis claimed to have received calls from the base asking about child-sized hermetically sealed caskets. Nurse Naomi Self reportedly described performing preliminary examinations on bodies that were not human. First Lieutenant Walter Haut, who wrote the original press release, left a sealed affidavit claiming he had personally seen the craft and bodies.</p><h2>Why It Still Matters</h2><p>Roswell matters not just as a UFO case but as a study in government secrecy and public trust. Whatever crashed in the New Mexico desert in 1947, the government's handling of the incident — the contradictory statements, the missing records, the silenced witnesses — created a template for conspiracy thinking that persists to this day. The truth, as they say, is still out there.</p>`,
    tags: ["roswell","ufo","aliens","new mexico","government cover-up"],
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800",
    imageCredit: "Unsplash",
    imageCreditUrl: "https://unsplash.com",
    topic: "Roswell incident",
  },
  {
    title: "The Nazca Lines: Messages Written for the Gods",
    category: "Ancient Mysteries",
    excerpt: "Etched into the arid plateau of southern Peru, the Nazca Lines are among the most mysterious and awe-inspiring creations of the ancient world. These enormous geoglyphs — some stretching for miles — can only be fully appreciated from the air.",
    content: `<h2>Discovered From The Sky</h2><p>Although the Nazca Lines had been known to locals for centuries, they first attracted international attention in the 1920s when commercial aircraft began flying over the Peruvian desert. Pilots reported seeing enormous figures etched into the earth below — spirals, geometric shapes, and recognizable animals of extraordinary size. It was not until aerial photography became available that the true scale and complexity of the lines was understood.</p><h2>What They Are</h2><p>The Nazca Lines were created by the Nazca culture between 500 BCE and 500 CE. The creators removed reddish-brown iron oxide-coated pebbles from the surface, exposing the yellowish-grey ground beneath. The contrast creates figures visible from considerable height. The lines cover an area of nearly 450 square miles and include over 800 straight lines, 300 geometric figures, and 70 animal and plant designs — including a hummingbird, spider, monkey, and condor.</p><h2>The Enduring Mystery</h2><p>The purpose of the Nazca Lines has been debated for nearly a century. German mathematician Maria Reiche dedicated her life to their study, concluding they served as an astronomical calendar. Others have proposed they were ceremonial pathways, irrigation markers, or offerings to sky gods. The most sensational theory — promoted by Erich von Däniken in his 1968 book Chariots of the Gods — suggested they were landing strips for extraterrestrial spacecraft.</p><h2>Modern Analysis</h2><p>Modern archaeologists and anthropologists generally believe the lines had religious and ritual significance. Recent discoveries of water-related symbolism in many of the figures suggests they may have been created as offerings to water deities during periods of drought. The sheer effort required to create them — estimated at millions of man-hours — speaks to their immense spiritual importance to the Nazca people.</p><h2>Preservation Crisis</h2><p>Today, the Nazca Lines face threats from climate change, urban expansion, and human activity. In 2014, Greenpeace activists caused irreversible damage to the area near the hummingbird figure during a publicity stunt. UNESCO has called for greater protection of this irreplaceable world heritage site as the ancient mystery continues to attract visitors from around the globe.</p>`,
    tags: ["nazca lines","peru","ancient mysteries","geoglyphs","archaeology"],
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=800",
    imageCredit: "Unsplash",
    imageCreditUrl: "https://unsplash.com",
    topic: "The Nazca Lines",
  },
  {
    title: "Mothman: The Winged Prophet of Point Pleasant",
    category: "Cryptids",
    excerpt: "Between November 1966 and December 1967, the small town of Point Pleasant, West Virginia was terrorized by a series of encounters with a terrifying winged entity. When the Silver Bridge collapsed killing 46 people, many wondered if Mothman had been a harbinger of doom.",
    content: `<h2>The First Encounter</h2><p>On the night of November 15, 1966, two young couples driving near an abandoned TNT plant outside Point Pleasant reported encountering a large, grey figure standing near the road. It was described as roughly humanoid, standing six or seven feet tall, with enormous wings folded against its back and glowing red eyes. When they drove away in panic, the creature allegedly pursued their car at speeds exceeding 100 miles per hour before disappearing.</p><h2>A Wave of Terror</h2><p>Over the following thirteen months, more than a hundred residents of the Point Pleasant area reported similar encounters. Witnesses described the same basic characteristics: enormous size, grey or brown coloring, massive wingspan estimated at ten to fifteen feet, and the disturbing red eyes that witnesses consistently described as hypnotic or paralyzing. Many reported feeling an overwhelming sense of dread in the creature's presence.</p><h2>The Silver Bridge Disaster</h2><p>On December 15, 1967 — thirteen months after the first Mothman sighting — the Silver Bridge connecting Point Pleasant to Gallipolis, Ohio collapsed during evening rush hour. Forty-six people died in the icy waters of the Ohio River. Almost immediately, locals began connecting the Mothman sightings to the disaster, suggesting the creature had been a warning of the coming tragedy.</p><h2>John Keel's Investigation</h2><p>Journalist and paranormal researcher John Keel spent considerable time in Point Pleasant investigating the phenomena, eventually writing The Mothman Prophecies in 1975. Keel noticed that the Mothman sightings were accompanied by numerous other anomalous events — UFO sightings, Men in Black encounters, poltergeist activity, and prophetic phone calls warning of disasters. He theorized that Mothman was not a physical creature but a manifestation of something altogether stranger.</p><h2>The Legacy</h2><p>Point Pleasant has embraced its dark history. A twelve-foot steel statue of Mothman stands in the town center, and an annual Mothman Festival draws thousands of visitors each September. The creature has reportedly been sighted in other locations before major disasters — including near Chernobyl before the 1986 nuclear accident and in Chicago before a series of accidents in 2017. Whatever Mothman truly is, its legacy as an omen of disaster endures.</p>`,
    tags: ["mothman","point pleasant","cryptids","west virginia","silver bridge"],
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800",
    imageCredit: "Unsplash",
    imageCreditUrl: "https://unsplash.com",
    topic: "Mothman",
  },
  {
    title: "The Dyatlov Pass Incident: Nine Hikers, No Answers",
    category: "Paranormal",
    excerpt: "In February 1959, nine experienced Soviet hikers died under circumstances so bizarre that investigators were forced to conclude they were killed by an unknown compelling force. More than six decades later, the Dyatlov Pass incident remains one of history's most baffling unsolved mysteries.",
    content: `<h2>The Expedition</h2><p>In January 1959, a group of ten ski hikers from the Ural Polytechnical Institute set out to complete a Category III expedition through the northern Ural Mountains of the Soviet Union — the highest difficulty rating available at the time. Led by Igor Dyatlov, a 23-year-old engineering student, the group consisted of experienced outdoor enthusiasts, most of whom had completed difficult expeditions before.</p><h2>Something Goes Wrong</h2><p>One member of the group turned back early due to illness, leaving nine to continue. They established their final camp on the slopes of Kholat Syakhl — a name that translates from the indigenous Mansi language as Dead Mountain — on the evening of February 1. They were never seen alive again.</p><h2>The Discovery</h2><p>When the group failed to return as scheduled, search parties were sent out. On February 26, their abandoned tent was discovered on the mountain slope. What investigators found was deeply disturbing: the tent had been cut open from the inside, and the hikers had fled into the freezing night in their socks or barefoot, wearing minimal clothing in temperatures that had dropped to -30°C.</p><h2>The Bodies</h2><p>The bodies were found over the following months. The first five had died of hypothermia, but the circumstances were strange — they appeared to have fled the tent in apparent panic, some heading back toward it before collapsing. The final four bodies, found two months later in a ravine, told a different story: they had suffered massive internal injuries — broken ribs, crushed skulls — without corresponding external wounds, as if they had been subjected to enormous pressure. One woman was missing her tongue.</p><h2>The Unknown Compelling Force</h2><p>Soviet investigators officially attributed the deaths to an unknown compelling force and closed the case. Over the decades, theories have ranged from an avalanche to military testing to infrasound causing mass panic to a Yeti attack. In 2019, Russian investigators reopened the case and concluded an avalanche was responsible, but many experts found the explanation unsatisfactory. The nine hikers of Dyatlov Pass took their secret with them into the snow.</p>`,
    tags: ["dyatlov pass","unsolved mystery","russia","hiking","unexplained deaths"],
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1551582045-6ec9c11d8697?w=800",
    imageCredit: "Unsplash",
    imageCreditUrl: "https://unsplash.com",
    topic: "The Dyatlov Pass incident",
  },
  {
    title: "The Bermuda Triangle: Myth or Maritime Menace?",
    category: "Unexplained",
    excerpt: "Between Miami, Bermuda, and Puerto Rico lies a roughly triangular stretch of ocean that has allegedly swallowed hundreds of ships and aircraft without a trace. The Bermuda Triangle has captivated the public imagination for decades — but what does the evidence actually show?",
    content: `<h2>Origins of the Legend</h2><p>The term Bermuda Triangle was coined by journalist Vincent Gaddis in a 1964 Argosy magazine article, but the legend had been building since at least 1950 when reporter E.V.W. Jones wrote about mysterious disappearances in the area. The legend reached its cultural peak in 1974 with Charles Berlitz's bestselling book The Bermuda Triangle, which sold millions of copies and spawned countless documentaries and films.</p><h2>Flight 19</h2><p>The most famous Bermuda Triangle incident occurred on December 5, 1945, when five U.S. Navy Avenger torpedo bombers disappeared during a training exercise. The flight leader, Lieutenant Charles Taylor, radioed that his compasses were malfunctioning and that everything looked wrong — even the ocean. All 14 men aboard the five aircraft were lost. A rescue flying boat sent to search for them also disappeared with 13 men aboard. The official investigation concluded the cause was unknown.</p><h2>The Missing Ships</h2><p>Among the vessels allegedly claimed by the Triangle, the USS Cyclops stands out. The 542-foot Navy cargo ship disappeared in March 1918 while carrying 10,000 tons of manganese ore and 309 crew members — the single largest loss of life in U.S. Naval history not involving combat. No wreckage, bodies, or distress signals were ever found. The ship's fate remains officially unknown to this day.</p><h2>The Skeptical View</h2><p>Skeptics, including the U.S. Coast Guard and Lloyd's of London, have consistently argued that the Bermuda Triangle's reputation is largely myth. Insurance giant Lloyd's does not charge higher premiums for ships passing through the area. Research by skeptic Lawrence David Kusche found that many of the disappearances attributed to the Triangle were misrepresented, exaggerated, or occurred outside the Triangle's boundaries entirely.</p><h2>Natural Explanations</h2><p>The area is one of the most heavily traveled shipping lanes in the world, which naturally increases the probability of accidents. The region is prone to sudden, violent storms. Methane hydrate deposits on the ocean floor could theoretically cause large bubbles that might sink ships. Electronic fog and compass anomalies have been reported. Whether the Bermuda Triangle is genuinely dangerous or simply a legend built from selective reporting, the ocean keeps its secrets.</p>`,
    tags: ["bermuda triangle","unexplained","ships","disappearances","ocean mystery"],
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800",
    imageCredit: "Unsplash",
    imageCreditUrl: "https://unsplash.com",
    topic: "The Bermuda Triangle",
  },
  {
    title: "Gobekli Tepe: The Temple That Rewrote History",
    category: "Ancient Mysteries",
    excerpt: "Buried beneath a hilltop in southeastern Turkey, Gobekli Tepe is the oldest known megalithic structure on Earth — built 7,000 years before Stonehenge and 6,000 years before the invention of writing. Its existence has fundamentally challenged our understanding of human civilization.",
    content: `<h2>The Discovery</h2><p>In 1994, German archaeologist Klaus Schmidt was surveying sites in southeastern Turkey when a Kurdish shepherd directed him to a hill covered with flint chips. Schmidt immediately recognized the significance of what he found: enormous T-shaped limestone pillars, some weighing up to 20 tons, arranged in circular enclosures on a hilltop in the Taurus Mountains. Carbon dating would eventually reveal that construction began around 9600 BCE — making Gobekli Tepe nearly 12,000 years old.</p><h2>What Makes It Impossible</h2><p>According to the conventional archaeological timeline, complex monumental architecture should not have existed in 9600 BCE. The accepted narrative held that large-scale organized construction required agriculture, surplus food, and therefore settled civilization. But the people who built Gobekli Tepe were hunter-gatherers — nomadic peoples who had not yet discovered farming. The discovery forced archaeologists to reconsider which came first: civilization or religion.</p><h2>The Pillars</h2><p>The T-shaped pillars at Gobekli Tepe are covered with elaborate carvings of animals — foxes, snakes, boars, cranes, ducks, and wild bulls — as well as abstract symbols whose meaning remains unknown. The largest pillars stand 18 feet tall and weigh up to 20 tons. Quarrying, transporting, and erecting them without metal tools, wheels, or draft animals represents an engineering feat that still puzzles researchers.</p><h2>Deliberately Buried</h2><p>Most astonishingly, Gobekli Tepe was deliberately buried around 8000 BCE. Someone — perhaps the very people who built it — filled the enclosures with rubble, bones, and flint tools, sealing the complex under tons of debris. This intentional burial actually preserved the site beautifully, but the motivation behind it remains one of archaeology's great mysteries.</p><h2>What We Still Don't Know</h2><p>Only a small fraction of Gobekli Tepe has been excavated. Ground-penetrating radar surveys suggest there are at least 16 more enclosures yet to be uncovered. The site may be just the tip of a much larger complex. Who built it, what rituals took place there, and why it was buried may never be fully understood — but its existence alone has permanently altered our understanding of what our ancestors were capable of.</p>`,
    tags: ["gobekli tepe","turkey","ancient mysteries","archaeology","prehistoric"],
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    imageCredit: "Unsplash",
    imageCreditUrl: "https://unsplash.com",
    topic: "Gobekli Tepe",
  },
  {
    title: "The Phoenix Lights: Arizona's Most Witnessed UFO Event",
    category: "UFOs",
    excerpt: "On the night of March 13, 1997, thousands of people across Arizona and Nevada witnessed one of the most dramatic UFO events in American history. The Phoenix Lights remains the most widely witnessed and documented UFO sighting ever recorded.",
    content: `<h2>The Night Everything Changed</h2><p>On March 13, 1997, beginning around 7:30 PM, a wave of UFO sightings swept across the state of Arizona moving from northwest to southeast. Witnesses in Henderson, Nevada first reported a V-shaped formation of lights before it moved into Arizona, passing over Prescott, Prescott Valley, and eventually the Phoenix metropolitan area — home to over three million people.</p><h2>What People Saw</h2><p>Witness accounts were remarkably consistent. Most described a massive, triangular or boomerang-shaped craft — some estimated it to be a mile wide — moving slowly and silently through the sky. The craft blocked out stars as it passed overhead, confirming it was a solid object rather than a formation of aircraft. Many witnesses reported feeling an eerie silence as the object passed — as though ambient sound had been somehow muted.</p><h2>The Second Event</h2><p>A second, distinct event occurred around 10 PM when a series of stationary amber orbs appeared in a line south of Phoenix and were witnessed by thousands of residents. The military later attributed these lights to flares dropped by A-10 aircraft during exercises at the Barry Goldwater Range. However, many witnesses disputed this explanation, noting the lights appeared to be stationary in front of the mountains rather than falling.</p><h2>Official Response</h2><p>Arizona Governor Fife Symington initially mocked the incident at a press conference, producing an aide dressed in an alien costume. He later admitted that he had personally witnessed the craft and was deeply unsettled by it. "It was enormous and inexplicable," Symington said in 2007. "As a pilot and a former Air Force officer, I can assure you that craft was not of this world."</p><h2>Still Unexplained</h2><p>The first formation of lights — the massive V-shaped craft — has never been officially explained by the government. To this day, it remains one of the most credible and well-documented UFO cases on record, supported by video footage, photographs, and the testimony of thousands of witnesses including military personnel, pilots, and police officers. The Phoenix Lights may be the strongest evidence yet that something truly unknown shares our skies.</p>`,
    tags: ["phoenix lights","ufo","arizona","mass sighting","1997"],
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800",
    imageCredit: "Unsplash",
    imageCreditUrl: "https://unsplash.com",
    topic: "Phoenix Lights",
  },
  {
    title: "Dragons: The Universal Monster With a Global Footprint",
    category: "Mythic Creatures",
    excerpt: "From Chinese imperial courts to medieval European dungeons, from Aztec temples to Norse sagas, dragons appear in the mythologies of virtually every civilization on Earth. Their near-universal presence raises a fascinating question: what if dragons were real?",
    content: `<h2>A Creature Born From Every Culture</h2><p>The dragon is perhaps the most widespread mythological creature in human history. Ancient Mesopotamian texts describe the serpentine chaos monster Tiamat. Egyptian mythology features the great serpent Apep. Chinese tradition reveres the long — a benevolent serpentine dragon associated with water and imperial power. European medieval tradition depicts fire-breathing, winged beasts that hoarded gold and terrorized villages. Despite developing in isolation, these traditions share striking similarities.</p><h2>The Western Dragon</h2><p>The Western dragon tradition likely has roots in ancient encounters with large reptiles and snakes magnified through storytelling. The oldest recorded dragon myth in Western tradition is the Babylonian Enuma Elish, dating to approximately 1800 BCE, in which the god Marduk slays the dragon Tiamat to create the world. This pattern — a heroic combat with a serpentine monster — recurs across Greek, Norse, and eventually Christian mythology.</p><h2>The Eastern Dragon</h2><p>Eastern dragons represent something entirely different. The Chinese long is a composite creature — combining the features of nine different animals — that embodies power, wisdom, and good fortune. Far from being feared, the Chinese dragon was a symbol of the Emperor himself, a benevolent cosmic force that brought rain and prosperity. Japanese, Korean, and Vietnamese dragon traditions share this positive characterization, representing balance and elemental power rather than evil.</p><h2>Could Dragons Have Existed?</h2><p>Some researchers have proposed that dragon myths originated in actual encounters with now-extinct or undiscovered animals. Gigantic prehistoric reptiles like Quetzalcoatlus — a pterosaur with a 35-foot wingspan — or massive monitor lizards like Megalania could theoretically have inspired dragon legends in different parts of the world. The discovery of dinosaur fossils by ancient peoples may have contributed to dragon mythology, as fragmentary large bones were interpreted as the remains of enormous serpentine creatures.</p><h2>The Immortal Symbol</h2><p>Whatever their origin, dragons have proven extraordinarily durable as cultural symbols. They appear in the national symbols of Wales, Bhutan, and Malta. They anchor the mythology of Tolkien's Middle Earth, George R.R. Martin's Westeros, and countless other fictional universes. The dragon endures because it speaks to something primal — a combination of awe, terror, and the ancient human awareness that we are not alone in a world that contains things far larger and more powerful than ourselves.</p>`,
    tags: ["dragons","mythology","mythic creatures","world mythology","ancient"],
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
    imageCredit: "Unsplash",
    imageCreditUrl: "https://unsplash.com",
    topic: "Dragon mythology origins",
  },
];

async function seedArticles() {
  console.log('🔮 Seeding Vaultedd with starter articles...');
  const now = new Date();

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    // Space articles out by 1 day each going backwards
    const publishDate = new Date(now);
    publishDate.setDate(publishDate.getDate() - (articles.length - 1 - i));

    const docRef = db.collection('articles').doc();
    await docRef.set({
      ...article,
      publishedAt: Timestamp.fromDate(publishDate),
      generatedBy: 'seed',
    });

    // Mark topic as used
    await db.collection('used_topics').add({
      topic: article.topic,
      usedAt: Timestamp.fromDate(publishDate),
    });

    console.log(`✅ [${i+1}/10] "${article.title}"`);
  }

  console.log('\n🎉 All 10 articles seeded successfully!');
  console.log('Your Vaultedd website now has content ready to display.');
  process.exit(0);
}

seedArticles().catch(e => { console.error('❌ Seed failed:', e); process.exit(1); });

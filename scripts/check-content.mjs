/**
 * Content integrity check. Verifies that every plate has art, every collection
 * reference resolves, plate numbers are unique and continuous, and guides are
 * ordered without gaps.
 *
 *   npx tsx scripts/check-content.mjs
 */
import { allCollections, allGuides, allPositions, positionsIn } from '../src/content/index.ts';
import { poses } from '../src/art/poses.ts';

const problems = [];
const note = (message) => problems.push(message);

if (allPositions.length !== 36) note(`expected 36 positions, found ${allPositions.length}`);
if (allGuides.length !== 8) note(`expected 8 guides, found ${allGuides.length}`);
if (allCollections.length !== 6) note(`expected 6 collections, found ${allCollections.length}`);

const slugs = new Set();
const plateNumbers = new Set();
const usedPoses = new Set();

for (const position of allPositions) {
  if (slugs.has(position.slug)) note(`duplicate slug: ${position.slug}`);
  slugs.add(position.slug);

  if (plateNumbers.has(position.plate)) note(`duplicate plate number: ${position.plate}`);
  plateNumbers.add(position.plate);

  if (!poses[position.pose]) note(`${position.slug}: missing pose art "${position.pose}"`);
  usedPoses.add(position.pose);

  for (const field of ['title', 'commonName', 'summary', 'setup', 'why', 'care', 'setting']) {
    if (!position[field]?.trim()) note(`${position.slug}: empty ${field}`);
  }
  for (const field of ['steps', 'tips', 'variations', 'tags']) {
    if (!position[field]?.length) note(`${position.slug}: empty ${field}`);
  }
  if (position.closeness < 1 || position.closeness > 5) note(`${position.slug}: closeness out of range`);
  if (position.effort < 1 || position.effort > 5) note(`${position.slug}: effort out of range`);
}

for (let plate = 1; plate <= 36; plate += 1) {
  if (!plateNumbers.has(plate)) note(`missing plate number ${plate}`);
}

const guideSlugs = new Set();
for (const guide of allGuides) {
  if (guideSlugs.has(guide.slug)) note(`duplicate guide slug: ${guide.slug}`);
  guideSlugs.add(guide.slug);
  if (!guide.blocks.length) note(`${guide.slug}: no blocks`);
  for (const block of guide.blocks) {
    if (block.kind === 'list' && !block.items?.length) note(`${guide.slug}: empty list block`);
    if (block.kind === 'steps' && !block.items?.length) note(`${guide.slug}: empty steps block`);
    if (!['paragraph', 'heading', 'list', 'steps', 'quote', 'note'].includes(block.kind)) {
      note(`${guide.slug}: unknown block kind ${block.kind}`);
    }
  }
}

allGuides.forEach((guide, index) => {
  if (guide.order !== index + 1) note(`${guide.slug}: order ${guide.order} at index ${index}`);
});

const collectionSlugs = new Set();
for (const collection of allCollections) {
  if (collectionSlugs.has(collection.slug)) note(`duplicate collection slug: ${collection.slug}`);
  collectionSlugs.add(collection.slug);
  const members = positionsIn(collection);
  if (members.length !== collection.positions.length) {
    note(`${collection.slug}: ${collection.positions.length - members.length} unresolved position slug(s)`);
  }
  if (members.length < 3) note(`${collection.slug}: only ${members.length} plates`);
}

for (const position of allPositions) {
  for (const slug of position.collections) {
    if (!collectionSlugs.has(slug)) note(`${position.slug}: unknown collection "${slug}"`);
    else if (!allCollections.find((c) => c.slug === slug)?.positions.includes(position.slug)) {
      note(`${position.slug}: lists "${slug}" but the collection does not list it back`);
    }
  }
}

const unusedPoses = Object.keys(poses).filter((id) => !usedPoses.has(id));
if (unusedPoses.length) note(`unused pose art: ${unusedPoses.join(', ')}`);

if (problems.length) {
  console.error(`\n${problems.length} content problem(s):`);
  for (const problem of problems) console.error(`  • ${problem}`);
  process.exit(1);
}

console.log(`Content OK — ${allPositions.length} plates, ${allGuides.length} guides, ${allCollections.length} collections.`);

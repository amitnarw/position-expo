/**
 * Keeps `position.collections` in sync with `collections.ts`.
 *
 * collections.ts is the authoritative membership list (it defines the curated
 * eight-plate paths and their order). This script rewrites each position's
 * `collections: [...]` line to match, so the plate page and the collection page
 * can never disagree.
 *
 *   npx tsx scripts/reconcile-collections.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { collections } from '../src/content/collections.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const file = join(root, 'src', 'content', 'positions.ts');

const membership = new Map();
for (const collection of collections) {
  for (const slug of collection.positions) {
    const list = membership.get(slug) ?? [];
    list.push(collection.slug);
    membership.set(slug, list);
  }
}

const source = readFileSync(file, 'utf8');
const lines = source.split('\n');

let currentSlug = null;
let changes = 0;

const updated = lines.map((line) => {
  const slugMatch = line.match(/^\s*slug: '([^']+)',\s*$/);
  if (slugMatch) {
    currentSlug = slugMatch[1];
    return line;
  }

  const collectionsMatch = line.match(/^(\s*)collections: \[[^\]]*\],\s*$/);
  if (collectionsMatch && currentSlug) {
    const list = membership.get(currentSlug) ?? [];
    if (list.length === 0) {
      console.warn(`  ! ${currentSlug} belongs to no collection`);
    }
    const next = `${collectionsMatch[1]}collections: [${list
      .map((slug) => `'${slug}'`)
      .join(', ')}],`;
    if (next !== line) changes += 1;
    return next;
  }

  return line;
});

writeFileSync(file, updated.join('\n'));
console.log(`Reconciled position.collections — ${changes} line(s) updated.`);

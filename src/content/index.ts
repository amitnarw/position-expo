import { collections } from './collections';
import { guides } from './guides';
import { positions } from './positions';
import type { Collection, Guide, Position } from './types';

export type { Collection, Guide, GuideBlock, Pace, Position } from './types';

export const allPositions: Position[] = [...positions].sort((a, b) => a.plate - b.plate);
export const allGuides: Guide[] = [...guides].sort((a, b) => a.order - b.order);
export const allCollections: Collection[] = collections;

const positionBySlug = new Map(allPositions.map((item) => [item.slug, item]));
const guideBySlug = new Map(allGuides.map((item) => [item.slug, item]));
const collectionBySlug = new Map(allCollections.map((item) => [item.slug, item]));

export const featured = allPositions[0];

export function getPosition(slug: string | undefined): Position | undefined {
  return slug ? positionBySlug.get(slug) : undefined;
}

export function getGuide(slug: string | undefined): Guide | undefined {
  return slug ? guideBySlug.get(slug) : undefined;
}

export function getCollection(slug: string | undefined): Collection | undefined {
  return slug ? collectionBySlug.get(slug) : undefined;
}

export function positionsIn(collection: Collection): Position[] {
  return collection.positions
    .map((slug) => positionBySlug.get(slug))
    .filter((item): item is Position => Boolean(item));
}

export function collectionsFor(position: Position): Collection[] {
  return position.collections
    .map((slug) => collectionBySlug.get(slug))
    .filter((item): item is Collection => Boolean(item));
}

export function neighbours(position: Position): { previous: Position; next: Position } {
  const index = allPositions.findIndex((item) => item.slug === position.slug);
  const previous = allPositions[(index - 1 + allPositions.length) % allPositions.length];
  const next = allPositions[(index + 1) % allPositions.length];
  return { previous, next };
}

export type SearchHit = {
  kind: 'position' | 'guide' | 'collection';
  slug: string;
  title: string;
  subtitle: string;
};

export function search(query: string, limit = 24): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored: Array<{ hit: SearchHit; score: number }> = [];

  const push = (hit: SearchHit, haystack: string, weight: number) => {
    const index = haystack.toLowerCase().indexOf(q);
    if (index === -1) return;
    scored.push({ hit, score: weight + (index === 0 ? 0 : 1) + index / 200 });
  };

  for (const position of allPositions) {
    push(
      {
        kind: 'position',
        slug: position.slug,
        title: position.title,
        subtitle: position.commonName,
      },
      `${position.title} ${position.commonName}`,
      0,
    );
    push(
      {
        kind: 'position',
        slug: position.slug,
        title: position.title,
        subtitle: position.commonName,
      },
      `${position.tags.join(' ')} ${position.setting} ${position.summary}`,
      2,
    );
  }

  for (const guide of allGuides) {
    push(
      { kind: 'guide', slug: guide.slug, title: guide.title, subtitle: guide.kicker },
      `${guide.title} ${guide.summary} ${guide.topics.join(' ')}`,
      1,
    );
  }

  for (const collection of allCollections) {
    push(
      {
        kind: 'collection',
        slug: collection.slug,
        title: collection.title,
        subtitle: collection.subtitle,
      },
      `${collection.title} ${collection.subtitle} ${collection.intro}`,
      1.5,
    );
  }

  const seen = new Set<string>();
  return scored
    .sort((a, b) => a.score - b.score)
    .filter(({ hit }) => {
      const key = `${hit.kind}:${hit.slug}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit)
    .map(({ hit }) => hit);
}

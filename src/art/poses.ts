import type { Pose } from './body';
import { a } from './poses/a';
import { b } from './poses/b';
import { c } from './poses/c';

/** Every plate in the atlas, keyed by position slug. */
export const poses: Record<string, Pose> = {
  ...a,
  ...b,
  ...c,
};

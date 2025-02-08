import { join, resolve } from 'node:path';

export const compilePostersFolderPath = (root: string, pths: string[]): string => {
  return join(root, resolve(...pths));
};

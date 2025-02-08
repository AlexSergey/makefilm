import { parse } from 'node:path';

export const getPosterName = (url: string, baseUrl: string): string => {
  const pth = new URL(url, baseUrl);
  const parsed = parse(pth.pathname);

  return `${parsed.name.replace(/[^a-z]/gi, '')}${parsed.ext}`;
};

import { mkdirp } from 'mkdirp';
import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { Parser } from './parser';
const root = resolve(__dirname, '..');

const bootstrap = async (): Promise<void> => {
  const parsedFolder = join(root, 'parsed');
  const parser = new Parser(root);
  parser.prepare();
  const rawData = parser.getRawData();
  const validData = parser.getValidData();
  console.log(`Raw data: ${rawData.length}`);
  console.log(`Valid data: ${validData.length}`);
  const [movies, actors, directors, genres] = await parser.parse(parsedFolder);
  mkdirp.sync(parsedFolder);
  console.log(`Parsed data: ${movies.length}`);
  writeFileSync(join(parsedFolder, 'movies.json'), JSON.stringify(movies, null, 2));
  writeFileSync(join(parsedFolder, 'actors.json'), JSON.stringify(actors, null, 2));
  writeFileSync(join(parsedFolder, 'directors.json'), JSON.stringify(directors, null, 2));
  writeFileSync(join(parsedFolder, 'genres.json'), JSON.stringify(genres, null, 2));
};
bootstrap();

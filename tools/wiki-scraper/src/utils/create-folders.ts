import { mkdirp } from 'mkdirp';

export const createFolder = (folderPath: string): void => {
  mkdirp.mkdirpSync(folderPath);
};

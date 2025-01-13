import axios from 'axios';
import { writeFileSync } from 'node:fs';

export const download = async (url: string, filename: string): Promise<boolean> => {
  const controller = new AbortController();

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      signal: controller.signal,
    });
    writeFileSync(filename, response.data);

    return true;
  } catch {
    controller.abort();

    return false;
  }
};

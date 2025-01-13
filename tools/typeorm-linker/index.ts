import { sync } from 'fast-glob';
import { existsSync, mkdirSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

function typeormLinker(): void {
  // eslint-disable-next-line no-console
  console.log('Creating entity-index.ts for api app');
  const src = join(__dirname, '..', '..', '/apps/api/src');
  if (!existsSync(src)) {
    // eslint-disable-next-line no-console
    console.log(`App api cannot be found. Path not exist: ${src}`);
    process.exit(1);
  }
  const outDir = `${src}/common/database`;
  const tmpFileEntities = `${outDir}/tmp-entities-index.ts`;
  const outFileEntities = `${outDir}/entities.ts`;
  if (!existsSync(outDir)) {
    mkdirSync(outDir);
  }
  for (const item of sync(`${src}/**/*.entity.ts`)) {
    const filePath = relative(outDir, item).replace(/\.ts$/, '');
    const data = `export * from '${filePath}';\n`;
    writeFileSync(tmpFileEntities, data, { flag: 'a+' });
  }
  if (existsSync(outFileEntities) && existsSync(tmpFileEntities)) {
    unlinkSync(outFileEntities);
    // eslint-disable-next-line no-console
    console.log(`Old file '${outFileEntities}' removed`);
  }
  if (existsSync(tmpFileEntities)) {
    renameSync(tmpFileEntities, outFileEntities);
    // eslint-disable-next-line no-console
    console.log(`New file ${outFileEntities} saved`);
  }
}

typeormLinker();

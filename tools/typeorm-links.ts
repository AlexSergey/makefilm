import * as fg from 'fast-glob';
import * as fs from 'node:fs';
import * as path from 'node:path';

function typeormLinks(): void {
  // eslint-disable-next-line no-console
  console.log('Creating entity-index.ts for api app');
  const src = `${path.dirname(__dirname)}/apps/api/src`;
  if (!fs.existsSync(src)) {
    // eslint-disable-next-line no-console
    console.log(`App api cannot be found. Path not exist: ${src}`);
    process.exit(1);
  }
  const outDir = `${src}/common/database`;
  const tmpFileEntities = `${outDir}/tmp-entities-index.ts`;
  const outFileEntities = `${outDir}/entities.ts`;
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }
  for (const item of fg.sync(`${src}/**/*.entity.ts`)) {
    const filePath = path.relative(outDir, item).replace(/\.ts$/, '');
    const data = `export * from '${filePath}';\n`;
    fs.writeFileSync(tmpFileEntities, data, { flag: 'a+' });
  }
  if (fs.existsSync(outFileEntities) && fs.existsSync(tmpFileEntities)) {
    fs.unlinkSync(outFileEntities);
    // eslint-disable-next-line no-console
    console.log(`Old file '${outFileEntities}' removed`);
  }
  if (fs.existsSync(tmpFileEntities)) {
    fs.renameSync(tmpFileEntities, outFileEntities);
    // eslint-disable-next-line no-console
    console.log(`New file ${outFileEntities} saved`);
  }
}

typeormLinks();

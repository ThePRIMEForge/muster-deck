import { mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import {
  buildReviewedStaffingTemplateSql,
  parseLockedReviewCsv,
  reviewRowsToTemplateGroups,
} from './reviewed-csv.mjs';

async function main() {
  const sourceCsv = resolve(
    process.env.SHIP_POSITION_REVIEW_CSV ?? 'supabase/reference/ship-position-review-2026-05-21.csv',
  );
  const outputDir = resolve(
    process.env.REVIEWED_STAFFING_TEMPLATE_SQL_DIR ??
      'supabase/generated/reviewed-staffing-templates',
  );

  const csvText = await readFile(sourceCsv, 'utf8');
  const rows = parseLockedReviewCsv(csvText);
  const groups = reviewRowsToTemplateGroups(rows);
  const sql = buildReviewedStaffingTemplateSql({ csvText });

  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  const outputPath = resolve(outputDir, '001.sql');
  await writeFile(outputPath, sql, 'utf8');
  await writeFile(
    resolve(outputDir, 'manifest.json'),
    JSON.stringify({
      generatedAt: new Date().toISOString(),
      sourceCsv,
      rowCount: rows.length,
      shipGroupCount: groups.length,
      templateCount: groups.reduce((sum, group) => sum + group.templates.length, 0),
      files: [outputPath],
    }, null, 2),
    'utf8',
  );

  console.log(JSON.stringify({
    outputDir,
    sourceCsv,
    rowCount: rows.length,
    shipGroupCount: groups.length,
    templateCount: groups.reduce((sum, group) => sum + group.templates.length, 0),
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

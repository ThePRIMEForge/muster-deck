import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { buildStaffingTemplateSql } from './build-sql.mjs';

const API_URL = 'https://api.star-citizen.wiki/api/vehicles';

function readPositiveInteger(name, fallback) {
  const value = process.env[name];
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
  return parsed;
}

async function fetchVehiclePage({ pageNumber, pageSize }) {
  const url = new URL(API_URL);
  url.searchParams.set('page[size]', String(pageSize));
  url.searchParams.set('page[number]', String(pageNumber));

  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      'user-agent': 'StarCitizenFleetManager/0.1 staffing template sync',
    },
  });

  if (!response.ok) {
    throw new Error(`Wiki vehicle page ${pageNumber} failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function fetchVehicles({ pageSize, maxPages }) {
  const vehicles = [];
  let pageNumber = 1;
  let lastPage = 1;

  do {
    const payload = await fetchVehiclePage({ pageNumber, pageSize });
    vehicles.push(...(payload.data ?? []));
    lastPage = payload.meta?.last_page ?? pageNumber;
    pageNumber += 1;
  } while (pageNumber <= lastPage && pageNumber <= maxPages);

  return vehicles;
}

async function main() {
  const pageSize = readPositiveInteger('WIKI_PAGE_SIZE', 100);
  const maxPages = readPositiveInteger('WIKI_MAX_PAGES', Number.MAX_SAFE_INTEGER);
  const batchSize = readPositiveInteger('STAFFING_TEMPLATE_BATCH_SIZE', 20);
  const outputDir = resolve(process.env.STAFFING_TEMPLATE_SQL_DIR ?? 'supabase/generated/staffing-templates');

  const vehicles = await fetchVehicles({ pageSize, maxPages });
  await mkdir(outputDir, { recursive: true });

  const files = [];
  for (let index = 0; index < vehicles.length; index += batchSize) {
    const batchNumber = Math.floor(index / batchSize) + 1;
    const batchVehicles = vehicles.slice(index, index + batchSize);
    const sql = buildStaffingTemplateSql({ vehicles: batchVehicles });
    const fileName = `${String(batchNumber).padStart(3, '0')}.sql`;
    const outputPath = resolve(outputDir, fileName);
    await writeFile(outputPath, sql, 'utf8');
    files.push(outputPath);
  }

  await writeFile(
    resolve(outputDir, 'manifest.json'),
    JSON.stringify({
      generatedAt: new Date().toISOString(),
      vehicleCount: vehicles.length,
      batchSize,
      files,
    }, null, 2),
    'utf8',
  );

  console.log(JSON.stringify({
    outputDir,
    vehicleCount: vehicles.length,
    batchSize,
    batchCount: files.length,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

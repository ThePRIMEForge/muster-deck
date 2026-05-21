import assert from 'node:assert/strict';
import test from 'node:test';

import {
  fanProjectDisclaimer,
  foundationCopy,
  moduleSummaries,
  prohibitedOfficialPhrases,
} from '../../src/lib/foundationCopy.ts';

test('foundation copy includes all four product pillars', () => {
  assert.equal(moduleSummaries.rallyPoint.title, 'Rally Point');
  assert.equal(moduleSummaries.fleetCommand.title, 'Fleet Command');
  assert.equal(moduleSummaries.spoils.title, 'S.P.O.I.L.S.');
  assert.equal(moduleSummaries.provingGround.title, 'Proving Ground');
});

test('landing copy respects broad combat, industrial, tournament, and reward positioning', () => {
  assert.equal(foundationCopy.landing.heroTitle, 'Rally, command, settle.');
  assert.match(foundationCopy.landing.heroSubtitle, /cargo/);
  assert.match(foundationCopy.landing.heroSubtitle, /combat/);
  assert.match(foundationCopy.landing.heroSubtitle, /tournaments/);
  assert.match(foundationCopy.landing.heroSubtitle, /'verse/);
});

test('fan disclaimer keeps MusterDeck independent', () => {
  assert.match(fanProjectDisclaimer, /independent fan-made tool/);
  assert.match(fanProjectDisclaimer, /not affiliated/);
  assert.match(fanProjectDisclaimer, /Cloud Imperium Games/);
});

test('copy avoids official-status language', () => {
  const allCopy = JSON.stringify({ foundationCopy, moduleSummaries, fanProjectDisclaimer }).toLowerCase();

  for (const phrase of prohibitedOfficialPhrases) {
    assert.equal(allCopy.includes(phrase.toLowerCase()), false, `Unexpected phrase: ${phrase}`);
  }
});

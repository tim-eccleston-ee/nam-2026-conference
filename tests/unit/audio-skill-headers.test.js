import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const scripts = [
  '.claude/skills/transcribe-audio/scripts/transcribe.py',
  '.claude/skills/listen-to-meeting/scripts/listen.py',
];

const requiresPython = (file) => {
  const m = readFileSync(file, 'utf8').match(/^# requires-python = "(.+)"$/m);
  return m && m[1];
};

for (const file of scripts) {
  test(`${file} caps requires-python below 3.15`, () => {
    const spec = requiresPython(file);
    assert.ok(spec, 'header has requires-python');
    assert.match(spec, /<3\.15(,|$)/);
  });
}

test('both audio scripts carry the same requires-python', () => {
  assert.equal(requiresPython(scripts[0]), requiresPython(scripts[1]));
});

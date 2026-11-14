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

for (const file of scripts) {
  test(`${file} script block holds only TOML-valid lines`, () => {
    const m = readFileSync(file, 'utf8').match(/^# \/\/\/ script\n((?:#.*\n)*?)# \/\/\/$/m);
    assert.ok(m, 'has a PEP 723 block');
    // PEP 723 strips "# " from each line; what remains must be blank, a TOML
    // comment, a key = value, a list item, or a closing bracket.
    for (const line of m[1].split('\n').filter(Boolean)) {
      const body = line.replace(/^# ?/, '');
      assert.match(body, /^(\s*$|\s*#|\s*\S+\s*=|\s*"|\s*\])/, `invalid TOML line: ${line}`);
    }
  });
}

# Cap requires-python below 3.15 in the audio skill scripts

## What this changes
`uv run` on `transcribe.py` and `listen.py` resolves on a clean machine: the PEP 723 headers cap Python at `<3.15`, so uv picks 3.14 or lower, where `onnxruntime` has wheels. No flag or env var needed.

## Where
- `.claude/skills/transcribe-audio/scripts/transcribe.py` — line 3: `requires-python = ">=3.10,<3.15"`, plus a comment above it (onnxruntime wheels stop at cp314; raise once cp315 ships).
- `.claude/skills/listen-to-meeting/scripts/listen.py` — same line 3 and comment, kept in step.
- `wait.py` and `session.py` unchanged.
- Test in new `tests/unit/audio-skill-headers.test.js` (node:test, no lane or helpers; reads the two files and parses the `# /// script` block).

## How it will be proved
| Done when | Check | Layer |
| --- | --- | --- |
| uv picks Python 3.14 or lower, no flag, for both scripts | each header's `requires-python` has an upper bound of `<3.15` (false today: `>=3.10` only) | unit |
| `listen.py check` reaches readiness report; `transcribe.py check` runs decode test | builder runs `uv run <script> check` by hand on this machine with `--python 3.14` absent from the command; not automatable in CI | manual |
| Nothing outside the two headers changes | `git diff --stat` shows only the two script files plus the spec and test | review |

## Decisions
The ticket's "nothing outside the headers changes" is read as covering the skills' code; a unit test and this spec are added as the repo requires. Both headers are also asserted to carry the same cap, to keep them in step.

## Out of scope
Raising the cap, and any model or capture code.

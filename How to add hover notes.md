# How to add hover notes (for Augment Agent)

Purpose: Make the VS Code hover note extension show helpful, consistent notes when a developer hovers files in the Explorer.

The extension reads from: `.vscode/notes.json`
- Keys are repo-relative file paths (e.g., `app/layout.tsx`, `final-test.js`, `components/ui/button.tsx`)
- Values are note objects with fields below

## Note object schema
```
{
  "<path>": {
    "id": "string-unique",
    "content": "markdown string (keep it short, beginner-friendly)",
    "type": "note",
    "created": "ISO timestamp",
    "modified": "ISO timestamp",
    "version": 1,
    "syncStatus": "offline",
    "tags": ["short", "keywords"],
    "priority": "low|medium|high",
    "isMarkdown": true
  }
}
```

## Writing style
- Start with an emoji + TITLE LINE (2–5 words)
- Add 1–2 sentences of context “why this exists”
- Then a short bulleted list of 3–6 items (what it provides/does)
- Keep under ~10 lines total; junior-dev friendly

## Process for adding notes
1) Find top-of-tree files first (root files, top-level docs, core configs)
   - Examples: `README.md`, `PLANNING.md`, `DEPLOYMENT-GUIDE.md`, `package.json`, `next.config.js`, `tsconfig.json`, `tailwind.config.js`, `app/layout.tsx`
2) Open `.vscode/notes.json`
3) Add a new entry for the file path with the schema above
4) Set `created` and `modified` to `new Date().toISOString()` (UTC)
5) Keep `version: 1` and `syncStatus: "offline"`
6) Save a backup if desired under `.vscode/notes-backups/`

## Updating notes
- Locate the object by file path key
- Update `content` and bump `modified` timestamp
- Keep the tone consistent and concise

## Examples
Minimal example (config):
```
"tsconfig.json": {
  "id": "ts-001",
  "content": "\n\n📝 TYPESCRIPT CONFIGURATION\n\nTells TypeScript compiler how to check your code and provide types.\n\n🔍 KEY SETTINGS:\n• strict\n• baseUrl & paths (@/...)\n• jsx\n\n💡 WHY:\nCatches bugs before runtime; improves DX.",
  "type": "note",
  "created": "2025-08-11T00:00:00.000Z",
  "modified": "2025-08-11T00:00:00.000Z",
  "version": 1,
  "syncStatus": "offline",
  "tags": ["config", "typescript"],
  "priority": "medium",
  "isMarkdown": true
}
```

Minimal example (script):
```
"final-test.js": {
  "id": "dev-tools-final-test-001",
  "content": "\n\n🧪 FINAL SETUP SANITY CHECK\n\nVerifies local environment: Supabase connectivity, tables, auth, RLS, env vars.\n\n💡 USAGE:\nnode final-test.js",
  "type": "note",
  "created": "2025-08-11T00:00:00.000Z",
  "modified": "2025-08-11T00:00:00.000Z",
  "version": 1,
  "syncStatus": "offline",
  "tags": ["dev-tools", "testing"],
  "priority": "low",
  "isMarkdown": true
}
```

## Quality checklist
- Does the title and bullets make sense to a junior dev?
- Is it short and scannable?
- Is the note accurate to the current code?
- Are tags useful for search?

## Common pitfalls
- Don’t add notes to every small file at once. Start top-of-tree.
- Don’t write paragraphs; keep it brief.
- Avoid stale info: update when files change.

## Rollout strategy
- Phase 1: Top-of-tree files (this request)
- Phase 2: Feature root files (components/admin/, app/api/)
- Phase 3: Sub-files and utilities

When in doubt, ask the maintainer for the desired “why” context and tone.


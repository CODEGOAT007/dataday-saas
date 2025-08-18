#!/usr/bin/env node
/*
  Hover Notes Auditor
  Scans the repo for top-of-tree files and major folders and reports which are missing
  entries in .vscode/notes.json. Optionally adds stub notes with --fix.
*/

const fs = require('fs');
const path = require('path');

const REPO_ROOT = process.cwd();
const NOTES_PATH = path.join(REPO_ROOT, '.vscode', 'notes.json');
const REPORT_PATH = path.join(REPO_ROOT, '.vscode', 'notes-report.md');

const args = process.argv.slice(2);
const FIX = args.includes('--fix');
const DEPTH = (() => {
  const flag = args.find(a => a.startsWith('--depth='));
  return flag ? Number(flag.split('=')[1]) : 1; // default: one level deep
})();

// Heuristics: what to scan and how
const EXCLUDE_DIRS = new Set(['.git', '.vscode', 'node_modules', '.next', 'dist', 'build', 'coverage']);
const INCLUDE_TOP_DIRS = new Set(['app', 'components', 'hooks', 'lib', 'types', 'tests', 'public', 'supabase']);
const EXCLUDE_FILE_EXT = new Set(['.zip', '.exe', '.lock', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp']);

function isInterestingFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (EXCLUDE_FILE_EXT.has(ext)) return false;
  // Allow common code/docs/config files
  return ['.md', '.js', '.ts', '.tsx', '.json', '.sql', '.css'].includes(ext) || /config\.js$/.test(file) || /\.config\.(ts|js)$/.test(file);
}

function toForwardSlashes(p) {
  return p.split(path.sep).join('/');
}

function loadNotes() {
  try {
    const raw = fs.readFileSync(NOTES_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function saveNotes(notes) {
  const content = JSON.stringify(notes, null, 2) + '\n';
  fs.writeFileSync(NOTES_PATH, content, 'utf8');
}

function scanRepo(depth = 1) {
  const candidates = new Set();

  // Root files
  const rootEntries = fs.readdirSync(REPO_ROOT, { withFileTypes: true });
  rootEntries.forEach(ent => {
    if (ent.isFile()) {
      if (isInterestingFile(ent.name)) candidates.add(ent.name);
    } else if (ent.isDirectory()) {
      if (EXCLUDE_DIRS.has(ent.name)) return;
      if (INCLUDE_TOP_DIRS.has(ent.name)) {
        candidates.add(ent.name); // folder-level note
        if (depth > 0) {
          const p = path.join(REPO_ROOT, ent.name);
          const sub = fs.readdirSync(p, { withFileTypes: true });
          sub.forEach(s => {
            if (s.isDirectory()) {
              // Only one level deep
              candidates.add(toForwardSlashes(path.join(ent.name, s.name)));
            } else if (s.isFile() && isInterestingFile(s.name)) {
              // Include top-level files directly inside these folders
              candidates.add(toForwardSlashes(path.join(ent.name, s.name)));
            }
          });
        }
      }
    }
  });

  return Array.from(candidates).sort();
}

function generateStub(pathKey) {
  const base = path.basename(pathKey);
  const isFolder = !path.extname(base) && !base.includes('.');
  const title = isFolder ? `📁 ${base.toUpperCase()} FOLDER` : `📄 ${base}`;
  return {
    id: `auto-${base.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase()}-${Date.now()}`,
    content: `\n\n${title}\n\nAuto-generated stub. Replace with a concise, beginner-friendly note about why this exists.`,
    type: 'note',
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
    version: 1,
    syncStatus: 'offline',
    tags: ['hover-notes', 'todo'],
    priority: 'low',
    isMarkdown: true,
  };
}

function isDirKey(k) {
  try {
    const p = path.join(REPO_ROOT, k);
    return fs.existsSync(p) && fs.lstatSync(p).isDirectory();
  } catch { return false; }
}

function aliasKeysForFolder(k) {
  const aliases = new Set([k]);
  // Trailing slash/backslash
  if (!k.endsWith('/')) aliases.add(k + '/');
  if (!k.endsWith('\\')) aliases.add(k + '\\');
  // Dot-prefixed
  aliases.add('./' + k);
  aliases.add('.\\' + k);
  // Absolute (both styles)
  const abs = path.join(REPO_ROOT, k);
  aliases.add(abs);
  aliases.add(abs.split(path.sep).join('/'));
  // Windows-style escaped
  if (path.sep === '\\') {
    const driveLower = abs.replace(/^([A-Z]):/, (m, d) => d.toLowerCase() + ':');
    aliases.add(driveLower);
    aliases.add(driveLower.split('\\').join('/'));
    aliases.add('/' + driveLower.split('\\').join('/'));
  }
  return Array.from(aliases);
}

function run() {
  const notes = loadNotes();
  const keys = new Set(Object.keys(notes));
  const candidates = scanRepo(DEPTH);
  const missing = candidates.filter(k => !keys.has(k));

  const reportLines = [];
  reportLines.push(`# Hover Notes Audit`);
  reportLines.push(`- Scanned depth: ${DEPTH}`);
  reportLines.push(`- Total candidates: ${candidates.length}`);
  reportLines.push(`- Covered: ${candidates.length - missing.length}`);
  reportLines.push(`- Missing: ${missing.length}`);
  reportLines.push('');
  if (missing.length) {
    reportLines.push('## Missing entries');
    missing.forEach(m => reportLines.push(`- ${m}`));
  } else {
    reportLines.push('All scanned items have hover notes. ✅');
  }

  fs.writeFileSync(REPORT_PATH, reportLines.join('\n') + '\n', 'utf8');
  console.log(reportLines.join('\n'));

  if (FIX && candidates.length) {
    let added = 0;
    candidates.forEach(k => {
      const isFolder = isDirKey(k);
      if (!keys.has(k)) {
        notes[k] = generateStub(k);
        added++;
      }
      if (isFolder) {
        const variants = aliasKeysForFolder(k);
        variants.forEach(v => {
          if (!notes[v]) {
            notes[v] = generateStub(k);
            added++;
          }
        });
      }
    });
    saveNotes(notes);
    console.log(`\nAdded ${added} stub notes (including folder alias variants) to .vscode/notes.json`);
  }
}

run();


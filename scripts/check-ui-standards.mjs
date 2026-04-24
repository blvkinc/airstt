import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const runtimeSrcDir = path.join(projectRoot, 'src');
const packageJsonPath = path.join(projectRoot, 'package.json');

const bannedPackages = [
  'antd',
  '@ant-design/icons',
  '@mui/material',
  '@mui/icons-material',
  '@chakra-ui/react',
  '@mantine/core',
  '@mantine/hooks',
];

const bannedImportMatchers = [
  /^antd(?:\/|$)/,
  /^@ant-design\/(?:icons|icons-svg)(?:\/|$)/,
  /^@mui\//,
  /^@chakra-ui\//,
  /^@mantine\//,
];

const runtimeExtensions = new Set(['.js', '.jsx', '.ts', '.tsx']);
const packageSections = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
const violations = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }

    if (runtimeExtensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function addViolation(message) {
  violations.push(message);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

for (const section of packageSections) {
  const deps = packageJson[section] ?? {};
  for (const pkg of bannedPackages) {
    if (pkg in deps) {
      addViolation(`package.json ${section} must not include banned runtime UI package \"${pkg}\".`);
    }
  }
}

for (const filePath of walk(runtimeSrcDir)) {
  const relativePath = path.relative(projectRoot, filePath);
  const source = fs.readFileSync(filePath, 'utf8');
  const importRegex = /(?:import\s+(?:[^'";]+?\s+from\s+)?|export\s+[^'";]+?\s+from\s+|import\s*\()(['"])([^'"\n]+)\1/g;

  for (const match of source.matchAll(importRegex)) {
    const specifier = match[2];

    if (bannedImportMatchers.some((pattern) => pattern.test(specifier))) {
      addViolation(`${relativePath} imports banned UI library \"${specifier}\".`);
    }

    if (specifier.includes('archive/')) {
      addViolation(`${relativePath} imports archive path \"${specifier}\". Archive files are reference-only.`);
    }
  }
}

if (violations.length > 0) {
  console.error('UI standard guardrail check failed:\n');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log('UI standard guardrail check passed.');

#!/usr/bin/env node
const { execSync } = require('node:child_process');

function remoteUrl() {
  try {
    return execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function parseOwnerRepo(url) {
  const match = url.match(/github\.com[:/]([^/]+)\/([^/.]+)(?:\.git)?$/i);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

const parsed = parseOwnerRepo(remoteUrl());
if (!parsed) {
  console.error('Не найден GitHub remote origin. Добавьте его командой: git remote add origin <URL_репозитория>');
  process.exit(1);
}

const repoPath = parsed.repo.toLowerCase() === `${parsed.owner.toLowerCase()}.github.io` ? '' : `/${parsed.repo}/`;
console.log(`https://${parsed.owner}.github.io${repoPath}`);

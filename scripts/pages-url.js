#!/usr/bin/env node
const { execSync } = require('node:child_process');

function remoteUrl() {
  try {
    return execSync('git remote get-url origin', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

function stripGitSuffix(repo) {
  return repo.endsWith('.git') ? repo.slice(0, -4) : repo;
}

function parseOwnerRepo(url) {
  const ssh = url.match(/^git@github\.com:([^/]+)\/(.+)$/i);
  if (ssh) return { owner: ssh[1], repo: stripGitSuffix(ssh[2]) };

  const https = url.match(/^https?:\/\/github\.com\/([^/]+)\/(.+)$/i);
  if (https) return { owner: https[1], repo: stripGitSuffix(https[2]) };

  return null;
}

const parsed = parseOwnerRepo(remoteUrl());
if (!parsed) {
  console.error('Не найден GitHub remote origin. Добавьте его командой: git remote add origin <URL_репозитория>');
  process.exit(1);
}

const isUserPage = parsed.repo.toLowerCase() === `${parsed.owner.toLowerCase()}.github.io`;
const repoPath = isUserPage ? '/' : `/${parsed.repo}/`;
console.log(`https://${parsed.owner}.github.io${repoPath}`);

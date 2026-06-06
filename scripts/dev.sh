#!/usr/bin/env bash
set -e

BRANCH="${1}"
CLEAN=false

for arg in "$@"; do
  if [[ "$arg" == "--clean" ]]; then
    CLEAN=true
  fi
done

if [[ -z "$BRANCH" ]]; then
  echo "Usage: ./scripts/dev.sh <branch> [--clean]"
  exit 1
fi

if [[ ! -f ".env.local" ]]; then
  echo "Warning: .env.local not found — auth will not work (running in demo mode)"
fi

echo "Switching to branch: $BRANCH"
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

if [[ "$CLEAN" == true ]]; then
  echo "Clean install: removing node_modules..."
  rm -rf node_modules
fi

echo "Installing dependencies..."
npm install

echo "Starting dev server..."
npm run dev

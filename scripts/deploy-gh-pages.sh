#!/usr/bin/env bash
# Publish Běijīng 101 to GitHub Pages.
#
# Creates (or reuses) a repository, pushes this folder, and turns on Pages.
# Everything it needs is static: no build step, no CI.
#
# usage: scripts/deploy-gh-pages.sh [repo-name]      (default: beijing101)
#
# Requires: gh (authenticated), git. Nothing is published until you run this.
set -euo pipefail

REPO="${1:-beijing101}"
OWNER="$(gh api user --jq .login)"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

echo "▸ validating content before publishing"
python3 scripts/validate-content.py >/dev/null || {
  echo "✗ content validation failed — fix data/lessons.js first" >&2
  exit 1
}
echo "  content OK"

echo "▸ ensuring git repo is clean and committed"
git add -A
if ! git diff --cached --quiet; then
  git -c user.name="$(git config user.name || echo "$OWNER")" \
      -c user.email="$(git config user.email || echo "${OWNER}@users.noreply.github.com")" \
      commit -m "chore: prepare deploy"
fi

if gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
  echo "▸ repo $OWNER/$REPO exists — pushing"
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$OWNER/$REPO.git"
  git push -u origin main
else
  echo "▸ creating $OWNER/$REPO (public)"
  gh repo create "$OWNER/$REPO" --public --source=. --remote=origin --push \
    --description "Běijīng 101 — a 30-day Beijing Mandarin foundation course (PWA)"
fi

echo "▸ enabling GitHub Pages on main /"
gh api "repos/$OWNER/$REPO/pages" -X POST \
  -H "Accept: application/vnd.github+json" \
  -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 \
  || echo "  (Pages may already be enabled)"

echo
echo "✓ published (first build takes a minute):"
echo "  https://$OWNER.github.io/$REPO/"
echo
echo "note: the live URL is https, so the service worker and install prompt work there."

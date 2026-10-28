#!/usr/bin/env bash
# Sätter ihop webbplatsen för Firebase Hosting i dist/web: index.html (från src/build.py) + print/ (tryckfilerna).
#   python3 src/build.py && python3 tools/press.py && bash tools/web.sh
set -euo pipefail
cd "$(dirname "$0")/.."
test -f dist/web/index.html || { echo "kör python3 src/build.py först"; exit 1; }
n=$(ls dist/print/*.pdf 2>/dev/null | wc -l)
[ "$n" -ge 34 ] || { echo "dist/print har $n PDF:er, väntade 34 (kör python3 tools/press.py)"; exit 1; }
rm -rf dist/web/print && mkdir -p dist/web/print
cp dist/print/*.pdf dist/print/manifest.json dist/web/print/
[ -f dist/print/build.json ] && cp dist/print/build.json dist/web/print/  # jämförelsen för nästa publicering (tools/press_plan.py)
grep -q "var FIREBASE_CONFIG=null" dist/web/index.html && echo "OBS: FIREBASE_CONFIG är tom – ingen Google-inloggning" || true
du -sh dist/web

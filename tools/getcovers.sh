#!/bin/bash
# Laddar ner omslag listade i docs/cover-urls.txt som saknas i assets/recraft-original/covers/
cd "$(dirname "$0")/.."
while read id url; do [ -z "$id" ] && continue; f=assets/recraft-original/covers/$id.webp; [ -s $f ] || curl -sS -o $f "$url" & done < docs/cover-urls.txt; wait
ls assets/recraft-original/covers | wc -l

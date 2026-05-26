#!/usr/bin/env bash
# Downloads the OFL-licensed font .ttf files into public/fonts/ for the
# GitHub Résumé Generator. Run once after `npm install`. Idempotent.
#
# Usage: bash scripts/fetch-fonts.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/public/fonts"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

mkdir -p "$DEST"

need() {
  for f in "$@"; do
    if [ ! -s "$DEST/$f" ]; then return 0; fi
  done
  return 1
}

echo "==> Inter"
INTER_FILES=(Inter-Regular.ttf Inter-Medium.ttf Inter-SemiBold.ttf Inter-Bold.ttf)
if need "${INTER_FILES[@]}"; then
  curl -fsSL -o "$TMP/inter.zip" \
    "https://github.com/rsms/inter/releases/download/v4.0/Inter-4.0.zip"
  unzip -q -o "$TMP/inter.zip" -d "$TMP/inter"
  for f in "${INTER_FILES[@]}"; do
    src="$(find "$TMP/inter" -type f -name "$f" | head -1)"
    if [ -z "$src" ]; then
      # Fallback: extract from variable font directory naming differences
      src="$(find "$TMP/inter" -type f -name "${f%.ttf}*.ttf" | head -1)"
    fi
    cp "$src" "$DEST/$f"
  done
else
  echo "    Inter fonts already present, skipping."
fi

echo "==> IBM Plex Serif"
PLEX_FILES=(IBMPlexSerif-Regular.ttf IBMPlexSerif-SemiBold.ttf)
if need "${PLEX_FILES[@]}"; then
  curl -fsSL -o "$TMP/plex.zip" \
    "https://github.com/IBM/plex/releases/download/%40ibm%2Fplex-serif%401.1.0/ibm-plex-serif.zip"
  unzip -q -o "$TMP/plex.zip" -d "$TMP/plex"
  for f in "${PLEX_FILES[@]}"; do
    src="$(find "$TMP/plex" -type f -name "$f" | head -1)"
    cp "$src" "$DEST/$f"
  done
else
  echo "    IBM Plex Serif fonts already present, skipping."
fi

echo "==> JetBrains Mono"
JB_FILES=(JetBrainsMono-Regular.ttf JetBrainsMono-Medium.ttf)
if need "${JB_FILES[@]}"; then
  for f in "${JB_FILES[@]}"; do
    curl -fsSL -o "$DEST/$f" \
      "https://raw.githubusercontent.com/JetBrains/JetBrainsMono/master/fonts/ttf/$f"
  done
else
  echo "    JetBrains Mono fonts already present, skipping."
fi

echo "==> Geist (app shell)"
GEIST_BASE="https://raw.githubusercontent.com/vercel/geist-font/main/packages/next/dist/fonts/geist-sans"
GEIST_FILES=(Geist-Regular.ttf Geist-Medium.ttf Geist-SemiBold.ttf)
if need "${GEIST_FILES[@]}"; then
  for f in "${GEIST_FILES[@]}"; do
    curl -fsSL -o "$DEST/$f" "$GEIST_BASE/$f"
  done
else
  echo "    Geist fonts already present, skipping."
fi

echo "==> Newsreader (italic disruption)"
NEWSREADER_FILES=(Newsreader-Italic.ttf)
if need "${NEWSREADER_FILES[@]}"; then
  # Variable italic font from Google Fonts (single file, all weights/optical sizes).
  curl -fsSL -o "$DEST/Newsreader-Italic.ttf" \
    "https://raw.githubusercontent.com/google/fonts/main/ofl/newsreader/Newsreader-Italic%5Bopsz%2Cwght%5D.ttf"
else
  echo "    Newsreader font already present, skipping."
fi

echo "==> Geist Mono (app shell)"
GEISTMONO_BASE="https://raw.githubusercontent.com/vercel/geist-font/main/packages/next/dist/fonts/geist-mono"
GEISTMONO_FILES=(GeistMono-Regular.ttf GeistMono-Medium.ttf)
if need "${GEISTMONO_FILES[@]}"; then
  for f in "${GEISTMONO_FILES[@]}"; do
    curl -fsSL -o "$DEST/$f" "$GEISTMONO_BASE/$f"
  done
else
  echo "    Geist Mono fonts already present, skipping."
fi

echo "==> Done. Font files in $DEST"
ls -lh "$DEST"

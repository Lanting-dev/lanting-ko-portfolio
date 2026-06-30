#!/usr/bin/env bash
# Sync public/experiemental → public/experimental/{slug}
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/public/experiemental"
DST="$ROOT/public/experimental"

mkdir -p "$DST"/{suma,resonant,travel-pal,boojie,doorbear}

heic_to_jpg() {
  local src="$1" dest="$2"
  sips -s format jpeg -s formatOptions 85 "$src" --out "$dest" >/dev/null
}

pdf_to_png() {
  local src="$1" dest="$2"
  sips -s format png "$src" --out "$dest" >/dev/null
}

# ── SUMA ──────────────────────────────────────────────────────────────────────
SUMA_SRC="$SRC/SUMA"
SUMA_DST="$DST/suma"

cp "$SUMA_SRC/sing bowl.png" "$SUMA_DST/hero.png"

cp "$SUMA_SRC/2.png" "$SUMA_DST/gallery-01.png"
cp "$SUMA_SRC/3.png" "$SUMA_DST/gallery-02.png"

i=3
while IFS= read -r f; do
  cp "$f" "$SUMA_DST/gallery-$(printf '%02d' "$i").png"
  i=$((i + 1))
  [[ "$i" -gt 12 ]] && break
done < <(find "$SUMA_SRC" -maxdepth 1 -name 'Screenshot*.png' | sort)

# AR-VR Final (team project) — presentation slide + PDF
if [[ -f "$SUMA_SRC/AR-VR Final/Final presentation.pdf" ]]; then
  cp "$SUMA_SRC/AR-VR Final/Final presentation.pdf" "$SUMA_DST/ar-vr-final-presentation.pdf"
  pdf_to_png "$SUMA_SRC/AR-VR Final/Final presentation.pdf" "$SUMA_DST/ar-vr-final-cover.png"
fi

# Demo video (final presentation clip — preferred over raw screen recording)
if [[ -f "$SUMA_SRC/clip.mp4" ]]; then
  cp "$SUMA_SRC/clip.mp4" "$SUMA_DST/demo.mp4"
fi

# Poster still — extract at ~45s (sunset oasis scene) if swift is available
if [[ -f "$SUMA_DST/demo.mp4" ]] && command -v swift >/dev/null; then
  SUMA_DEMO="$SUMA_DST/demo.mp4" SUMA_HERO="$SUMA_DST/hero.png" swift -e '
import AVFoundation, AppKit
let v = ProcessInfo.processInfo.environment["SUMA_DEMO"]!
let o = ProcessInfo.processInfo.environment["SUMA_HERO"]!
let g = AVAssetImageGenerator(asset: AVURLAsset(url: URL(fileURLWithPath: v)))
g.appliesPreferredTrackTransform = true
g.maximumSize = CGSize(width: 1920, height: 1920)
if let cg = try? g.copyCGImage(at: CMTime(seconds: 45, preferredTimescale: 600), actualTime: nil) {
  let d = NSBitmapImageRep(cgImage: cg).representation(using: .png, properties: [:])!
  try? d.write(to: URL(fileURLWithPath: o))
}
' 2>/dev/null || true
fi

# ── Resonant ─────────────────────────────────────────────────────────────────
pdf_to_png "$SRC/Resonant/resonant.pdf" "$DST/resonant/hero.png"
cp "$SRC/Resonant/resonant.pdf" "$DST/resonant/resonant.pdf"
cp "$SRC/Resonant/vr.mp4" "$DST/resonant/vr.mp4"

# ── Travel Pal (+ Eye / A-Frame merge) ───────────────────────────────────────
TP_SRC="$SRC/Travel Pal"
TP_DST="$DST/travel-pal"

cp "$TP_SRC/IMG_5952.PNG" "$TP_DST/hero.png"

TP_GALLERY=(
  "IMG_5953.PNG"
  "IMG_5954.PNG"
  "IMG_5955 2.PNG"
  "IMG_5956 2.PNG"
  "IMG_5958 2.PNG"
  "IMG_5959 2.PNG"
  "IMG_5960 2.PNG"
  "IMG_5961.PNG"
  "IMG_5962.PNG"
  "IMG_5968.PNG"
)

i=1
for f in "${TP_GALLERY[@]}"; do
  if [[ -f "$TP_SRC/$f" ]]; then
    cp "$TP_SRC/$f" "$TP_DST/gallery-$(printf '%02d' "$i").png"
    ((i++)) || true
  fi
done

cp "$TP_SRC/Travel Pal.pdf" "$TP_DST/travel-pal.pdf"
pdf_to_png "$TP_SRC/Travel Pal.pdf" "$TP_DST/gallery-concept.png"

# Screen recordings (smallest first for primary demo)
if [[ -f "$TP_SRC/ScreenRecording_04-07-2025 15.MOV" ]]; then
  cp "$TP_SRC/ScreenRecording_04-07-2025 15.MOV" "$TP_DST/demo.mov"
fi
if [[ -f "$TP_SRC/ScreenRecording_04-07-2025 16.MOV" ]]; then
  cp "$TP_SRC/ScreenRecording_04-07-2025 16.MOV" "$TP_DST/demo-2.mov"
fi

# Eye → A-Frame exploration
find "$SRC/Eye" -maxdepth 1 -name 'Screen Recording*.mov' -exec cp {} "$TP_DST/eye-aframe.mov" \;

# ── Boojie (HEIC → JPG) ──────────────────────────────────────────────────────
n=0
while IFS= read -r -d '' heic; do
  ((n++)) || true
  heic_to_jpg "$heic" "$DST/boojie/$(printf '%02d' "$n").jpg"
done < <(find "$SRC/Boojie" -maxdepth 1 -name '*.HEIC' -print0 | sort -z)

# Hero = middle-ish image for variety
if [[ -f "$DST/boojie/01.jpg" ]]; then
  cp "$DST/boojie/08.jpg" "$DST/boojie/hero.jpg" 2>/dev/null || cp "$DST/boojie/01.jpg" "$DST/boojie/hero.jpg"
fi

# Copy one MOV as showcase clip
if [[ -f "$SRC/Boojie/IMG_9156.MOV" ]]; then
  cp "$SRC/Boojie/IMG_9156.MOV" "$DST/boojie/clip.mov"
fi

# ── Doorbear (HEIC → JPG) ───────────────────────────────────────────────────
n=0
while IFS= read -r -d '' heic; do
  ((n++)) || true
  heic_to_jpg "$heic" "$DST/doorbear/$(printf '%02d' "$n").jpg"
done < <(find "$SRC/Doorbear" -maxdepth 1 -name '*.HEIC' -print0 | sort -z)

if [[ -f "$DST/doorbear/01.jpg" ]]; then
  cp "$DST/doorbear/01.jpg" "$DST/doorbear/hero.jpg"
fi

echo "Done. Asset counts:"
for s in suma resonant travel-pal boojie doorbear; do
  echo "  $s: $(ls "$DST/$s" | wc -l | tr -d ' ') files"
done

# Regenerate intrinsic-dimension lookup so <img>/<video> can reserve layout space.
bash "$ROOT/scripts/measure-experimental-dimensions.sh"

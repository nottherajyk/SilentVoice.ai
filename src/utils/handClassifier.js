/**
 * ASL Alphabet Hand Gesture Classifier (Rule-Based)
 * 
 * Classifies hand landmarks into ASL fingerspelling letters A–Z.
 * Each letter returns { letter, confidence } where confidence ∈ [0, 1].
 *
 * v2 — Rewrote M/T/S/N/Z with mutually-exclusive thumb-position geometry.
 */

import {
  LANDMARKS as L,
  distance,
  distance2D,
  isFingerExtended,
  isThumbExtended,
  fingerCurlAmount,
  angleBetween,
  normalizeLandmarks,
} from './landmarkUtils';

/* ── helpers ── */

function getFingerStates(lm) {
  const indexExtended  = isFingerExtended(lm, L.INDEX_TIP, L.INDEX_PIP);
  const middleExtended = isFingerExtended(lm, L.MIDDLE_TIP, L.MIDDLE_PIP);
  const ringExtended   = isFingerExtended(lm, L.RING_TIP, L.RING_PIP);
  const pinkyExtended  = isFingerExtended(lm, L.PINKY_TIP, L.PINKY_PIP);
  const thumbExtended  = isThumbExtended(lm);

  const indexCurl  = fingerCurlAmount(lm, L.INDEX_MCP, L.INDEX_PIP, L.INDEX_DIP, L.INDEX_TIP);
  const middleCurl = fingerCurlAmount(lm, L.MIDDLE_MCP, L.MIDDLE_PIP, L.MIDDLE_DIP, L.MIDDLE_TIP);
  const ringCurl   = fingerCurlAmount(lm, L.RING_MCP, L.RING_PIP, L.RING_DIP, L.RING_TIP);
  const pinkyCurl  = fingerCurlAmount(lm, L.PINKY_MCP, L.PINKY_PIP, L.PINKY_DIP, L.PINKY_TIP);

  const extendedCount = [indexExtended, middleExtended, ringExtended, pinkyExtended]
    .filter(Boolean).length;

  return {
    indexExtended, middleExtended, ringExtended, pinkyExtended, thumbExtended,
    indexCurl, middleCurl, ringCurl, pinkyCurl, extendedCount,
  };
}

/** Palm center (average of the 4-finger MCPs). */
function palmCenter(lm) {
  return {
    x: (lm[L.INDEX_MCP].x + lm[L.MIDDLE_MCP].x + lm[L.RING_MCP].x + lm[L.PINKY_MCP].x) / 4,
    y: (lm[L.INDEX_MCP].y + lm[L.MIDDLE_MCP].y + lm[L.RING_MCP].y + lm[L.PINKY_MCP].y) / 4,
  };
}

/** Hand scale = wrist → middle-MCP distance. */
function handScale(lm) {
  return distance2D(lm[L.WRIST], lm[L.MIDDLE_MCP]) || 0.001;
}

/* ════════════════════════════════════════════════════════════════════
   Dedicated fist-classifier for M / N / S / T / A / E
   These all share "four fingers curled" — the ONLY differentiator
   is the thumb's position relative to the curled fingers.
   ════════════════════════════════════════════════════════════════════ */

function classifyFist(lm, fs) {
  const scale = handScale(lm);
  const thumb = lm[L.THUMB_TIP];
  const thumbIP = lm[L.THUMB_IP];

  // Key reference points on the curled fingers
  const idxPIP = lm[L.INDEX_PIP];
  const idxDIP = lm[L.INDEX_DIP];
  const midPIP = lm[L.MIDDLE_PIP];
  const midDIP = lm[L.MIDDLE_DIP];
  const rngPIP = lm[L.RING_PIP];

  // Normalised distances (divide by hand scale so thresholds are hand-size independent)
  const thumbToIdxPIP = distance2D(thumb, idxPIP) / scale;
  const thumbToIdxDIP = distance2D(thumb, idxDIP) / scale;
  const thumbToMidPIP = distance2D(thumb, midPIP) / scale;
  const thumbToMidDIP = distance2D(thumb, midDIP) / scale;
  const thumbToRngPIP = distance2D(thumb, rngPIP) / scale;

  // Thumb-tip x relative to finger PIPs (positive = thumb further from pinky side)
  const idxPIPx = idxPIP.x;
  const midPIPx = midPIP.x;

  // Is thumb tip in front of (closer to camera) the curled finger plane?
  // Use z-axis: lower z = closer to camera.
  const thumbInFront = thumb.z < idxPIP.z;

  // Is thumb tip BETWEEN index and middle?  Check x-range.
  const thumbXBetweenIdxMid =
    (thumb.x > Math.min(idxPIPx, midPIPx) - 0.02) &&
    (thumb.x < Math.max(idxPIPx, midPIPx) + 0.02);

  // Is thumb tip BELOW / tucked under the finger tips?
  const idxTip = lm[L.INDEX_TIP];
  const midTip = lm[L.MIDDLE_TIP];
  const rngTip = lm[L.RING_TIP];
  const thumbBelowFingerTips = thumb.y > Math.min(idxTip.y, midTip.y, rngTip.y);

  // ── T: thumb pokes between index & middle PIPs ──
  // Thumb tip is very close to index PIP and sits between index/middle columns.
  const tScore = (() => {
    if (thumbToIdxPIP > 0.35) return 0;
    let s = 0;
    if (thumbToIdxPIP < 0.20) s += 0.35;
    else if (thumbToIdxPIP < 0.28) s += 0.20;
    if (thumbXBetweenIdxMid) s += 0.25;
    if (thumb.y < idxPIP.y) s += 0.15;  // thumb tip pokes upward through gap
    if (thumbToMidPIP < 0.25) s += 0.10;
    return Math.min(s, 0.90);
  })();

  // ── S: fist with thumb across front of curled fingers ──
  // Thumb tip sits in front (z) and overlaps the index/middle DIP region.
  const sScore = (() => {
    let s = 0;
    if (thumbInFront) s += 0.25;
    // thumb overlaps finger front
    if (thumbToIdxDIP < 0.25) s += 0.15;
    if (thumbToMidDIP < 0.30) s += 0.10;
    // thumb NOT between idx/mid (that's T)
    if (!thumbXBetweenIdxMid) s += 0.15;
    // thumb is roughly at same y-level as PIPs
    if (Math.abs(thumb.y - idxPIP.y) / scale < 0.30) s += 0.10;
    // not extended outward
    if (!fs.thumbExtended) s += 0.10;
    return Math.min(s, 0.90);
  })();

  // ── M: three fingers over thumb — thumb emerges below pinky side ──
  // Thumb tip sits UNDER index+middle+ring and pokes out below ring PIP.
  const mScore = (() => {
    let s = 0;
    if (thumbBelowFingerTips) s += 0.20;
    // thumb near ring PIP area
    if (thumbToRngPIP < 0.30) s += 0.25;
    // thumb further from index than from ring
    if (thumbToRngPIP < thumbToIdxPIP) s += 0.15;
    // thumb below all three finger PIPs
    if (thumb.y > idxPIP.y && thumb.y > midPIP.y && thumb.y > rngPIP.y) s += 0.15;
    if (!fs.thumbExtended) s += 0.05;
    return Math.min(s, 0.90);
  })();

  // ── N: two fingers over thumb — thumb emerges between middle & ring ──
  // Thumb tip sits UNDER index+middle and pokes out near middle PIP.
  const nScore = (() => {
    let s = 0;
    if (thumbBelowFingerTips) s += 0.15;
    // thumb near middle PIP
    if (thumbToMidPIP < 0.25) s += 0.25;
    // thumb below index and middle PIPs but NOT below ring PIP
    if (thumb.y > idxPIP.y && thumb.y > midPIP.y) s += 0.15;
    if (thumb.y < rngPIP.y + 0.02) s += 0.10; // NOT as deep as M
    // thumb between mid and ring columns
    const thumbXBetweenMidRng =
      (thumb.x > Math.min(midPIPx, rngPIP.x) - 0.02) &&
      (thumb.x < Math.max(midPIPx, rngPIP.x) + 0.02);
    if (thumbXBetweenMidRng) s += 0.15;
    if (!fs.thumbExtended) s += 0.05;
    return Math.min(s, 0.90);
  })();

  // ── A: fist with thumb alongside (beside index, sticking up) ──
  const aScore = (() => {
    let s = 0;
    if (fs.thumbExtended) s += 0.30;
    if (thumb.y < idxPIP.y) s += 0.20;     // thumb tip above index PIP
    if (thumbToIdxPIP < 0.30) s += 0.10;
    if (fs.indexCurl > 0.5) s += 0.10;
    return Math.min(s, 0.90);
  })();

  // ── E: all fingers curled tightly, thumb tucked under fingers ──
  const eScore = (() => {
    let s = 0;
    const allTight = fs.indexCurl > 0.55 && fs.middleCurl > 0.55 &&
                     fs.ringCurl > 0.55 && fs.pinkyCurl > 0.55;
    if (allTight) s += 0.25;
    if (!fs.thumbExtended) s += 0.15;
    if (thumbBelowFingerTips) s += 0.15;
    // thumb tucked far inside (close to palm center)
    const pc = palmCenter(lm);
    if (distance2D(thumb, pc) / scale < 0.30) s += 0.15;
    return Math.min(s, 0.85);
  })();

  // Pick best
  const fistCandidates = [
    { letter: 'T', confidence: tScore },
    { letter: 'S', confidence: sScore },
    { letter: 'M', confidence: mScore },
    { letter: 'N', confidence: nScore },
    { letter: 'A', confidence: aScore },
    { letter: 'E', confidence: eScore },
  ];

  fistCandidates.sort((a, b) => b.confidence - a.confidence);
  const best = fistCandidates[0];
  const second = fistCandidates[1];

  // Only return if clearly winning (gap > 0.08) or decent absolute score
  if (best.confidence > 0.35 && (best.confidence - second.confidence) > 0.05) {
    return best;
  }
  if (best.confidence > 0.50) {
    return best;
  }
  return null; // ambiguous — let main classifier handle
}

/* ════════════════════════════════════════════
   Main classifier entry point
   ════════════════════════════════════════════ */

export function classifyASL(rawLandmarks) {
  if (!rawLandmarks || rawLandmarks.length < 21) {
    return { letter: null, confidence: 0 };
  }

  const lm = rawLandmarks;
  const nlm = normalizeLandmarks(lm);
  const fs = getFingerStates(lm);
  const candidates = [];

  // ── Fist-family (M/N/S/T/A/E) — dedicated sub-classifier ──
  const allFingersCurled = !fs.indexExtended && !fs.middleExtended &&
                           !fs.ringExtended && !fs.pinkyExtended;
  if (allFingersCurled) {
    const fistResult = classifyFist(lm, fs);
    if (fistResult) {
      candidates.push(fistResult);
    }
  }

  // ── B: Four fingers extended, thumb folded ──
  if (fs.indexExtended && fs.middleExtended && fs.ringExtended && fs.pinkyExtended && !fs.thumbExtended) {
    const close = distance2D(lm[L.INDEX_TIP], lm[L.PINKY_TIP]) < 0.15;
    candidates.push({ letter: 'B', confidence: close ? 0.85 : 0.7 });
  }

  // ── C: Curved hand ──
  {
    const semi = fs.indexCurl > 0.2 && fs.indexCurl < 0.7 &&
                 fs.middleCurl > 0.2 && fs.middleCurl < 0.7;
    if (semi && fs.thumbExtended && fs.extendedCount <= 2) {
      const d = distance2D(lm[L.THUMB_TIP], lm[L.INDEX_TIP]);
      if (d > 0.05 && d < 0.2) candidates.push({ letter: 'C', confidence: 0.70 });
    }
  }

  // ── D: Index up, thumb touches middle ──
  if (fs.indexExtended && !fs.middleExtended && !fs.ringExtended && !fs.pinkyExtended) {
    if (distance2D(lm[L.THUMB_TIP], lm[L.MIDDLE_TIP]) < 0.08)
      candidates.push({ letter: 'D', confidence: 0.80 });
  }

  // ── F: thumb+index circle, rest extended ──
  if (fs.middleExtended && fs.ringExtended && fs.pinkyExtended) {
    if (distance2D(lm[L.THUMB_TIP], lm[L.INDEX_TIP]) < 0.06)
      candidates.push({ letter: 'F', confidence: 0.80 });
  }

  // ── G: Index pointing sideways ──
  if (fs.indexExtended && !fs.middleExtended && !fs.ringExtended && !fs.pinkyExtended) {
    const horiz = Math.abs(lm[L.INDEX_TIP].y - lm[L.INDEX_MCP].y) < 0.08;
    if (horiz && fs.thumbExtended) candidates.push({ letter: 'G', confidence: 0.65 });
  }

  // ── H: Index+middle sideways ──
  if (fs.indexExtended && fs.middleExtended && !fs.ringExtended && !fs.pinkyExtended) {
    const h1 = Math.abs(lm[L.INDEX_TIP].y - lm[L.INDEX_MCP].y) < 0.08;
    const h2 = Math.abs(lm[L.MIDDLE_TIP].y - lm[L.MIDDLE_MCP].y) < 0.08;
    if (h1 && h2) candidates.push({ letter: 'H', confidence: 0.65 });
  }

  // ── I: Pinky only ──
  if (!fs.indexExtended && !fs.middleExtended && !fs.ringExtended && fs.pinkyExtended)
    candidates.push({ letter: 'I', confidence: 0.80 });

  // ── K: Index+middle V with thumb between ──
  if (fs.indexExtended && fs.middleExtended && !fs.ringExtended && !fs.pinkyExtended) {
    const a = angleBetween(lm[L.INDEX_TIP], lm[L.INDEX_MCP], lm[L.MIDDLE_TIP]);
    if (a > 15 && a < 60 && fs.thumbExtended) candidates.push({ letter: 'K', confidence: 0.65 });
  }

  // ── L: L-shape ──
  if (fs.indexExtended && !fs.middleExtended && !fs.ringExtended && !fs.pinkyExtended && fs.thumbExtended) {
    const a = angleBetween(lm[L.INDEX_TIP], lm[L.WRIST], lm[L.THUMB_TIP]);
    if (a > 60 && a < 120) candidates.push({ letter: 'L', confidence: 0.80 });
  }

  // ── O: Fingertips touch thumb ──
  {
    const d1 = distance2D(lm[L.THUMB_TIP], lm[L.INDEX_TIP]) < 0.07;
    const d2 = distance2D(lm[L.THUMB_TIP], lm[L.MIDDLE_TIP]) < 0.1;
    if (d1 && d2 && fs.indexCurl > 0.3) candidates.push({ letter: 'O', confidence: 0.70 });
  }

  // ── P: Like K but pointing down ──
  if (fs.indexExtended && fs.middleExtended && !fs.ringExtended && !fs.pinkyExtended) {
    if (lm[L.INDEX_TIP].y > lm[L.WRIST].y && fs.thumbExtended)
      candidates.push({ letter: 'P', confidence: 0.60 });
  }

  // ── Q: Like G but pointing down ──
  if (fs.indexExtended && !fs.middleExtended && !fs.ringExtended && !fs.pinkyExtended) {
    if (lm[L.INDEX_TIP].y > lm[L.WRIST].y && fs.thumbExtended)
      candidates.push({ letter: 'Q', confidence: 0.60 });
  }

  // ── R: Index+middle crossed ──
  if (fs.indexExtended && fs.middleExtended && !fs.ringExtended && !fs.pinkyExtended) {
    const crossed = lm[L.INDEX_TIP].x > lm[L.MIDDLE_TIP].x;
    const close = distance2D(lm[L.INDEX_TIP], lm[L.MIDDLE_TIP]) < 0.05;
    if (crossed || close) candidates.push({ letter: 'R', confidence: 0.60 });
  }

  // ── U: Index+middle together vertical ──
  if (fs.indexExtended && fs.middleExtended && !fs.ringExtended && !fs.pinkyExtended) {
    const close = distance2D(lm[L.INDEX_TIP], lm[L.MIDDLE_TIP]) < 0.05;
    const vert = Math.abs(lm[L.INDEX_TIP].x - lm[L.INDEX_MCP].x) < 0.06;
    if (close && vert && !fs.thumbExtended) candidates.push({ letter: 'U', confidence: 0.70 });
  }

  // ── V: Peace sign ──
  if (fs.indexExtended && fs.middleExtended && !fs.ringExtended && !fs.pinkyExtended) {
    const spread = distance2D(lm[L.INDEX_TIP], lm[L.MIDDLE_TIP]) > 0.06;
    const a = angleBetween(lm[L.INDEX_TIP], lm[L.INDEX_MCP], lm[L.MIDDLE_TIP]);
    if (spread && a > 15 && !fs.thumbExtended) candidates.push({ letter: 'V', confidence: 0.75 });
  }

  // ── W: Index+middle+ring extended ──
  if (fs.indexExtended && fs.middleExtended && fs.ringExtended && !fs.pinkyExtended && !fs.thumbExtended)
    candidates.push({ letter: 'W', confidence: 0.75 });

  // ── X: Index hook ──
  if (!fs.middleExtended && !fs.ringExtended && !fs.pinkyExtended) {
    const bent = lm[L.INDEX_TIP].y > lm[L.INDEX_DIP].y && lm[L.INDEX_DIP].y < lm[L.INDEX_PIP].y;
    if (bent) candidates.push({ letter: 'X', confidence: 0.60 });
  }

  // ── Y: Thumb+pinky extended ──
  if (!fs.indexExtended && !fs.middleExtended && !fs.ringExtended && fs.pinkyExtended && fs.thumbExtended)
    candidates.push({ letter: 'Y', confidence: 0.85 });

  // ── Z: Index extended, drawing Z motion (static = index pointing) ──
  // Z is inherently motion-based.  For static, we detect index pointing
  // at a diagonal angle that differs from D/G/Q.
  if (fs.indexExtended && !fs.middleExtended && !fs.ringExtended && !fs.pinkyExtended) {
    const dx = lm[L.INDEX_TIP].x - lm[L.INDEX_MCP].x;
    const dy = lm[L.INDEX_TIP].y - lm[L.INDEX_MCP].y;
    const diag = Math.abs(dx) > 0.04 && Math.abs(dy) > 0.04; // neither horizontal nor vertical
    const notG = Math.abs(dy) > 0.03; // G is horizontal
    const notQ = lm[L.INDEX_TIP].y < lm[L.WRIST].y; // Q points down
    if (diag && notG && notQ && !fs.thumbExtended)
      candidates.push({ letter: 'Z', confidence: 0.55 });
  }

  // ── Fallback ──
  if (candidates.length === 0) {
    if (fs.extendedCount === 5 && fs.thumbExtended)
      candidates.push({ letter: 'B', confidence: 0.45 });
    else if (fs.extendedCount === 0 && !fs.thumbExtended)
      candidates.push({ letter: 'S', confidence: 0.40 });
    else if (fs.extendedCount === 1 && fs.indexExtended)
      candidates.push({ letter: 'D', confidence: 0.40 });
    else if (fs.extendedCount === 2 && fs.indexExtended && fs.middleExtended)
      candidates.push({ letter: 'V', confidence: 0.40 });
  }

  if (candidates.length === 0) return { letter: null, confidence: 0 };
  candidates.sort((a, b) => b.confidence - a.confidence);
  return candidates[0];
}

/**
 * Landmark utility functions for hand gesture recognition.
 * MediaPipe Hands returns 21 landmarks, each with {x, y, z}.
 * All coordinates are normalized [0, 1].
 */

// Landmark indices
export const LANDMARKS = {
  WRIST: 0,
  THUMB_CMC: 1,
  THUMB_MCP: 2,
  THUMB_IP: 3,
  THUMB_TIP: 4,
  INDEX_MCP: 5,
  INDEX_PIP: 6,
  INDEX_DIP: 7,
  INDEX_TIP: 8,
  MIDDLE_MCP: 9,
  MIDDLE_PIP: 10,
  MIDDLE_DIP: 11,
  MIDDLE_TIP: 12,
  RING_MCP: 13,
  RING_PIP: 14,
  RING_DIP: 15,
  RING_TIP: 16,
  PINKY_MCP: 17,
  PINKY_PIP: 18,
  PINKY_DIP: 19,
  PINKY_TIP: 20,
};

/**
 * Calculate Euclidean distance between two landmark points.
 */
export function distance(a, b) {
  return Math.sqrt(
    (a.x - b.x) ** 2 +
    (a.y - b.y) ** 2 +
    (a.z - b.z) ** 2
  );
}

/**
 * Calculate 2D distance (ignoring z).
 */
export function distance2D(a, b) {
  return Math.sqrt(
    (a.x - b.x) ** 2 +
    (a.y - b.y) ** 2
  );
}

/**
 * Normalize landmarks relative to wrist position and hand scale.
 * Returns landmarks centered at wrist with unit scale.
 */
export function normalizeLandmarks(landmarks) {
  const wrist = landmarks[LANDMARKS.WRIST];
  const middleMCP = landmarks[LANDMARKS.MIDDLE_MCP];
  const scale = distance(wrist, middleMCP) || 1;

  return landmarks.map(lm => ({
    x: (lm.x - wrist.x) / scale,
    y: (lm.y - wrist.y) / scale,
    z: (lm.z - wrist.z) / scale,
  }));
}

/**
 * Check if a finger is extended (tip above PIP joint in y-axis).
 * Note: In MediaPipe, y increases downward, so tip.y < pip.y means extended.
 */
export function isFingerExtended(landmarks, tipIdx, pipIdx) {
  return landmarks[tipIdx].y < landmarks[pipIdx].y;
}

/**
 * Check if a finger is curled (tip below MCP joint).
 */
export function isFingerCurled(landmarks, tipIdx, mcpIdx) {
  return landmarks[tipIdx].y > landmarks[mcpIdx].y;
}

/**
 * Check if thumb is extended (using x-axis since thumb moves laterally).
 */
export function isThumbExtended(landmarks) {
  const thumbTip = landmarks[LANDMARKS.THUMB_TIP];
  const thumbIP = landmarks[LANDMARKS.THUMB_IP];
  const thumbMCP = landmarks[LANDMARKS.THUMB_MCP];
  
  // Thumb is extended if tip is far from palm center
  const palmCenter = {
    x: (landmarks[LANDMARKS.INDEX_MCP].x + landmarks[LANDMARKS.PINKY_MCP].x) / 2,
    y: (landmarks[LANDMARKS.INDEX_MCP].y + landmarks[LANDMARKS.PINKY_MCP].y) / 2,
    z: 0,
  };
  
  const tipDist = distance2D(thumbTip, palmCenter);
  const mcpDist = distance2D(thumbMCP, palmCenter);
  
  return tipDist > mcpDist * 1.1;
}

/**
 * Get angle between three points (in degrees).
 */
export function angleBetween(a, b, c) {
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };
  
  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.sqrt(ab.x ** 2 + ab.y ** 2);
  const magCB = Math.sqrt(cb.x ** 2 + cb.y ** 2);
  
  if (magAB === 0 || magCB === 0) return 0;
  
  const cosAngle = Math.max(-1, Math.min(1, dot / (magAB * magCB)));
  return Math.acos(cosAngle) * (180 / Math.PI);
}

/**
 * Get the finger curl amount (0 = fully extended, 1 = fully curled).
 */
export function fingerCurlAmount(landmarks, mcpIdx, pipIdx, dipIdx, tipIdx) {
  const angle1 = angleBetween(
    landmarks[mcpIdx],
    landmarks[pipIdx],
    landmarks[tipIdx]
  );
  // Normalize: ~180° = extended (0), ~60° = curled (1)
  return Math.max(0, Math.min(1, (180 - angle1) / 120));
}

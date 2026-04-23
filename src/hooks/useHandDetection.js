import { useRef, useState, useCallback, useEffect } from 'react';
import { classifyASL } from '../utils/handClassifier';

/**
 * Loads a script from CDN and returns a promise.
 */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.crossOrigin = 'anonymous';
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load: ${src}`));
    document.head.appendChild(script);
  });
}

/**
 * Custom hook for webcam-based hand detection and ASL classification.
 * Uses MediaPipe Hands loaded from CDN to avoid ESM bundling issues.
 */
export function useHandDetection(landmarkColor = '#00b4ff') {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const handsRef = useRef(null);
  const fpsTimestamps = useRef([]);
  const colorRef = useRef(landmarkColor);

  useEffect(() => {
    colorRef.current = landmarkColor;
  }, [landmarkColor]);

  const [detectedLetter, setDetectedLetter] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [handDetected, setHandDetected] = useState(false);
  const [landmarks, setLandmarks] = useState(null);
  const [fps, setFps] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const drawLandmarks = useCallback((canvas, handLandmarks) => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!handLandmarks || handLandmarks.length === 0) return;

    const lm = handLandmarks;
    const w = canvas.width;
    const h = canvas.height;
    const color = colorRef.current;

    // Connection lines
    const connections = [
      [0,1],[1,2],[2,3],[3,4],
      [0,5],[5,6],[6,7],[7,8],
      [0,9],[9,10],[10,11],[11,12],
      [0,13],[13,14],[14,15],[15,16],
      [0,17],[17,18],[18,19],[19,20],
      [5,9],[9,13],[13,17],
    ];

    // Draw connections
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = color;
    connections.forEach(([i, j]) => {
      ctx.beginPath();
      ctx.moveTo(lm[i].x * w, lm[i].y * h);
      ctx.lineTo(lm[j].x * w, lm[j].y * h);
      ctx.stroke();
    });

    // Draw landmarks
    lm.forEach((point, idx) => {
      const x = point.x * w;
      const y = point.y * h;
      const isTip = idx % 4 === 0 && idx > 0;
      const isWrist = idx === 0;
      const radius = isWrist ? 4 : (isTip ? 3 : 2);

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();

      // White dot center
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.5, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    });
  }, []);

  const onResults = useCallback((results) => {
    // FPS calculation
    const now = performance.now();
    fpsTimestamps.current.push(now);
    fpsTimestamps.current = fpsTimestamps.current.filter(t => now - t < 1000);
    setFps(fpsTimestamps.current.length);

    const canvas = canvasRef.current;
    if (!canvas) return;

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const handLandmarks = results.multiHandLandmarks[0];
      setHandDetected(true);
      setLandmarks(handLandmarks);

      // Draw overlay
      drawLandmarks(canvas, handLandmarks);

      // Classify gesture
      const result = classifyASL(handLandmarks);
      setDetectedLetter(result.letter);
      setConfidence(result.confidence);
    } else {
      setHandDetected(false);
      setLandmarks(null);
      setDetectedLetter(null);
      setConfidence(0);

      // Clear canvas
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [drawLandmarks]);

  const startCamera = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Check browser support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support camera access. Please use Chrome, Firefox, or Edge.');
      }

      const video = videoRef.current;
      if (!video) throw new Error('Video element not ready');

      // Load MediaPipe from CDN
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');
      await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');

      // Access the global objects
      const { Hands } = window;
      const { Camera } = window;

      if (!Hands || !Camera) {
        throw new Error('Failed to load MediaPipe libraries');
      }

      // Initialize MediaPipe Hands
      const hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        },
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.5,
      });

      hands.onResults(onResults);
      handsRef.current = hands;

      // Start camera
      const camera = new Camera(video, {
        onFrame: async () => {
          if (handsRef.current && videoRef.current) {
            await handsRef.current.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480,
      });

      cameraRef.current = camera;
      await camera.start();

      setIsLoading(false);
      setIsRunning(true);
    } catch (err) {
      console.error('Camera initialization error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera permissions and reload.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please connect a webcam.');
      } else {
        setError(err.message || 'Failed to initialize camera');
      }
      setIsLoading(false);
    }
  }, [onResults]);

  const stopCamera = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
    if (handsRef.current) {
      handsRef.current.close();
      handsRef.current = null;
    }
    setIsRunning(false);
    setHandDetected(false);
    setDetectedLetter(null);
    setConfidence(0);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    canvasRef,
    detectedLetter,
    confidence,
    isLoading,
    error,
    handDetected,
    landmarks,
    fps,
    isRunning,
    startCamera,
    stopCamera,
  };
}

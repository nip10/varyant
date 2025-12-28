"use client";

import confetti from "canvas-confetti";
import { useCallback, useRef } from "react";

interface ConfettiOptions {
  /** Number of particles (default: 200) */
  particleCount?: number;
  /** Spread angle in degrees (default: 70) */
  spread?: number;
  /** Duration before confetti falls (default: uses decay) */
  duration?: number;
}

export function useConfetti() {
  // Track if celebration is in progress to prevent spam
  const isAnimatingRef = useRef(false);

  /**
   * Fire a dramatic celebration confetti from multiple angles
   * Triggered for experiment wins and successful experiment creation
   */
  const celebrate = useCallback((options: ConfettiOptions = {}) => {
    // Prevent multiple simultaneous celebrations
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const count = options.particleCount ?? 200;
    const defaults: confetti.Options = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    // Fire from left side
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      origin: { x: 0.2, y: 0.7 },
    });

    // Fire from center
    fire(0.2, {
      spread: 60,
      origin: { x: 0.5, y: 0.7 },
    });

    // Fire from right side
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      origin: { x: 0.8, y: 0.7 },
    });

    // Extra burst with larger particles
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      origin: { x: 0.5, y: 0.6 },
    });

    // Reset after animation completes
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 3000);
  }, []);

  /**
   * Fire a smaller, subtle celebration
   * Good for minor wins or confirmations
   */
  const celebrateSmall = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      zIndex: 9999,
    });

    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 2000);
  }, []);

  /**
   * Fire confetti from a specific element's position
   * Useful for button celebrations
   */
  const celebrateFromElement = useCallback((element: HTMLElement) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const rect = element.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x, y },
      zIndex: 9999,
    });

    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 2000);
  }, []);

  return {
    celebrate,
    celebrateSmall,
    celebrateFromElement,
  };
}

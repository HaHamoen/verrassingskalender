import confetti from 'canvas-confetti';
import { JACKPOT_CONFETTI_DURATION } from '../constants/calendar';

export function useConfetti() {
  const triggerConfetti = () => {
    const duration = JACKPOT_CONFETTI_DURATION;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const triggerSimpleConfetti = (element?: HTMLElement) => {
    let origin = { x: 0.5, y: 0.6 };

    if (element) {
      const rect = element.getBoundingClientRect();
      origin = {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      };
    }

    confetti({
      particleCount: 100,
      spread: 70,
      origin,
    });
  };

  return {
    triggerConfetti,
    triggerSimpleConfetti,
  };
}

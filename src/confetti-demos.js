// canvas-confetti demo options reference
// See https://www.kirilv.com/canvas-confetti/ for live demos
// To use: include canvas-confetti library and call these functions as needed

// 1. Basic Cannon
function confettiBasicCannon() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// 2. Random Direction
function confettiRandomDirection() {
  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }
  confetti({
    angle: randomInRange(55, 125),
    spread: randomInRange(50, 70),
    particleCount: randomInRange(50, 100),
    origin: { y: 0.6 }
  });
}

// 3. Realistic Look
function confettiRealistic() {
  var count = 200;
  var defaults = { origin: { y: 0.7 } };
  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }
  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

// 4. Fireworks
function confettiFireworks(duration = 15000) {
  var animationEnd = Date.now() + duration;
  var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }
  var interval = setInterval(function() {
    var timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    var particleCount = 50 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
}

// 5. Stars
function confettiStars() {
  var defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
  };
  function shoot() {
    confetti({ ...defaults, particleCount: 40, scalar: 1.2, shapes: ['star'] });
    confetti({ ...defaults, particleCount: 10, scalar: 0.75, shapes: ['circle'] });
  }
  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
}

// 6. Snow
function confettiSnow(duration = 15000) {
  var animationEnd = Date.now() + duration;
  var skew = 1;
  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }
  (function frame() {
    var timeLeft = animationEnd - Date.now();
    var ticks = Math.max(200, 500 * (timeLeft / duration));
    skew = Math.max(0.8, skew - 0.001);
    confetti({
      particleCount: 1,
      startVelocity: 0,
      ticks: ticks,
      origin: {
        x: Math.random(),
        y: (Math.random() * skew) - 0.2
      },
      colors: ['#ffffff'],
      shapes: ['circle'],
      gravity: randomInRange(0.4, 0.6),
      scalar: randomInRange(0.4, 1),
      drift: randomInRange(-0.4, 0.4)
    });
    if (timeLeft > 0) {
      requestAnimationFrame(frame);
    }
  })();
}

// 7. School Pride
function confettiSchoolPride(duration = 15000) {
  var end = Date.now() + duration;
  var colors = ['#bb0000', '#ffffff'];
  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

// 8. Custom Shapes (see original demo for shapeFromPath usage)
// 9. Emoji (see original demo for shapeFromText usage)
// 10. Custom Canvas (see original demo for canvas targeting)

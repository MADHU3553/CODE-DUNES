/**
 * ============================================================
 * CODE DUNES — PAGE 3: EVENT LOBBY CONTROLLER
 * Spardha 2k26: Uncharted | Start Main Event Sequence
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Ambient Desert Dust
  initAmbientDesertDust();

  // 2. Audio Synthesizer
  const sound = new AudioSynthesizer();

  // 3. Start Main Event Button Action
  const btnStart = document.getElementById("btn-start-main-event");
  const launchOverlay = document.getElementById("launch-overlay");
  const closePlaceholder = document.getElementById("placeholder-close");

  if (btnStart && launchOverlay) {
    btnStart.addEventListener("click", () => {
      sound.playClick();
      launchOverlay.classList.add("active");
      launchOverlay.setAttribute("aria-hidden", "false");
      if (closePlaceholder) closePlaceholder.focus();
    });
  }

  function hidePlaceholder() {
    if (!launchOverlay) return;
    launchOverlay.classList.remove("active");
    launchOverlay.setAttribute("aria-hidden", "true");
    if (btnStart) btnStart.focus();
  }

  if (closePlaceholder) closePlaceholder.addEventListener("click", hidePlaceholder);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && launchOverlay?.classList.contains("active")) {
      hidePlaceholder();
    }
  });
});

// Web Audio API Synthesizer
class AudioSynthesizer {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playBeep(freq = 440, type = 'sine', duration = 0.1, gainVal = 0.08) {
    try {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playClick() {
    this.playBeep(650, 'triangle', 0.06, 0.05);
  }

}

// Ambient Desert Dust Canvas
function initAmbientDesertDust() {
  const canvas = document.getElementById("sand-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let animationFrameId;
  let width, height;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const particleCount = Math.min(45, Math.floor(window.innerWidth / 30));
  const particles = [];

  class DustParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = initial ? Math.random() * width : -10;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.2 + 0.8;
      this.speedX = Math.random() * 0.9 + 0.35;
      this.speedY = (Math.random() - 0.45) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.15;
      this.color = Math.random() > 0.4 ? "245, 214, 154" : "218, 165, 78";
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > width + 10 || this.y < -10 || this.y > height + 10) {
        this.reset(false);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new DustParticle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    animationFrameId = requestAnimationFrame(animate);
  }

  animate();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      animate();
    }
  });
}

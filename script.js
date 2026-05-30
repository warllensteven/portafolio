/* =============================================
   PORTFOLIO — script.js
   Warllen Romero
============================================= */

document.addEventListener("DOMContentLoaded", () => {
  // ─── CURSOR ───────────────────────────────
  const cursor = document.getElementById("cursor");
  const trail = document.getElementById("cursorTrail");
  let mx = 0,
    my = 0,
    tx = 0,
    ty = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + "px";
    cursor.style.top = my + "px";
  });

  (function animTrail() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    trail.style.left = tx + "px";
    trail.style.top = ty + "px";
    requestAnimationFrame(animTrail);
  })();

  // ─── CANVAS BACKGROUND ────────────────────
  const canvas = document.getElementById("bgCanvas");
  const ctx = canvas.getContext("2d");
  let W,
    H,
    particles = [];

  function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.7 ? "#00d4ff" : "#ffffff";
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 80) * 0.08;
          ctx.strokeStyle = "#00d4ff";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    drawLines();
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  // ─── HEADER SCROLL ────────────────────────
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  });

  // ─── MOBILE MENU ──────────────────────────
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  hamburger.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    hamburger.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", open);
  });

  document.querySelectorAll(".mob-link").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });

  // ─── SCROLL REVEAL ────────────────────────
  const reveals = document.querySelectorAll("[data-reveal]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger based on sibling index
          const siblings = [...entry.target.parentElement.children].filter(
            (el) => el.hasAttribute("data-reveal"),
          );
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 0.1}s`;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
  );

  reveals.forEach((el) => observer.observe(el));

  // ─── SKILL BARS ───────────────────────────
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );

  document
    .querySelectorAll(".skill-item")
    .forEach((el) => skillObserver.observe(el));

  // ─── SMOOTH SCROLL OFFSET ─────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset = 80;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: "smooth",
        });
      }
    });
  });

  // ─── ACTIVE NAV LINK ──────────────────────
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove("active"));
          const active = document.querySelector(
            `.nav-link[href="#${entry.target.id}"]`,
          );
          if (active) active.classList.add("active");
        }
      });
    },
    { threshold: 0.4 },
  );

  sections.forEach((s) => activeObserver.observe(s));

  // ─── HERO ENTRANCE ────────────────────────
  setTimeout(() => {
    document.querySelectorAll(".hero [data-reveal]").forEach((el, i) => {
      setTimeout(() => {
        el.style.transitionDelay = "0s";
        el.classList.add("visible");
      }, i * 150);
    });
  }, 200);

  // ─── TYPING EFFECT ON EYEBROW ─────────────
  const eyebrow = document.querySelector(".hero-eyebrow");
  if (eyebrow) {
    const text = eyebrow.textContent;
    eyebrow.textContent = "";
    eyebrow.style.opacity = 1;
    let idx = 0;
    setTimeout(() => {
      const typeInterval = setInterval(() => {
        eyebrow.textContent += text[idx];
        idx++;
        if (idx >= text.length) clearInterval(typeInterval);
      }, 50);
    }, 400);
  }
});

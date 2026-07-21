const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const menuPanel = document.querySelector("#site-menu");
const menuLinks = document.querySelectorAll(".menu-panel a");
const hero = document.querySelector(".hero");
const revealItems = document.querySelectorAll(".reveal");
const quoteSections = document.querySelectorAll(".quote-transition");
const scrollMediaItems = document.querySelectorAll("[data-scroll-media]");
const counters = document.querySelectorAll("[data-counter]");
const navLinks = document.querySelectorAll(".main-nav a");
const magneticItems = document.querySelectorAll("[data-magnetic]");
const hoverTargets = document.querySelectorAll(
  "a, button, .route-card, .project-card, .timeline-card, .leader-card, .skill-chip, .quote-target, .signature-item, .stat-card, .emi-shot, .emi-gallery-intro, .about-principle, .partner-stamp, .timeline-logo, .xr-portrait, .visit-card, .visit-side-photo, .visit-learning",
);
const staggerGroups = document.querySelectorAll(
  ".route-grid, .signature-grid, .emi-gallery, .stats-grid, .partner-logo-strip, .timeline, .visit-gallery, .visit-learnings, .project-grid, .skills-showcase, .skill-matrix, .leadership-cards",
);
const spatialCards = document.querySelectorAll(
  ".route-card, .timeline-card, .project-card, .leader-card, .skill-matrix article, .partner-stamp, .signature-item, .visit-side-photo, .visit-learning",
);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setMenu(open) {
  body.classList.toggle("menu-open", open);
  menuToggle?.setAttribute("aria-expanded", String(open));
  menuPanel?.setAttribute("aria-hidden", String(!open));
}

menuToggle?.addEventListener("click", () => {
  setMenu(!body.classList.contains("menu-open"));
});

menuLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

function setScrolledState() {
  body.classList.toggle("is-scrolled", window.scrollY > 20);
}

setScrolledState();
window.addEventListener("scroll", setScrolledState, { passive: true });

function setScrollProgress() {
  const scrollRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = Math.max(0, Math.min(1, window.scrollY / scrollRange));
  body.style.setProperty("--scroll-progress", progress.toFixed(4));
  body.style.setProperty("--scroll-flow-stop", `${(18 + progress * 55).toFixed(2)}%`);
  body.style.setProperty("--flow-pulse-scale", (0.84 + progress * 0.1).toFixed(3));
}

setScrollProgress();
window.addEventListener("scroll", setScrollProgress, { passive: true });
window.addEventListener("resize", setScrollProgress);

let animationFrame = 0;

window.addEventListener("pointermove", (event) => {
  if (animationFrame) return;

  animationFrame = requestAnimationFrame(() => {
    const x = event.clientX;
    const y = event.clientY;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const tiltX = ((x - centerX) / centerX) * 9;
    const tiltY = ((y - centerY) / centerY) * 7;

    body.style.setProperty("--cursor-x", `${x}px`);
    body.style.setProperty("--cursor-y", `${y}px`);
    hero?.style.setProperty("--tilt-x", `${tiltX}px`);
    hero?.style.setProperty("--tilt-y", `${tiltY}px`);
    hero?.style.setProperty("--tilt-rot-x", `${tiltX * -0.18}deg`);
    hero?.style.setProperty("--tilt-rot-y", `${tiltY * 0.16}deg`);

    animationFrame = 0;
  });
});

hoverTargets.forEach((target) => {
  target.addEventListener("pointerenter", () => body.classList.add("cursor-hover"));
  target.addEventListener("pointerleave", () => body.classList.remove("cursor-hover"));
});

spatialCards.forEach((card) => {
  card.classList.add("spatial-ready");

  card.addEventListener("pointermove", (event) => {
    if (reducedMotion) return;
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / Math.max(1, rect.width);
    const py = (event.clientY - rect.top) / Math.max(1, rect.height);
    const rotateY = (px - 0.5) * 5.2;
    const rotateX = (0.5 - py) * 4.2;
    card.style.setProperty("--card-rx", `${rotateX.toFixed(3)}deg`);
    card.style.setProperty("--card-ry", `${rotateY.toFixed(3)}deg`);
    card.style.setProperty("--glare-x", `${(px * 100).toFixed(1)}%`);
    card.style.setProperty("--glare-y", `${(py * 100).toFixed(1)}%`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--card-rx", "0deg");
    card.style.setProperty("--card-ry", "0deg");
  });
});

magneticItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    if (reducedMotion) return;
    const rect = item.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
    item.style.transform = `translate(${x}px, ${y}px)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});

function animateCounter(counter) {
  if (counter.dataset.counted === "true") return;
  counter.dataset.counted = "true";

  const target = Number(counter.dataset.counter || 0);
  if (reducedMotion) {
    counter.textContent = String(target);
    return;
  }

  const duration = 1100;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = String(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function setRevealStagger() {
  staggerGroups.forEach((group) => {
    const items = group.querySelectorAll(":scope > .reveal");
    items.forEach((item, index) => {
      const delay = Math.min(index, 9) * 68;
      item.style.setProperty("--reveal-delay", `${delay}ms`);
    });
  });
}

setRevealStagger();

quoteSections.forEach((section) => {
  const line = section.querySelector(".quote-line");
  if (!line || line.dataset.split === "true") return;

  const text = line.textContent.trim();
  const words = text.split(/\s+/).filter(Boolean);
  line.dataset.split = "true";
  line.setAttribute("aria-label", text);
  line.textContent = "";

  words.forEach((word, index) => {
    const span = document.createElement("span");
    span.className = "quote-word";
    span.style.setProperty("--i", index);
    span.setAttribute("aria-hidden", "true");
    span.textContent = word;
    line.append(span);
    if (index < words.length - 1) line.append(document.createTextNode(" "));
  });
});

let quoteFrame = 0;

function updateQuoteProgress() {
  quoteFrame = 0;
  if (!quoteSections.length) return;

  if (reducedMotion) {
    quoteSections.forEach((section) => {
      section.style.setProperty("--quote-progress", "1");
      section.style.setProperty("--quote-arrow-x", "0rem");
      section.style.setProperty("--quote-grid-tilt", "0deg");
      section.style.setProperty("--quote-grid-y", "0rem");
      section.style.setProperty("--quote-inner-tilt-x", "0deg");
      section.style.setProperty("--quote-inner-tilt-y", "0deg");
      section.style.setProperty("--quote-lift", "0rem");
      section.style.setProperty("--quote-ring-spin", "0deg");
      section.style.setProperty("--quote-ring-y", "0rem");
      section.style.setProperty("--quote-target-x", "0rem");
    });
    return;
  }

  const viewportCenter = window.innerHeight / 2;
  const range = window.innerHeight * 0.82;

  quoteSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const sectionCenter = rect.top + rect.height / 2;
    const focus = Math.max(0, Math.min(1, 1 - Math.abs(sectionCenter - viewportCenter) / range));
    const travel = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
    const progress = focus * 0.72 + travel * 0.28;
    const inverse = 1 - progress;
    section.style.setProperty("--quote-progress", progress.toFixed(3));
    section.style.setProperty("--quote-arrow-x", `${(inverse * 0.45).toFixed(3)}rem`);
    section.style.setProperty("--quote-grid-tilt", `${((0.5 - progress) * 2.2).toFixed(3)}deg`);
    section.style.setProperty("--quote-grid-y", `${(inverse * 0.55).toFixed(3)}rem`);
    section.style.setProperty("--quote-inner-tilt-x", `${((0.5 - progress) * 1.8).toFixed(3)}deg`);
    section.style.setProperty("--quote-inner-tilt-y", `${((progress - 0.5) * 1.4).toFixed(3)}deg`);
    section.style.setProperty("--quote-lift", `${(inverse * 0.7).toFixed(3)}rem`);
    section.style.setProperty("--quote-ring-spin", `${(progress * 24).toFixed(3)}deg`);
    section.style.setProperty("--quote-ring-y", `${(progress * 0.35).toFixed(3)}rem`);
    section.style.setProperty("--quote-target-x", `${(progress * 0.35).toFixed(3)}rem`);
  });
}

function requestQuoteProgress() {
  if (quoteFrame) return;
  quoteFrame = requestAnimationFrame(updateQuoteProgress);
}

window.addEventListener("scroll", requestQuoteProgress, { passive: true });
window.addEventListener("resize", requestQuoteProgress);
updateQuoteProgress();

let mediaFrame = 0;

function updateMediaMotion() {
  mediaFrame = 0;
  if (!scrollMediaItems.length) return;

  if (reducedMotion) {
    scrollMediaItems.forEach((item) => {
      item.style.setProperty("--media-y", "0rem");
      item.style.setProperty("--media-rot", "0deg");
      item.style.setProperty("--media-scale", "1");
    });
    return;
  }

  const viewportCenter = window.innerHeight / 2;
  const range = window.innerHeight * 0.9;

  scrollMediaItems.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;
    const distance = (itemCenter - viewportCenter) / range;
    const clamped = Math.max(-1, Math.min(1, distance));
    const direction = index % 2 === 0 ? 1 : -1;

    item.style.setProperty("--media-y", `${(clamped * -0.45).toFixed(3)}rem`);
    item.style.setProperty("--media-rot", `${(clamped * direction * 0.75).toFixed(3)}deg`);
    item.style.setProperty("--media-scale", `${(1 + (1 - Math.abs(clamped)) * 0.004).toFixed(3)}`);
  });
}

function requestMediaMotion() {
  if (mediaFrame) return;
  mediaFrame = requestAnimationFrame(updateMediaMotion);
}

window.addEventListener("scroll", requestMediaMotion, { passive: true });
window.addEventListener("resize", requestMediaMotion);
updateMediaMotion();

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        entry.target.querySelectorAll?.("[data-counter]").forEach(animateCounter);
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px 12% 0px", threshold: 0.08 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const quoteObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
      });
    },
    { rootMargin: "-12% 0px -18% 0px", threshold: 0.18 },
  );

  quoteSections.forEach((section) => quoteObserver.observe(section));

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.42 },
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-42% 0px -52% 0px", threshold: 0 },
  );

  document.querySelectorAll("main section[id]:not(.quote-transition)").forEach((section) => sectionObserver.observe(section));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
  quoteSections.forEach((section) => section.classList.add("is-visible"));
  counters.forEach(animateCounter);
}

const canvas = document.querySelector("#skill-canvas");
const context = canvas?.getContext("2d");
const skillsLab = document.querySelector(".skills-lab");

function setupCanvas() {
  if (!canvas || !context) return [];
  const rect = canvas.getBoundingClientRect();
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.floor(rect.width * pixelRatio));
  canvas.height = Math.max(1, Math.floor(rect.height * pixelRatio));
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const labels = ["PLC", "DCS", "SCADA", "HIL", "OPC", "MQTT", "PID", "BESS", "AI", "GFM", "CFC", "HMI"];
  return labels.map((label, index) => {
    const angle = (Math.PI * 2 * index) / labels.length;
    const radius = 0.28 + (index % 3) * 0.06;
    return {
      label,
      angle,
      radius,
      speed: 0.0018 + (index % 4) * 0.00035,
      phase: index * 0.72,
    };
  });
}

let skillNodes = setupCanvas();
let skillsActive = !("IntersectionObserver" in window);
let skillFrame = 0;

function drawSkills() {
  if (!canvas || !context || reducedMotion) return;
  if (!skillsActive) {
    skillFrame = 0;
    return;
  }

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const cx = width / 2;
  const cy = height / 2;
  const base = Math.min(width, height);
  context.clearRect(0, 0, width, height);

  skillNodes.forEach((node, index) => {
    node.angle += node.speed;
    const wave = Math.sin(performance.now() * 0.001 + node.phase) * 12;
    node.x = cx + Math.cos(node.angle) * base * node.radius;
    node.y = cy + Math.sin(node.angle) * base * (node.radius * 0.7) + wave;

    skillNodes.slice(index + 1).forEach((other) => {
      const distance = Math.hypot(node.x - other.x, node.y - other.y);
      if (distance > base * 0.34) return;
      const alpha = 1 - distance / (base * 0.34);
      context.strokeStyle = `rgba(223, 241, 13, ${alpha * 0.34})`;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(node.x, node.y);
      context.lineTo(other.x, other.y);
      context.stroke();
    });
  });

  skillNodes.forEach((node) => {
    context.fillStyle = "rgba(223, 241, 13, 0.95)";
    context.beginPath();
    context.arc(node.x, node.y, 4, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "rgba(241, 239, 225, 0.82)";
    context.font = "700 10px system-ui, sans-serif";
    context.textAlign = "center";
    context.fillText(node.label, node.x, node.y - 10);
  });

  skillFrame = requestAnimationFrame(drawSkills);
}

function requestSkillAnimation() {
  if (skillFrame || reducedMotion) return;
  skillFrame = requestAnimationFrame(drawSkills);
}

window.addEventListener("resize", () => {
  skillNodes = setupCanvas();
  requestSkillAnimation();
});

if ("IntersectionObserver" in window && skillsLab) {
  const skillObserver = new IntersectionObserver(
    (entries) => {
      skillsActive = entries.some((entry) => entry.isIntersecting);
      if (skillsActive) requestSkillAnimation();
    },
    { rootMargin: "18% 0px 18% 0px", threshold: 0.04 },
  );
  skillObserver.observe(skillsLab);
} else {
  skillsActive = true;
  requestSkillAnimation();
}

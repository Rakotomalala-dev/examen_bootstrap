/* =========================================================================
   ECOWORLD — script.js
   JavaScript vanilla — aucune dépendance backend.
   Organisé en petits modules indépendants, chacun ne s'active que si les
   éléments correspondants existent sur la page en cours.
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initMobileMenuAutoClose();
  initRevealOnScroll();
  initCounters();
  initBackToTop();
  initTiltCards();
  initProjectFilters();
  initGallery();
  initBlog();
  initContactForm();
  initNewsletterForms();
  initTimelineAndYear();
  initHeroEarth();
});

/* -------------------------------------------------------------------------
   1. NAVBAR — devient opaque + compacte au scroll
   ---------------------------------------------------------------------- */
function initNavbar() {
  const nav = document.querySelector(".navbar-eco");
  if (!nav) return;
  const toggle = () => {
    if (window.scrollY > 60) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  };
  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
}

/* Ferme le menu hamburger mobile après un clic sur un lien -------------- */
function initMobileMenuAutoClose() {
  const collapseEl = document.getElementById("mainNav");
  if (!collapseEl || !window.bootstrap) return;
  const links = collapseEl.querySelectorAll(".nav-link, .btn");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      if (collapseEl.classList.contains("show")) {
        const instance = bootstrap.Collapse.getOrCreateInstance(collapseEl);
        instance.hide();
      }
    });
  });
}

/* -------------------------------------------------------------------------
   2. APPARITIONS PROGRESSIVES AU SCROLL (IntersectionObserver)
   ---------------------------------------------------------------------- */
function initRevealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

/* -------------------------------------------------------------------------
   3. COMPTEURS ANIMÉS (statistiques de l'association)
   ---------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.counter);
    const suffix = el.dataset.suffix || "";
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString("fr-FR") + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString("fr-FR") + suffix;
    };
    requestAnimationFrame(step);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => observer.observe(el));
}

/* -------------------------------------------------------------------------
   4. BOUTON RETOUR EN HAUT
   ---------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 500) btn.classList.add("is-visible");
      else btn.classList.remove("is-visible");
    },
    { passive: true }
  );
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* -------------------------------------------------------------------------
   5. EFFET 3D AU SURVOL DES CARTES (tilt léger selon la position souris)
   ---------------------------------------------------------------------- */
function initTiltCards() {
  const cards = document.querySelectorAll(".tilt-card");
  if (!cards.length) return;
  if (window.matchMedia("(pointer: coarse)").matches) return; // pas sur mobile/tactile

  cards.forEach((card) => {
    const inner = card.querySelector(".tilt-card-inner");
    if (!inner) return;
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      inner.style.transform = `rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg) translateY(-8px) translateZ(10px)`;
    });
    card.addEventListener("mouseleave", () => {
      inner.style.transform = "";
    });
  });
}

/* -------------------------------------------------------------------------
   6. FILTRES DE PROJETS (page Nos projets) — sans rechargement
   ---------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBar = document.querySelector("[data-project-filters]");
  const cards = document.querySelectorAll("[data-project-category]");
  if (!filterBar || !cards.length) return;

  const pills = filterBar.querySelectorAll(".filter-pill");
  const emptyState = document.getElementById("projectsEmptyState");

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      pills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      const category = pill.dataset.filter;
      let visibleCount = 0;

      cards.forEach((card) => {
        const match = category === "all" || card.dataset.projectCategory === category;
        if (match) {
          card.style.display = "";
          requestAnimationFrame(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          });
          visibleCount++;
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(14px)";
          setTimeout(() => {
            if (!card.classList.contains("active-match")) card.style.display = "none";
          }, 250);
        }
      });

      if (emptyState) emptyState.style.display = visibleCount === 0 ? "block" : "none";
    });
  });
}

/* -------------------------------------------------------------------------
   7. GALERIE — filtres par catégorie + LIGHTBOX avec navigation
   ---------------------------------------------------------------------- */
function initGallery() {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  const filterBar = document.querySelector("[data-gallery-filters]");
  const items = Array.from(grid.querySelectorAll(".gallery-item"));

  if (filterBar) {
    const pills = filterBar.querySelectorAll(".filter-pill");
    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        pills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        const category = pill.dataset.filter;
        items.forEach((item) => {
          const show = category === "all" || item.dataset.category === category;
          item.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* Lightbox */
  const backdrop = document.getElementById("lightbox");
  if (!backdrop) return;
  const imgEl = backdrop.querySelector(".lightbox-img");
  const captionEl = backdrop.querySelector(".lightbox-caption");
  const closeBtn = backdrop.querySelector(".lightbox-close");
  const prevBtn = backdrop.querySelector(".lightbox-nav.prev");
  const nextBtn = backdrop.querySelector(".lightbox-nav.next");

  let currentIndex = 0;

  const getVisibleItems = () => items.filter((i) => i.style.display !== "none");

  const openLightbox = (index) => {
    const visible = getVisibleItems();
    currentIndex = index;
    const item = visible[currentIndex];
    if (!item) return;
    const img = item.querySelector("img");
    imgEl.src = img.dataset.full || img.src;
    imgEl.alt = img.alt;
    captionEl.textContent = item.dataset.caption || img.alt;
    backdrop.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    backdrop.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  const step = (dir) => {
    const visible = getVisibleItems();
    currentIndex = (currentIndex + dir + visible.length) % visible.length;
    openLightbox(currentIndex);
  };

  items.forEach((item, i) => {
    item.addEventListener("click", () => {
      const visible = getVisibleItems();
      const idx = visible.indexOf(item);
      openLightbox(idx);
    });
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", "Agrandir l'image");
    item.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const visible = getVisibleItems();
        openLightbox(visible.indexOf(item));
      }
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeLightbox();
  });
  prevBtn.addEventListener("click", () => step(-1));
  nextBtn.addEventListener("click", () => step(1));

  document.addEventListener("keydown", (e) => {
    if (!backdrop.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
}

/* -------------------------------------------------------------------------
   8. BLOG — recherche + filtre par catégorie (frontend uniquement)
   ---------------------------------------------------------------------- */
function initBlog() {
  const list = document.getElementById("blogList");
  if (!list) return;
  const cards = Array.from(list.querySelectorAll("[data-blog-card]"));
  const searchInput = document.getElementById("blogSearch");
  const catButtons = document.querySelectorAll("[data-blog-category]");
  const noResults = document.getElementById("blogNoResults");

  let activeCategory = "all";

  const applyFilters = () => {
    const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    let visible = 0;

    cards.forEach((card) => {
      const title = card.dataset.title.toLowerCase();
      const excerpt = card.dataset.excerpt.toLowerCase();
      const category = card.dataset.category;

      const matchesCategory = activeCategory === "all" || category === activeCategory;
      const matchesSearch = !query || title.includes(query) || excerpt.includes(query);

      if (matchesCategory && matchesSearch) {
        card.style.display = "";
        visible++;
      } else {
        card.style.display = "none";
      }
    });

    if (noResults) noResults.style.display = visible === 0 ? "block" : "none";
  };

  if (searchInput) searchInput.addEventListener("input", applyFilters);

  catButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      catButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.blogCategory;
      applyFilters();
    });
  });
}

/* -------------------------------------------------------------------------
   9. FORMULAIRE DE CONTACT — validation JS + envoi simulé
   ---------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const successAlert = document.getElementById("contactSuccess");

  const fields = {
    name: { el: form.querySelector("#cf-name"), validate: (v) => v.trim().length >= 2, msg: "Merci d'indiquer votre nom complet (2 caractères minimum)." },
    email: { el: form.querySelector("#cf-email"), validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: "Merci d'indiquer une adresse email valide." },
    subject: { el: form.querySelector("#cf-subject"), validate: (v) => v.trim().length > 0, msg: "Merci de choisir un sujet." },
    message: { el: form.querySelector("#cf-message"), validate: (v) => v.trim().length >= 10, msg: "Votre message doit contenir au moins 10 caractères." },
  };

  const showError = (field) => {
    field.el.classList.add("is-invalid");
    const errorEl = form.querySelector(`[data-error-for="${field.el.id}"]`);
    if (errorEl) {
      errorEl.textContent = field.msg;
      errorEl.classList.add("is-visible");
    }
  };
  const clearError = (field) => {
    field.el.classList.remove("is-invalid");
    const errorEl = form.querySelector(`[data-error-for="${field.el.id}"]`);
    if (errorEl) errorEl.classList.remove("is-visible");
  };

  Object.values(fields).forEach((field) => {
    if (!field.el) return;
    field.el.addEventListener("input", () => {
      if (field.validate(field.el.value)) clearError(field);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let allValid = true;

    Object.values(fields).forEach((field) => {
      if (!field.el) return;
      if (field.validate(field.el.value)) {
        clearError(field);
      } else {
        showError(field);
        allValid = false;
      }
    });

    if (!allValid) {
      if (successAlert) successAlert.classList.remove("is-visible");
      return;
    }

    /* Aucun backend : simulation d'un envoi réussi côté frontend */
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalLabel = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Envoi en cours…';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalLabel;
      if (successAlert) successAlert.classList.add("is-visible");
      form.reset();
      Object.values(fields).forEach((field) => field.el && clearError(field));
      if (successAlert) successAlert.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 900);
  });
}

/* -------------------------------------------------------------------------
   10. NEWSLETTER — validation email + confirmation (toutes pages)
   ---------------------------------------------------------------------- */
function initNewsletterForms() {
  const forms = document.querySelectorAll("[data-newsletter-form]");
  forms.forEach((form) => {
    const input = form.querySelector('input[type="email"]');
    const feedback = form.querySelector("[data-newsletter-feedback]");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = input.value.trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      if (!feedback) return;
      feedback.classList.remove("text-danger", "text-forest", "d-block");
      feedback.classList.add("d-block");

      if (!valid) {
        feedback.textContent = "Merci de saisir une adresse email valide.";
        feedback.classList.add("text-danger");
        input.classList.add("is-invalid");
        return;
      }

      input.classList.remove("is-invalid");
      feedback.textContent = "Merci ! Votre inscription à la newsletter EcoWorld est confirmée.";
      feedback.classList.add("text-forest");
      form.reset();
    });
  });
}

/* -------------------------------------------------------------------------
   11. TIMELINE (déjà en CSS) + année automatique du footer
   ---------------------------------------------------------------------- */
function initTimelineAndYear() {
  const yearEls = document.querySelectorAll("[data-current-year]");
  yearEls.forEach((el) => (el.textContent = new Date().getFullYear()));
}

/* -------------------------------------------------------------------------
   12. RÉSEAU RACINAIRE LUMINEUX (Three.js) — une structure de racines/
   mycélium générée par branchement récursif, qui "pousse" à l'affichage
   puis vit doucement (pulsations, spores, légère rotation, parallaxe).
   Aucune image externe : tout est généré procéduralement au chargement.
   ---------------------------------------------------------------------- */

/* Petit générateur pseudo-aléatoire à graine fixe (résultat stable) */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* Répartit n directions de façon équilibrée sur une sphère (spirale de Fibonacci) */
function fibonacciDirections(n) {
  const dirs = [];
  const offset = 2 / n;
  const increment = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const phi = i * increment;
    dirs.push(new THREE.Vector3(Math.cos(phi) * r, y, Math.sin(phi) * r));
  }
  return dirs;
}

/* Construit récursivement un réseau de branches (racines / mycélium) et
   renvoie la liste des segments, ordonnés du tronc vers les extrémités
   (utile pour l'animation de pousse progressive). */
function buildRootNetwork(maxDepth) {
  const rand = seededRandom(2024);
  const segments = [];
  const upAxis = new THREE.Vector3(0, 1, 0);
  const sideAxis = new THREE.Vector3(1, 0, 0);

  const grow = (origin, direction, length, depth) => {
    const end = origin.clone().add(direction.clone().multiplyScalar(length));
    segments.push({ start: origin, end, depth, isTip: depth === maxDepth });
    if (depth === maxDepth) return;

    const branchCount = depth < 2 ? 3 : rand() < 0.55 ? 2 : 1;
    for (let i = 0; i < branchCount; i++) {
      const wobbleY = (rand() - 0.5) * 1.15;
      const wobbleX = (rand() - 0.5) * 0.75;
      const newDir = direction.clone()
        .applyAxisAngle(upAxis, wobbleY)
        .applyAxisAngle(sideAxis, wobbleX)
        .normalize();
      grow(end, newDir, length * 0.72, depth + 1);
    }
  };

  fibonacciDirections(6).forEach((dir) => grow(new THREE.Vector3(0, 0, 0), dir, 0.62, 0));

  // Tri du tronc vers les extrémités pour une pousse progressive crédible
  segments.sort((a, b) => a.depth - b.depth);
  return segments;
}

/* Sprite radial doux, façon halo de lumière chaude (fond du hero) */
function buildGlowSprite() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(217,122,77,0.55)");
  grad.addColorStop(0.5, "rgba(181,80,46,0.18)");
  grad.addColorStop(1, "rgba(181,80,46,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function initHeroEarth() {
  const container = document.getElementById("hero-earth") || document.getElementById("about-earth");
  if (!container) return;
  if (window.matchMedia("(max-width: 991.98px)").matches) return;
  if (typeof THREE === "undefined") return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isHero = container.id === "hero-earth";
  const width = container.clientWidth || container.parentElement.clientWidth;
  const height = container.clientHeight || container.parentElement.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.z = isHero ? 4.6 : 3.6;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const networkGroup = new THREE.Group();
  scene.add(networkGroup);

  /* --- Halo chaud en fond, uniquement dans le hero -------------------- */
  if (isHero) {
    const glowMaterial = new THREE.SpriteMaterial({
      map: buildGlowSprite(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const glow = new THREE.Sprite(glowMaterial);
    glow.scale.set(6.5, 6.5, 1);
    glow.position.set(0.3, 0, -1.4);
    scene.add(glow);
  }

  /* --- Construction du réseau de racines ------------------------------ */
  const segments = buildRootNetwork(5);
  const vertCount = segments.length * 2;
  const positions = new Float32Array(vertCount * 3);
  const colors = new Float32Array(vertCount * 3);
  const glowColors = new Float32Array(vertCount * 3);

  const deep = new THREE.Color(0x5c6b28);   // mousse profond — tronc
  const light = new THREE.Color(0xa3b45f);  // olive clair — extrémités
  const bud = new THREE.Color(0xd97a4d);    // terracotta — jeunes pousses

  segments.forEach((seg, i) => {
    const mix = Math.min(seg.depth / 5, 1);
    const base = deep.clone().lerp(light, mix);
    const color = seg.isTip && Math.random() < 0.35 ? bud : base;

    const i0 = i * 6;
    positions[i0] = seg.start.x; positions[i0 + 1] = seg.start.y; positions[i0 + 2] = seg.start.z;
    positions[i0 + 3] = seg.end.x; positions[i0 + 4] = seg.end.y; positions[i0 + 5] = seg.end.z;

    colors[i0] = color.r; colors[i0 + 1] = color.g; colors[i0 + 2] = color.b;
    colors[i0 + 3] = color.r; colors[i0 + 4] = color.g; colors[i0 + 5] = color.b;

    const glowColor = new THREE.Color(0xf4e6cd);
    glowColors[i0] = glowColor.r; glowColors[i0 + 1] = glowColor.g; glowColors[i0 + 2] = glowColor.b;
    glowColors[i0 + 3] = glowColor.r; glowColors[i0 + 4] = glowColor.g; glowColors[i0 + 5] = glowColor.b;
  });

  // Halo doux derrière le trait principal (effet de lueur, sans post-processing)
  const glowGeometry = new THREE.BufferGeometry();
  glowGeometry.setAttribute("position", new THREE.BufferAttribute(positions.slice(), 3));
  glowGeometry.setAttribute("color", new THREE.BufferAttribute(glowColors, 3));
  const glowLineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.12, linewidth: 4,
  });
  const glowLines = new THREE.LineSegments(glowGeometry, glowLineMaterial);
  glowLines.scale.setScalar(1.02);
  networkGroup.add(glowLines);

  // Trait principal du réseau
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  lineGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.92 });
  const rootLines = new THREE.LineSegments(lineGeometry, lineMaterial);
  networkGroup.add(rootLines);

  // Pousse progressive : on ne révèle d'abord que les premiers segments
  lineGeometry.setDrawRange(0, reduceMotion ? vertCount : 0);
  glowGeometry.setDrawRange(0, reduceMotion ? vertCount : 0);

  /* --- Nœuds lumineux aux extrémités (bourgeons / points de vie) ------ */
  const tips = segments.filter((s) => s.isTip);
  const tipPositions = new Float32Array(tips.length * 3);
  tips.forEach((tip, i) => {
    tipPositions[i * 3] = tip.end.x;
    tipPositions[i * 3 + 1] = tip.end.y;
    tipPositions[i * 3 + 2] = tip.end.z;
  });
  const tipGeometry = new THREE.BufferGeometry();
  tipGeometry.setAttribute("position", new THREE.BufferAttribute(tipPositions, 3));
  const tipMaterial = new THREE.PointsMaterial({
    color: 0xd97a4d, size: 0.075, sizeAttenuation: true,
    transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending,
  });
  const tipPoints = new THREE.Points(tipGeometry, tipMaterial);
  networkGroup.add(tipPoints);

  /* --- Spores flottantes (uniquement dans le hero) --------------------- */
  let spores = null;
  const sporeBounds = 2.4;
  if (isHero) {
    const count = 50;
    const sporePositions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      sporePositions[i * 3] = (Math.random() - 0.5) * sporeBounds * 1.6;
      sporePositions[i * 3 + 1] = (Math.random() - 0.5) * sporeBounds * 1.6;
      sporePositions[i * 3 + 2] = (Math.random() - 0.5) * sporeBounds;
    }
    const sporeGeometry = new THREE.BufferGeometry();
    sporeGeometry.setAttribute("position", new THREE.BufferAttribute(sporePositions, 3));
    const sporeMaterial = new THREE.PointsMaterial({
      color: 0xf4e6cd, size: 0.045, transparent: true, opacity: 0.6,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    spores = new THREE.Points(sporeGeometry, sporeMaterial);
    scene.add(spores);
  }

  /* --- Éclairage doux (les matériaux sont auto-éclairés / vertex color) */
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  /* --- Parallaxe léger : la scène suit doucement la souris -------------- */
  let targetRotX = 0, targetRotY = 0;
  let currentRotX = 0, currentRotY = 0;
  if (!reduceMotion) {
    window.addEventListener("mousemove", (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetRotY = nx * 0.28;
      targetRotX = ny * 0.14;
    });
  }

  let frameId;
  let t = 0;
  const growDuration = 2.6; // secondes
  const baseY = networkGroup.position.y;

  const animate = () => {
    t += 0.016;

    if (!reduceMotion) {
      // Révélation progressive du réseau à l'ouverture de la page
      const growProgress = Math.min(t / growDuration, 1);
      const eased = 1 - Math.pow(1 - growProgress, 3);
      const revealed = Math.floor(eased * segments.length) * 2;
      lineGeometry.setDrawRange(0, revealed);
      glowGeometry.setDrawRange(0, revealed);

      networkGroup.rotation.y += 0.0016;
      tipPoints.material.opacity = 0.7 + Math.sin(t * 1.8) * 0.25;
      glowLineMaterial.opacity = 0.08 + Math.sin(t * 0.9) * 0.05;

      if (spores) {
        spores.rotation.y += 0.0009;
        const posAttr = spores.geometry.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
          let y = posAttr.getY(i) + 0.0018;
          if (y > sporeBounds * 0.8) y = -sporeBounds * 0.8;
          posAttr.setY(i, y);
        }
        posAttr.needsUpdate = true;
      }

      networkGroup.position.y = baseY + Math.sin(t * 0.55) * 0.05;
    }

    currentRotX += (targetRotX - currentRotX) * 0.05;
    currentRotY += (targetRotY - currentRotY) * 0.05;
    networkGroup.rotation.x = currentRotX;
    camera.position.x = currentRotY * 0.5;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    frameId = requestAnimationFrame(animate);
  };
  animate();

  window.addEventListener("resize", () => {
    if (window.matchMedia("(max-width: 991.98px)").matches) {
      cancelAnimationFrame(frameId);
      container.style.display = "none";
      return;
    }
    const w = container.clientWidth || container.parentElement.clientWidth;
    const h = container.clientHeight || container.parentElement.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

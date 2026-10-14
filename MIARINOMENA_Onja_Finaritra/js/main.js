/* ===== Monde des Gamers — JavaScript vanilla ===== */

// --- Données (jeux fictifs) ---
const GAMES = [
  {
    t: "Neon Rift",
    g: "FPS",
    p: "PC",
    r: 4.8,
    img: "photo-1542751371-adc38448a05e",
    d: "FPS tactique 5v5 dans une mégalopole cyberpunk. Gunplay précis, capacités hackées.",
  },
  {
    t: "Void Striker",
    g: "Action",
    p: "PS5",
    r: 4.6,
    img: "photo-1511512578047-dfb367046420",
    d: "Action-aventure spatiale : combats fluides, boss colossaux et solo de 30 heures.",
  },
  {
    t: "Pixel Kingdom",
    g: "RPG",
    p: "Switch",
    r: 4.7,
    img: "photo-1550745165-9bc0b252726f",
    d: "RPG rétro en pixel art avec coopération locale et plus de 200 quêtes.",
  },
  {
    t: "Apex Circuit",
    g: "Course",
    p: "Xbox",
    r: 4.4,
    img: "photo-1493711662062-fa541adb3fc8",
    d: "Courses futuristes à 900 km/h, circuits suspendus et classements hebdomadaires.",
  },
  {
    t: "Arena Zero",
    g: "MOBA",
    p: "PC",
    r: 4.5,
    img: "photo-1552820728-8b83bb6b773f",
    d: "MOBA 5v5 de 20 minutes, 60 héros et une scène compétitive très active.",
  },
  {
    t: "Shadow Protocol",
    g: "FPS",
    p: "PS5",
    r: 4.3,
    img: "photo-1538481199705-c710c4e965fc",
    d: "Infiltration et tir en équipe dans des bases high-tech. Mode coop 4 joueurs.",
  },
  {
    t: "Mythic Guild",
    g: "RPG",
    p: "PC",
    r: 4.9,
    img: "photo-1511512578047-dfb367046420",
    d: "MMO de fantasy : donjons à 20 joueurs, guildes et économie gérée par les joueurs.",
  },
  {
    t: "Drift Legends",
    g: "Course",
    p: "Switch",
    r: 4.2,
    img: "photo-1493711662062-fa541adb3fc8",
    d: "Drift arcade en écran partagé, 40 voitures personnalisables.",
  },
];
const PLAYERS = [
  ["Kaizen_X", "Neon Rift", 2840],
  ["Luna.exe", "Arena Zero", 2715],
  ["Vortex", "Void Striker", 2602],
  ["NyxBlade", "Mythic Guild", 2540],
  ["PixelWolf", "Pixel Kingdom", 2477],
  ["Zer0Cool", "Shadow Protocol", 2390],
];
const NEWS = [
  {
    t: "Neon Rift saison 3 : nouvelle carte et armes",
    c: "Mises à jour",
    d: "12 oct.",
    img: "photo-1542751371-adc38448a05e",
    x: "La saison 3 ajoute la carte « Docks Électriques », trois armes et un mode classé revu pour limiter les abandons.",
  },
  {
    t: "Les Championnats Régionaux ouvrent leurs inscriptions",
    c: "E-sport",
    d: "10 oct.",
    img: "photo-1552820728-8b83bb6b773f",
    x: "Cent vingt équipes se disputeront une dotation de 20 000 € sur trois week-ends de matchs diffusés en direct.",
  },
  {
    t: "Test : le casque Sonic Pulse 7.1",
    c: "Matériel",
    d: "8 oct.",
    img: "photo-1538481199705-c710c4e965fc",
    x: "Son spatial précis, micro clair et 40 h d'autonomie : notre avis après deux semaines de jeu.",
  },
  {
    t: "Pixel Kingdom arrive en coopération en ligne",
    c: "Jeux",
    d: "5 oct.",
    img: "photo-1550745165-9bc0b252726f",
    x: "Le patch 2.0 permet de jouer à deux à distance et corrige une trentaine de bugs de quêtes.",
  },
];
const U = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;
const $ = (s) => document.querySelector(s);

// --- Navbar + footer injectés sur toutes les pages ---
const LINKS = [
  ["index.html", "Accueil"],
  ["jeux.html", "Jeux"],
  ["communauter.html", "Communauté"],
  ["actualites.html", "Actualités"],
  ["contact.html", "Contact"],
];
const here = location.pathname.split("/").pop() || "index.html";
document.body.insertAdjacentHTML(
  "afterbegin",
  `
<nav class="navbar navbar-expand-lg navbar-dark fixed-top"><div class="container">
 <a class="navbar-brand" href="index.html">⌁ MONDE DES GAMERS</a>
 <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav" aria-label="Menu"><span class="navbar-toggler-icon"></span></button>
 <div class="collapse navbar-collapse" id="nav"><ul class="navbar-nav ms-auto">
 ${LINKS.map(([h, l]) => `<li class="nav-item"><a class="nav-link ${h === here ? "active" : ""}" href="${h}">${l}</a></li>`).join("")}
 </ul></div></div></nav>`,
);
document.body.insertAdjacentHTML(
  "beforeend",
  `<footer><div class="container d-flex flex-wrap justify-content-between gap-2">
 <span>© 2026 Monde des Gamers</span><span>Jouez ensemble. Gagnez ensemble.</span></div></footer>`,
);

// --- Carte de jeu (réutilisée accueil + catalogue) ---
const card = (
  g,
  modal = true,
) => `<div class="col-sm-6 col-lg-${modal ? 3 : 4}"><article class="gcard">
 <div class="imgwrap"><img src="${U(g.img)}" alt="Illustration ${g.t}" loading="lazy"></div>
 <div class="p-3"><h3 class="h5">${g.t}</h3>
 <p><span class="tag">${g.g}</span><span class="tag">${g.p}</span> <small class="text-mut">★ ${g.r}</small></p>
 ${modal ? `<button class="btn btn-line btn-sm" data-i="${GAMES.indexOf(g)}">En savoir plus</button>` : `<a class="btn btn-line btn-sm" href="jeux.html">Voir le jeu</a>`}
 </div></article></div>`;

// Image de secours si Unsplash est inaccessible (le dégradé CSS prend le relais)
document.addEventListener(
  "error",
  (e) => {
    if (e.target.tagName === "IMG") e.target.removeAttribute("src");
  },
  true,
);

// --- Accueil : jeux tendance + compteur animé ---
if ($("#trending"))
  $("#trending").innerHTML = [...GAMES]
    .sort((a, b) => b.r - a.r)
    .slice(0, 3)
    .map((g) => card(g, false))
    .join("");
if ($("#counter")) {
  let n = 0;
  const max = 48213,
    step = max / 80;
  const id = setInterval(() => {
    n = Math.min(max, n + step);
    $("#counter").textContent = Math.floor(n).toLocaleString("fr-FR");
    if (n >= max) clearInterval(id);
  }, 20);
}

// --- Catalogue : recherche + filtres genre/plateforme + modale ---
if ($("#grid")) {
  const draw = () => {
    const q = $("#q").value.toLowerCase(),
      g = $("#fg").value,
      p = $("#fp").value;
    const list = GAMES.filter(
      (x) =>
        x.t.toLowerCase().includes(q) && (!g || x.g === g) && (!p || x.p === p),
    );
    $("#grid").innerHTML =
      list.map((x) => card(x)).join("") ||
      '<p class="text-mut">Aucun jeu ne correspond. Modifiez vos filtres.</p>';
    $("#count").textContent = `${list.length} jeu(x)`;
  };
  ["#q", "#fg", "#fp"].forEach((s) => $(s).addEventListener("input", draw));
  $("#reset").onclick = () => {
    $("#q").value = $("#fg").value = $("#fp").value = "";
    draw();
  };
  $("#grid").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-i]");
    if (!b) return;
    const g = GAMES[b.dataset.i];
    $("#mTitle").textContent = g.t;
    $("#mImg").src = U(g.img);
    $("#mBody").textContent =
      `${g.d} Genre : ${g.g} · Plateforme : ${g.p} · Note : ${g.r}/5`;
    new bootstrap.Modal("#gameModal").show();
  });
  draw();
}

// --- Communauté : classement + préremplissage du tournoi ---
if ($("#board"))
  $("#board").innerHTML = PLAYERS.map(
    (p, i) =>
      `<tr><td>#${i + 1}</td><td>${p[0]}</td><td class="text-mut">${p[1]}</td><td class="text-end" style="color:var(--cyan)">${p[2]} pts</td></tr>`,
  ).join("");
document.querySelectorAll("[data-tournoi]").forEach(
  (b) =>
    (b.onclick = () => {
      $("#tournoi").value = b.dataset.tournoi;
      $("#regForm").scrollIntoView({ behavior: "smooth" });
      $("#pseudo").focus();
    }),
);

// --- Validation basique des formulaires (inscription + contact) ---
document.querySelectorAll("form[data-ok]").forEach((f) =>
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    f.classList.add("was-validated");
    if (!f.checkValidity()) return;
    const ok = $(f.dataset.ok);
    ok.classList.remove("d-none");
    ok.focus();
    f.reset();
    f.classList.remove("was-validated");
  }),
);

// --- Actualités : article à la une + liste ---
if ($("#news")) {
  const [a, ...rest] = NEWS;
  $("#news").innerHTML =
    `<div class="col-lg-7"><div class="gcard"><div class="imgwrap"><img style="height:320px" src="${U(a.img)}" alt=""></div>
  <div class="p-4"><span class="tag">${a.c}</span><small class="text-mut">${a.d}</small><h2 class="h3 mt-2">${a.t}</h2><p class="text-mut">${a.x}</p></div></div></div>
  <div class="col-lg-5 d-flex flex-column gap-3">${rest
    .map(
      (
        n,
      ) => `<div class="panel glow d-flex gap-3"><img src="${U(n.img)}" alt="" width="90" height="90" style="object-fit:cover;border-radius:4px">
  <div><span class="tag">${n.c}</span><small class="text-mut">${n.d}</small><h3 class="h6 mt-1">${n.t}</h3><p class="small text-mut mb-0">${n.x}</p></div></div>`,
    )
    .join("")}</div>`;
}

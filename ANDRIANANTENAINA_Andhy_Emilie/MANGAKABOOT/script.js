/* =====================================================
   NAVIGATION ENTRE LES PAGES
===================================================== */
function showPage(pageId) {
    window.location.href =
        pageId === "home" ? "index.html" : pageId + ".html";
    return;
    const pages =
        document.querySelectorAll(".page");
    pages.forEach(function(page) {
        page.classList.remove("active");
    });
    const selectedPage =
        document.getElementById(pageId);
    selectedPage.classList.add("active");
    const navLinks =
        document.querySelectorAll(".nav-link");
    navLinks.forEach(function(link) {
        link.classList.remove("active");
        if (link.dataset.page === pageId) {
            link.classList.add("active");
        }
    });
    document
        .getElementById("navLinks")
        .classList
        .remove("open");
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
    setTimeout(function() {
        lucide.createIcons();
        observeElements();
    }, 50);
}
/* =====================================================
   MENU MOBILE
===================================================== */
function toggleMenu() {
    document
        .getElementById("navLinks")
        .classList
        .toggle("open");
}
/* =====================================================
   FORMULAIRE CONTACT
===================================================== */
const contactForm =
    document.getElementById("contactForm");
const contactMessage =
    document.getElementById("contactMessage");
if (contactForm) contactForm.addEventListener(
    "submit",
    function(event) {
        event.preventDefault();
        contactMessage
            .classList
            .add("show");
        contactForm.reset();
        setTimeout(function() {
            contactMessage
                .classList
                .remove("show");
        }, 5000);
    }
);
/* =====================================================
   MANGA ROULETTE
===================================================== */
const recommendations = [
    {
        title: "Crimson Shadow",
        description:
            "Une aventure intense où les ombres cachent un secret capable de changer le destin.",
        image:
            "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Midnight Files",
        description:
            "Chaque nuit à minuit, un nouveau dossier apparaît. Personne ne sait qui l'envoie.",
        image:
            "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Lost Worlds",
        description:
            "Une mystérieuse porte mène vers un monde qui n'aurait jamais dû exister.",
        image:
            "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Silent Hearts",
        description:
            "Deux personnes, une promesse oubliée et des souvenirs impossibles à effacer.",
        image:
            "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Neon Spirit",
        description:
            "Dans une ville illuminée par les néons, les esprits commencent à apparaître.",
        image:
            "https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&w=500&q=80"
    },
    {
        title: "Last Horizon",
        description:
            "Le dernier voyage commence au-delà de l'horizon, là où personne n'est jamais revenu.",
        image:
            "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=500&q=80"
    }
];
const rouletteWheel =
    document.getElementById("rouletteWheel");
const spinButton =
    document.getElementById("spinButton");
const rouletteResult =
    document.getElementById("rouletteResult");
const rouletteImage =
    document.getElementById("rouletteImage");
const rouletteTitle =
    document.getElementById("rouletteTitle");
const rouletteDescription =
    document.getElementById("rouletteDescription");
let currentRotation = 0;
if (spinButton) spinButton.addEventListener(
    "click",
    function() {
        spinButton.disabled = true;
        rouletteResult
            .classList
            .remove("show");
        const randomIndex =
            Math.floor(
                Math.random()
                *
                recommendations.length
            );
        const recommendation =
            recommendations[randomIndex];
        const extraRotation =
            1800
            +
            Math.floor(
                Math.random()
                *
                1800
            );
        currentRotation += extraRotation;
        rouletteWheel.style.transform =
            "rotate("
            +
            currentRotation
            +
            "deg)";
        setTimeout(function() {
            rouletteImage.src =
                recommendation.image;
            rouletteTitle.textContent =
                recommendation.title;
            rouletteDescription.textContent =
                recommendation.description;
            rouletteResult
                .classList
                .add("show");
            spinButton.disabled = false;
        }, 4500);
    }
);
/* =====================================================
   ANIMATION AU SCROLL
===================================================== */
let revealObserver;
function observeElements() {
    if (revealObserver) {
        revealObserver.disconnect();
    }
    const revealElements =
        document.querySelectorAll(
            ".page.active .reveal"
        );
    revealObserver =
        new IntersectionObserver(
            function(entries) {
                entries.forEach(
                    function(entry) {
                        if (entry.isIntersecting) {
                            entry.target
                                .classList
                                .add("show");
                        }
                    }
                );
            },
            {
                threshold: 0.15
            }
        );
    revealElements.forEach(
        function(element) {
            revealObserver.observe(element);
        }
    );
}
/* =====================================================
   COMPTEURS
===================================================== */
const counters =
    document.querySelectorAll(
        ".stat-number"
    );
const counterObserver =
    new IntersectionObserver(
        function(entries) {
            entries.forEach(
                function(entry) {
                    if (entry.isIntersecting) {
                        const counter =
                            entry.target;
                        const target =
                            Number(
                                counter.dataset.target
                            );
                        let current = 0;
                        const increment =
                            Math.ceil(
                                target / 100
                            );
                        const interval =
                            setInterval(
                                function() {
                                    current += increment;
                                    if (current >= target) {
                                        current = target;
                                        clearInterval(interval);
                                    }
                                    counter.textContent =
                                        current.toLocaleString(
                                            "fr-FR"
                                        );
                                },
                                20
                            );
                        counterObserver.unobserve(
                            counter
                        );
                    }
                }
            );
        },
        {
            threshold: 0.5
        }
    );
counters.forEach(
    function(counter) {
        counterObserver.observe(counter);
    }
);
/* =====================================================
   INITIALISATION DES ICONES
===================================================== */
lucide.createIcons();
/* =====================================================
   INITIALISATION DES ANIMATIONS
===================================================== */
observeElements();

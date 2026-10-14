// ============================================================
// 1. ANIMATION AU SCROLL ("reveal")
// On utilise IntersectionObserver, une fonctionnalité native du
// navigateur (pas un composant Bootstrap) qui "observe" quand un
// élément devient visible à l'écran, puis lui ajoute la classe
// "active" définie dans style.css pour déclencher la transition.
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // l'animation ne se joue qu'une fois
      }
    });
  }, {
    threshold: 0.15 // se déclenche quand 15% de l'élément est visible
  });

  revealElements.forEach(el => observer.observe(el));

  // ============================================================
  // 2. TOOLTIPS BOOTSTRAP
  // Bootstrap exige d'initialiser chaque tooltip en JavaScript
  // (contrairement à l'accordéon ou au modal qui marchent juste
  // avec des attributs data-bs-*)
  // ============================================================
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));

  // ============================================================
  // 3. LIEN ACTIF DANS LA NAVBAR
  // Compare l'URL de la page actuelle avec chaque lien du menu
  // pour lui ajouter automatiquement la classe "active"
  // ============================================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // ============================================================
  // 4. VALIDATION DE FORMULAIRE (pattern officiel Bootstrap)
  // Empêche l'envoi tant que les champs requis ne sont pas remplis
  // correctement, et affiche les messages d'erreur/succès Bootstrap.
  // ============================================================
  const forms = document.querySelectorAll('.needs-validation');
  forms.forEach(form => {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }

      // Si le formulaire est valide : on simule un envoi avec un spinner,
      // puis on affiche un toast de confirmation.
      const submitBtn = form.querySelector('button[type="submit"]');
      const spinner = submitBtn.querySelector('.spinner-border');
      const btnText = submitBtn.querySelector('.btn-text');

      spinner.classList.remove('d-none');
      btnText.textContent = 'Envoi en cours...';
      submitBtn.disabled = true;

      setTimeout(() => {
        spinner.classList.add('d-none');
        btnText.textContent = 'Envoyer le message';
        submitBtn.disabled = false;
        form.classList.remove('was-validated');
        form.reset();

        const toastEl = document.getElementById('confirmationToast');
        if (toastEl) {
          const toast = new bootstrap.Toast(toastEl);
          toast.show();
        }
      }, 1200); // simulation d'un envoi réseau
    });
  });
});
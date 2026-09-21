// ============ Icone Lucide ============
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
});

// ============ Menu mobile ============
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const isOpen = !mobileMenu.classList.contains('hidden');
    menuBtn.setAttribute('aria-expanded', isOpen);
  });
}

// ============ Navbar: ombra su scroll ============
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 12) {
      navbar.classList.add('shadow-sm');
    } else {
      navbar.classList.remove('shadow-sm');
    }
  });
}

// ============ Reveal on scroll ============
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// ============ Accordion FAQ ============
document.querySelectorAll('.accordion-trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.accordion-item');
    const wasOpen = item.classList.contains('open');
    item.parentElement.querySelectorAll('.accordion-item').forEach((i) => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// ============ Testimonial slider ============
const track = document.getElementById('testimonial-track');
if (track) {
  const slides = track.children.length;
  let index = 0;
  const update = () => { track.style.transform = `translateX(-${index * 100}%)`; };
  document.getElementById('t-next')?.addEventListener('click', () => {
    index = (index + 1) % slides;
    update();
  });
  document.getElementById('t-prev')?.addEventListener('click', () => {
    index = (index - 1 + slides) % slides;
    update();
  });
  let auto = setInterval(() => {
    index = (index + 1) % slides;
    update();
  }, 6000);
  track.closest('section')?.addEventListener('mouseenter', () => clearInterval(auto));
}

// ============ Blog: filtro categorie + ricerca ============
const searchInput = document.getElementById('blog-search');
const categoryBtns = document.querySelectorAll('.category-filter');
const blogCards = document.querySelectorAll('.blog-card');
let activeCategory = 'tutti';

function filterBlog() {
  const q = (searchInput?.value || '').toLowerCase().trim();
  blogCards.forEach((card) => {
    const cat = card.dataset.category;
    const title = card.dataset.title.toLowerCase();
    const matchesCategory = activeCategory === 'tutti' || cat === activeCategory;
    const matchesSearch = title.includes(q);
    card.style.display = matchesCategory && matchesSearch ? '' : 'none';
  });
}

categoryBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    categoryBtns.forEach((b) => b.classList.remove('bg-primary', 'text-white'));
    btn.classList.add('bg-primary', 'text-white');
    activeCategory = btn.dataset.category;
    filterBlog();
  });
});
searchInput?.addEventListener('input', filterBlog);

// ============ Form di contatto/prenotazione ============
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const requiredFields = bookingForm.querySelectorAll('[required]');
    requiredFields.forEach((field) => {
      const errorEl = document.getElementById(`err-${field.id}`);
      if (!field.value.trim() || (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(field.value))) {
        valid = false;
        field.classList.add('border-red-400');
        if (errorEl) errorEl.classList.remove('hidden');
      } else {
        field.classList.remove('border-red-400');
        if (errorEl) errorEl.classList.add('hidden');
      }
    });

    if (!valid) return;

    const modal = document.getElementById('success-modal');
    modal?.classList.remove('hidden');
    bookingForm.reset();
  });
}

document.getElementById('close-modal')?.addEventListener('click', () => {
  document.getElementById('success-modal')?.classList.add('hidden');
});

// ============ Anno corrente nel footer ============
document.querySelectorAll('.current-year').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// ============ Gestione blocco e sblocco Google Maps (GDPR) ============
function initMapConsent() {
  const loadMapBtn = document.getElementById('load-map-btn');
  const mapOverlay = document.getElementById('map-consent-overlay');
  const googleMap = document.getElementById('google-map');

  function enableMap() {
    if (googleMap && googleMap.dataset.src && googleMap.classList.contains('hidden')) {
      googleMap.src = googleMap.dataset.src; 
      googleMap.classList.remove('hidden');
      if (mapOverlay) {
        mapOverlay.style.display = 'none'; 
      }
    }
  }

  // Sblocco tramite pulsante manuale sul box della mappa
  if (loadMapBtn) {
    loadMapBtn.addEventListener('click', () => {
      enableMap();
    });
  }

  // Sblocco automatico se l'utente ha già accettato in una sessione precedente
  if (document.cookie.includes('cookieconsent_status=allow')) {
    enableMap();
  }

  // Sblocco automatico quando si clicca "Accetta tutti" sul banner di Osano
  document.addEventListener('click', (e) => {
    if (e.target.matches('.cc-allow') || e.target.closest('.cc-allow')) {
      setTimeout(enableMap, 300);
    }
  });
}

// Esegue subito se il DOM è pronto, altrimenti attende
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMapConsent);
} else {
  initMapConsent();
}
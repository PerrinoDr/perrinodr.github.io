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

// ============ Anno corrente nel footer ============
document.querySelectorAll('.current-year').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// ============ Gestione blocco e sblocco Google Maps (GDPR) ============

// Funzione globale richiamata dal banner dei cookie nell'HTML (<head>)
function unlockMap() {
  const googleMap = document.getElementById('google-map');
  const mapOverlay = document.getElementById('map-consent-overlay');

  if (googleMap && googleMap.dataset.src && googleMap.classList.contains('hidden')) {
    googleMap.src = googleMap.dataset.src; 
    googleMap.classList.remove('hidden');
    if (mapOverlay) {
      mapOverlay.style.display = 'none'; 
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loadMapBtn = document.getElementById('load-map-btn');

  // Sblocco manuale tramite il pulsante nel box della mappa
  if (loadMapBtn) {
    loadMapBtn.addEventListener('click', () => {
      unlockMap();
    });
  }

  // Sblocco automatico se l'utente aveva già accettato in precedenza
  if (document.cookie.includes('cookieconsent_status=allow')) {
    unlockMap();
  }
});
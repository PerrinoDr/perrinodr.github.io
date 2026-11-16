// ============ Icone Lucide ============
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
});

// ============ Menu mobile ============
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Impedisce al click di propagarsi e chiudere subito il menu
      mobileMenu.classList.toggle('hidden');
      const isOpen = !mobileMenu.classList.contains('hidden');
      menuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Chiude il menu se si clicca in un qualsiasi altro punto della pagina
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
});

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

// ============ Gestione blocco e sblocco Google Maps e Video (GDPR) ============
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

  const videoIframe = document.getElementById('dailymotion-video');
  const videoContainer = document.getElementById('video-container');
  const videoPlaceholder = document.getElementById('video-cookie-placeholder');

  if (videoIframe && videoIframe.dataset.src && videoContainer.classList.contains('hidden')) {
    videoIframe.src = videoIframe.dataset.src;
    videoContainer.classList.remove('hidden');
    if (videoPlaceholder) {
      videoPlaceholder.style.display = 'none';
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loadMapBtn = document.getElementById('load-map-btn');

  if (loadMapBtn) {
    loadMapBtn.addEventListener('click', () => {
      unlockMap();
    });
  }

  if (document.cookie.includes('cookieconsent_status=allow')) {
    setTimeout(unlockMap, 100);
  }

  // ============ Slider Feedback Clienti (Ultra-robusto) ============
  const feedbackTrack = document.getElementById("feedbackTrack");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const dotsContainer = document.getElementById("sliderDots");
  const cards = document.querySelectorAll(".feedback-card");

  if (feedbackTrack && cards.length > 0) {
    console.log("Slider feedback attivo!");

    if (dotsContainer) {
      dotsContainer.innerHTML = "";
      cards.forEach((_, index) => {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => {
          const scrollAmount = feedbackTrack.clientWidth;
          feedbackTrack.scrollTo({ left: scrollAmount * index, behavior: "smooth" });
        });
        dotsContainer.appendChild(dot);
      });
    }

    const dots = document.querySelectorAll(".slider-dots .dot, .slider-dots span");

    feedbackTrack.addEventListener("scroll", () => {
      if (dots.length === 0) return;
      const scrollAmount = feedbackTrack.clientWidth || 300;
      const activeIndex = Math.round(feedbackTrack.scrollLeft / scrollAmount);
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === activeIndex);
      });
    });

    function scrollNext() {
      const scrollAmount = feedbackTrack.clientWidth || 300;
      if (feedbackTrack.scrollLeft + feedbackTrack.clientWidth >= feedbackTrack.scrollWidth - 10) {
        feedbackTrack.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        feedbackTrack.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }

    function scrollPrev() {
      const scrollAmount = feedbackTrack.clientWidth || 300;
      if (feedbackTrack.scrollLeft <= 10) {
        feedbackTrack.scrollTo({ left: feedbackTrack.scrollWidth, behavior: "smooth" });
      } else {
        feedbackTrack.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    }

    if (nextBtn) nextBtn.addEventListener("click", scrollNext);
    if (prevBtn) prevBtn.addEventListener("click", scrollPrev);

    let autoPlay = setInterval(scrollNext, 5000);

    feedbackTrack.addEventListener("mouseenter", () => clearInterval(autoPlay));
    feedbackTrack.addEventListener("mouseleave", () => {
      autoPlay = setInterval(scrollNext, 5000);
    });
    feedbackTrack.addEventListener("touchstart", () => clearInterval(autoPlay), { passive: true });
  }
});
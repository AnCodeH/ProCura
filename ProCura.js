// ==========================================
// 📊 COUNTER ANIMATION
// ==========================================
const counters = document.querySelectorAll('.counter');

counters.forEach(counter => {
  counter.innerText = '0';

  const updateCounter = () => {
    const target = +counter.getAttribute('data-target');
    const current = +counter.innerText;
    const increment = target / 100;

    if (current < target) {
      counter.innerText = `${Math.ceil(current + increment)}`;
      setTimeout(updateCounter, 20);
    } else {
      counter.innerText = target;
    }
  };

  updateCounter();
});

// ==========================================
// ⚓ SMOOTH SCROLL ACCELERATOR
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetEl = document.querySelector(this.getAttribute('href'));
    if (targetEl) {
      targetEl.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// ==========================================
// 🌐 TRANSLATION SYSTEM ENGINE
// ==========================================
async function setLanguage(lang) {
  try {
    const response = await fetch(`./locales/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Could not fetch translation file for language: ${lang}`);
    }
    const translations = await response.json();

    // Find all elements containing a data-i18n attribute and inject text
    document.querySelectorAll("[data-i18n]").forEach(element => {
      const translationKey = element.getAttribute("data-i18n");
      if (translations[translationKey]) {
        element.textContent = translations[translationKey];
      }
    });

    localStorage.setItem("preferredLanguage", lang);
  } catch (error) {
    console.error("Error loading translations:", error);
  }
}

function setupLanguageSwitcher() {
  const langSelect = document.getElementById("lang-switch");
  
  if (langSelect) {
    langSelect.removeEventListener("change", handleLangChange); // Prevent duplicate listeners
    langSelect.addEventListener("change", handleLangChange);

    // Set the dropdown to match the current preferred language
    const currentLang = localStorage.getItem("preferredLanguage") || "en";
    langSelect.value = currentLang;
  }
}

function handleLangChange(e) {
  setLanguage(e.target.value);
}

// ==========================================
// 📬 MAIN INJECTOR & INITIALIZATION FLOW
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // 1. Fire off both fetches simultaneously
  const fetchHeader = fetch('Header.html')
    .then(res => res.text())
    .then(html => {
      const placeholder = document.getElementById('header-placeholder');
      if (placeholder) placeholder.innerHTML = html;
    });

  const fetchFooter = fetch('Footer.html')
    .then(res => res.text())
    .then(html => {
      const placeholder = document.getElementById('footer-placeholder');
      if (placeholder) placeholder.innerHTML = html;
    });

  // 2. Wait until BOTH header and footer are fully injected into the page template canvas
  Promise.all([fetchHeader, fetchFooter])
    .then(() => {
      // 3. Determine the targeted display language
      const savedLang = localStorage.getItem("preferredLanguage") || "en";
      
      // 4. Translate the whole page layout (including newly injected headers/footers)
      return setLanguage(savedLang);
    })
    .then(() => {
      // 5. Bind listener handles to the fresh markup
      setupLanguageSwitcher();

      // =======================================================
      // 🔥 PHONE COMPATIBILITY (INITIALIZED IN STEP)
      // =======================================================
      const menuToggle = document.querySelector('.menu-toggle');
      const navMenu = document.getElementById('nav-menu');

      if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevents instant closure on global taps
          menuToggle.classList.toggle('active');
          navMenu.classList.toggle('active');
        });
      }

      // Mobile click handling for inside-navbar context boxes
      document.querySelectorAll('.desc-toggle').forEach(button => {
        button.addEventListener('click', (e) => {
          if (window.innerWidth <= 900) {
            e.preventDefault();
            e.stopPropagation();
            
            const wrapper = button.closest('.nav-link-wrapper');
            
            // Auto-collapse adjacent accordion columns
            document.querySelectorAll('.nav-link-wrapper').forEach(item => {
              if (item !== wrapper) item.classList.remove('is-open');
            });
            
            wrapper.classList.toggle('is-open');
          }
        });
      });

      // =======================================================
      // ✨ SCROLL REVEAL JAVASCRIPT ANIMATIONS
      // =======================================================
      const revealElements = document.querySelectorAll(".reveal");
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target); // Kill execution watcher once rendered
          }
        });
      }, {
        threshold: 0.15 // Triggers viewport rendering at 15% visibility
      });

      revealElements.forEach(element => {
        observer.observe(element);
      });
    })
    .catch(err => console.error("Error building structural interface elements:", err));
});

// ==========================================
// 🖱 GLOBAL CLICKS & DESKTOP EVENT DRIVERS
// ==========================================
document.addEventListener('click', (event) => {
  const navMenu = document.getElementById('nav-menu');
  const menuToggle = document.querySelector('.menu-toggle');

  // 1. Smart Global Window Closer (Closes slide-out menus if clicking away)
  if (!event.target.closest('.nav-link-wrapper')) {
    document.querySelectorAll('.nav-link-wrapper').forEach(item => {
      item.classList.remove('is-open');
    });
  }

  if (navMenu && menuToggle && !navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
  }

  // 2. Desktop Context Accordions / Overlay Backdrops
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  if (event.target.closest('.dropdown-toggle')) {
    navbar.classList.add('nav-menu-open');
  } 
  else if (event.target.closest('.close-toggle') || event.target.closest('.menu-backdrop')) {
    navbar.classList.remove('nav-menu-open');
    
    document.querySelectorAll('.nav-link-wrapper.has-submenu').forEach(el => {
      el.classList.remove('is-open');
      el.querySelector('.submenu-toggle')?.setAttribute('aria-expanded', 'false');
    });
  }

  // 3. Submenu Drawer Toggle Controls
  const submenuBtn = event.target.closest('.submenu-toggle');
  if (submenuBtn) {
    const parentWrapper = submenuBtn.closest('.nav-link-wrapper');
    const isOpen = parentWrapper.classList.toggle('is-open');
    submenuBtn.setAttribute('aria-expanded', isOpen);
  }
});
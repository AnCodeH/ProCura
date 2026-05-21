//**Counter Animation**

const counters = document.querySelectorAll('.counter');

counters.forEach(counter => {

  counter.innerText = '0';

  const updateCounter = () => {

    const target = +counter.getAttribute('data-target');
    const current = +counter.innerText;

    const increment = target / 100;

    if(current < target){
      counter.innerText = `${Math.ceil(current + increment)}`;
      setTimeout(updateCounter, 20);
    } else {
      counter.innerText = target;
    }

  };

  updateCounter();

});


//**Smooth Scroll**

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

  anchor.addEventListener('click', function(e){

    e.preventDefault();

    document.querySelector(this.getAttribute('href'))
      .scrollIntoView({
        behavior:'smooth'
      });

  });

});

//**Language changer**
document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("lang-switch");

  // Asynchronous function to fetch JSON and update UI
  async function setLanguage(lang) {
    try {
      // Fetch the specific language JSON file
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

      // Save preference to user's browser storage
      localStorage.setItem("preferredLanguage", lang);
    } catch (error) {
      console.error("Error loading translations:", error);
    }
  }

  // Event listener for dropdown change
  langSelect.addEventListener("change", (e) => {
    setLanguage(e.target.value);
  });

  // Determine starting language (saved preference OR fallback to English)
  const savedLang = localStorage.getItem("preferredLanguage") || "en";
  langSelect.value = savedLang;
  setLanguage(savedLang);
});


//**PHONE compatibility**
// 1. Hamburger Drawer Toggle Controller
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.getElementById('nav-menu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Stops the menu from immediately closing due to global clicks
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// 2. Mobile-specific click handling for product description toggles
document.querySelectorAll('.desc-toggle').forEach(button => {
    button.addEventListener('click', (e) => {
        // Only trigger layout changes if the mobile media query layout is currently active
        if (window.innerWidth <= 900) {
            e.preventDefault();
            e.stopPropagation(); // Keeps the menu from snapping shut on interaction
            
            const wrapper = button.closest('.nav-link-wrapper');
            
            // Auto-collapse any other open description boxes first
            document.querySelectorAll('.nav-link-wrapper').forEach(item => {
                if (item !== wrapper) item.classList.remove('is-open');
            });
            
            // Open or close our targeted layout panel
            wrapper.classList.toggle('is-open');
        }
    });
});

// 3. Smart Global Window Tap Closer
document.addEventListener('click', (e) => {
    // If a user clicks completely outside a link wrapper, hide active descriptions
    if (!e.target.closest('.nav-link-wrapper')) {
        document.querySelectorAll('.nav-link-wrapper').forEach(item => {
            item.classList.remove('is-open');
        });
    }

    // If a user clicks outside the menu and toggle button, collapse the drawer
    if (navMenu && menuToggle && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});
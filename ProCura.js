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
        //window.innerWidth <= 900
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

//Fade in
document.addEventListener("DOMContentLoaded", function () {
    const revealElements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Check if the element has entered the viewport
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target); // Stops watching once animated
            }
        });
    }, {
        threshold: 0.15 // Triggers when 15% of the element is visible
    });

    revealElements.forEach(element => {
        observer.observe(element);
    });
});

//Header and footer injector and language selector

// Function to handle fetching and translating languages
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

// Function to setup the language dropdown switcher
function setupLanguageSwitcher() {
  const langSelect = document.getElementById("lang-switch");
  
  if (langSelect) {
    // Listen for manual language changes
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

// MAIN INJECTOR & INITIALIZATION FLOW
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

  // 2. Wait until BOTH header and footer are fully injected into the page
  Promise.all([fetchHeader, fetchFooter])
    .then(() => {
      // 3. Now that everything is in the DOM, determine the target language
      const savedLang = localStorage.getItem("preferredLanguage") || "en";
      
      // 4. Translate the whole page (including newly injected headers/footers)
      setLanguage(savedLang).then(() => {
        // 5. Finally, bind the event listener to the freshly injected dropdown
        setupLanguageSwitcher();
      });
    })
    .catch(err => console.error("Error injecting page components:", err));
});
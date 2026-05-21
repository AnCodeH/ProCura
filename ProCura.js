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
document.querySelectorAll('.desc-toggle').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        
        const wrapper = button.closest('.nav-link-wrapper');
        
        // Close any other open popup boxes first
        document.querySelectorAll('.nav-link-wrapper').forEach(item => {
            if (item !== wrapper) item.classList.remove('is-open');
        });
        
        // Toggle the current popup active visibility class
        wrapper.classList.toggle('is-open');
    });
});

// Close all description popups instantly if a user taps anywhere else on mobile screen
document.addEventListener('click', () => {
    document.querySelectorAll('.nav-link-wrapper').forEach(item => {
        item.classList.remove('is-open');
    });
});
import { submitIdea, getRandomIdea } from './ideaLogic.js';
import { setupBackButton, setupSubmitButton, setupButtonApply } from './domHandlers.js';

// Handling of page load events
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes('order.html')) {
    setupButtonApply(submitIdea);
  }

  if (window.location.pathname.includes('index.html')) {
    const title_random = document.getElementById('title-random');
    const description_random = document.getElementById('description-random');
    
    if (title_random && description_random) {
      getRandomIdea(title_random, description_random);
    }
  }

  setupBackButton();
  setupSubmitButton(submitIdea);
});

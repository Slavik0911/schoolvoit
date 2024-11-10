import { submitIdea, getRandomIdea, voteIdea } from './ideaLogic.js';
import { setupBackButton, setupSubmitButton, setupButtonApply } from './domHandlers.js';

document.addEventListener("DOMContentLoaded", function () {
  const title_random = document.getElementById('title-random');
  const description_random = document.getElementById('description-random');
  const voteForButton = document.querySelector('.void-button.pink');
  const voteAgainstButton = document.querySelector('.void-button.purple');

  if (title_random && description_random) {
    getRandomIdea(title_random, description_random);
  }

  if (voteForButton) {
    voteForButton.addEventListener('click', () => voteIdea('for'));
  }

  if (voteAgainstButton) {
    voteAgainstButton.addEventListener('click', () => voteIdea('against'));
  }

  if (window.location.pathname.includes('order.html')) {
    setupButtonApply(submitIdea);
  }

  setupBackButton();
  setupSubmitButton(submitIdea);
});

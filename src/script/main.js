// Import functions from ideaLogic.js and domHandlers.js
import { submitIdea, getLatestIdea, voteIdea } from './ideaLogic.js';
import { setupBackButton, setupSubmitButton, setupButtonApply } from './domHandlers.js';

document.addEventListener("DOMContentLoaded", function () {
  const title_random = document.getElementById('title-random');
  const description_random = document.getElementById('description-random');
  const upvoteButton = document.querySelector('.void-button.pink');
  const downvoteButton = document.querySelector('.void-button.purple');

  if (title_random && description_random) {
    getLatestIdea(title_random, description_random);
  }

  if (upvoteButton) {
    upvoteButton.addEventListener('click', () => voteIdea('upvote'));
  }

  if (downvoteButton) {
    downvoteButton.addEventListener('click', () => voteIdea('downvote'));
  }

  if (window.location.pathname.includes('order.html')) {
    setupButtonApply(submitIdea);
  }

  setupBackButton();
  setupSubmitButton(submitIdea);
});

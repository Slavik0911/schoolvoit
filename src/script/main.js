// Import functions from ideaLogic.js and domHandlers.js
import { submitIdea, getLatestIdea, voteIdea, createUser, getUserId } from './ideaLogic.js';
import { setupBackButton, setupSubmitButton, setupButtonApply } from './domHandlers.js';


window.onload = async function () {
  const userId = getUserId(); // Generate or get a user ID
  await createUser(userId); // Create a record in Firestore if it doesn't exist yet
};

document.addEventListener("DOMContentLoaded", function () {
  const title_last = document.getElementById('title-random');
  const description_last = document.getElementById('description-random');
  const upvoteButton = document.querySelector('.void-button.pink');
  const downvoteButton = document.querySelector('.void-button.purple');

  if (title_last && description_last) {
    getLatestIdea(title_last, description_last);
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

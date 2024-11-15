// Import functions from ideaLogic.js
import { submitIdea, getLatestIdea, voteIdea } from './ideaLogic.js';

// Get HTML elements
const submitButton = document.getElementById('submitIdeaButton');
const inputTitle = document.getElementById('input-title');
const inputDescription = document.getElementById('input-description');
const inputNumber = document.getElementById('input-number');
const buttonApply = document.getElementById('button-apply');
const backButton = document.getElementById('backButton');
const title_random = document.getElementById('title-random');
const description_random = document.getElementById('description-random');
const upvoteButton = document.getElementById('upvoteButton');
const downvoteButton = document.getElementById('downvoteButton');

// Function to handle the "Back" button
function setupBackButton() {
  if (backButton) {
    backButton.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
}

// Function to handle the "Submit Idea" button
function setupSubmitButton() {
  if (submitButton) {
    submitButton.addEventListener('click', () => {
      window.location.href = 'order.html';
    });
  }
}

// Function to handle the "Done" button
function setupButtonApply() {
  if (buttonApply) {
    buttonApply.addEventListener('click', () => {
      const title = inputTitle.value;
      const description = inputDescription.value;
      const phoneNumber = inputNumber.value;

      if (title && description && phoneNumber) {
        submitIdea(title, description);
      } else {
        alert("Please fill out all fields.");
      }
    });
  }
}

// Function to get the latest idea that hasn't been voted on yet
function setupRandomIdea() {
  if (title_random && description_random) {
    getLatestIdea(title_random, description_random);
  }
}

// Function to handle the voting buttons
function setupVoteButtons() {
  if (upvoteButton && downvoteButton) {
    upvoteButton.addEventListener('click', () => voteIdea('upvote'));
    downvoteButton.addEventListener('click', () => voteIdea('downvote'));
  }
}

// Initialize all event handlers
function initializeDomHandlers() {
  setupBackButton();
  setupSubmitButton();
  setupButtonApply();
  setupRandomIdea();
  setupVoteButtons();
}

// Export all necessary functions
export {
  setupBackButton,
  setupSubmitButton,
  setupButtonApply,
  setupRandomIdea,
  setupVoteButtons,
  initializeDomHandlers
};

// Import functions from ideaLogic.js
import { submitIdea, getLatestIdea, voteIdea } from './ideaLogic.js';

// Get HTML elements
const submitButton = document.getElementById('submitIdeaButton');
const inputTitle = document.getElementById('input-title');
const inputDescription = document.getElementById('input-description');
const inputAuthor = document.getElementById('input-author');
const buttonApply = document.getElementById('button-apply');
const backButton = document.getElementById('backButton');
const title_last = document.getElementById('title-random');
const description_last = document.getElementById('description-random');
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
      const title = inputTitle.value.trim();
      const description = inputDescription.value.trim();
      const author = inputAuthor.value.trim();

      //Enter to admin functional
      if (title === "admin123" && description === "admin123") {
        window.location.href = 'admin.html';
        return; 
      }

      if (title && description && author) {
        submitIdea(title, description, author);
      } else {
        alert("Заповни всі поля");
      }
    });
  }
}

// Function to get the latest idea that hasn't been voted on yet
function setupRandomIdea() {
  if (title_last && description_last) {
    getLatestIdea(title_last, description_last);
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

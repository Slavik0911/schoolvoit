// Get element from HTML
const submitButton = document.getElementById('submitIdeaButton');
const inputTitle = document.getElementById('input-title');
const inputDescription = document.getElementById('input-description');
const inputNumber = document.getElementById('input-number');
const buttonApply = document.getElementById('button-apply');
const backButton = document.getElementById('backButton');
const title_random = document.getElementById('title-random');
const description_random = document.getElementById('description-random');

// On click back 
function setupBackButton() {
  if (backButton) {
    backButton.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
}

// On click "Подати ідею"
function setupSubmitButton(submitIdea) {
  if (submitButton) {
    submitButton.addEventListener('click', () => {
      window.location.href = 'order.html';
    });
  }
}

// On click "Готово"
function setupButtonApply(submitIdea) {
  if (buttonApply) {
    buttonApply.addEventListener('click', () => {
      const title = inputTitle.value;
      const description = inputDescription.value;
      const phoneNumber = inputNumber.value;
      if (title && description && phoneNumber) {
        submitIdea(title, description);
      } else {
        alert("Будь ласка, заповніть всі поля.");
      }
    });
  }
}

export { setupBackButton, setupSubmitButton, setupButtonApply };

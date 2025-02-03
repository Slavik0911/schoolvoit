// Get HTML elements
const blockButton = document.getElementById('blockButton');

// Function to handle the "Block App" button
function setupBlockButton() {
  if (blockButton) {
    blockButton.addEventListener('click', () => {
      // Block buttons on index.html by setting a flag in Firestore or local storage
      localStorage.setItem('appBlocked', 'true');
      alert('App is now blocked!');

      // Change the title to "Технічна перерва"
      document.title = "Технічна перерва";
    });
  }
}

// Initialize all event handlers
setupBlockButton();

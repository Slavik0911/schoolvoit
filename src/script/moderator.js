// Import Firestore functions
import { collection, getDocs, updateDoc, deleteDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
import { firestore } from './firebase.js';

let cachedIdeas = null; // Cache for ideas

document.addEventListener("DOMContentLoaded", () => {
    displayIdea();
    setupBackButton();
});

function setupBackButton() {
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
}

// Function to fetch and display the latest idea
async function displayIdea() {
    const ideas = await getIdeas(); // Use cached ideas if available
    const titleElement = document.getElementById('idea-title');
    const descriptionElement = document.getElementById('idea-description');

    if (!titleElement || !descriptionElement) {
        console.error("Elements for displaying idea title and description not found");
        return;
    }

    // Get the latest unapproved idea
    const latestIdea = ideas.length > 0 ? ideas.find(idea => !idea.isApproved) : null;

    if (latestIdea) {
        // Display the latest idea's title and description
        titleElement.textContent = latestIdea.title;
        descriptionElement.textContent = latestIdea.description;
        titleElement.dataset.ideaId = latestIdea.id;
        titleElement.dataset.userId = latestIdea.userId;
        // Передаємо ідею в обробники подій тільки якщо вона визначена
        setupEventListeners(latestIdea);
    } else {
        titleElement.textContent = "Немає доступних ідей";
        descriptionElement.textContent = "";
    }
}

// Function to retrieve ideas from Firestore
async function getIdeas(forceRefresh = false) {
    if (!forceRefresh && cachedIdeas) {
        return cachedIdeas;
    }

    const querySnapshot = await getDocs(collection(firestore, "ideas"));
    const ideas = [];
    querySnapshot.forEach((doc) => {
        ideas.push({ id: doc.id, ...doc.data() });
    });

    // Sort ideas by timestamp to get the newest ones first
    ideas.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Cache the received ideas
    cachedIdeas = ideas;
    return ideas;
}

// Set up event listeners for buttons
function setupEventListeners(idea) {
    if (!idea || !idea.id || !idea.userId) {
        console.error("Invalid idea object:", idea);
        return;
    }

    const approveButton = document.getElementById('approve-idea');
    const deleteButton = document.getElementById('del-idea');
    const banButton = document.getElementById('ban-user');

    if (!approveButton || !deleteButton || !banButton) {
        console.error("One or more buttons not found");
        return;
    }

    // Clear previous event handlers
    approveButton.replaceWith(approveButton.cloneNode(true));
    deleteButton.replaceWith(deleteButton.cloneNode(true));
    banButton.replaceWith(banButton.cloneNode(true));

    // Re-acquire buttons after replacement
    const newApproveButton = document.getElementById('approve-idea');
    const newDeleteButton = document.getElementById('del-idea');
    const newBanButton = document.getElementById('ban-user');

    // Add new event handlers
    newApproveButton.addEventListener('click', () => approveIdea(idea.id));
    newDeleteButton.addEventListener('click', () => deleteIdea(idea.id));
    newBanButton.addEventListener('click', () => banUser(idea.userId));
}

// Function to approve an idea
async function approveIdea(ideaId) {
    const ideaRef = doc(firestore, "ideas", ideaId);
    try {
        const docSnapshot = await getDoc(ideaRef);
        if (!docSnapshot.exists()) {
            alert("Ідея не знайдена. Можливо, її вже видалено.");
            return;
        }

        await updateDoc(ideaRef, {
            isApproved: true
        });

        // Update the cache without reloading all data
        cachedIdeas = cachedIdeas.map(idea =>
            idea.id === ideaId ? { ...idea, isApproved: true } : idea
        );

        // Update ideas display after approval
        displayIdea();
    } catch (error) {
        console.error("Помилка схвалення ідеї:", error);
        alert("Не вдалося схвалити ідею. Спробуйте ще раз.");
    }
}

// Function to ban a user
async function banUser(userId) {
    try {
        const userRef = doc(firestore, "users", userId);
        await updateDoc(userRef, { isBanned: true });
        
        alert("Користувача заблоковано.");
        displayIdea(); 
    } catch (error) {
        console.error("Помилка при бані юзера:", error);
        alert("Не вдалося заблокувати користувача. Спробуйте ще раз.");
    }
}

// Function to delete an idea
async function deleteIdea(ideaId) {
    try {
        const ideaRef = doc(firestore, "ideas", ideaId);
        await deleteDoc(ideaRef);

        // Update the cache without reloading all data
        cachedIdeas = cachedIdeas.filter(idea => idea.id !== ideaId);

        // Update ideas display after deletion
        displayIdea();
    } catch (error) {
        console.error("Помилка видалення ідеї:", error);
        alert("Не вдалося видалити ідею. Спробуйте ще раз.");
    }
}

export { displayIdea, setupBackButton, getIdeas, setupEventListeners, approveIdea, banUser, deleteIdea };

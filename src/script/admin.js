import { collection, getDocs, updateDoc, deleteDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
import { firestore } from './firebase.js';

let cachedIdeas = null; // Cache for ideas

// Event listener for when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    displayIdeas();
});

// Function to pin an idea
async function pinIdea(ideaId) {
    try {
        const ideaRef = doc(firestore, "ideas", ideaId);
        const ideaDoc = await getDoc(ideaRef);

        if (ideaDoc.exists()) {
            const isPinned = !ideaDoc.data().isPinned; // Toggle the current value of isPinned

            await updateDoc(ideaRef, { isPinned });
            alert("Ідея закріплена.");
        } else {
            console.error("Ідея не знайдена.");
        }
    } catch (error) {
        console.error("Помилка при закріпленні ідеї:", error);
        alert("Не вдалося закріпити ідею. Спробуйте ще раз.");
    }
}

// Function to fetch and display ideas
async function displayIdeas() {
    const ideas = await getIdeas();
    const ideaList = document.getElementById('idea-list');

    if (!ideaList) {
        console.error("Element with id 'idea-list' not found");
        return;
    }

    // Clear the existing list of ideas
    ideaList.innerHTML = '';

    // Iterate through each idea and create elements to display them
    ideas.forEach(idea => {
        const ideaElement = document.createElement('div');
        ideaElement.classList.add('idea', 'mt-2', 'flex', 'flex-col', 'cursor-pointer');
        ideaElement.dataset.id = idea.id; // Додати цей рядок

        // Determine background color based on upVotes and downVotes
        if (idea.upVotes > idea.downVotes) {
            ideaElement.classList.add('light-green'); // win
        } else if (idea.upVotes < idea.downVotes) {
            ideaElement.classList.add('red'); // defeat
        } else {
            ideaElement.classList.add('grey'); // draw
        }

        // Create and style the header for the idea
        const ideaHeader = document.createElement('div');
        ideaHeader.classList.add('idea-header', 'flex', 'justify-between', 'items-center', 'p-2', 'w-full');

        if (idea.upVotes > idea.downVotes) {
            ideaHeader.classList.add('mint-green'); // win
        } else if (idea.upVotes < idea.downVotes) {
            ideaHeader.classList.add('light-red'); // defeat
        } else {
            ideaHeader.classList.add('light-grey'); // draw
        }

        const ideaName = document.createElement('h2');
        ideaName.classList.add('idea-name');
        ideaName.textContent = idea.title;
        ideaHeader.appendChild(ideaName);
        ideaElement.appendChild(ideaHeader);

        // Create and style the body with date and votes
        const ideaBody = document.createElement('div');
        ideaBody.classList.add('idea-body', 'flex', 'justify-between', 'items-center', 'px-4', 'py-2');

        const ideaDate = document.createElement('span');
        ideaDate.classList.add('text-sm');
        ideaDate.textContent = new Date(idea.timestamp).toLocaleDateString();
        ideaBody.appendChild(ideaDate);

        const ideaVotes = document.createElement('span');
        ideaVotes.classList.add('arrow');
        ideaVotes.innerHTML = `<i class="fas fa-arrow-up"></i> ${idea.upVotes} <i class="fas fa-arrow-down"></i> ${idea.downVotes}`;
        ideaBody.appendChild(ideaVotes);
        ideaElement.appendChild(ideaBody);

        ideaList.appendChild(ideaElement);

        // Add event listener to display details on the panel
        ideaElement.addEventListener('click', () => displayIdeaInBar(idea));
    });

    // Add event listener to the pin idea button
    document.getElementById('pin-idea').addEventListener('click', () => {
        const ideaId = document.getElementById('modal-title').dataset.id;
        pinIdea(ideaId);
    });
    // Add event listener to the delete idea
    document.getElementById('delete-idea').addEventListener('click', () => {
        const ideaId = document.getElementById('modal-title').dataset.id;
        deleteIdea(ideaId);
    });
    // Add event listener to the ban user
    document.getElementById('user-ban').addEventListener('click', () => {
        const userId = document.getElementById('author').dataset.userId; 
        banUser(userId);
    });
}

// Function to retrieve ideas from Firestore
async function getIdeas() {
    if (cachedIdeas) {
        // If ideas are already cached, return them
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

// Function to display idea details in the panel
function displayIdeaInBar(idea) {
    const ideaModal = document.getElementById('idea-modal');
    const title = document.getElementById('modal-title');
    const author = document.getElementById('author');
    const description = document.getElementById('modal-description');

    title.textContent = idea.title;
    title.dataset.id = idea.id;  // Add dataset.id here
    author.textContent = idea.author;
    author.dataset.userId = idea.userId;  // Додати цей рядок
    description.textContent = idea.description;

    ideaModal.classList.remove('hidden');

    // Add event listener to hide the panel when clicking outside
    document.addEventListener('click', (event) => {
        if (!document.getElementById('bar').contains(event.target) && !event.target.closest('.idea')) {
            ideaModal.classList.add('hidden');
        }
    });
}

// Function to ban a user
async function banUser(userId) {
    try {
        const userRef = doc(firestore, "users", userId);
        await updateDoc(userRef, { isBanned: true });
        alert("Користувача заблоковано");
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

        //Reload page
        window.location.reload();
    } catch (error) {
        console.error("Помилка видалення ідеї:", error);
        alert("Не вдалося видалити ідею. Спробуйте ще раз.");
    }
}

export { displayIdeas, banUser, deleteIdea };

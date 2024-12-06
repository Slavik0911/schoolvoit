import { collection, getDocs, updateDoc, deleteDoc, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
import { firestore } from './firebase.js';

// Event listener for when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    displayIdeas();
});

// Function to fetch and display ideas
async function displayIdeas() {
    const ideas = await getIdeas();
    const ideaList = document.getElementById('idea-list');
    const bar = document.getElementById('bar'); // Extract the panel for the idea

    if (!ideaList) {
        console.error("Element with id 'idea-list' not found");
        return;
    }

    // Iterate through each idea and create elements to display them
    ideas.forEach(idea => {
        const ideaElement = document.createElement('div');
        ideaElement.classList.add('idea', 'mt-2', 'flex', 'flex-col', 'cursor-pointer');

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
        ideaElement.addEventListener('click', () => displayIdeaInBar(idea, bar));
    });
}

// Function to retrieve ideas from Firestore
async function getIdeas() {
    const querySnapshot = await getDocs(collection(firestore, "ideas"));
    const ideas = [];
    querySnapshot.forEach((doc) => {
        ideas.push({ id: doc.id, ...doc.data() });
    });
    return ideas;
}

// Function to display idea details in the panel
function displayIdeaInBar(idea, bar) {
    bar.classList.remove('hidden');
    bar.innerHTML = '';

    // Create and append title element
    const title = document.createElement('h1');
    title.id = 'modal-title';
    title.classList.add('text-2xl', 'mb-4');
    title.textContent = idea.title;
    bar.appendChild(title);

    // Create and append author element
    const author = document.createElement('h2');
    author.id = 'author';
    author.classList.add('modal-title', 'mb-4');
    author.textContent = idea.author;
    bar.appendChild(author);

    // Create and append description element
    const description = document.createElement('div');
    description.id = 'modal-description';
    description.classList.add('text-base', 'break-words', 'text-center', 'w-full', 'overflow-y-auto', 'h-[300px]');
    description.textContent = idea.description;
    bar.appendChild(description);

    // Create and append buttons for ban and delete
    const buttons = document.createElement('div');
    buttons.classList.add('flex', 'justify-between', 'w-full', 'mt-auto');

    const banButton = document.createElement('button');
    banButton.classList.add('void-button--small', 'red', 'h-[8vh]', 'rounded-2xl', 'text-[14px]', 'p-2');
    banButton.textContent = 'Забанити юзера';
    banButton.addEventListener('click', () => banUser(idea.userId)); // Add event listener for banning the user
    buttons.appendChild(banButton);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('void-button--small', 'red', 'h-[8vh]', 'rounded-2xl', 'text-[14px]', 'p-2');
    deleteButton.textContent = 'Видалити ідею';
    deleteButton.addEventListener('click', () => deleteIdea(idea.id)); // Add event listener for deleting the idea
    buttons.appendChild(deleteButton);

    bar.appendChild(buttons);

    // Add event listener to hide the panel when clicking outside
    document.addEventListener('click', (event) => {
        if (!bar.contains(event.target) && !event.target.closest('.idea')) {
            bar.classList.add('hidden');
        }
    });
}

// Function to ban a user
async function banUser(userId) {
    try {
        if (!userId) {
            throw new Error("У юзера нема ID");
        }

        const userRef = doc(firestore, "users", userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            throw new Error("Користувач не існує");
        }

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
        alert("Ідею видалено.");
        location.reload(); // Refresh the page to reflect changes
    } catch (error) {
        console.error("Помилка видалення ідеї:", error);
        alert("Не вдалося видалити ідею. Спробуйте ще раз.");
    }
}

export { displayIdeas, banUser, deleteIdea };

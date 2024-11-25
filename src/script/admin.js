import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
import { firestore } from './firebase.js';

document.addEventListener("DOMContentLoaded", () => {
    displayIdeas();
});

async function displayIdeas() {
    const ideas = await getIdeas();
    const ideaList = document.getElementById('idea-list');

    if (!ideaList) {
        console.error("Element with id 'idea-list' not found");
        return;
    }

    ideas.forEach(idea => {
        const ideaElement = document.createElement('div');

        // Background
        if (idea.upVotes > idea.downVotes) {
            ideaElement.classList.add('idea', 'mt-2', 'flex', 'flex-col', 'light-green'); // win
        } else if (idea.upVotes < idea.downVotes) {
            ideaElement.classList.add('idea', 'mt-2', 'flex', 'flex-col', 'red'); // defeat
        } else {
            ideaElement.classList.add('idea', 'mt-2', 'flex', 'flex-col', 'grey'); // draw
        }

        // Header
        const ideaHeader = document.createElement('div');

        if (idea.upVotes > idea.downVotes) {
            ideaHeader.classList.add('idea-header', 'mint-green'); // win
        } else if (idea.upVotes < idea.downVotes) {
            ideaHeader.classList.add('idea-header', 'light-red'); // defeat
        } else {
            ideaHeader.classList.add('idea-header', 'light-grey'); // draw
        }

        ideaElement.appendChild(ideaHeader);

        // Name
        const ideaName = document.createElement('h1');
        ideaName.classList.add('idea-name');
        ideaName.textContent = idea.title;
        ideaHeader.appendChild(ideaName);

        //body
        const ideaBody = document.createElement('div');
        ideaBody.classList.add('idea-body', 'flex', 'justify-between', 'items-center', 'px-4');
        ideaElement.appendChild(ideaBody);

        // Date
        const ideaDate = document.createElement('span');
        ideaDate.classList.add('text-[14px]');
        ideaDate.textContent = new Date(idea.timestamp).toLocaleDateString();
        ideaBody.appendChild(ideaDate);

        // Votes
        const ideaVotes = document.createElement('span');
        ideaVotes.classList.add('arrow');
        ideaVotes.innerHTML = `<i class="fas fa-arrow-up"></i> ${idea.upVotes} <i class="fas fa-arrow-down"></i> ${idea.downVotes}`;
        ideaBody.appendChild(ideaVotes);

        ideaList.appendChild(ideaElement);
    });
}

// Get ideas function
async function getIdeas() {
    const querySnapshot = await getDocs(collection(firestore, "ideas"));
    const ideas = [];
    querySnapshot.forEach((doc) => {
        ideas.push({ id: doc.id, ...doc.data() });
    });
    return ideas;
}

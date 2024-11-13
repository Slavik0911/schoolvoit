// Import Firestore functions
import { collection, addDoc, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
import { firestore } from './firebase.js';

// Function to submit an idea to the database
async function submitIdea(title, description) {
  try {
    const ideasCollection = collection(firestore, "ideas");
    await addDoc(ideasCollection, {
      title: title,
      description: description,
      timestamp: new Date().toISOString(),
      voteRate: 0 // Add an initial vote rate
    });
    alert("Ідея успішно дадана!");
    window.location.href = 'order.html';
  } catch (error) {
    console.error("Error adding idea:", error);
    alert("Failed to add idea. Please try again.");
  }
}

// Function to get a random idea that has not been voted on yet
async function getRandomIdea(title_random, description_random) {
  try {
    const votedIdeas = JSON.parse(localStorage.getItem('votedIdeas')) || [];
    const ideasCollection = collection(firestore, "ideas");
    const snapshot = await getDocs(ideasCollection);
    const ideas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Filter out ideas that have already been voted on
    const filteredIdeas = ideas.filter(idea => !votedIdeas.includes(idea.id));

    if (filteredIdeas.length > 0) {
      const randomIdea = filteredIdeas[Math.floor(Math.random() * filteredIdeas.length)];
      title_random.textContent = randomIdea.title;
      description_random.textContent = randomIdea.description;
      title_random.dataset.ideaId = randomIdea.id;
    } else {
      title_random.textContent = "Немає доступних ідей.";
      description_random.textContent = "";
    }
  } catch (error) {
    console.error("Помилка при отриманні ідеї:", error);
    title_random.textContent = "Помилка завантаження ідеї.";
    description_random.textContent = "";
  }
}

// Function to handle voting
async function voteIdea(voteType) {
  const ideaId = document.getElementById('title-random').dataset.ideaId;
  if (!ideaId) return;

  const votedIdeas = JSON.parse(localStorage.getItem('votedIdeas')) || [];
  if (!votedIdeas.includes(ideaId)) {
    votedIdeas.push(ideaId);
    localStorage.setItem('votedIdeas', JSON.stringify(votedIdeas));

    // Get the idea document and update the vote rate
    const ideaDoc = doc(firestore, "ideas", ideaId);
    try {
      // Update the vote rate based on the vote type
      const snapshot = await getDocs(collection(firestore, "ideas"));
      const currentIdea = snapshot.docs.find(doc => doc.id === ideaId);
      let currentVoteRate = currentIdea.data().voteRate || 0;

      if (voteType === 'upvote') {
        currentVoteRate += 1;
      } else if (voteType === 'downvote') {
        currentVoteRate -= 1;
      }

      await updateDoc(ideaDoc, { voteRate: currentVoteRate });
    } catch (error) {
      console.error("Error updating vote rate:", error);
    }
  }

  // Update the display with a new idea
  const title_random = document.getElementById('title-random');
  const description_random = document.getElementById('description-random');
  getRandomIdea(title_random, description_random);
}

export { submitIdea, getRandomIdea, voteIdea };

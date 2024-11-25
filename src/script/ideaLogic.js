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
      upVotes: 0,  // Add initial upvote count
      downVotes: 0 // Add initial downvote count
    });
    alert("Ідея успішно додана!");
    window.location.href = 'order.html';
  } catch (error) {
    console.error("Error adding idea:", error);
    alert("Failed to add idea. Please try again.");
  }
}

// Function to get the latest idea that has not been voted on yet
async function getLatestIdea(title_random, description_random) {
  try {
    const votedIdeas = JSON.parse(localStorage.getItem('votedIdeas')) || [];
    const ideasCollection = collection(firestore, "ideas");
    const snapshot = await getDocs(ideasCollection);
    const ideas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Sort ideas by timestamp (newest first)
    ideas.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Filter out ideas that have already been voted on
    const filteredIdeas = ideas.filter(idea => !votedIdeas.includes(idea.id));

    // Display the latest idea
    if (filteredIdeas.length > 0) {
      const latestIdea = filteredIdeas[0]; // Take the first (newest) idea
      title_random.textContent = latestIdea.title;
      description_random.textContent = latestIdea.description;
      title_random.dataset.ideaId = latestIdea.id;
    } else {
      title_random.textContent = "No available ideas.";
      description_random.textContent = "";
    }
  } catch (error) {
    console.error("Error getting idea:", error);
    title_random.textContent = "Error loading idea.";
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

    const ideaDoc = doc(firestore, "ideas", ideaId);
    try {
      // Get the current values ​​of upVotes and downVotes
      const snapshot = await getDocs(collection(firestore, "ideas"));
      const currentIdea = snapshot.docs.find(doc => doc.id === ideaId);
      let currentUpVotes = currentIdea.data().upVotes || 0;
      let currentDownVotes = currentIdea.data().downVotes || 0;

      // We update voting depending on the type
      if (voteType === 'upvote') {
        currentUpVotes += 1;
      } else if (voteType === 'downvote') {
        currentDownVotes += 1;
      }

      // Update the document in the database
      await updateDoc(ideaDoc, {
        upVotes: currentUpVotes,
        downVotes: currentDownVotes
      });

      //Update the display of ideas with new voices
      const title_random = document.getElementById('title-random');
      const description_random = document.getElementById('description-random');
      getLatestIdea(title_random, description_random);

    } catch (error) {
      console.error("Error updating vote counts:", error);
    }
  }
}

export { submitIdea, getLatestIdea, voteIdea };

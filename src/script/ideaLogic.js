// Import Firestore functions
import { collection, addDoc, setDoc, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
import { firestore } from './firebase.js';
import { getDoc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";

// Function to get a unique user ID
function getUserId() {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = crypto.randomUUID(); // Generate a new unique ID
    localStorage.setItem("userId", userId); // Store it for future use
  }
  return userId;
}

// Check if a user is banned
async function isUserBanned(userId) {
  const userRef = doc(firestore, "users", userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists() && userDoc.data().isBanned) {
    return true;
  }
  return false;
}

// Function to create a user if they do not exist
async function createUser(userId) {
  const userRef = doc(firestore, "users", userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await setDoc(userRef, { isBanned: false });
  }
}

// Function to submit an idea to the database
async function submitIdea(title, description, author) {
  try {
    const userId = getUserId(); // Get user ID

    // Check if the user is banned
    const banned = await isUserBanned(userId);
    if (banned) {
      alert("Ви заблоковані та не можете надсилати ідеї.");
      return;
    }

    // Save the idea to Firestore
    const ideasCollection = collection(firestore, "ideas");
    await addDoc(ideasCollection, {
      title: title,
      description: description,
      author: author || 'Анонім',
      userId: userId, // Save user ID with the idea
      timestamp: new Date().toISOString(),
      upVotes: 0,
      downVotes: 0
    });

    alert("Ідея успішно додана!");
    window.location.href = 'order.html';
  } catch (error) {
    console.error("Помилка додавання ідеї:", error);
    alert("Не вдалося додати ідею. Спробуйте ще раз.");
  }
}

// Function to get the latest idea that has not been voted on yet
async function getLatestIdea(title_last, description_last) {
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
      title_last.textContent = latestIdea.title;
      description_last.textContent = latestIdea.description;
      title_last.dataset.ideaId = latestIdea.id;
    } else {
      title_last.textContent = "No available ideas.";
      description_last.textContent = "";
    }
  } catch (error) {
    console.error("Error getting idea:", error);
    title_last.textContent = "Error loading idea.";
    description_last.textContent = "";
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

      // Update the display of ideas with new votes
      const title_last = document.getElementById('title-random');
      const description_last = document.getElementById('description-random');
      getLatestIdea(title_last, description_last);

    } catch (error) {
      console.error("Error updating vote counts:", error);
    }
  }
}

export { submitIdea, getLatestIdea, voteIdea, createUser, getUserId };
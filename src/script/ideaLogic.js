// Import Firestore functions
import { collection, addDoc, getDocs, updateDoc, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
import { firestore } from './firebase.js';

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

      // Get the current date and time
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

      // Check if the user has submitted 3 ideas in the last 24 hours
      const userIdeasCollection = collection(firestore, "ideas");
      const userIdeasSnapshot = await getDocs(userIdeasCollection);
      const userIdeas = userIdeasSnapshot.docs.filter(doc => doc.data().userId === userId && new Date(doc.data().timestamp) > last24Hours);

      if (userIdeas.length >= 3) {
          alert("Ви можете подати лише три ідеї на день.");
          return;
      }

      // Save the idea to Firestore
      const ideasCollection = collection(firestore, "ideas");
      await addDoc(ideasCollection, {
          title: title,
          description: description,
          author: author || 'Анонім',
          userId: userId, // Save user ID with the idea
          timestamp: now.toISOString(),
          isApproved: false, // Idea initially needs approval
          upVotes: 0,
          downVotes: 0,
          isPinned: false // Default value for isPinned
      });

      alert("Ідею подано на модерацію.");
      window.location.href = 'index.html';
  } catch (error) {
      console.error("Помилка додавання ідеї:", error);
      alert("Не вдалося додати ідею. Спробуйте ще раз.");
  }
}


// Function to get the latest idea that has not been voted on yet and is approved
async function getLatestIdea(title_last, description_last) {
  try {
      const votedIdeas = JSON.parse(localStorage.getItem('votedIdeas')) || [];
      const ideasCollection = collection(firestore, "ideas");
      const snapshot = await getDocs(ideasCollection);
      const ideas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Sort ideas by isPinned and timestamp, filter out unapproved and already voted ideas
      const filteredIdeas = ideas
          .filter(idea => idea.isApproved && !votedIdeas.includes(idea.id)) // Only approved ideas
          .sort((a, b) => {
              if (a.isPinned === b.isPinned) {
                  return new Date(b.timestamp) - new Date(a.timestamp);
              }
              return a.isPinned ? -1 : 1;
          });

      // Display the latest idea
      if (filteredIdeas.length > 0) {
          const latestIdea = filteredIdeas[0]; // Take the first (newest or pinned) idea
          title_last.textContent = latestIdea.title;
          description_last.textContent = latestIdea.description;
          title_last.dataset.ideaId = latestIdea.id;
      } else {
          title_last.textContent = "Ідеї закінчились";
          description_last.textContent = "Подавайте свої";
      }
  } catch (error) {
      console.error("Error getting idea:", error);
      title_last.textContent = "Помилка завантаження.";
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

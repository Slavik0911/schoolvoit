import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
import { firestore } from './firebase.js';

// Function for adding an idea to DB
async function submitIdea(title, description) {
  try {
    const ideasCollection = collection(firestore, "ideas");
    await addDoc(ideasCollection, {
      title: title,
      description: description,
      timestamp: new Date().toISOString(),
    });
    alert("Ідея успішно додана!");
    window.location.href = 'order.html';
  } catch (error) {
    console.error("Помилка при додаванні ідеї:", error);
    alert("Не вдалося додати ідею. Спробуйте ще раз.");
  }
}

// A feature to get a random idea from DB
async function getRandomIdea(title_random, description_random) {
  try {
    const ideasCollection = collection(firestore, "ideas");
    const snapshot = await getDocs(ideasCollection);
    const ideas = snapshot.docs.map(doc => doc.data());
    
    if (ideas.length > 0) {
      const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
      title_random.textContent = randomIdea.title;
      description_random.textContent = randomIdea.description;
    } else {
      title_random.textContent = "Немає доступних ідей.";
      description_random.textContent = "";
    }//error handler
  } catch (error) {
    console.error("Помилка при отриманні ідеї:", error);
    title_random.textContent = "Помилка завантаження ідеї.";
    description_random.textContent = "";
  }
}

export { submitIdea, getRandomIdea };

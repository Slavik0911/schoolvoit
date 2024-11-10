import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
import { firestore } from './firebase.js';

// Функція для додавання ідеї в БД
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

// Функція для отримання випадкової ідеї, яка ще не була проголосована
async function getRandomIdea(title_random, description_random) {
  try {
    const votedIdeas = JSON.parse(localStorage.getItem('votedIdeas')) || [];
    const ideasCollection = collection(firestore, "ideas");
    const snapshot = await getDocs(ideasCollection);
    const ideas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Фільтруємо ідеї, які вже були проголосовані
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

// Функція для голосування
function voteIdea(voteType) {
  const ideaId = document.getElementById('title-random').dataset.ideaId;
  if (!ideaId) return;

  // Зберігаємо ідентифікатор ідеї в Local Storage
  const votedIdeas = JSON.parse(localStorage.getItem('votedIdeas')) || [];
  if (!votedIdeas.includes(ideaId)) {
    votedIdeas.push(ideaId);
    localStorage.setItem('votedIdeas', JSON.stringify(votedIdeas));
  }

  // Показуємо нову ідею після голосування
  const title_random = document.getElementById('title-random');
  const description_random = document.getElementById('description-random');
  getRandomIdea(title_random, description_random);
}

export { submitIdea, getRandomIdea, voteIdea };

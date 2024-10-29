// Initialize flashcards from localStorage or start with an empty array
let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];

// Utility function to save flashcards to localStorage
function saveFlashcards() {
    try {
        localStorage.setItem("flashcards", JSON.stringify(flashcards));
    } catch (error) {
        console.error("Failed to save flashcards:", error);
    }
}

// Utility function to update the displayed flashcards list
function updateFlashcardList() {
    const flashcardsList = document.getElementById("flashcardsList");
    if (!flashcardsList) return;  // Prevent errors if element not found

    flashcardsList.innerHTML = "";  // Clear the list

    flashcards.forEach((flashcard, index) => {
        const li = document.createElement("li");
        li.textContent = `${flashcard.word} - ${flashcard.meaning}`;

        // Add a remove button for each flashcard
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", () => removeFlashcard(index));

        li.appendChild(removeBtn);
        flashcardsList.appendChild(li);
    });
}

// Add a new flashcard and save it to localStorage
function addFlashcard(word, meaning) {
    if (!word || !meaning) return;
    flashcards.push({ word, meaning });
    saveFlashcards();
    updateFlashcardList();
}

// Remove a flashcard by index
function removeFlashcard(index) {
    if (index >= 0 && index < flashcards.length) {
        flashcards.splice(index, 1);
        saveFlashcards();
        updateFlashcardList();
    }
}

// Load flashcards on page load
document.addEventListener("DOMContentLoaded", updateFlashcardList);

// Event listener for the flashcard form
const flashcardForm = document.getElementById("flashcardForm");
if (flashcardForm) {
    flashcardForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const word = document.getElementById("word").value.trim();
        const meaning = document.getElementById("meaning").value.trim();
        addFlashcard(word, meaning);
        flashcardForm.reset();
    });
}


// Quiz initialization
const startQuizButton = document.getElementById("startQuizButton");
if (startQuizButton) {
    startQuizButton.addEventListener("click", () => {
        if (flashcards.length < 4) {
            alert("Please add at least 4 flashcards to start the quiz.");
            return;
        }
        document.getElementById("quizSection").style.display = "block";
        generateQuiz();
    });
}

// Generate quiz question
function generateQuiz() {
    const correctIndex = Math.floor(Math.random() * flashcards.length);
    const correctFlashcard = flashcards[correctIndex];
    document.getElementById("question").textContent = `What is the meaning of "${correctFlashcard.word}"?`;

    const choices = flashcards
        .filter((_, index) => index !== correctIndex)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    choices.push(correctFlashcard);
    choices.sort(() => 0.5 - Math.random());

    const choicesList = document.getElementById("choices");
    choicesList.innerHTML = "";  // Clear previous choices

    choices.forEach(choice => {
        const li = document.createElement("li");
        li.textContent = choice.meaning;
        li.addEventListener("click", () => checkAnswer(choice === correctFlashcard, correctFlashcard.meaning));
        choicesList.appendChild(li);
    });
}

// Check user's answer
function checkAnswer(isCorrect, correctAnswer) {
    const quizMessage = document.getElementById("quizMessage");
    quizMessage.textContent = isCorrect ? "Correct!" : `Incorrect! The correct answer was "${correctAnswer}".`;
    setTimeout(generateQuiz, 2000);  // Generate next question after 2 seconds
}
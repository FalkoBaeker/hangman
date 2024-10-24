// Import confetti library
import confetti from "https://cdn.skypack.dev/canvas-confetti";

// List of possible words
const words = [
    "about", "apple", "aunt", "away", "bash", "back", "before", "box", "buy",
    "csharp", "cake", "chair", "circle", "come", "dart", "dance", "deep",
    "die", "drop", "elixir", "each", "empty", "ever", "eye", "fortran",
    "face", "fever", "firm", "fork", "golang", "gate", "gift", "gold",
    "gun", "haskell", "hair", "hurt", "head", "hen", "ink", "isle", "iron",
    "ice", "javascript", "java", "junk", "jam", "juice", "jug", "kotlin",
    "kill", "knee", "knife", "know", "lua", "long", "last", "light", "lame",
    "matlab", "moon", "milk", "mad", "meal", "native", "negro", "news",
    "nice", "ocaml", "off", "old", "over", "oil", "python", "pain",
    "price", "pen", "pull", "php", "quick", "queen", "queer", "rust",
    "rain", "rice", "run", "ruby", "repair", "spell", "scala", "skin",
    "swift", "story", "solidity", "soup", "true", "thin", "typescript",
    "tilte", "toe", "ugly", "use", "unit", "voice", "visit", "water",
    "wasm", "walk", "wife", "wire", "yard", "yell", "young", "zoo", "zero",
];

// ============================================================
// DOM Element Selectors
const keyboardBtns = document.querySelectorAll(".keyboard-btn");
const triesDiv = document.querySelector(".tries");
const startButton = document.querySelector("#start");
const main = document.querySelector(".main");
const mainDiv = document.querySelector(".inner-main");
const img = document.querySelector("#hangman");
const startGame = document.querySelector("#start-game");
const hintModal = document.querySelector("#modal-hint");
const tries0Modal = document.querySelector("#modal-tries0");
const winModal = document.querySelector("#modal-win");
const loseModal = document.querySelector("#modal-lose");
const secretWord = document.querySelector("#secret-word");
const aboutModal = document.querySelector("#modal-about");
const hintButton = document.querySelector("#hint"); // Cached for easier access

// Game State Variables
let blocks = null; // DOM elements representing each letter block
let originalWord = []; // The original word as an array of letters
let remainingLetters = new Set(); // Unique letters remaining to guess
let tries = 0; // Current number of tries left
let totalTries = 0; // Total number of tries allowed
let firstTime = true; // Indicates if it's the first hint

// Initial Setup: Disable all letter buttons and the hint button
disableBtns();

// Add event listeners to letter buttons
keyboardBtns.forEach((key) => {
    const letter = key.getAttribute("id").toLowerCase(); // Ensure lowercase
    key.addEventListener("click", () => handleLetterClick(letter));
});

// Add event listener to the start button
startButton.addEventListener("click", startNewGame);

// Function to handle letter button clicks
function handleLetterClick(letter) {
    // Debugging: Log the clicked letter and current state
    console.log(`Clicked letter: ${letter}`);
    console.log(`Remaining letters:`, Array.from(remainingLetters));
    console.log(`Tries left: ${tries}`);

    if (tries <= 0 || remainingLetters.size === 0) return; // Prevent actions if game over

    const button = document.querySelector(`#${letter}`);
    if (!button) {
        console.error(`Button with ID '${letter}' not found.`);
        return;
    }

    const isMatch = originalWord.includes(letter);

    if (isMatch) {
        // Reveal all instances of the letter
        let lettersRevealed = 0;
        blocks.forEach((block) => {
            if (block.getAttribute('data-letter') === letter && !block.classList.contains("visible")) {
                block.classList.add("visible");
                block.textContent = letter.toUpperCase(); // Show the letter
                lettersRevealed++;
            }
        });

        // Remove the letter from remainingLetters to prevent further matches
        remainingLetters.delete(letter);
        console.log(`Letter '${letter}' is a match! Revealed ${lettersRevealed} instances.`);
    } else {
        // Handle incorrect guess
        button.classList.add("fail");
        decTries();
        updateTriesDisplay();
        updateHangmanImage();
        console.log(`Letter '${letter}' is not in the word. Tries left: ${tries}`);
    }

    // Disable the button after click
    button.disabled = true;
    button.classList.add('disabled');

    // Check win or lose conditions
    checkWinLose();
}

// Function to start a new game
function startNewGame() {
    console.log("Starting a new game...");
    disableStart();
    enableBtns();
    resetGameState();
    generateWordBlocks();
    setTries();
    firstTime = true; // Reset hint state for new game
}

// Function to reset the game state
function resetGameState() {
    tries = 0;
    totalTries = 0;
    remainingLetters.clear();
    secretWord.innerHTML = "";
    clearFails();
    clearMainDiv();
    updateTriesDisplay();
    img.src = "./assets/images/0.png"; // Reset hangman image
    console.log("Game state has been reset.");
}

// Function to generate word blocks in the DOM
function generateWordBlocks() {
    originalWord = getRndWord();
    remainingLetters = new Set(originalWord); // Initialize remainingLetters with unique letters

    console.log(`Selected word: ${originalWord.join("")}`);
    console.log(`Unique letters to guess:`, Array.from(remainingLetters));

    // Create divs for each letter in the word
    originalWord.forEach((letter, index) => {
        const div = document.createElement("div");
        div.classList.add(`main-block`);
        div.classList.add(`val-${letter}`);
        div.setAttribute("id", `letter-${index}`);
        div.setAttribute('data-letter', letter);
        div.textContent = "_"; // Initially hide the letters
        mainDiv.appendChild(div);
    });

    blocks = document.querySelectorAll(".main-block");
}

// Utility Functions

// Function to generate a random number between min and max (inclusive)
function getRnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to select a random word from the words array
function getRndWord() {
    const selectedWord = words[getRnd(0, words.length - 1)].toLowerCase().split("");
    if (selectedWord.length >= 7 && window.innerWidth <= 768) {
        main.style.height = "140px";
    }
    return selectedWord;
}

// Function to update the tries display
function updateTriesDisplay() {
    triesDiv.innerHTML = `Tries: ${tries} out of ${totalTries} tries left`;
}

// Function to handle hints
hintButton.addEventListener("click", handleHint);

function handleHint() {
    if (tries <= 0 || remainingLetters.size === 0) {
        console.log("Cannot take a hint. Either game is over or no letters left to guess.");
        return; // Prevent hints if game over
    }

    if (firstTime && tries > 2) {
        console.log("Opening hint modal.");
        openHintModal();
    } else if (tries > 2) {
        console.log("Revealing a random letter as an additional hint.");
        revealRandomLetter();
        decTries(2); // Deduct 2 tries for additional hints
        updateTriesDisplay();
        updateHangmanImage();
    } else {
        console.log("Not enough tries left to take a hint.");
        openTries0Modal();
    }
}

// Function to reveal a random hidden letter
function revealRandomLetter() {
    // Filter remaining letters to ensure we pick only from them
    const availableLetters = Array.from(remainingLetters);
    if (availableLetters.length === 0) return;

    const randomIndex = getRnd(0, availableLetters.length - 1);
    const randomLetter = availableLetters[randomIndex];
    console.log(`Revealing random letter: '${randomLetter}'`);
    handleLetterClick(randomLetter);
}

// Function to set the initial number of tries
function setTries() {
    totalTries = Math.max(originalWord.length, 6); // Ensure a minimum number of tries
    tries = totalTries;
    updateTriesDisplay();
    console.log(`Total tries set to ${totalTries}`);
}

// Function to decrement tries
function decTries(amount = 1) {
    tries -= amount;
    if (tries < 0) tries = 0;
    console.log(`Tries decremented by ${amount}. Tries left: ${tries}`);
}

// Function to disable the start button
function disableStart() {
    startButton.disabled = true;
    startButton.classList.add("start-fail");
    console.log("Start button disabled.");
}

// Function to enable the start button
function enableStart() {
    startButton.disabled = false;
    startButton.classList.remove("start-fail");
    console.log("Start button enabled.");
}

// Function to disable all letter buttons and the hint button
function disableBtns() {
    keyboardBtns.forEach(button => {
        button.disabled = true;
        button.classList.add("disabled");
    });
    if (hintButton) {
        hintButton.disabled = true;
        hintButton.classList.add("disabled");
    }
    console.log("All letter buttons and hint button disabled.");
}

// Function to enable all letter buttons and the hint button
function enableBtns() {
    keyboardBtns.forEach(button => {
        button.disabled = false;
        button.classList.remove("disabled", "fail"); // Reset disabled and fail classes
    });
    if (hintButton) {
        hintButton.disabled = false;
        hintButton.classList.remove("disabled");
    }
    console.log("All letter buttons and hint button enabled.");
}

// Function to clear fail and disabled classes from letter buttons
function clearFails() {
    keyboardBtns.forEach(button => {
        button.classList.remove("fail", "disabled");
        button.disabled = false;
    });
    console.log("Fail and disabled classes cleared from all letter buttons.");
}

// Function to clear the main word display
function clearMainDiv() {
    mainDiv.innerHTML = "";
    main.style.height = ""; // Reset height
    console.log("Main word display cleared.");
}

// Function to update the hangman image based on remaining tries
function updateHangmanImage() {
    const percent = (tries / totalTries) * 100;
    console.log(`Updating hangman image. Tries left: ${tries}, Percent: ${percent}%`);

    if (percent > 71.5 && percent <= 87.75) {
        img.src = "./assets/images/1.png";
    } else if (percent > 57.25 && percent <= 71.5) {
        img.src = "./assets/images/2.png";
    } else if (percent > 43 && percent <= 57.25) {
        img.src = "./assets/images/3.png";
    } else if (percent > 28.75 && percent <= 43) {
        img.src = "./assets/images/4.png";
    } else if (percent > 14.5 && percent <= 28.75) {
        img.src = "./assets/images/5.png";
    } else if (percent <= 14.5) {
        img.src = "./assets/images/6.png";
    } else {
        img.src = "./assets/images/0.png"; // Default image
    }
}

// Function to check win or lose conditions
function checkWinLose() {
    if (tries <= 0) {
        // Player has lost
        console.log("Player has lost the game.");
        revealSecretWord();
        openLoseModal();
        setTimeout(() => {
            closeLoseModal();
            resetAfterGameOver();
        }, 2500);
    } else if (remainingLetters.size === 0) {
        // Player has won
        console.log("Player has won the game!");
        triggerConfetti();
        openWinModal();
        setTimeout(() => {
            closeWinModal();
            resetAfterGameOver();
        }, 3000);
    }
}

// Function to reveal the secret word upon losing
function revealSecretWord() {
    secretWord.innerHTML = `Secret word was "<strong>${originalWord.join("").toUpperCase()}</strong>"`;
    console.log("Secret word revealed.");
}

// Function to reset the game after win or lose
function resetAfterGameOver() {
    console.log("Resetting game after win/lose.");
    resetGameState();
    disableBtns();
    enableStart();
}

// Function to trigger confetti on win
function triggerConfetti() {
    console.log("Triggering confetti!");
    confetti({
        particleCount: 200,
        scalar: 1.175,
        angle: 60,
        gravity: 0.75,
        spread: 70,
        origin: { x: 0 },
    });
    confetti({
        particleCount: 200,
        scalar: 1.175,
        angle: 120,
        gravity: 0.75,
        spread: 70,
        origin: { x: 1 },
    });
}

// ================== Modal Functions =====================

// Function to open hint modal
function openHintModal() {
    hintModal.showModal();
    console.log("Hint modal opened.");
}

// Function to close hint modal
document.querySelector("#close-hint").addEventListener("click", closeHintModal);
function closeHintModal() {
    hintModal.close();
    console.log("Hint modal closed.");
}

// Function to open tries0 modal
function openTries0Modal() {
    tries0Modal.showModal();
    console.log("Tries0 modal opened.");
    setTimeout(() => {
        closeTries0Modal();
    }, 1500); // Extended time for better user experience
}

// Function to close tries0 modal
function closeTries0Modal() {
    tries0Modal.close();
    console.log("Tries0 modal closed.");
}

// Function to open win modal
function openWinModal() {
    winModal.showModal();
    console.log("Win modal opened.");
}

// Function to close win modal
function closeWinModal() {
    winModal.close();
    console.log("Win modal closed.");
}

// Function to open lose modal
function openLoseModal() {
    loseModal.showModal();
    console.log("Lose modal opened.");
}

// Function to close lose modal
function closeLoseModal() {
    loseModal.close();
    console.log("Lose modal closed.");
}

// Function to open about modal
document.querySelector("#open-about").addEventListener("click", () => {
    aboutModal.showModal();
    console.log("About modal opened.");
});

// Function to close about modal
document.querySelector("#close-about").addEventListener("click", () => {
    aboutModal.close();
    console.log("About modal closed.");
});

// Function to handle taking a hint
document.querySelector("#take-hint").addEventListener("click", applyHint);
function applyHint() {
    console.log("Applying hint.");
    firstTime = false;
    closeHintModal();
    revealRandomLetter();
    decTries(2); // Deduct 2 tries for taking a hint
    updateTriesDisplay();
    updateHangmanImage();
}

// ============================================================
// End of Hangman Game Code

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

// Game State Variables
let blocks = null;
let dupWord = [];
let currentWord = [];
let tries = 0;
let totalTries = 0;
let firstTime = true;

// Initialize the game by disabling buttons
disableBtns();

// Add event listeners to letter buttons
keyboardBtns.forEach((key) => {
    key.addEventListener("click", () => play(key.getAttribute("id")));
});

// Add event listener to the start button
startButton.addEventListener("click", () => {
    disableStart();
    enableBtns();
    clearFails();
    clearMainDiv();
    genWordBlocks();
    setTries();
});

// Function to handle letter button clicks
function play(id) {
    if (tries > 0) {
        const button = document.querySelector(`#${id}`);
        const isMatch = currentWord.includes(id);
        let revealed = false;

        if (isMatch) {
            // Reveal all instances of the letter
            blocks.forEach((block) => {
                if (block.textContent === id && !block.classList.contains("visible")) {
                    block.classList.add("visible");
                    revealed = true;
                }
            });

            // Remove all instances from currentWord to prevent further matches
            currentWord = currentWord.filter(letter => letter !== id);
        } else {
            // Handle incorrect guess
            button.classList.add("fail");
            decTries();
            triesDiv.innerHTML = `Tries: ${tries} out of ${totalTries} tries left`;
            setImg();
        }

        // Disable the button after click
        button.disabled = true;
        button.classList.add('disabled');

        winLose();
    }
}

// Utility Functions

// Function to generate a random number between min and max (inclusive)
function getRnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to select a random word from the words array
function getRndWord() {
    const selectedWord = words[getRnd(0, words.length - 1)].split("");
    if (selectedWord.length >= 7 && window.innerWidth <= 768) {
        main.style.height = "140px";
    }
    return selectedWord;
}

// Function to generate word blocks in the DOM
function genWordBlocks() {
    currentWord = getRndWord();
    dupWord = [...currentWord];

    // Create divs for each letter in the word
    currentWord.forEach((letter, index) => {
        const div = document.createElement("div");
        div.classList.add(`main-block`);
        div.classList.add(`val-${letter}`);
        div.setAttribute("id", `letter-${index}`);
        div.innerHTML = "_"; // Initially hide the letters
        mainDiv.appendChild(div);
    });

    blocks = document.querySelectorAll(".main-block");
}

// Function to handle hints
document.querySelector("#hint").addEventListener("click", hint);
function hint() {
    if (firstTime && tries > 2) {
        openHint();
    } else if (tries > 2 && !firstTime) {
        const hiddenBlocks = Array.from(blocks).filter(block => !block.classList.contains("visible"));
        if (hiddenBlocks.length > 0) {
            const randomBlock = hiddenBlocks[getRnd(0, hiddenBlocks.length - 1)];
            const letter = randomBlock.textContent.toLowerCase();
            play(letter);
            tries -= 2;
            triesDiv.innerHTML = `Tries: ${tries} out of ${totalTries} tries left`;
            setImg();
        }
    } else if (tries <= 2) {
        tries0();
    }
}

// Function to reset the game state
function resetAll() {
    tries = 0;
    triesDiv.innerHTML = "";
    startGame.innerHTML = "Play Again";
    img.src = "./assets/images/0.png";
    currentWord = [];
    dupWord = [];
    clearFails();
    clearMainDiv();
    enableStart();
}

// Function to clear fail classes from letter buttons
function clearFails() {
    for (let i = 97; i < 123; i++) {
        const letter = String.fromCharCode(i);
        const button = document.querySelector(`#${letter}`);
        if (button) {
            button.classList.remove("fail");
        }
    }
}

// Function to clear the main word display
function clearMainDiv() {
    mainDiv.innerHTML = "";
    main.style.height = ""; // Reset height
}

// Function to update the hangman image based on remaining tries
function setImg() {
    const percent = (tries / totalTries) * 100;
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
    }
}

// Function to set the initial number of tries
function setTries() {
    tries = currentWord.length;
    totalTries = currentWord.length;
    triesDiv.innerHTML = `Tries: ${tries} out of ${totalTries} tries left`;
}

// Function to decrement tries
function decTries() {
    tries -= 1;
}

// Function to disable the start button
function disableStart() {
    startButton.disabled = true;
    startButton.classList.add("start-fail");
}

// Function to enable the start button
function enableStart() {
    startButton.disabled = false;
    startButton.classList.remove("start-fail");
}

// Function to disable all letter buttons and the hint button
function disableBtns() {
    keyboardBtns.forEach(button => {
        button.disabled = true;
        button.classList.add("disabled");
    });
    document.querySelector(".hint").disabled = true;
    document.querySelector(".hint").classList.add("disabled");
}

// Function to enable all letter buttons and the hint button
function enableBtns() {
    keyboardBtns.forEach(button => {
        button.disabled = false;
        button.classList.remove("disabled");
    });
    document.querySelector(".hint").disabled = false;
    document.querySelector(".hint").classList.remove("disabled");
}

// Function to check win or lose conditions
function winLose() {
    if (tries === 0) {
        // Player has lost
        secretWord.innerHTML = `Secret word was "${dupWord.join("")}"`;
        openLose();
        setTimeout(() => {
            hideTries();
            closeLose();
            resetAll();
            disableBtns();
        }, 2500);
    } else if (document.querySelectorAll(".visible").length === dupWord.length) {
        // Player has won
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
        openWin();
        setTimeout(() => {
            hideTries();
            closeWin();
            resetAll();
            disableBtns();
        }, 3000);
    }
}

// Function to hide the tries div
function hideTries() {
    const triesElement = document.querySelector(".tries");
    if (triesElement) {
        triesElement.style.display = "none";
    }
}

// ================== Modal Functions =====================

// Function to open hint modal
function openHint() {
    hintModal.showModal();
}

// Function to close hint modal
document.querySelector("#close-hint").addEventListener("click", closeHint);
function closeHint() {
    hintModal.close();
}

// Function to open tries0 modal
function openTries0() {
    tries0Modal.showModal();
}

// Function to close tries0 modal
function closeTries0() {
    tries0Modal.close();
}

// Function to open win modal
function openWin() {
    winModal.showModal();
}

// Function to close win modal
function closeWin() {
    winModal.close();
}

// Function to open lose modal
function openLose() {
    loseModal.showModal();
}

// Function to close lose modal
function closeLose() {
    loseModal.close();
}

// Function to open about modal
document.querySelector("#open-about").addEventListener("click", () => {
    aboutModal.showModal();
});

// Function to close about modal
document.querySelector("#close-about").addEventListener("click", () => {
    aboutModal.close();
});

// Function to handle taking a hint
document.querySelector("#take-hint").addEventListener("click", setFirstTimeFalse);
function setFirstTimeFalse() {
    firstTime = false;
    closeHint();
    hint();
}

// Function to handle when player has not enough tries
function tries0() {
    openTries0();
    setTimeout(() => {
        closeTries0();
    }, 1000);
}

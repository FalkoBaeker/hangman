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
let selectedWord = [];
let tries = 0;
let totalTries = null;
let firstTime = true;

// Initial Setup
disableBtns();

// Add event listeners to letter buttons
keyboardBtns.forEach((key) => {
    key.addEventListener("click", () => play(key.getAttribute("id")));
});

// Start button event listener
startButton.addEventListener("click", () => {
    disableStart();
    enableBtns();
    clearFails();
    clearMainDiv();
    generateWordBlocks();
    setTries();
});

// Main game play function
function play(letter) {
    if (tries <= 0) return;
    
    const button = document.querySelector(`#${letter}`);
    if (!button) return;
    
    // Disable the button immediately after click
    button.disabled = true;
    
    const matches = getAllIndices(selectedWord, letter);
    
    if (matches.length > 0) {
        // Reveal all instances of the letter
        matches.forEach(index => {
            const block = blocks[index];
            block.classList.add("visible");
            block.textContent = letter.toUpperCase();
        });
        button.classList.add("success");
    } else {
        // Wrong guess
        button.classList.add("fail");
        decTries();
        triesDiv.innerHTML = `${tries} out of ${totalTries} tries left`;
        setImg();
    }
    
    winLose();
}

// Helper function to get all indices of a letter in the word
function getAllIndices(arr, val) {
    const indices = [];
    arr.forEach((letter, i) => {
        if (letter === val) indices.push(i);
    });
    return indices;
}

// Generate random word
function getRndWord() {
    const word = words[Math.floor(Math.random() * words.length)].toLowerCase().split("");
    if (word.length >= 7 && window.innerWidth <= 768) {
        main.style.height = "140px";
    }
    return word;
}

// Generate word blocks
function generateWordBlocks() {
    selectedWord = getRndWord();
    console.log(selectedWord.join("")); // For debugging

    selectedWord.forEach((letter, index) => {
        const div = document.createElement("div");
        div.classList.add("main-block");
        div.classList.add(`val-${letter}`);
        div.textContent = "_";
        mainDiv.appendChild(div);
    });
    
    blocks = document.querySelectorAll(".main-block");
}

// Reset game
function resetAll() {
    tries = 0;
    triesDiv.innerHTML = "";
    startGame.innerHTML = "Play Again";
    img.src = "./assets/images/0.png";
    selectedWord = [];
    clearFails();
    clearMainDiv();
    enableStart();
}

// Clear failed attempts
function clearFails() {
    keyboardBtns.forEach(btn => {
        btn.classList.remove("fail", "success");
        btn.disabled = false;
    });
}

// Clear main display
function clearMainDiv() {
    mainDiv.innerHTML = "";
    main.style.height = "";
}

// Set hangman image
function setImg() {
    const percent = (tries / totalTries) * 100;
    if (percent > 71.5 && percent <= 87.75) img.src = "./assets/images/1.png";
    else if (percent > 57.25 && percent <= 71.5) img.src = "./assets/images/2.png";
    else if (percent > 43 && percent <= 57.25) img.src = "./assets/images/3.png";
    else if (percent > 28.75 && percent <= 43) img.src = "./assets/images/4.png";
    else if (percent > 14.5 && percent <= 28.75) img.src = "./assets/images/5.png";
    else if (percent <= 14.5) img.src = "./assets/images/6.png";
}

// Set tries
function setTries() {
    tries = selectedWord.length;
    totalTries = selectedWord.length;
    triesDiv.innerHTML = `${tries} out of ${totalTries} tries left`;
}

function decTries() {
    tries = Math.max(0, tries - 1);
}

// Button state management
function disableStart() {
    startButton.disabled = true;
    startButton.classList.add("start-fail");
}

function enableStart() {
    startButton.disabled = false;
    startButton.classList.remove("start-fail");
}

function disableBtns() {
    keyboardBtns.forEach(btn => btn.disabled = true);
    document.querySelector(".hint").disabled = true;
}

function enableBtns() {
    keyboardBtns.forEach(btn => btn.disabled = false);
    document.querySelector(".hint").disabled = false;
}

// Win/Lose conditions
function winLose() {
    const allLettersRevealed = Array.from(blocks).every(block => 
        block.classList.contains("visible")
    );

    if (tries === 0) {
        secretWord.innerHTML = `secret word was "${selectedWord.join("")}"`;
        openLose();
        setTimeout(() => {
            triesDiv.innerHTML = "";
            closeLose();
            resetAll();
            disableBtns();
        }, 2500);
    } else if (allLettersRevealed) {
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
            triesDiv.innerHTML = "";
            closeWin();
            resetAll();
            disableBtns();
        }, 3000);
    }
}

// Hint system
document.querySelector("#hint").addEventListener("click", hint);

function hint() {
    if (firstTime && tries > 2) {
        openHint();
    } else if (tries > 2 && !firstTime) {
        const hiddenBlocks = Array.from(blocks).filter(block => !block.classList.contains("visible"));
        if (hiddenBlocks.length > 0) {
            const randomBlock = hiddenBlocks[Math.floor(Math.random() * hiddenBlocks.length)];
            const letter = selectedWord[Array.from(blocks).indexOf(randomBlock)];
            play(letter);
            tries -= 2;
            triesDiv.innerHTML = `${tries} out of ${totalTries} tries left`;
            setImg();
        }
    } else if (tries <= 2) {
        tries0();
    }
}

// Modal functions
function openHint() { hintModal.showModal(); }
function closeHint() { hintModal.close(); }
function openTries0() { tries0Modal.showModal(); }
function closeTries0() { tries0Modal.close(); }
function openWin() { winModal.showModal(); }
function closeWin() { winModal.close(); }
function openLose() { loseModal.showModal(); }
function closeLose() { loseModal.close(); }

document.querySelector("#close-hint").addEventListener("click", closeHint);
document.querySelector("#open-about").addEventListener("click", () => aboutModal.showModal());
document.querySelector("#close-about").addEventListener("click", () => aboutModal.close());
document.querySelector("#take-hint").addEventListener("click", setFirstTimeFalse);

function setFirstTimeFalse() {
    firstTime = false;
    closeHint();
    hint();
}

function tries0() {
    openTries0();
    setTimeout(closeTries0, 1000);
}

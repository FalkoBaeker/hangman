// import confetti from "./confetti.js";
import confetti from "https://cdn.skypack.dev/canvas-confetti";

let words = [
    "about",
    "apple",
    "aunt",
    "away",
    "bash",
    "back",
    "before",
    "box",
    "buy",
    "csharp",
    "cake",
    "chair",
    "circle",
    "come",
    "dart",
    "dance",
    "deep",
    "die",
    "drop",
    "elixir",
    "each",
    "empty",
    "ever",
    "eye",
    "fortran",
    "face",
    "fever",
    "firm",
    "fork",
    "golang",
    "gate",
    "gift",
    "gold",
    "gun",
    "haskell",
    "hair",
    "hurt",
    "head",
    "hen",
    "ink",
    "isle",
    "iron",
    "ice",
    "javascript",
    "java",
    "junk",
    "jam",
    "juice",
    "jug",
    "kotlin",
    "kill",
    "knee",
    "knife",
    "know",
    "lua",
    "long",
    "last",
    "light",
    "lame",
    "matlab",
    "moon",
    "milk",
    "mad",
    "meal",
    "native",
    "negro",
    "news",
    "nice",
    "ocaml",
    "off",
    "old",
    "over",
    "oil",
    "python",
    "pain",
    "price",
    "pen",
    "pull",
    "php",
    "quick",
    "queen",
    "queer",
    "rust",
    "rain",
    "rice",
    "run",
    "ruby",
    "repair",
    "spell",
    "scala",
    "skin",
    "swift",
    "story",
    "solidity",
    "soup",
    "true",
    "thin",
    "typescript",
    "tilte",
    "toe",
    "ugly",
    "use",
    "unit",
    "voice",
    "visit",
    "water",
    "wasm",
    "walk",
    "wife",
    "wire",
    "yard",
    "yell",
    "young",
    "zoo",
    "zero",
];

// ============================================================
// Changing height of main div in getRndWord on w=768px if letters exceeds 7
const winWidth = window.innerWidth;

// adding listener to each key
let keyboardBtns = document.querySelectorAll(".keyboard-btn");
keyboardBtns.forEach((key) => {
    key.addEventListener("click", () => play(key.getAttribute("id")));
});

const tries_div = document.querySelector(".tries");
const start_button = document.querySelector("#start");
const main = document.querySelector(".main");
const main_div = document.querySelector(".inner-main");
const img = document.querySelector("#hangman");
const startGame = document.querySelector("#start-game");
let blocks = null;
let dupWord = [];
let word = [];
let tries = 0;
let totalTries = null;
let firstTime = true;

// Modals
const hintModal = document.querySelector("#modal-hint");
const tries0Modal = document.querySelector("#modal-tries0");
const winModal = document.querySelector("#modal-win");
const loseModal = document.querySelector("#modal-lose");
const secretWord = document.querySelector("#secret-word");
const aboutModal = document.querySelector("#modal-about");

// starting script
disableBtns();

start_button.addEventListener("click", () => {
    disableStart();
    enableBtns();
    clearFails();
    clearMainDiv();
    genWrdBlocks();
    setTries();
});

function play(id) {
    if (tries > 0) {
        let match = word.includes(id);
        let res = 1;
        if (match) {
            blocks.forEach((block) => {
                if (
                    !block.classList.contains("visible") &&
                    block.textContent === id &&
                    res >= 1
                ) {
                    block.classList.add("visible");
                    res -= 1;
                }
            });
            word.splice(word.indexOf(id), 1);
        } else if (!match) {
            document.querySelector(`#${id}`).classList.add("fail");
            document.querySelector(`#${id}`).disabled = true;
            decTries();
            document.querySelector(
                ".tries"
            ).innerHTML = `${tries} out of ${totalTries} tries left`;
            setImg();
        }
    }
    winLose();
}

// utility functions

// =========================================

function getRnd(min, max) {
    let step1 = max - min + 1;
    let step2 = Math.random() * step1;
    let result = Math.floor(step2) + min;
    return result;
}

function getRndWord() {
    let word = words[getRnd(0, words.length - 1)].split("");
    if (word.length >= 7 && winWidth <= 768) {
        main.style.height = "140px";
    }
    return word;
}

function genWrdBlocks() {
    word = getRndWord();
    console.log(word);
    dupWord = [...dupWord, ...word];

    // create divs in dom
    word.forEach((letter) => {
        let div = document.createElement("div");
        div.classList.add(`main-block`);
        div.classList.add(`val-${letter}`);
        div.innerHTML = letter;
        main_div.appendChild(div);
    });
    blocks = document.querySelectorAll(".main-block");
}

// =========================================

document.querySelector("#hint").addEventListener("click", hint);
function hint() {
    if (firstTime && tries > 2) {
        openHint();
    } else if (tries > 2 && !firstTime) {
        let arr = [];
        blocks.forEach((block) => {
            if (!block.classList.contains("visible")) {
                arr.push(block);
            }
        });
        arr[getRnd(0, arr.length - 1)].classList.add("visible");
        tries = tries - 2;
        document.querySelector(".tries").innerHTML = `tries: ${tries}`;
        setImg();
        winLose();
    } else if (tries <= 2) {
        tries0();
    }
}

function resetAll() {
    tries = 0;
    document.querySelector(".tries").innerHTML = "tries";
    startGame.innerHTML = "Play Again";
    img.src = "./assets/images/0.png";
    word = [];
    dupWord = [];
    clearFails();
    clearMainDiv();
    enableStart();
}

function clearFails() {
    for (let i = 97; i < 123; i++) {
        document
            .querySelector(`#${String.fromCharCode(i)}`)
            .classList.remove("fail");
    }
}

function clearMainDiv() {
    main_div.innerHTML = "";
}

function setImg() {
    let percent = (tries / totalTries) * 100;
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

function setTries() {
    tries = word.length;
    totalTries = word.length;
    tries_div.innerHTML = `${tries} out of ${totalTries} tries left`;
}

function decTries() {
    tries -= 1;
}

function disableStart() {
    start_button.disabled = true;
    start_button.classList.add("start-fail");
}

function enableStart() {
    start_button.disabled = false;
    start_button.classList.remove("start-fail");
}

function disableBtns() {
    for (let i = 97; i < 123; i++) {
        document.querySelector(`#${String.fromCharCode(i)}`).disabled = true;
    }
    document.querySelector(".hint").disabled = true;
}

function enableBtns() {
    for (let i = 97; i < 123; i++) {
        document.querySelector(`#${String.fromCharCode(i)}`).disabled = false;
    }
    document.querySelector(".hint").disabled = false;
}

function winLose() {
    if (tries === 0) {
        secretWord.innerHTML = `secret word was "${dupWord.join("")}"`;
        openLose();
        setTimeout(() => {
            closeLose();
            resetAll();
            disableBtns();
        }, 2500);
    } else if (
        document.querySelectorAll(".visible").length === dupWord.length
    ) {
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
        resetAll();
        disableBtns();
        setTimeout(() => {
            closeWin();
        }, 3000);
    }
}

// ================== Modal Functions =====================
// Modal Toggle
function openHint() {
    hintModal.showModal();
}
document.querySelector("#close-hint").addEventListener("click", closeHint);
function closeHint() {
    hintModal.close();
}
function openTries0() {
    tries0Modal.showModal();
}
function closeTries0() {
    tries0Modal.close();
}
function openWin() {
    winModal.showModal();
}
function closeWin() {
    winModal.close();
}
function openLose() {
    loseModal.showModal();
}
function closeLose() {
    loseModal.close();
}
document.querySelector("#open-about").addEventListener("click", () => {
    aboutModal.showModal();
});
document.querySelector("#close-about").addEventListener("click", () => {
    aboutModal.close();
});
// Modal Actions

document
    .querySelector("#take-hint")
    .addEventListener("click", setFirtTimeFalse);
function setFirtTimeFalse() {
    /** on taking hint */
    firstTime = false;
    closeHint();
    hint();
}

function tries0() {
    // when player has not enough tries
    openTries0();
    setTimeout(() => {
        closeTries0();
    }, 1000);
}

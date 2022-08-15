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

// ================= Confetti Code by CoderZ90 ==================
var confetti = {
    maxCount: 1550, //set max confetti count
    speed: 2, //set the particle animation speed
    frameInterval: 15, //the confetti animation frame interval in milliseconds
    alpha: 1.0, //the alpha opacity of the confetti (between 0 and 1, where 1 is opaque and 0 is invisible)
    gradient: false, //whether to use gradients for the confetti particles
    start: null, //call to start confetti animation (with optional timeout in milliseconds, and optional min and max random confetti count)
    stop: null, //call to stop adding confetti
    toggle: null, //call to start or stop the confetti animation depending on whether it's already running
    pause: null, //call to freeze confetti animation
    resume: null, //call to unfreeze confetti animation
    togglePause: null, //call to toggle whether the confetti animation is paused
    remove: null, //call to stop the confetti animation and remove all confetti immediately
    isPaused: null, //call and returns true or false depending on whether the confetti animation is paused
    isRunning: null, //call and returns true or false depending on whether the animation is running
};

(function () {
    confetti.start = startConfetti;
    confetti.stop = stopConfetti;
    confetti.toggle = toggleConfetti;
    confetti.pause = pauseConfetti;
    confetti.resume = resumeConfetti;
    confetti.togglePause = toggleConfettiPause;
    confetti.isPaused = isConfettiPaused;
    confetti.remove = removeConfetti;
    confetti.isRunning = isConfettiRunning;
    var supportsAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame;
    var colors = [
        "rgba(30,144,255,",
        "rgba(107,142,35,",
        "rgba(255,215,0,",
        "rgba(255,192,203,",
        "rgba(106,90,205,",
        "rgba(173,216,230,",
        "rgba(238,130,238,",
        "rgba(152,251,152,",
        "rgba(70,130,180,",
        "rgba(244,164,96,",
        "rgba(210,105,30,",
        "rgba(220,20,60,",
    ];
    var streamingConfetti = false;
    var animationTimer = null;
    var pause = false;
    var lastFrameTime = Date.now();
    var particles = [];
    var waveAngle = 0;
    var context = null;

    function resetParticle(particle, width, height) {
        particle.color =
            colors[(Math.random() * colors.length) | 0] +
            (confetti.alpha + ")");
        particle.color2 =
            colors[(Math.random() * colors.length) | 0] +
            (confetti.alpha + ")");
        particle.x = Math.random() * width;
        particle.y = Math.random() * height - height;
        particle.diameter = Math.random() * 10 + 5;
        particle.tilt = Math.random() * 10 - 10;
        particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
        particle.tiltAngle = Math.random() * Math.PI;
        return particle;
    }

    function toggleConfettiPause() {
        if (pause) resumeConfetti();
        else pauseConfetti();
    }

    function isConfettiPaused() {
        return pause;
    }

    function pauseConfetti() {
        pause = true;
    }

    function resumeConfetti() {
        pause = false;
        runAnimation();
    }

    function runAnimation() {
        if (pause) return;
        else if (particles.length === 0) {
            context.clearRect(0, 0, window.innerWidth, window.innerHeight);
            animationTimer = null;
        } else {
            var now = Date.now();
            var delta = now - lastFrameTime;
            if (!supportsAnimationFrame || delta > confetti.frameInterval) {
                context.clearRect(0, 0, window.innerWidth, window.innerHeight);
                updateParticles();
                drawParticles(context);
                lastFrameTime = now - (delta % confetti.frameInterval);
            }
            animationTimer = requestAnimationFrame(runAnimation);
        }
    }

    function startConfetti(timeout, min, max) {
        var width = window.innerWidth;
        var height = window.innerHeight;
        window.requestAnimationFrame = (function () {
            return (
                window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    return window.setTimeout(callback, confetti.frameInterval);
                }
            );
        })();
        var canvas = document.getElementById("confetti-canvas");
        if (canvas === null) {
            canvas = document.createElement("canvas");
            canvas.setAttribute("id", "confetti-canvas");
            canvas.setAttribute(
                "style",
                "display:block;z-index:999999;pointer-events:none;position:fixed;top:0"
            );
            document.body.prepend(canvas);
            canvas.width = width;
            canvas.height = height;
            window.addEventListener(
                "resize",
                function () {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                },
                true
            );
            context = canvas.getContext("2d");
        } else if (context === null) context = canvas.getContext("2d");
        var count = confetti.maxCount;
        if (min) {
            if (max) {
                if (min == max) count = particles.length + max;
                else {
                    if (min > max) {
                        var temp = min;
                        min = max;
                        max = temp;
                    }
                    count =
                        particles.length +
                        ((Math.random() * (max - min) + min) | 0);
                }
            } else count = particles.length + min;
        } else if (max) count = particles.length + max;
        while (particles.length < count)
            particles.push(resetParticle({}, width, height));
        streamingConfetti = true;
        pause = false;
        runAnimation();
        if (timeout) {
            window.setTimeout(stopConfetti, timeout);
        }
    }

    function stopConfetti() {
        streamingConfetti = false;
    }

    function removeConfetti() {
        stop();
        pause = false;
        particles = [];
    }

    function toggleConfetti() {
        if (streamingConfetti) stopConfetti();
        else startConfetti();
    }

    function isConfettiRunning() {
        return streamingConfetti;
    }

    function drawParticles(context) {
        var particle;
        var x, y, x2, y2;
        for (var i = 0; i < particles.length; i++) {
            particle = particles[i];
            context.beginPath();
            context.lineWidth = particle.diameter;
            x2 = particle.x + particle.tilt;
            x = x2 + particle.diameter / 2;
            y2 = particle.y + particle.tilt + particle.diameter / 2;
            if (confetti.gradient) {
                var gradient = context.createLinearGradient(
                    x,
                    particle.y,
                    x2,
                    y2
                );
                gradient.addColorStop("0", particle.color);
                gradient.addColorStop("1.0", particle.color2);
                context.strokeStyle = gradient;
            } else context.strokeStyle = particle.color;
            context.moveTo(x, particle.y);
            context.lineTo(x2, y2);
            context.stroke();
        }
    }

    function updateParticles() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        var particle;
        waveAngle += 0.01;
        for (var i = 0; i < particles.length; i++) {
            particle = particles[i];
            if (!streamingConfetti && particle.y < -15)
                particle.y = height + 100;
            else {
                particle.tiltAngle += particle.tiltAngleIncrement;
                particle.x += Math.sin(waveAngle) - 0.5;
                particle.y +=
                    (Math.cos(waveAngle) + particle.diameter + confetti.speed) *
                    0.5;
                particle.tilt = Math.sin(particle.tiltAngle) * 15;
            }
            if (
                particle.x > width + 20 ||
                particle.x < -20 ||
                particle.y > height
            ) {
                if (streamingConfetti && particles.length <= confetti.maxCount)
                    resetParticle(particle, width, height);
                else {
                    particles.splice(i, 1);
                    i--;
                }
            }
        }
    }
})();

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
        resetAll();
        disableBtns();
        setTimeout(() => {
            closeLose();
        }, 1500);
    } else if (
        document.querySelectorAll(".visible").length === dupWord.length
    ) {
        confetti.start();
        openWin();
        resetAll();
        disableBtns();
        setTimeout(() => {
            closeWin();
        }, 2500);
        setTimeout(() => {
            confetti.stop();
        }, 1500);
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

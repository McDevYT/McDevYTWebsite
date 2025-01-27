const piDigits = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989";
const piDisplay = document.getElementById("pi-display");
const timerElement = document.getElementById("timer");
const restartBtn = document.getElementById("restart-btn");

let currentIndex = 2; // Start after "3."
let startTime = null;
let timerInterval = null;
let gameOver = false;

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        timerElement.textContent = `Time: ${elapsedTime.toFixed(3)}s`;
    }, 10);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetChallenge() {
    stopTimer();
    currentIndex = 2; // Reset to start after "3."
    startTime = null;
    gameOver = false;
    timerElement.textContent = "Time: 0.000s";
    clearMessage();
    updatePiDisplay(); // Reset display and position
}

function displayMessage(message, isError = false) {
    const messageElement = document.getElementById("game-message");
    if (messageElement) messageElement.remove();

    const newMessage = document.createElement("div");
    newMessage.id = "game-message";
    newMessage.textContent = message;
    newMessage.style.color = isError ? "red" : "green";
    newMessage.style.fontWeight = "bold";
    newMessage.style.marginTop = "20px";
    newMessage.style.fontSize = "24px";
    document.querySelector(".container").appendChild(newMessage);
}

function clearMessage() {
    const messageElement = document.getElementById("game-message");
    if (messageElement) messageElement.remove();
}

function updatePiDisplay(reset = false) {
    piDisplay.innerHTML = ""; // Clear the display

    const beforeStart = Math.max(0, currentIndex - 7); // 5 digits before the active digit
    const afterEnd = Math.min(piDigits.length, currentIndex + 7); // 20 digits after the active digit

    const before = piDigits.slice(beforeStart, currentIndex); // Digits already typed
    const active = piDigits[currentIndex]; // Active digit
    const after = piDigits.slice(currentIndex + 1, afterEnd); // Remaining digits

    // Create spans for digits before the active digit
    before.split("").forEach((digit) => {
        const span = document.createElement("span");
        span.textContent = digit;
        span.className = "typed-digit";
        piDisplay.appendChild(span);
    });

    // Active digit replaced with an underscore
    const activeSpan = document.createElement("span");
    activeSpan.textContent = "_";
    activeSpan.className = "active-digit";
    piDisplay.appendChild(activeSpan);

    // Remaining digits replaced with underscores
    after.split("").forEach(() => {
        const span = document.createElement("span");
        span.textContent = "_";
        span.className = "hidden-digit";
        piDisplay.appendChild(span);
    });

    const activeOffset = activeSpan.offsetLeft + activeSpan.offsetWidth / 2;
    const containerWidth = piDisplay.offsetWidth;
    const viewportWidth = window.innerWidth;

    const scrollAmount = activeOffset - viewportWidth / 0 + containerWidth / 2;
    piDisplay.style.transform = `translateX(${-scrollAmount}px)`; // Adjust the scroll amount
}

function handleKeyPress(event) {
    const validKeys = "0123456789";  // Only allow numbers

    if (validKeys.indexOf(event.key) === -1) return;  // Ignore non-numeric keys

    if (event.key === "Enter") {
        if (gameOver) resetChallenge();
        return;
    }

    if (gameOver) return;

    clearMessage();

    if (!timerInterval) startTimer();

    const key = event.key;
    if (key === piDigits[currentIndex]) {
        currentIndex++;
        if (currentIndex < piDigits.length) {
            updatePiDisplay();
        } else {
            stopTimer();
            displayMessage("Congratulations! You typed all digits of Pi!");
            gameOver = true;
        }
    } else {
        stopTimer();
        displayMessage(`Mistake at digit ${currentIndex + 1}. Press Enter to restart.`, true);
        gameOver = true;
    }
}

// Add event listener for numpad buttons
document.getElementById("btn-1").addEventListener("click", () => handleKeyPress({ key: "1" }));
document.getElementById("btn-2").addEventListener("click", () => handleKeyPress({ key: "2" }));
document.getElementById("btn-3").addEventListener("click", () => handleKeyPress({ key: "3" }));
document.getElementById("btn-4").addEventListener("click", () => handleKeyPress({ key: "4" }));
document.getElementById("btn-5").addEventListener("click", () => handleKeyPress({ key: "5" }));
document.getElementById("btn-6").addEventListener("click", () => handleKeyPress({ key: "6" }));
document.getElementById("btn-7").addEventListener("click", () => handleKeyPress({ key: "7" }));
document.getElementById("btn-8").addEventListener("click", () => handleKeyPress({ key: "8" }));
document.getElementById("btn-9").addEventListener("click", () => handleKeyPress({ key: "9" }));
document.getElementById("btn-0").addEventListener("click", () => handleKeyPress({ key: "0" }));

document.addEventListener("keydown", handleKeyPress);
restartBtn.addEventListener("click", resetChallenge);

// Initialize the challenge
resetChallenge();

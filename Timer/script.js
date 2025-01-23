document.addEventListener("DOMContentLoaded", () => {
    const timerDisplay = document.querySelector(".timer");
    const dateTimeInput = document.getElementById("datetime");
    const startButton = document.getElementById("start");
    let countdownInterval;

    startButton.addEventListener("click", () => {
        if (countdownInterval) clearInterval(countdownInterval);
        const targetDate = new Date(dateTimeInput.value);
        if (isNaN(targetDate)) {
            timerDisplay.textContent = "Invalid date/time!";
            return;
        }

        countdownInterval = setInterval(() => {
            const now = new Date();
            const timeDifference = targetDate - now;

            if (timeDifference <= 0) {
                clearInterval(countdownInterval);
                timerDisplay.textContent = "Time's up!";
                return;
            }

            const hours = String(Math.floor((timeDifference / (1000 * 60 * 60)) % 24)).padStart(2, "0");
            const minutes = String(Math.floor((timeDifference / (1000 * 60)) % 60)).padStart(2, "0");
            const seconds = String(Math.floor((timeDifference / 1000) % 60)).padStart(2, "0");
            
            timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
        }, 1000);
    });
});

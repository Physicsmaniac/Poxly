function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
}

// Update clock immediately and set interval to update every second
updateClock();
setInterval(updateClock, 1000);

 const words = ["Time", "L'heure", "Tiempo", "Zeit", "Tempo", "時間"];

    let currentIndex = 0;

    function updateText() {
        const textElement = document.getElementById("changing-text");

        // Fade-out effect
        textElement.style.opacity = 0;

        // Change the word after fade-out
        setTimeout(() => {
            textElement.textContent = words[currentIndex];
            textElement.style.opacity = 1; // Fade-in effect

            // Move to the next word, loop back to the start if at the end
            currentIndex = (currentIndex + 1) % words.length;
        }, 1000); // Match the fade-out duration
    }

    // Start the cycle and repeat every 4 seconds
    updateText();
    setInterval(updateText, 4000);
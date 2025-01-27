// Fetch a random fact on page load
window.addEventListener("DOMContentLoaded", fetchFact);

document.getElementById("generate").addEventListener("click", fetchFact);

async function fetchFact() {
    try {
        const response = await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random");
        const data = await response.json();
        
        // Access the fact text from the API response
        const factText = data.text;

        // Find the div to display the fact and update it
        const factElement = document.getElementById("fact");
        factElement.textContent = factText;
    } catch (error) {
        console.error("Error fetching the fact: ", error);
    }
}

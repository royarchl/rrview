// CREATING ARTIST JSON STRING (EXPERIMENTAL)
const rawArtistsArray = [
    "Ariana Grande", "Lana Del Rey", "The Weeknd", "ZHU", "brakence", "Logic",
    "Stormzy", "NLE Choppa", "ArrDee", "FKA twigs", "Metro Boomin", "8485",
    "Tyler, The Creator", "Maluma", "Kendrick Lamar", "Bad Bunny", "Gang Starr",
    "Alexandra Savior", "The Beatles", "The Mamas & The Papas", "Lil Yachty", 
    "Paramore", "Russ", "Coast Contra", "Duki", "UFO", "Yumi", "Fredo", "Halsey",
    "ROSALÍA", "Beyoncé", "Travis Scott", "J. Cole", "underscores", "Drake", 
    "Jane Remover", "James Newton Howard", "Herencia de Patrones", "Fuerza Regida", 
    "tobi lou", "Fakefree KP", "Maggie Lindemann", "SIE Sound Team", "Spell316", 
    "GZA", "That Mexican OT", "Ashnikko", "Nessa Barrett", "Nep", "KeViN11", 
    "Melanie Martinez", "Dove Cameron", "Yeat", "Nas", "Kanye West"
];
sortCaseInsensitive(rawArtistsArray);



// JSON TESTING
const artistJsonString = JSON.stringify(rawArtistsArray);



// HELPER FUNCTIONS
function sortCaseInsensitive(array)
{
    array.sort( (a,b) => a.localeCompare(b, 'en', { sensitivity: "base" }));
}

function normalizeText(text)
{
    const normalizedText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const noPunctuationText = normalizedText.replace(/[^\w\s\d]/g, '');
    const dashedText = noPunctuationText.replace(/\s+/g, '-');
    const finalText = dashedText.charAt(0).toUpperCase() + dashedText.slice(1).toLowerCase();
    return finalText;
}



function generateAlphabetLetters() 
{
    const lettersContainer = document.getElementById("letters-container");
    lettersContainer.classList.add("letters-grid");
    const navigationContainer = document.getElementById("navigation");

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    alphabet.split('').forEach((letter, index) => {
        // SETTING UP NAVIGATION BAR
        const letterLink = document.createElement('a');
        letterLink.href = `#section-${letter}`;
        letterLink.className = "navigation-letter";
        letterLink.textContent = letter;
        letterLink.addEventListener("click", (event) => {
            event.preventDefault();
            const targetId = event.target.getAttribute("href");
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: "smooth" });
            }
        });
        navigationContainer.appendChild(letterLink);                        // APPEND

        // SETTING UP CONTAINERS FOR LISTS OF ARTISTS
        const letterContainer = document.createElement("div");
        letterContainer.id = `section-${letter}`;
        letterContainer.className = "letter-container";

        const bigLetter = document.createElement("div");
        bigLetter.className = "big-letter";
        bigLetter.innerHTML = `<h2>${letter}</h2>`;
        letterContainer.appendChild(bigLetter);                             // APPEND

        // UNPACKING JSON OBJECT AND ITERATING
        const artistArray = JSON.parse(artistJsonString);
        artistArray.forEach(artist => {
            const firstLetter = artist.charAt(0).toUpperCase();
            if (firstLetter === letter) {
                const artistLink = document.createElement('a');
                artistLink.href = `artists/${normalizeText(artist)}`;
                artistLink.className = "artist-link";
                artistLink.textContent = artist;
                letterContainer.appendChild(artistLink);
            }
        });
        lettersContainer.appendChild(letterContainer);                      // APPEND
    });
}

function scrollToLetter(letter) 
{
    const letterSection = document.getElementById(`letter-${letter}`);
    if (letterSection) {
        letterSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}



window.onload = generateAlphabetLetters();
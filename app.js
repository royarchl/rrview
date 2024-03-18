let artistsArray = [
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
artistsArray.sort( (a,b) => a.localeCompare(b, 'en', { sensitivity: "base" }));


function normalizeText(text)
{
    const normalizedText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const dashedText = normalizedText.replace(/\s+/g, '-');
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
        const letterLink = document.createElement('a');
        letterLink.href = `#section-${letter}`;
        letterLink.className = "navigation-letter";
        letterLink.textContent = letter;
        letterLink.addEventListener("click", function(event) {
            event.preventDefault();
            const targetId = this.getAttribute("href");
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: "smooth" });
            }
        });
        if (index < alphabet.length - 1) {
            letterLink.style.marginRight = "10px";
        }
        navigationContainer.appendChild(letterLink);

        
        const letterContainer = document.createElement("div");
        letterContainer.className = "letter-container";

        const bigLetter = document.createElement("div");
        bigLetter.className = "big-letter";
        bigLetter.id = `section-${letter}`;
        bigLetter.innerHTML = `<h1>${letter}</h1>`;
        letterContainer.appendChild(bigLetter);

        // flag to check for child artists
        let hasArtists = false;

        // iterate over the artistsArray
        artistsArray.forEach(artist => {
            const firstLetter = artist.charAt(0).toUpperCase();
            if (firstLetter === letter) {
                const artistLink = document.createElement('a');
                artistLink.href = normalizeText(artist);
                artistLink.className = "artist-link";
                artistLink.textContent = artist;
                letterContainer.appendChild(artistLink);
                letterContainer.appendChild(document.createElement('br'));

                hasArtists = true;
            }
        });

        if (!hasArtists) {
            bigLetter.style.color = "lightgray";
            letterLink.style.color = "lightgray";
        }

        lettersContainer.appendChild(letterContainer);
    });
}

function scrollToLetter(letter) {
    const letterSection = document.getElementById(`letter-${letter}`);
    if (letterSection) {
        letterSection.scrollIntoView({ behavior: "smooth" });
    }
}

window.onload = generateAlphabetLetters();
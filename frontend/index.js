// const baseUrl = "http://127.0.0.1:8000";
const frontEndUrl = "127.0.0.1:5500";

async function requestArtistListFromBackend()
{
    try {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }

        const response = await fetch(`/api/artists`, requestOptions);
        if (!response.ok) {
            throw new Error("Network response was not ok.");
        }

        const data = await response.json();
        console.log(data);
        generateAlphabetLetters(data);
    } catch (error) {
        console.error("Error: ", error);
    }
}


// HELPER FUNCTIONS
function sortCaseInsensitive(array)
{
    array.sort( (a,b) => a.localeCompare(b, 'en', { sensitivity: "base" }));
}

function normalizeText(text)
{
    const uniqueCharactersReplacedText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const noPunctuationText = uniqueCharactersReplacedText.replace(/[^\w\s\d]/g, '');
    const dashesForSpacesText = noPunctuationText.replace(/\s+/g, '-');
    const onlyFirstLetterCapitalizedText = dashesForSpacesText.charAt(0).toUpperCase() + dashesForSpacesText.slice(1).toLowerCase();
    return onlyFirstLetterCapitalizedText;
}

// WARNING!
// There is nothing that verifies the passed parameter type
function generateAlphabetLetters(jsonObject) 
{   
    const lettersListContainer = document.getElementById("letters-container");
    const navigationContainer = document.getElementById("navigation");

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#";

    alphabet.split('').forEach((letter) => {
        
        // DETERMINING IF FIRST LETTER IS A NUMBER
        const sectionValue = (!(/[a-zA-Z]/).test(letter)) 
            ? `section-0`
            : `section-${letter}`;
        
        // CREATING NAV BAR
        const navLetterItem = document.createElement('a');
        Object.assign(navLetterItem, {
            href: `#${sectionValue}`,
            className: "navigation-letter",
            textContent: letter 
        });
        navLetterItem.addEventListener("click", function(event) {
            event.preventDefault();
            document.querySelector(this.getAttribute("href"))
                    .scrollIntoView({ behavior: "smooth" });
        });
        navigationContainer.appendChild(navLetterItem);

        // CREATING LETTER CONTAINERS
        const letterContainer = document.createElement("div");
        Object.assign(letterContainer, {
            id: sectionValue,
            className: "letter-container"
        });
        lettersListContainer.appendChild(letterContainer);

        // CREATING LETTER HEADERS
        const bigLetter = document.createElement("div");
        Object.assign(bigLetter, {
            className: "big-letter",
            innerHTML: `<h2>${letter}</h2>`
        });
        letterContainer.appendChild(bigLetter);
    });

    // POPULATE ARTISTS INTO PROPER CONTAINERS [ LINEAR - O(n) ]
    const artistArray = jsonObject;
    artistArray.forEach(artist => {
        const firstLetter = artist["name"].charAt(0).toUpperCase();

        const artistLink = document.createElement('a');
        Object.assign(artistLink, {
            // SHOULD this href be to the albums page but then that file
            // on-load would make the call to the backend for the information?
            href: `/api/artists/${normalizeText(artist["name"])}`,
            className: "artist-link",
            textContent: artist["name"]
        });
        artistLink.dataset.artistId = artist["id"];
        artistLink.addEventListener("click", function(event) {
            event.preventDefault();

            const artistId = this.getAttribute("data-artist-id");
            sessionStorage.setItem("selectedArtistId", artistId);

            window.location.href = "albums.html";
        });

        const sectionId = (!(/[a-zA-Z]/).test(firstLetter)) 
            ? `section-0`
            : `section-${firstLetter}`;
        document.getElementById(sectionId).appendChild(artistLink); 
    });
}

const showOnPx = 100;
const backToTopButton = document.querySelector(".back-to-top");

const scrollContainer = () => {
    return document.documentElement || document.body;
};

document.addEventListener("scroll", () => {
    if (scrollContainer().scrollTop > showOnPx) {
        backToTopButton.classList.remove("hidden");
    } else {
        backToTopButton.classList.add("hidden");
    }
})

const goToTop = () => {
    document.body.scrollIntoView({
        behavior: "smooth",
    });
};
backToTopButton.addEventListener("click", goToTop);

window.onload = async () => {
    await requestArtistListFromBackend();
};

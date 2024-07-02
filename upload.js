// HTTP REQUESTS
// const baseUrl = 'http://127.0.0.1:8000';

// Implement backend request for route containing SpotifyAPI request (AlbumController.cs)
document.getElementById("album-retrieval").addEventListener("submit", function(event) {
    event.preventDefault();

    const spotifyUrl = document.getElementById("url-input").value;

    if (!spotifyUrl.includes("album")) {
        throw new Error("The supplied url is not a valid album link.");
    }
    this.reset();

    const startIndex = spotifyUrl.indexOf("/album/") + 7;
    const endIndex = spotifyUrl.indexOf("?");
    const spotifyAlbumId = spotifyUrl.substring(startIndex, endIndex);

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }

    fetch(`/api/get_album/${spotifyAlbumId}`, requestOptions)
        .then(Response => {
            if (!Response.ok) {
                throw new Error("Network response was not ok.");
            }
            return Response.json();
        })
        .then(data => {
            populateFormInformationFromAlbumObject(data);
        })
        .catch(error => {
            console.error("Error:", error);
        });
});

document.getElementById("album-upload").addEventListener("submit", function(event) {
    event.preventDefault();

    const albumTitle = document.getElementById("album-name").value;
    const albumReleaseDate = document.getElementById("album-year").value;
    const albumComment = document.getElementById("album-comment").value;
    const albumUrl = document.getElementById("album-url").value;
    const albumArtworkUrl = document.getElementById("album-art-url").value;
    const albumBestSong = document.getElementById("best-song-select").value;

    const artistName = document.getElementById("artist-name").value;

    const songs = [];
    const songElements = document.querySelectorAll(".song-item");
    songElements.forEach( (songElement, index) => {

        const songTitle = songElement.querySelector(".song-name").value.trim();
        const songFeatures = songElement.querySelector(".song-features").value;

        const bestSongBool = (songTitle == albumBestSong) ? true : false;

        // ADD BEST_SONG FIELD
        const song = {
            Name: songTitle,
            Url: songElement.querySelector(".song-url").value,  // ERROR: idk why yet.
            Features: songFeatures,
            SongNumber: index + 1,
            IsBestSong: bestSongBool,
            review: {
                Rating: songElement.querySelector(".song-rating").checked,
                Comment: songElement.querySelector(".song-comment").value,
            }
        };
        songs.push(song);
    });

    // RESET FORM
    // const songsContainer = document.getElementById("songs-container");
    // songsContainer.innerHTML = "";
    // addSongElement();
    // this.reset();

    const formDataObject = {
        artist: {
            Name: artistName,
            albums: [
                {
                    Name: albumTitle,
                    ReleaseDate: albumReleaseDate,
                    Comment: albumComment,
                    Url: albumUrl,
                    ArtUrl: albumArtworkUrl,
                    // bestSong: albumBestSong,    // what is this? why and how to make it work?
                    songs: songs
                },
            ],
        },
    };

    console.log(formDataObject);

    // MAKE THE HTTP REQUEST
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formDataObject)
        // body: JSON.stringify({ jsonData: albumTitle })
    };

    // console.log(formDataObject);

    fetch(`/api/upload`, requestOptions)
        .then(response => {
            if (response.status == 409) {
                alert("The album you are trying to upload has already been posted for this artist.");
                const songsContainer = document.getElementById("songs-container");
                songsContainer.innerHTML = "";
                addSongElement();
                this.reset();
            }
            if (!response.ok) {
                throw new Error("Something in the upload went wrong");
            }
            console.log("Success!");
            const songsContainer = document.getElementById("songs-container");
            songsContainer.innerHTML = "";
            addSongElement();
            this.reset();
        })
        .catch(error => {
            console.error(error);
        });
});



// FUNCTIONS

// Add song button functionality
function addSongElement()
{
    const songsContainer = document.getElementById("songs-container");

    const songItem = document.createElement("div");
    songItem.className = "song-item";
    songsContainer.append(songItem);

    const checkbox = document.createElement("input");
    Object.assign(checkbox, {
        className: "song-rating input-checkbox-base",
        type: "checkbox",
        name: "songRating"
    });
    songItem.append(checkbox);
    checkbox.focus();

    const nameInput = document.createElement("input");
    Object.assign(nameInput, {
        className: "song-name input-text-base",
        type: "text",
        name: "songName",
        placeholder: "Track",
        autocomplete: "off",
        required: true
    });
    songItem.append(nameInput);

    const featuresInput = document.createElement("input");
    Object.assign(featuresInput, {
        className: "song-features input-text-base",
        type: "text",
        name: "songFeatures",
        placeholder: "Features",
        autocomplete: "off",
        required: false
    });
    songItem.append(featuresInput);

    const addDeleteButton = document.createElement("button");
    Object.assign(addDeleteButton, {
        className: "delete-song button-endline",
        type: "button",
        tabIndex: -1
    });
    addDeleteButton.addEventListener("click", function() {
        deleteSongElement(this);
    });
    songItem.append(addDeleteButton);

        const deleteButtonIcon = document.createElement("span");
        deleteButtonIcon.className = "material-symbols-outlined md-18";
        deleteButtonIcon.textContent = "delete";
        addDeleteButton.append(deleteButtonIcon);

    const addCommentButton = document.createElement("button");
    Object.assign(addCommentButton, {
        className: "add-comment button-endline",
        type: "button",
        tabIndex: -1
    });
    addCommentButton.addEventListener("click", function() {
        toggleComment(this);
    });
    songItem.append(addCommentButton);

        const commentButtonIcon = document.createElement("span");
        commentButtonIcon.className = "material-symbols-outlined md-18";
        commentButtonIcon.textContent = "add_comment";
        addCommentButton.append(commentButtonIcon);

    const commentInput = document.createElement("textarea");
    Object.assign(commentInput, {
        className: "song-comment input-textarea-base hidden",
        name: "songComment",
        placeholder: "Song Comment (optional)"
    });
    songItem.append(commentInput);

    const songUrl = document.createElement("input");
    Object.assign(songUrl, {
        type: "hidden",
        name: "songUrl",
        id: "song-url",
        className: "song-url",
        value: ""
    });
    songItem.append(songUrl)

    // RETURN the reference to the song-item we just created
    return songItem;
}

// Create delete song functionality
function deleteSongElement(button)
{
    const parentContainer = button.parentNode;
    parentContainer.remove();

    const songsContainer = document.getElementById("songs-container");
    if (songsContainer.children.length == 0) {
        setTimeout(addSongElement, 150);
    }

}

// Create comment toggle-hide functionality
function toggleComment(button)
{
    const parentContainer = button.parentNode;

    const idk = parentContainer.querySelector(".add-comment").querySelector("span");
    idk.classList.toggle("highlight");
    idk.textContent = (idk.classList.contains("highlight")) ? "chat_error" : "add_comment";

    const commentInput = parentContainer.querySelector(".song-comment");
    commentInput.classList.toggle("hidden");
    commentInput.value = "";
    commentInput.focus();
}

function selectAll() {
    const songsContainer = document.getElementById("songs-container");
    let checkboxes = songsContainer.querySelectorAll(".song-item .song-rating")

    checkboxes.forEach((checkbox) => {
        checkbox.checked = true;
    });
}

function populateFormInformationFromAlbumObject(obj)
{
    // POPULATING ALBUM INFORMATION
    document.getElementById("artist-name").value = obj["artist_name"];
    document.getElementById("album-name").value = obj["album_title"];
    document.getElementById("album-year").value = obj["album_release_date"];
    document.getElementById("album-url").value = obj["album_url"];
    document.getElementById("album-art-url").value = obj["album_art_url"];


    // POPULATING SONG INFORMATION
    const songsContainer = document.getElementById("songs-container");
    const objectSongsCount = obj["songs"].length;

    for (let i = 1; i <= objectSongsCount; ++i)
    {
        // Only create a form element when none remain
        let songItemElement = songsContainer.querySelector(`#songs-container > :nth-child(${i})`);
        if (songItemElement == null)
        {
            songItemElement = addSongElement();
        }

        let songName = obj["songs"][i-1]["title"]
        if (songName.includes("feat")) {
            const startIndex = songName.indexOf("(feat");
            const endIndex = songName.indexOf(")") + 1;
            const removedPortion = songName.substring(startIndex, endIndex);
            songName = songName.replace(removedPortion, "");
        }

        songItemElement.querySelector(".song-name").value = songName;
        songItemElement.querySelector(".song-url").value = obj["songs"][i-1]["url"];
        songItemElement.querySelector(".song-features").value = obj["songs"][i-1]["features"];
    }
}


// EVENT LISTENERS

// Highlight 'add song' option on TAB focus
const addSongButton = document.getElementById("add-song");
addSongButton.addEventListener("focus", (source) => {
    source.target.parentNode.querySelector("span").classList.toggle("highlight");
    source.target.style.color = "var(--text-highlight--secondary";
});
addSongButton.addEventListener("blur", (source) => {
    source.target.parentNode.querySelector("span").classList.toggle("highlight");
    source.target.style.color = "var(--text-secondary)";
});



// Update dropdown with current song selection
const dropdownButton = document.getElementById("best-song-select");
dropdownButton.addEventListener("focus", function() {
    const currentSelectedValue = this.value;

    // reset options to prevent duplicates
    this.innerHTML = '<option value="" disabled selected>Best Song</option>';

    const songElements = document.querySelectorAll(".song-item");
    songElements.forEach( (songElement) => {
        const songNameInput = songElement.querySelector(".song-name");
        if (songNameInput.value != "") {
            const songItem = document.createElement("option");
            songItem.textContent = songNameInput.value;
            dropdownButton.appendChild(songItem);
        }
    });

    // re-set the last selected value
    this.value = currentSelectedValue;
});

async function checkAuth() {
  const response = await fetch(`/api/check_auth`);
  if (!response.ok) {
    window.location.href = 'index.html';
  }
}

window.onload = checkAuth();

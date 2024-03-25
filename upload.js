// HTTP REQUESTS
const baseUrl = 'https://localhost:7231/';

// Implement backend request for route containing SpotifyAPI request (AlbumController.cs)
document.getElementById("album-retrieval").addEventListener("submit", function(event) { 
    event.preventDefault();

    const formData = new FormData(this);
    console.log(formData);

    this.reset();

    const requestOptions = {
        method: "POST",
        body: formData
    };

    fetch("/album-retrieval", requestOptions)
        .then(Response => {
            if (!Response.ok) {
                throw new Error("Network response was not ok.");
            }
            return Response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error("Error:", error);
        });
});

// Implement backend request for uploading an album
document.getElementById("album-upload").addEventListener("submit", function(event) {
    event.preventDefault();

    // create the object
    const albumTitle = document.getElementById("album-name").value;
    const albumReleaseDate = document.getElementById("album-year").value;
    const albumComment = document.getElementById("album-comment").value;
    const albumUrl = document.getElementById("album-url").value;
    const albumArtworkUrl = document.getElementById("album-art-url").value;
    
    const artistName = document.getElementById("artist-name").value;
    const artistImageUrl = document.getElementById("artist-art-url").value;

    const songs = [];
    const songElements = document.querySelectorAll(".song-item");
    songElements.forEach( (songElement, index) => {

        let songTitle = songElement.querySelector(".song-name").value;
        const songFeatures = songElement.querySelector(".song-features").value;
        if (songFeatures != "") {
            songTitle = `${songTitle} (feat. ${songFeatures})`;
        }

        const song = {
            songTitle: songTitle,
            songUrl: songElement.querySelector(".song-url").value,  // ERROR: idk why yet.
            songNumber: index + 1,
            review: {
                reviewRating: songElement.querySelector(".song-rating").checked,
                reviewComment: songElement.querySelector(".song-comment").value
            }
        };
        songs.push(song);
    });

    const formDataObject = {
        albumTitle: albumTitle,
        albumReleaseDate: albumReleaseDate,
        albumComment: albumComment,
        albumUrl: albumUrl,
        albumArtworkUrl: albumArtworkUrl,
        artist: {
            artistName: artistName,
            artistImageUrl: artistImageUrl
        },
        songs: songs
    };
    console.log(formDataObject);
})



// FUNCTIONS

// Add song button functionality
function addSong()
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
}

// Create delete song functionality
function deleteSongElement(button)
{
    const parentContainer = button.parentNode;
    parentContainer.remove();

    const songsContainer = document.getElementById("songs-container");
    if (songsContainer.children.length == 0) {
        setTimeout(addSong, 150);
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
    
    // reset options to prevent duplicates
    dropdownButton.innerHTML = '<option value="" disabled selected>Best Song</option>';
    
    const songElements = document.querySelectorAll(".song-item");
    songElements.forEach( (songElement) => {
        const songNameInput = songElement.querySelector(".song-name");
        if (songNameInput.value != "") {
            const songItem = document.createElement("option");
            songItem.textContent = songNameInput.value;
            dropdownButton.appendChild(songItem);
        }
    });
});
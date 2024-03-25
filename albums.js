// CREATING ALBUM JSON ARRAY (EXPERIMENTAL)
const artistAlbumList = [
    {
        "image": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fourculturemag.com%2Fwp-content%2Fuploads%2F2022%2F12%2Flana-del-rey-1024x1024.jpeg&f=1&nofb=1&ipt=22d9d0000d03715176607ba03c78f2def64c062100ac51c2a6f27f6011a88d23&ipo=images", 
        "album_title": "Did you know that there's a tunnel under Ocean Blvd",
        "album_artist": "Lana Del Rey",
        "release_date": "2023",
        "release_date_precision": "year",
        "album_description": "This is one of her best albums. It's a bit different from her other stuff but a welcome change. Easily one of her best albums.",
        "tracks": [
            { "track_number": 1, "track_title": "The Grants", "track_comment": "I really enjoyed it.", "track_rating": false },
            { "track_number": 2, "track_title": "Did you know there's a tunnel under Ocean Blvd", "track_comment": "", "track_rating": false },
            { "track_number": 3, "track_title": "Sweet", "track_comment": "", "track_rating": true },
            { "track_number": 4, "track_title": "A&W", "track_comment": "", "track_rating": true },
            { "track_number": 5, "track_title": "Judah Smith Interlude", "track_comment": "", "track_rating": false },
            { "track_number": 6, "track_title": "Candy Necklace (feat. Hone Batiste)", "track_comment": "", "track_rating": true },
            { "track_number": 7, "track_title": "Jon Batiste Interlude", "track_comment": "", "track_rating": true },
            { "track_number": 8, "track_title": "Kintsugi", "track_comment": "", "track_rating": false },
            { "track_number": 9, "track_title": "Fingertips", "track_comment": "", "track_rating": true },
            { "track_number": 10, "track_title": "Paris, Texas (feat. SYML)", "track_comment": "", "track_rating": true },
            { "track_number": 11, "track_title": "Grandfather please stand on the shoulders of my father while he's deep-sea fishing (feat. RIOPY)", "track_comment": "", "track_rating": true },
            { "track_number": 12, "track_title": "Let The Light In (feat. Father John Misty)", "track_comment": "", "track_rating": true },
            { "track_number": 13, "track_title": "Margaret (feat. Bleachers)", "track_comment": "", "track_rating": false },
            { "track_number": 14, "track_title": "Fishtail", "track_comment": "", "track_rating": true },
            { "track_number": 15, "track_title": "Peppers", "track_comment": "", "track_rating": true },
            { "track_number": 16, "track_title": "Taco Truck x VB", "track_comment": "Easily my favorite.", "track_rating": true }
        ],
    }
];
const albumListJsonString = JSON.stringify(artistAlbumList);


let cardActive = false;

function flipCard(card) {
    card.classList.toggle("flipped");
    cardActive = !cardActive;
}

function generateAlbumCards()
{
    const albumCardsContainer = document.getElementById("album-cards__container");
    const albumsObj = JSON.parse(albumListJsonString);

    albumsObj.forEach(album => {

        console.log(album);

        // code
        const albumCard = document.createElement("div");
        albumCard.className = "album-card";
        albumCard.addEventListener("click", function() {
            flipCard(this);
        });
        albumCardsContainer.append(albumCard);
        
            const albumCardFront = document.createElement("div");
            albumCardFront.className = "album-card__front";
            albumCardFront.style.backgroundImage = `url("${album['image']}")`;
            albumCard.append(albumCardFront);

            const albumCardBack = document.createElement("div");
            albumCardBack.className = "album-card__back";
            albumCard.append(albumCardBack);

                const albumCardBackWrapper = document.createElement("div");
                albumCardBackWrapper.className = "album-card__back--wrapper";
                albumCardBack.append(albumCardBackWrapper);

                    const albumHeadings = document.createElement("div");
                    albumHeadings.className = "album-headings";
                    albumCardBackWrapper.append(albumHeadings);

                        const albumTitle = document.createElement("h2");
                        albumTitle.className = "album-title";
                        albumTitle.textContent = album["album_title"];
                        albumHeadings.append(albumTitle);

                        const albumSubheadings = document.createElement("div");
                        albumSubheadings.className = "album-subheadings";
                        albumHeadings.append(albumSubheadings);

                            const albumArtist = document.createElement("div");
                            albumArtist.className = "album-artist separator";
                            albumArtist.textContent = album["album_artist"];
                            albumSubheadings.append(albumArtist);

                            const albumYear = document.createElement("div");
                            albumYear.className = "album-year separator";
                            albumYear.textContent = album["release_date"];
                            albumSubheadings.append(albumYear);

                        const albumComments = document.createElement("div");
                        albumComments.className = "album-comments";
                        albumComments.innerHTML = `<span>${album["album_description"]}</span>`;
                        albumHeadings.append(albumComments);

                    const songsList = document.createElement("div");
                    songsList.className = "songs-list";
                    albumCardBackWrapper.append(songsList);

                    album["tracks"].forEach(song => {

                        console.log(song);

                        const songsListRow = document.createElement("div");
                        songsListRow.className = "songs-list-row";
                        songsList.append(songsListRow);

                            const songsListRowSongIndex = document.createElement("div");
                            songsListRowSongIndex.className = "songs-list-row__song-index";
                            songsListRow.append(songsListRowSongIndex);

                                const indexNumber = document.createElement("div");
                                indexNumber.className = "index-number";
                                songsListRowSongIndex.append(indexNumber);

                                    const indexNumberValue = document.createElement("span");
                                    indexNumberValue.className = "index-number__value";
                                    indexNumberValue.textContent = song["track_number"];
                                    indexNumber.append(indexNumberValue);

                            const songsListRowSongInfo = document.createElement("div");
                            songsListRowSongInfo.className = "songs-list-row__song-info";
                            songsListRow.append(songsListRowSongInfo);

                                const songsListRowSongInfoGrid = document.createElement("div");
                                songsListRowSongInfoGrid.className = "songs-list-row__song-info--grid";
                                songsListRowSongInfo.append(songsListRowSongInfoGrid);

                                    const songsListRowSongName = document.createElement("span");
                                    songsListRowSongName.className = "songs-list-row__song-name";
                                    songsListRowSongName.textContent = song["track_title"];
                                    songsListRowSongInfoGrid.append(songsListRowSongName);

                                    const songsListRowSongComment = document.createElement("span");
                                    songsListRowSongComment.className = "songs-list-row__song-comment";
                                    songsListRowSongComment.textContent = song["track_comment"];
                                    songsListRowSongInfoGrid.append(songsListRowSongComment);

                            const songsListColRating = document.createElement("div");
                            songsListColRating.className = "songs-list__col--rating";
                            songsListRow.append(songsListColRating);

                                const songsListRowRatingIcon = document.createElement("div");
                                songsListRowRatingIcon.className = "songs-list-row__rating-icon md-18 material-symbols-outlined";
                                songsListRowRatingIcon.textContent = "favorite";
                                if (song["track_rating"]) {
                                    songsListRowRatingIcon.classList.add("filled", "highlight");
                                }
                                songsListColRating.append(songsListRowRatingIcon);
        });
    });
}


window.onload = generateAlbumCards();


// const scrollContainer = document.querySelector("body");

// scrollContainer.addEventListener("wheel", (evt) => {
//     evt.preventDefault();
//     scrollContainer.scrollLeft -= evt.deltaY;
// });

// function smoothScrollTo(element, targetScrollLocation, duration)
// {
//     var startScrollLocation = element.scrollLeft;
//     var distance = targetScrollLocation - startScrollLocation;
//     var startTime = null;

//     function animationStep(timestamp)
//     {
//         if (!startTime) startTime = timestamp;
//         var progress = timestamp - startTime;

//         element.scrollLeft = easeInOutQuad(progress, startScrollLocation, distance, duration);

//         if (progress < duration) {
//             window.requestAnimationFrame(animationStep);
//         }
//     }

//     function easeInOutQuad(t, b, c, d)
//     {
//         t /= d / 2;
//         if (t < 1)  return (c / 2 * t * t + b);
//         t--;
//         return (-c / 2 * (t * (t - 2) - 1) + b);
//     }

//     window.requestAnimationFrame(animationStep);
// }

let lastScrollTimestamp = 0;

const scrollableContainer = document.getElementById("scrollable-container");
scrollableContainer.addEventListener("wheel", function(event) {
    event.preventDefault();
    const currentTimestamp = Date.now();
    const timeSinceLastScroll = currentTimestamp - lastScrollTimestamp;

    if (cardActive)  return;
    // if (timeSinceLastScroll < 100)  return;

    lastScrollTimestamp = currentTimestamp;
    var scrollAmount = event.deltaY || -event.wheelDelta;
    document.documentElement.scrollLeft += scrollAmount;



        // var targetScroll = document.documentElement.scrollLeft + (scrollAmount * 5);
        // smoothScrollTo(document.documentElement, targetScroll, 300);


    // Preventing overscroll to left
    if (document.documentElement.scrollLeft < 0) {
        document.documentElement.scroll = 0;
    }

    // Prevent overscroll to right
    var maxScrollLeft = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    if (document.documentElement.scrollLeft > maxScrollLeft) {
        document.documentElement.scrollLeft = maxScrollLeft;
    }
});
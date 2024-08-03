// const baseUrl = 'http://127.0.0.1:8000';


function getAlbumInformationFromBackend(artistId)
{
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };

    return fetch(`/api/albums/${artistId}`, requestOptions)
        .then(Response => {
            if (!Response.ok) {
                throw new Error("Network response was not ok.");
            }
            return Response.json();
        })
        .then(data => {
            console.log(data);
            return data;

            generateAlbumCards(data);
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
}


// THINK OF A NEW LOGIC FOR DETERMINING FLIPPED CARDS!
// - Should you be able to scroll with cards flipped?
function flipCard(card) {
    if (!isDragging) {
        card.classList.toggle("flipped");

        var songsList = card.querySelector('.songs-list');
        if (card.classList.contains('flipped')) {
            songsList.style.pointerEvents = 'auto';
        } else {
            songsList.style.pointerEvents = 'none';
        }

    }
}
function centerCard(card) {
    if (isDragging) return;

    const cardRect = card.getBoundingClientRect();
    const sliderRect = slider.getBoundingClientRect();

    // Calc center position
    const cardCenterX = cardRect.left + cardRect.width / 2;
    const sliderCenterX = sliderRect.left + sliderRect.width / 2;

    // Calc scroll amount
    const scrollAmount = cardCenterX - sliderCenterX;

    slider.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}


const selectedArtistId = sessionStorage.getItem("selectedArtistId");
window.onload = function () {
    getAlbumInformationFromBackend(selectedArtistId)
        .then(albumData => {
            const template_source = document.getElementById("album-template").innerHTML;
            const template = Handlebars.compile(template_source);

            const albums = albumData['albums'];
            for (let i = 0; i < albums.length; ++i) {
                if (albums[i]["Comment"] == "") {
                    albums[i]["Comment"] = "No album comment.";
                }
                albums[i]["ReleaseDate"] = new Date(albums[i]["ReleaseDate"]).getFullYear();
            }

            const html = template(albumData);
            document.getElementById("album-cards__container").innerHTML = html;

            document.querySelectorAll('.album-card').forEach(album => {
                album.addEventListener("click", function() {
                    flipCard(this);
                    centerCard(this)
                });
            });
        })
        .catch(error => {
            console.error("Error fetching album information: ", error)
        });
};


// let lastScrollTimestamp = 0;

// const scrollableContainer = document.getElementById("scrollable-container");
// scrollableContainer.addEventListener("wheel", function(event) {
//     event.preventDefault();
//     const currentTimestamp = Date.now();
//     const timeSinceLastScroll = currentTimestamp - lastScrollTimestamp;

//     lastScrollTimestamp = currentTimestamp;
//     var scrollAmount = event.deltaY || -event.wheelDelta;
//     document.documentElement.scrollLeft += scrollAmount;

//     // Preventing overscroll to left
//     if (document.documentElement.scrollLeft < 0) {
//         document.documentElement.scroll = 0;
//     }

//     // Prevent overscroll to right
//     var maxScrollLeft = document.documentElement.scrollWidth - document.documentElement.clientWidth;
//     if (document.documentElement.scrollLeft > maxScrollLeft) {
//         document.documentElement.scrollLeft = maxScrollLeft;
//     }
// });


const slider = document.getElementById('album-cards__container');
let isDown = false;
let startX;
let scrollLeft;
let isDragging = false;
const dragThreshold = 3;

slider.addEventListener('mousedown', (e) => {
    isDown = true;
    isDragging = false;
    slider.classList.add('active');
    // startX = e.pageX - slider.offsetLeft;
    startX = e.pageX - slider.getBoundingClientRect().left;
    scrollLeft = slider.scrollLeft;
});
slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('active');
});
slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('active');
});
slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();

    // const x = e.pageX - slider.offsetLeft;
    const x = e.pageX - slider.getBoundingClientRect().left;
    const walk = (x - startX) * 1;
    slider.scrollLeft = scrollLeft - walk;

    if (Math.abs(x - startX) > dragThreshold) {
        isDragging = true;
    }
});
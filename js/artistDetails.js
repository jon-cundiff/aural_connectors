import { getArtistDetails, getConcerts } from "./ticketmaster.js";
import { getParams } from "./getParams.js";

const artistDiv = document.getElementById("artistDiv");
const artistImages = document.getElementById("artistImages");
const upcomingConcerts = document.getElementById("upcomingConcerts");
const requiredKeys = ["id"];

const params = getParams(requiredKeys);
if (!params.id) {
    window.location.assign("/");
}

const displayArtist = (artist) => {
    let externalLinkItems = [];
    if (artist.externalLinks) {
        const valuableKeys = [
            "lastfm",
            "spotify",
            "twitter",
            "youtube",
            "facebook",
            "homepage",
        ];
        const externalLinkKeys = valuableKeys.filter(
            (key) => artist.externalLinks[key]
        );
        externalLinkItems = externalLinkKeys.map(
            (key) => `
        <p><a href="${artist.externalLinks[key][0].url}">${key}</a></p>
      `
        );
    }
    artistDiv.innerHTML = `<h1>${artist.name}</h1>
    ${artist.classifications[0].genre
            ? `<h3>Genre: ${artist.classifications[0].genre.name}</h3>`
            : ""
        }
    <div class="externalLinks">${externalLinkItems.join("")}</div>
          `;
};

async function displayArtistImages(images) {
    const max = Math.max.apply(
        Math,
        images.map(function (img) {
            return img.width;
        })
    );
    const index = images.findIndex((image) => image.width === max);
    artistImages.innerHTML = `<img src="${images[index].url}">`;
}

function displayUpcomingConcerts(concertData) {
    const events = concertData._embedded.events;
    const concertsHTML = events.map((concert) => {
        let countryOrState = concert._embedded.venues[0].country.name;
        if (concert._embedded.venues[0].state) {
            countryOrState = concert._embedded.venues[0].state.stateCode
                ? concert._embedded.venues[0].state.stateCode
                : concert._embedded.venues[0].state.name;
        }
        const startDate = new Date(
            concert.dates.start.dateTime
        ).toLocaleString();

        return `
            <a class="concert carouselItem" href="/concert.html?id=${concert.id
            }">
                <div class="concertImgContainer">
                    <img class="concertImg" src=${concert.images[0].url} />
                </div>
                <h3>${concert.name}</h3>
                ${concert._embedded.venues[0].name
                ? `<i>${concert._embedded.venues[0].name}</i>`
                : ""
            }
                <b>${concert._embedded.venues[0].city.name
            }, ${countryOrState}</b>
                <h4>${startDate}</h4>
                <div class="hover"></div>
            </a>
        `;
    });
    upcomingConcerts.innerHTML = concertsHTML.join("");
}

getArtistDetails(params.id)
    .then((artist) => {
        displayArtist(artist);
        displayArtistImages(artist.images);
    })
    .catch(() => {
        const detailsContainer = document.getElementById("detailsContainer");
        detailsContainer.innerHTML = `<div class="horizontalContainer detailsError"><h4>We were unable to get the artist details.</h4></div>`;
    });

getConcerts(params.id, "attractionId")
    .then((concertData) => {
        displayUpcomingConcerts(concertData);
    })
    .catch(() => {
        upcomingConcerts.parentElement.classList.add("detailsError");
        upcomingConcerts.parentElement.innerHTML =
            "<h4>We we unable to get the upcoming concerts.</h4>";
    });

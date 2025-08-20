// Display all episodes on the page
let allEpisodes = [];
function setup() {
  allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = ""; // Clear any existing text

  // Add a class for CSS grid
  rootElem.className = "episodes-grid";

  episodeList.forEach((episode) => {
    // Create a container for each episode
    const episodeSection = document.createElement("section");
    episodeSection.className = "episode-card";

    // Episode code, zero-padded
    const seasonStr = String(episode.season).padStart(2, "0");
    const numberStr = String(episode.number).padStart(2, "0");
    const episodeCode = `S${seasonStr}E${numberStr}`;

    // Episode title with bold episode code
    const titleElem = document.createElement("h3");
    titleElem.innerHTML = `<strong>${episodeCode}</strong> - ${episode.name}`;
    episodeSection.appendChild(titleElem);

    // Image
    if (episode.image && episode.image.medium) {
      const imgElem = document.createElement("img");
      imgElem.src = episode.image.medium;
      imgElem.alt = episode.name;
      episodeSection.appendChild(imgElem);
    }

    // Summary
    const summaryElem = document.createElement("div");
    summaryElem.innerHTML = episode.summary || "No summary available.";
    episodeSection.appendChild(summaryElem);

    // Link back to TVMaze
    const linkElem = document.createElement("a");
    linkElem.href = episode.url;
    linkElem.target = "_blank";
    linkElem.textContent = "View on TVMaze.com";
    episodeSection.appendChild(linkElem);

    // Append episode card to root
    rootElem.appendChild(episodeSection);
  });
}

let searchInput = document.getElementById("search-box");
searchInput.addEventListener("input", function () {
  let searchValue = searchInput.value.toLowerCase();
  let result = filterEpisodes(searchValue, allEpisodes);
  makePageForEpisodes(result);
});

function filterEpisodes(searchValue, allEpisodes) {
  let filterEpisode = allEpisodes.filter(function (episode) {
    let matchedTitle = episode.name.toLowerCase().includes(searchValue);
    return matchedTitle;
  });
  return filterEpisode;
}
window.onload = setup;

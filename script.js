let allEpisodes = [];
let allShows = [];
let episodesCache = {};

function fetchAllShows() {
  const showSelect = document.getElementById("select-show");
  showSelect.innerHTML = "";
  showSelect.appendChild(createOption("", "loading shows..."));

  fetch("https://api.tvmaze.com/shows")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to fetch TV shows. Please try again later.");
      }
      return response.json();
    })
    .then(function (data) {
      allShows = data;
      allShows.sort(function (a, b) {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });

      showSelect.innerHTML = `<option value = "">Select a show</option>`;

      allShows.forEach(function (show) {
        const option = document.createElement("option");
        option.value = show.id;
        option.innerHTML = show.name;
        showSelect.appendChild(option);
      });
    })
    .catch(function (error) {
      showSelect.innerHTML = `<option value = "">Error loading shows</option>`;
      console.error("Fetch error:", error);
    });
}

function createElement(tag, className, content) {
  const elem = document.createElement(tag);
  if (className) elem.className = className;
  if (content) elem.innerHTML = content;
  return elem;
}

function formatEpisodeCode(episode) {
  const seasonStr = String(episode.season).padStart(2, "0");
  const numberStr = String(episode.number).padStart(2, "0");
  return `S${seasonStr}E${numberStr}`;
}

function stripHtmlTags(str) {
  return str.replace(/<[^>]*>/g, "");
}

function createOption(value, text) {
  const opt = document.createElement("option");
  opt.value = value;
  opt.textContent = text;
  return opt;
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = "";
  rootElem.className = "episodes-grid";

  const countElem = document.getElementById("title-count");
  countElem.textContent = `Displaying ${episodeList.length} / ${allEpisodes.length} episodes`;

  episodeList.forEach((episode) => {
    const episodeSection = createElement("section", "episode-card");
    const episodeCode = formatEpisodeCode(episode);

    episodeSection.appendChild(
      createElement(
        "h3",
        "",
        `<strong>${episodeCode}</strong> - ${episode.name}`
      )
    );

    if (episode.image && episode.image.medium) {
      const imgElem = createElement("img");
      imgElem.src = episode.image.medium;
      imgElem.alt = episode.name;
      episodeSection.appendChild(imgElem);
    }

    const summaryElem = createElement(
      "div",
      "",
      episode.summary || "No summary available."
    );
    episodeSection.appendChild(summaryElem);

    const linkElem = createElement("a");
    linkElem.href = episode.url;
    linkElem.target = "_blank";
    linkElem.textContent = "View on TVMaze.com";
    episodeSection.appendChild(linkElem);

    rootElem.appendChild(episodeSection);
  });
}

function fillTitleDropdown(allEpisodes) {
  const selectElem = document.getElementById("title-select");
  selectElem.innerHTML = "";
  selectElem.appendChild(createOption("all", "Show All Episodes"));

  allEpisodes.forEach((episode) => {
    const episodeCode = formatEpisodeCode(episode);
    selectElem.appendChild(
      createOption(episode.id, `${episodeCode} - ${episode.name}`)
    );
  });
}

function filterEpisodes(searchValue) {
  return allEpisodes.filter((episode) => {
    const matchedTitle = episode.name.toLowerCase().includes(searchValue);
    const summaryMatch = episode.summary
      ? stripHtmlTags(episode.summary).toLowerCase().includes(searchValue)
      : false;
    return matchedTitle || summaryMatch;
  });
}

document.getElementById("title-select").addEventListener("change", function () {
  const value = this.value;
  if (value === "all") makePageForEpisodes(allEpisodes);
  else {
    const episode = allEpisodes.find((e) => e.id == value);
    makePageForEpisodes([episode]);
  }
});

document.getElementById("search-box").addEventListener("input", function () {
  const searchValue = this.value.toLowerCase();
  const result = filterEpisodes(searchValue);
  makePageForEpisodes(result);
});

function fetchEpisodes() {
  const selectElem = document.getElementById("title-select");
  selectElem.innerHTML = "";
  selectElem.appendChild(createOption("", "Loading episodes..."));

  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      allEpisodes = data;
      fillTitleDropdown(allEpisodes);
      makePageForEpisodes(allEpisodes);
    })
    .catch((error) => {
      selectElem.innerHTML = "";
      selectElem.appendChild(createOption("", "Error loading episodes"));
      const rootElem = document.getElementById("root");
      rootElem.textContent = "Sorry, there was an error loading the episodes.";
      console.error("Fetch error:", error);
    });
}

window.onload = fetchEpisodes;

// js/script.js

let allGames = [];

/* LOAD CSV */

async function loadCSV() {

  const response = await fetch(
    "https://docs.google.com/spreadsheets/d/1Vdm7gPpnZDvqJw8n7WaxFyjF8-nDQRpooZrpEuJDV9M/export?format=csv"
  );

  const csv = await response.text();

  const lines = csv.trim().split("\n");

  const headers = lines[0]
    .split(",")
    .map(h => h.trim());

  allGames = lines.slice(1).map(line => {

    const values =
      line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);

    let game = {};

    headers.forEach((header, index) => {

      game[header] =
        values[index]
          ?.replace(/^"|"$/g, "")
          .trim() || "";

    });

    return game;

  });

  populateFilters();
  renderGames(allGames);

}

/* RENDER GAMES */

function renderGames(games){

  const container =
    document.getElementById("gamesContainer");

  container.innerHTML = "";

  games.forEach(game => {

    const weight =
      game.weight.toUpperCase();

    container.innerHTML += `

      <div class="game-card">

        <img
          class="game-image"
          src="${game.image}"
          alt="${game.title}"
          loading="lazy"
        >

        <div class="game-content">

          <h2 class="game-title">
            ${game.title}
          </h2>

          <div class="badge ${weight}">
            ${weight}
          </div>

          <div class="game-info">

            🎮 ${game.platform}<br>
            ⚡ ${game.emulator}<br>
            💾 ${game.size_gb} GB<br>
            🧠 RAM: ${game.min_ram}GB+

          </div>

          <a
            class="view-btn"
            href="${game.download_link}"
            target="_blank"
          >
            DOWNLOAD
          </a>

        </div>

      </div>

    `;

  });

}

/* FILTERS */

function populateFilters(){

  const emulatorFilter =
    document.getElementById("emulatorFilter");

  const genreFilter =
    document.getElementById("genreFilter");

  const emulators =
    [...new Set(allGames.map(g => g.emulator))];

  const genres =
    [...new Set(allGames.map(g => g.genre))];

  emulators.forEach(emulator => {

    emulatorFilter.innerHTML += `
      <option value="${emulator}">
        ${emulator}
      </option>
    `;

  });

  genres.forEach(genre => {

    genreFilter.innerHTML += `
      <option value="${genre}">
        ${genre}
      </option>
    `;

  });

}

/* SEARCH */

document.getElementById("searchInput")
.addEventListener("input", filterGames);

document.getElementById("emulatorFilter")
.addEventListener("change", filterGames);

document.getElementById("genreFilter")
.addEventListener("change", filterGames);

document.getElementById("weightFilter")
.addEventListener("change", filterGames);

/* FILTER FUNCTION */

function filterGames(){

  const search =
    document.getElementById("searchInput")
    .value
    .toLowerCase();

  const emulator =
    document.getElementById("emulatorFilter")
    .value;

  const genre =
    document.getElementById("genreFilter")
    .value;

  const weight =
    document.getElementById("weightFilter")
    .value;

  const filtered = allGames.filter(game => {

    const matchesSearch =
      game.title.toLowerCase().includes(search) ||
      game.tags.toLowerCase().includes(search);

    const matchesEmulator =
      !emulator ||
      game.emulator === emulator;

    const matchesGenre =
      !genre ||
      game.genre === genre;

    const matchesWeight =
      !weight ||
      game.weight.toUpperCase() === weight;

    return (
      matchesSearch &&
      matchesEmulator &&
      matchesGenre &&
      matchesWeight
    );

  });

  renderGames(filtered);

}

loadCSV();

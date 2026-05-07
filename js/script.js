// js/script.js

let allGames = [];

// LOAD CSV
async function loadCSV() {

  const response = await fetch(https://docs.google.com/spreadsheets/d/1Vdm7gPpnZDvqJw8n7WaxFyjF8-nDQRpooZrpEuJDV9M/export?format=csv");
  const data = await response.text();

  const rows = data.split("\n").slice(1);

  allGames = rows.map(row => {

    const cols = row.split(",");

    return {
      id: cols[0],
      title: cols[1],
      platform: cols[2],
      emulator: cols[3],
      genre: cols[4],
      size_gb: cols[5],
      min_ram: cols[6],
      recommended_ram: cols[7],
      gpu_level: cols[8],
      offline: cols[9],
      fps_low: cols[10],
      fps_mid: cols[11],
      fps_high: cols[12],
      weight: cols[13],
      image: cols[14],
      description: cols[15],
      download_link: cols[16],
      emulator_link: cols[17],
      tags: cols[18],
      release_year: cols[19],
      android_support: cols[20],
      vulkan_required: cols[21],
      controller_support: cols[22],
      multiplayer: cols[23]
    };

  });

  populateFilters();
  renderGames(allGames);

}

function renderGames(games){

  const container = document.getElementById("gamesContainer");

  container.innerHTML = "";

  games.forEach(game => {

    container.innerHTML += `

      <div class="game-card">

        <img
          class="game-image"
          src="${game.image}"
          alt="${game.title}"
          loading="lazy"
        >

        <div class="game-content">

          <h2 class="game-title">${game.title}</h2>

          <div class="badge ${game.weight}">
            ${game.weight}
          </div>

          <div class="game-info">

            🎮 ${game.platform}<br>
            ⚡ ${game.emulator}<br>
            💾 ${game.size_gb} GB<br>
            RAM: ${game.min_ram}GB+

          </div>

          <a
            class="view-btn"
            href="game.html?id=${game.id}"
          >
            VIEW GAME
          </a>

        </div>

      </div>

    `;

  });

}

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

/* FILTERS */

document.getElementById("emulatorFilter")
.addEventListener("change", filterGames);

document.getElementById("genreFilter")
.addEventListener("change", filterGames);

document.getElementById("weightFilter")
.addEventListener("change", filterGames);

function filterGames(){

  const search =
    document.getElementById("searchInput")
    .value.toLowerCase();

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
      !emulator || game.emulator === emulator;

    const matchesGenre =
      !genre || game.genre === genre;

    const matchesWeight =
      !weight || game.weight === weight;

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

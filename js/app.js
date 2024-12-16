let countries = [];
let filteredCountries = [];
let currentPage = 1;
let resultPerPage;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

let padding;

if (window.innerWidth > 1025) {
  padding = "300px";
} else if (window.innerWidth > 787) {
  padding = "250px";
} else if (window.innerWidth > 426) {
  padding = "200px";
} else {
  padding = "150px";
}

// DOM reference
const cardsContainer = document.querySelector(".country-cards");

resultPerPage = window.innerWidth < 768 ? 8 : 12;

async function fetchCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    countries = await response.json();
    filteredCountries = [...countries];
    populateFilters();
    renderCards();
  } catch (err) {
    console.error("Error fetching countries:", err);
  }
}

fetchCountries();

// Filter country data
function filterData(country) {
  return {
    flags: country.flags?.png || "../images/default-flag.png",
    name: country.name?.common || "Unknown Country",
    tld: country.tld?.join(", ") || "N/A",
    region: country.region || "N/A",
    subregion: country.subregion || "N/A",
    area: country.area || "N/A",
    capital: country.capital?.join(", ") || "N/A",
    population: country.population || "N/A",
    languages: country.languages
      ? Object.values(country.languages).join(", ")
      : "N/A",
    currencies: country.currencies
      ? Object.values(country.currencies)
          .map((currency) => `${currency.name} (${currency.symbol || "-"})`)
          .join(", ")
      : "N/A",
  };
}

// Create country card
function createCard(country) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("country-data", JSON.stringify(country));
  card.innerHTML = `
    <img src="${country.flags}" alt="Flag of ${country.name}" />
    <h3>${country.name}</h3>`;
  return card;
}

// Render cards on the page
function renderCards() {
  const start = (currentPage - 1) * resultPerPage;
  const end = currentPage * resultPerPage;
  const currentData = filteredCountries.slice(start, end);

  currentData.forEach((country) => {
    cardsContainer.appendChild(createCard(filterData(country)));
  });

  document
    .getElementById("show-more")
    .classList.toggle("hidden", end >= filteredCountries.length);
}

// Event listener for "Show More" button
document.getElementById("show-more").addEventListener("click", () => {
  currentPage++;
  renderCards();
});

//? Details Page

// Country Details Page
function renderDetails(country) {
  country = JSON.parse(country);

  document.querySelector(".main").style.display = "none";

  const detailsDiv = document.querySelector(".country-details");
  detailsDiv.style.display = "flex";

  detailsDiv.setAttribute("country-data", JSON.stringify(country));

  // Check if the country is already in favorites
  const isFavorite = favorites.some((fav) => fav.name === country.name);

  detailsDiv.innerHTML = `
  <div class="btn">
    <button id="close-details" class="close-btn">
      <i class="fa-solid fa-arrow-left"></i> Back
    </button>
  </div>
  <p id="full" style="display: none">
    <span>Favorites list is full. You can add max 5 countries only in favorites.</span>
  </p>
  <div class="country-info">
    <div class="country-flag">
      <i id="favorite-icon" 
      class="${isFavorite ? "fa-solid" : "fa-regular"} fa-heart" 
      style="${isFavorite ? "color: #ff0000;" : ""}">
      </i>
      <img src="${country.flags}" alt="Flag of ${country.name}" />
      <h1>${country.name}</h1>
    </div>

    <div class="details">
      <h4>Top Level Domain: <span>${country.tld}</span></h4>
      <h4>Region: <span>${country.region}</span></h4>
      <h4>SubRegion: <span>${country.subregion}</span></h4>
      <h4>Area: <span>${country.area}</span></h4>
      <h4>Capital: <span>${country.capital}</span></h4>
      <h4>Population: <span>${country.population}</span></h4>
      <h4>Languages: <span>${country.languages}</span></h4>
      <h4>Independent: <span>${country.independent}</span></h4>
      <h4>Currencies: <span>${country.currencies}</span></h4>
    </div>
  </div>`;

  // Event Listener on the close button
  document.querySelector(".close-btn").addEventListener("click", () => {
    document.querySelector(".main").style.display = "flex";
    detailsDiv.style.display = "none";
  });

  // Add event listener on the favorite icon in details page
  document.getElementById("favorite-icon").addEventListener("click", (e) => {
    handleFavoritesIcon(e.target);
  });
}

// Add event listener on the Country Cards
document.querySelector(".country-cards").addEventListener("click", (e) => {
  if (e.target.closest(".card")) {
    renderDetails(e.target.closest(".card").getAttribute("country-data"));
  }
});

//? Favorites List

function handleFavoritesIcon(target) {
  let country = target
    .closest(".country-details")
    .getAttribute("country-data");

    // Parse country object
    country = JSON.parse(country);
  
  if (target.classList.contains("fa-regular") && favorites.length < 5) {
    target.classList.add("fa-solid");
    target.classList.remove("fa-regular");
    target.style.color = "#ff0000";
    addToFavorites(country);
  } else if (target.classList.contains("fa-solid")) {
    target.classList.remove("fa-solid");
    target.classList.add("fa-regular");
    target.style.removeProperty("color");
    removeFromFavorites(country);
  } else {
    document.getElementById("full").style.display = "block";
    setTimeout(() => {
      document.getElementById("full").style.display = "none";
    }, 2000);
  }
}

// Add to Favorites
function addToFavorites(country) {

  const favoritesList = document.getElementById("favorites-list");

  // Add country to favorites if less than 5
  const Data = createCard(country);
  favoritesList.appendChild(Data);
  favorites.push(country);
  localStorage.setItem("favorites", JSON.stringify(favorites));

  renderFavorites();
}

// Remove from Favorites
function removeFromFavorites(country) {
  const favoritesList = document.getElementById("favorites-list");
  const cards = Array.from(favoritesList.children); // Convert NodeList to an Array

  // Remove country from favorites array and update localStorage
  favorites = favorites.filter((fav) => fav.name !== country.name);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  

  const cardToRemove = cards.find((card) => card.dataset.name === country.name);
  if (cardToRemove) {
    favoritesList.removeChild(cardToRemove);
  }

  renderFavorites();

}


// Render favorites from localStorage
function renderFavorites() {
  const favoritesList = document.getElementById("favorites-list");
  favoritesList.innerHTML = ""; // Clear existing cards
  favorites.forEach((country) => {
    favoritesList.appendChild(createCard(country));
  });

  if(favorites.length === 0){
    document.querySelector('.favorites').style.display = 'none';
    document.querySelector('.container').style.removeProperty('padding-right');
  }else{
    document.querySelector('.favorites').style.display = 'block';
    favoritesList.style.display = 'flex';
    document.querySelector('.container').style.paddingRight = padding;
  }
}

// Event listener to show details
document.getElementById("favorites-list").addEventListener("click", (e) => {
  if (e.target.closest(".card")) {
    renderDetails(e.target.closest(".card").getAttribute("country-data"));
  }
});

// Initialize favorites on page load
document.addEventListener("DOMContentLoaded", renderFavorites);


//? Filters
// Update search suggestions
function updateSuggestions(query) {
  filteredCountries = [...countries]; // Reset to the full list of countries
  currentPage = 1; // Reset to the first page
  const suggestions = document.getElementById("search-suggestions");
  suggestions.innerHTML = ""; // Clear previous suggestions

  if (!query.trim()) {
    suggestions.classList.add("hidden");
    return;
  }

  // Refine search logic: match countries starting with query
  filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().startsWith(query.toLowerCase())
  );

  if (filteredCountries.length === 0) {
    suggestions.classList.add("hidden");
    return;
  }

  const suggestionItems = filteredCountries.slice(0, 5).map((country) => {
    const item = document.createElement("li");
    item.textContent = country.name.common;
    item.addEventListener("click", () => {
      cardsContainer.innerHTML = "";
      cardsContainer.appendChild(createCard(filterData(country)));
      document.getElementById("search-suggestions").classList.add("hidden");
      document
        .getElementById("show-more")
        .classList.toggle("hidden", 1 <= filteredCountries.length);
    });

    return item;
  });

  const viewAllItem = document.createElement("li");
  viewAllItem.textContent = "View All";
  viewAllItem.classList.add("view-all");
  viewAllItem.addEventListener("click", () => {
    cardsContainer.innerHTML = "";
    document.getElementById("search-suggestions").classList.add("hidden");
    renderCards();
  });

  populateFilters();
  suggestionItems.forEach((item) => suggestions.appendChild(item));
  if (filteredCountries.length > 1) suggestions.appendChild(viewAllItem);
  suggestions.classList.remove("hidden");
}

// Populate region and language filters
function populateFilters() {
  const regionFilter = document.getElementById("region-filter");
  const languageFilter = document.getElementById("language-filter");

  // Populate region filter
  const regions = [
    ...new Set(filteredCountries.map((country) => country.region)),
  ];
  regions.forEach((region) => {
    const option = document.createElement("option");
    option.value = region;
    option.textContent = region;
    regionFilter.appendChild(option);
  });

  // Populate language filter
  const languages = [
    ...new Set(
      filteredCountries.flatMap((country) =>
        Object.values(country.languages || {})
      )
    ),
  ];
  languages.forEach((language) => {
    const option = document.createElement("option");
    option.value = language;
    option.textContent = language;
    languageFilter.appendChild(option);
  });
}

function filterByCategory() {
  const regionFilterValue = document.getElementById("region-filter").value;
  const languageFilterValue = document.getElementById("language-filter").value;
  filteredCountries = [...countries]; // Reset to the full list of countries

  // Apply only one filter at a time
  if (regionFilterValue && !languageFilterValue) {
    filteredCountries = filteredCountries.filter(
      (country) => country.region === regionFilterValue
    );
  } else if (languageFilterValue && !regionFilterValue) {
    filteredCountries = filteredCountries.filter(
      (country) =>
        country.languages &&
        Object.values(country.languages).includes(languageFilterValue)
    );
  }

  cardsContainer.innerHTML = ""; // Clear existing cards
  currentPage = 1; // Reset to the first page
  renderCards();
}


// Add event listener to search input
document.getElementById("search").addEventListener("input", (e) => {
  const query = e.target.value;
  updateSuggestions(query);
});


// Toggle filter visibility on small screens
const toggleFiltersButton = document.getElementById("toggle-filters");
const filterContainer = document.querySelector(".filter");

toggleFiltersButton.addEventListener("click", () => {
  filterContainer.classList.toggle("show-filters");
});

// Add event listeners for region and language filters
document
  .getElementById("region-filter")
  .addEventListener("change", () => {
    // Clear language filter when region filter is used
    document.getElementById("language-filter").value = "";
    filterByCategory();
  });

document
  .getElementById("language-filter")
  .addEventListener("change", () => {
    // Clear region filter when language filter is used
    document.getElementById("region-filter").value = "";
    filterByCategory();
  });

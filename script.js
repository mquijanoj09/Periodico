// Theme Toggle Functionality
const themeToggle = document.getElementById("themeToggle");
const body = document.body;
let isDarkMode = false;

themeToggle.addEventListener("click", () => {
  isDarkMode = !isDarkMode;
  body.classList.toggle("dark-mode");
  themeToggle.innerHTML = isDarkMode
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
});

// Search Functionality
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchResults = document.getElementById("searchResults");

searchBtn.addEventListener("click", performSearch);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") performSearch();
});

function performSearch() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const newsCards = document.querySelectorAll(".news-card");
  let foundResults = 0;

  newsCards.forEach((card) => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    const content = card.querySelector("p").textContent.toLowerCase();

    if (title.includes(searchTerm) || content.includes(searchTerm)) {
      card.style.display = "block";
      foundResults++;
    } else {
      card.style.display = "none";
    }
  });

  // Update search results text
  if (searchTerm !== "") {
    searchResults.innerHTML = `<h3 class="search-results-text">Resultados para "${searchTerm}"</h3>`;
    searchResults.style.display = "block";
  } else {
    searchResults.style.display = "none";
    newsCards.forEach((card) => {
      card.style.display = "block";
    });
  }
}

// Smooth Scrolling for Navigation
document.querySelectorAll("nav a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const section = document.querySelector(this.getAttribute("href"));
    section.scrollIntoView({ behavior: "smooth" });
  });
});

// Load News Articles
async function getArticleId() {
  const response = await fetch("./data/news.json");
  const data = await response.json();

  // Loop through each category in the data object
  Object.keys(data).forEach((category) => {
    const articles = data[category];
    const newsSection = document.querySelector(`#${category} .news-grid`);

    // Check if the section for this category exists in the HTML
    if (newsSection) {
      // Loop through each article in the category
      articles.forEach((article) => {
        const newsCard = document.createElement("div");
        newsCard.classList.add("news-card");
        newsCard.innerHTML = `
            <a href="article.html?id=${article.id}" class="news-card">
              <img src="${article.image}" alt="${article.title}" />
              <div class="content">
                <span class="news-category">${article.category}</span>
                <h3>${article.title}</h3>
                <p>${article.summary}</p>
                <div class="news-meta">
                  <span>${article.readTime} de lectura</span>
                  <span>${article.publishedAt}</span>
                </div>
              </div>
            </a>
          `;
        newsSection.appendChild(newsCard);
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  getArticleId();
});

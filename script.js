// Theme Toggle Functionality
const themeToggle = document.getElementById("themeToggle");
const body = document.body;
let isDarkMode = false;

themeToggle.addEventListener("click", () => {
  isDarkMode = !isDarkMode;
  body.style.setProperty("--primary", isDarkMode ? "#ffffff" : "#1a1a1a");
  body.style.setProperty("--secondary", isDarkMode ? "#1a1a1a" : "#f5f5f5");
  body.style.setProperty("--text", isDarkMode ? "#f5f5f5" : "#2c2c2c");
  themeToggle.innerHTML = isDarkMode
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
});

// Weather Widget
async function getWeather() {
  try {
    const weatherContent = document.getElementById("weatherContent");

    // Get user's location
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const { latitude, longitude } = position.coords;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=YOUR_API_KEY&units=metric`
    );
    const data = await response.json();

    weatherContent.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                    <h2 style="margin-bottom: 0.5rem;">${data.name}</h2>
                    <p style="font-size: 2rem; font-weight: bold;">${Math.round(
                      data.main.temp
                    )}°C</p>
                    <p>${data.weather[0].description}</p>
                </div>
                <img src="http://openweathermap.org/img/w/${
                  data.weather[0].icon
                }.png" alt="Weather icon" style="width: 100px;">
            </div>
        `;
  } catch (error) {
    console.error("Error fetching weather:", error);
    document.getElementById("weatherContent").innerHTML =
      "Unable to fetch weather data";
  }
}

// Search Functionality
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", performSearch);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") performSearch();
});

function performSearch() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const newsCards = document.querySelectorAll(".news-card");

  newsCards.forEach((card) => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    const content = card.querySelector("p").textContent.toLowerCase();

    if (title.includes(searchTerm) || content.includes(searchTerm)) {
      card.style.display = "block";
      card.style.animation = "fadeIn 0.5s ease-in";
    } else {
      card.style.display = "none";
    }
  });
}

// Smooth Scrolling for Navigation
document.querySelectorAll("nav a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const section = document.querySelector(this.getAttribute("href"));
    section.scrollIntoView({ behavior: "smooth" });
  });
});

// Reading Time Calculator
function calculateReadingTime() {
  const articles = document.querySelectorAll(".news-card");

  articles.forEach((article) => {
    const text = article.querySelector("p").textContent;
    const words = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / 200); // Assuming 200 words per minute

    const timeSpan = article.querySelector(".news-meta span:first-child");
    timeSpan.textContent = `${readingTime} min read`;
  });
}

// Initialize features
document.addEventListener("DOMContentLoaded", () => {
  getWeather();
  calculateReadingTime();

  // Add animation to news cards on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".news-card").forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(card);
  });
});

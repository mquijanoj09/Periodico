function getArticleId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

async function findArticle(id) {
  const response = await fetch("./data/news.json");
  const data = await response.json();

  // Loop through each category
  for (const category in data) {
    // Find the article within the category
    const article = data[category].find((article) => article.id === id);

    if (article) {
      return article;
    }
  }
}

async function renderArticle(articleId) {
  try {
    // Assuming the article is fetched using findArticle() which is asynchronous
    const article = await findArticle(articleId);

    // If article is not found, redirect to the home page
    if (!article) {
      window.location.href = "/index.html";
      return;
    }

    // Set the page title with the article title
    document.title = `${article.title} - El Diario Digital`;

    // Create the content of the article dynamically
    const articleContent = document.querySelector(".article-content");
    const content = article.content
      .map((section) => {
        switch (section.type) {
          case "paragraph":
            return `<p>${section.text}</p>`;
          case "heading":
            return `<h2>${section.text}</h2>`;
          case "quote":
            return `
              <blockquote class="article-quote">
                <p>${section.text}</p>
                <cite>${section.author}${
              section.role ? `, ${section.role}` : ""
            }</cite>
              </blockquote>
            `;
          case "list":
            return `
              <ul>
                ${section.items.map((item) => `<li>${item}</li>`).join("")}
              </ul>
            `;
          default:
            return "";
        }
      })
      .join("");

    // Update the HTML with the article's data
    articleContent.innerHTML = `
      <header class="article-header">
        <span class="news-category">${article.category}</span>
        <h1>${article.title}</h1>
        <div class="article-meta">
          <span>${article.readTime} de lectura</span>
          <span>${article.publishedAt}</span>
          <span>Por ${article.author}</span>
        </div>
      </header>
      <img src="${article.image}" alt="${article.title}" class="article-image">
      <div class="article-text">
        ${content}
      </div>
    `;
  } catch (error) {
    console.error("Error rendering article:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const articleId = getArticleId();
  renderArticle(articleId);
});

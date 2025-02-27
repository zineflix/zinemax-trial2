const apiKey = "a1e72fd93ed59f56e6332813b9f8dcae";
const baseURL = "https://api.themoviedb.org/3";
const imgURL = "https://image.tmdb.org/t/p/w500";

// Function to fetch and set a random trending movie/TV show as a banner
const bannerTitle = document.getElementById("banner-title");
const bannerGenre = document.getElementById("banner-genre");
const bannerDescription = document.getElementById("banner-description");
const banner = document.querySelector(".banner");

async function fetchBanner() {
    const response = await fetch(
        `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`
    );
    const data = await response.json();
    const randomItem = data.results[Math.floor(Math.random() * data.results.length)];

    banner.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${randomItem.backdrop_path})`;
    bannerTitle.textContent = randomItem.title || randomItem.name;
    bannerDescription.textContent = randomItem.overview || "No description available.";
    
    // Fetch genres
    const genresResponse = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`);
    const genresData = await genresResponse.json();
    const genreMap = Object.fromEntries(genresData.genres.map(g => [g.id, g.name]));
    const genreNames = (randomItem.genre_ids || []).map(id => genreMap[id]).join(", ");
    
    bannerGenre.textContent = `Genre: ${genreNames || "Unknown"}`;
}

fetchBanner();

// Fetch Media Rows
async function fetchMedia(url, containerId, type) {
    const response = await fetch(url);
    const data = await response.json();
    const container = document.getElementById(containerId);
    
    data.results.forEach(item => {
        const mediaItem = document.createElement("div");
        mediaItem.classList.add("media-item");

        // Round the rating to one decimal place
        const rating = item.vote_average.toFixed(1);

        mediaItem.innerHTML = `
            <div class="poster-card">
                <div class="rating">
                    <span class="star"><i class="fas fa-star"></i></span> <span class="rating-number">${rating}</span>
                </div>
                <img src="${imgURL + item.poster_path}" alt="${item.title || item.name}">
            </div>
        `;
        
        mediaItem.addEventListener("click", () => {
            window.location.href = type === "movie" 
                ? `movie-details.html?movie_id=${item.id}`
                : `tvshows-details.html?id=${item.id}`;
        });

        container.appendChild(mediaItem);
    });
}

// Load Data
fetchBanner();
fetchMedia(`${baseURL}/discover/movie?api_key=${apiKey}&vote_count.gte=500&vote_average=10`, "popular-movies", "movie");
fetchMedia(`${baseURL}/discover/tv?api_key=${apiKey}&vote_count.gte=10000&vote_average=10`, "popular-tv-shows", "tv");
fetchMedia(`${baseURL}/discover/tv?api_key=${apiKey}&with_origin_country=KR&vote_count.gte=500`, "korean-tv-shows", "tv");
fetchMedia(`${baseURL}/discover/tv?api_key=${apiKey}&with_origin_country=JP&with_genres=16&vote_count.gte=500`, "japanese-animations", "tv");
fetchMedia(`${baseURL}/discover/movie?api_key=${apiKey}&with_companies=149142`, "philippine-movies", "movie");


// Ensure the function is globally accessible
document.addEventListener("DOMContentLoaded", function () {
    function scrollLeft(containerId) {
        let container = document.getElementById(containerId);
        if (container) {
            container.scrollBy({ left: -300, behavior: "smooth" });
        } else {
            console.error("Container not found:", containerId);
        }
    }

    function scrollRight(containerId) {
        let container = document.getElementById(containerId);
        if (container) {
            container.scrollBy({ left: 300, behavior: "smooth" });
        } else {
            console.error("Container not found:", containerId);
        }
    }

    // Attach event listeners to buttons (instead of inline HTML)
    document.querySelectorAll(".scroll-left").forEach(button => {
        button.addEventListener("click", function () {
            let targetId = this.nextElementSibling.id;
            scrollLeft(targetId);
        });
    });

    document.querySelectorAll(".scroll-right").forEach(button => {
        button.addEventListener("click", function () {
            let targetId = this.previousElementSibling.id;
            scrollRight(targetId);
        });
    });
});



// For Responsive Header
window.addEventListener("scroll", function () {
    let nav = document.querySelector("nav");
    if (window.scrollY > 50) {
        nav.classList.add("nav-solid"); // Solid color after scrolling down
    } else {
        nav.classList.remove("nav-solid"); // Transparent at the top
    }
});

// For sticky header when scrolling
    window.addEventListener("scroll", function () {
      let nav = document.querySelector("nav");
      if (window.scrollY > 50) {
        nav.classList.add("nav-solid"); // Add solid background when scrolled
      } else {
        nav.classList.remove("nav-solid"); // Remove solid background at top
      }
    });

    // Toggle menu visibility when menu button is clicked
document.getElementById("menu-btn").addEventListener("click", function() {
    document.getElementById("menu").classList.toggle("active");
});


// For Floating Message Close Function
function closeMessage() {
        document.getElementById("floating-message").style.display = "none";
    }


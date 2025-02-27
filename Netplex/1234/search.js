const apiKey = 'a1e72fd93ed59f56e6332813b9f8dcae';
const searchInput = document.getElementById('search');
const movieGrid = document.getElementById('movie-grid');
const recommendationText = document.getElementById('recommendation-text');

// Function to fetch popular or trending movies/TV shows
async function fetchRecommendations() {
  const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  // Clear previous results
  movieGrid.innerHTML = '';

  if (data.results.length === 0) {
    movieGrid.innerHTML = '<p>No recommendations available</p>';
    return;
  }

  // Display the recommended movies/TV shows
  data.results.forEach(item => {
    if (item.poster_path) {
      const posterUrl = `https://image.tmdb.org/t/p/w200${item.poster_path}`;
      const title = item.title || item.name;
      const rating = item.vote_average || 0;
      const id = item.id; // Unique ID of the movie or TV show
      const mediaType = item.media_type; // "movie" or "tv"

      // Create a link that points to the correct details page based on media type
      const link = document.createElement('a');
      link.href = mediaType === 'movie' 
        ? `movie-details.html?movie_id=${id}` // Movie details page
        : `tvshows-details.html?id=${id}`; // TV Show details page

      const movieItem = document.createElement('div');
      movieItem.classList.add('movie-item');
      
      movieItem.innerHTML = `
        <div class="rating-container">
          <div class="rating">
            <span class="star">&#9733;</span><span class="rating-number">${rating.toFixed(1)}</span>
          </div>
        </div>
        <img src="${posterUrl}" alt="${title}" />
      `;

      // Append the movie item to the link and the link to the movie grid
      link.appendChild(movieItem);
      movieGrid.appendChild(link);
    }
  });
}

// Function to fetch movies/TV shows based on search query
async function fetchMovies(query) {
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${query}&language=en-US&page=1&include_adult=false`;

  const response = await fetch(url);
  const data = await response.json();

  movieGrid.innerHTML = '';

  if (data.results.length === 0) {
    movieGrid.innerHTML = '<p>No results found</p>';
    return;
  }

  data.results.forEach(item => {
    if (item.poster_path) {
      const posterUrl = `https://image.tmdb.org/t/p/w200${item.poster_path}`;
      const title = item.title || item.name;
      const rating = item.vote_average || 0;
      const id = item.id; // Unique ID of the movie or TV show
      const mediaType = item.media_type; // "movie" or "tv"

      // Create a link that points to the correct details page based on media type
      const link = document.createElement('a');
      link.href = mediaType === 'movie' 
        ? `movie-details.html?movie_id=${id}` // Movie details page
        : `tvshows-details.html?id=${id}`; // TV Show details page

      const movieItem = document.createElement('div');
      movieItem.classList.add('movie-item');
      
      movieItem.innerHTML = `
        <div class="rating-container">
          <div class="rating">
            <span class="star">&#9733;</span><span class="rating-number">${rating.toFixed(1)}</span>
          </div>
        </div>
        <img src="${posterUrl}" alt="${title}" />
      `;

      // Append the movie item to the link and the link to the movie grid
      link.appendChild(movieItem);
      movieGrid.appendChild(link);
    }
  });
}

// Event listener for search input
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.trim();

  if (query) {
    recommendationText.innerHTML = `<p>Searching for "${query}"...</p>`;
    fetchMovies(query);
  } else {
    recommendationText.innerHTML = '<p>Recommend Movies and TV Shows</p>';
    fetchRecommendations();
  }
});

// Load recommended movies/TV shows when the page loads
fetchRecommendations();



/* FOR RESPONSIVE NAVIGATION BAR START */
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
/* FOR RESPONSIVE NAVIGATION BAR END */

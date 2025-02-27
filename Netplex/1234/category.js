const apiKey = 'a1e72fd93ed59f56e6332813b9f8dcae'; // Your TMDB API key
const baseUrl = 'https://api.themoviedb.org/3';
const movieGrid = document.getElementById('movie-grid');
const contentTypeSelect = document.getElementById('contentType');
const genreSelect = document.getElementById('genreSelect');
const yearSelect = document.getElementById('yearSelect');
const sortSelect = document.getElementById('sortSelect'); // The sort dropdown

let genres = []; // To store the genres
let currentYear = new Date().getFullYear(); // Get current year

// Fetching genres from TMDb API
async function fetchGenres() {
    try {
        const movieGenresResponse = await fetch(`${baseUrl}/genre/movie/list?api_key=${apiKey}&language=en-US`);
        const tvGenresResponse = await fetch(`${baseUrl}/genre/tv/list?api_key=${apiKey}&language=en-US`);
        
        const movieGenres = await movieGenresResponse.json();
        const tvGenres = await tvGenresResponse.json();
        
        genres = [...movieGenres.genres, ...tvGenres.genres]; // Combine genres from movies and TV shows

        populateGenreDropdown(); // Populate genre dropdown after fetching genres
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}

// Populate the genre dropdown
function populateGenreDropdown() {
    genreSelect.innerHTML = '<option value="all">All Genres</option>'; // Default option
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
    });
}

// Populate the year dropdown with years from 1900 to the current year
function populateYearDropdown() {
    for (let year = currentYear; year >= 1900; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

// Fetching movies and TV shows with genre, year filter, and sorting
async function fetchMoviesAndTVShows(contentType = 'both', genreId = 'all', year = 'all', sortBy = 'popularity.desc') {
    try {
        let moviesData = [];
        let tvShowsData = [];
        let yearQuery = year !== 'all' ? `&primary_release_year=${year}` : ''; // Add year filter if selected
        const genreQuery = genreId !== 'all' ? `&with_genres=${genreId}` : ''; // Add genre filter if selected
        const sortQuery = `&sort_by=${sortBy}`; // Add sorting query

        // Fetch movies if contentType is 'both' or 'movies'
        if (contentType === 'both' || contentType === 'movies') {
            const moviesResponse = await fetch(`${baseUrl}/discover/movie?api_key=${apiKey}&language=en-US&page=1${yearQuery}${genreQuery}${sortQuery}`);
            const moviesDataResponse = await moviesResponse.json();
            moviesData = moviesDataResponse.results;
        }

        // Fetch TV shows if contentType is 'both' or 'tvShows'
        if (contentType === 'both' || contentType === 'tvShows') {
            const tvShowsResponse = await fetch(`${baseUrl}/discover/tv?api_key=${apiKey}&language=en-US&page=1${yearQuery}${genreQuery}${sortQuery}`);
            const tvShowsDataResponse = await tvShowsResponse.json();
            tvShowsData = tvShowsDataResponse.results;
        }

        // Combine the fetched data
        const combinedData = [...moviesData, ...tvShowsData];
        displayItems(combinedData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayItems(items) {
    movieGrid.innerHTML = ''; // Clear the grid before displaying new items

    // Filter items to only include those that have a valid poster
    const validItems = items.filter(item => item.poster_path);

    validItems.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        const imgUrl = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
        let detailUrl = '';

        // Check if it's a movie or TV show and set the appropriate detail URL
        if (item.title) {
            detailUrl = `movie-details.html?movie_id=${item.id}`; // Movie details page
        } else if (item.name) {
            detailUrl = `tvshows-details.html?id=${item.id}`; // TV show details page
        }

        // Wrap the image with a link that directs to the detail page
        card.innerHTML = `
            <a href="${detailUrl}">
                <img src="${imgUrl}" alt="${item.title || item.name}">
            </a>
            <div class="info">
                <!-- You can add more information here like title or rating if desired -->
            </div>
        `;

        movieGrid.appendChild(card);
    });

    // If no valid items are found, show a message indicating that no results are available
    if (validItems.length === 0) {
        movieGrid.innerHTML = '<p>No movies or TV shows found with a poster image.</p>';
    }
}

// Handle content type change
function onContentTypeChange() {
    const selectedContentType = contentTypeSelect.value;
    const selectedGenre = genreSelect.value;
    const selectedYear = yearSelect.value;
    const selectedSort = sortSelect.value;
    fetchMoviesAndTVShows(selectedContentType, selectedGenre, selectedYear, selectedSort);
}

// Handle genre change
function onGenreChange() {
    const selectedContentType = contentTypeSelect.value;
    const selectedGenre = genreSelect.value;
    const selectedYear = yearSelect.value;
    const selectedSort = sortSelect.value;
    fetchMoviesAndTVShows(selectedContentType, selectedGenre, selectedYear, selectedSort);
}

// Handle year change
function onYearChange() {
    const selectedContentType = contentTypeSelect.value;
    const selectedGenre = genreSelect.value;
    const selectedYear = yearSelect.value;
    const selectedSort = sortSelect.value;
    fetchMoviesAndTVShows(selectedContentType, selectedGenre, selectedYear, selectedSort);
}

// Handle sort change
function onSortChange() {
    const selectedContentType = contentTypeSelect.value;
    const selectedGenre = genreSelect.value;
    const selectedYear = yearSelect.value;
    const selectedSort = sortSelect.value;
    fetchMoviesAndTVShows(selectedContentType, selectedGenre, selectedYear, selectedSort);
}

// Call the fetch functions when the page loads
window.onload = () => {
    fetchGenres(); // Fetch genres first
    populateYearDropdown(); // Populate the year dropdown
    fetchMoviesAndTVShows('both', 'all', 'all', 'popularity.desc'); // Fetch both Movies and TV Shows initially, sorted by popularity
};




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

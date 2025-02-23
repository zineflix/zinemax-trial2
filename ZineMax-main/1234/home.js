//----------------------------------
// FOR NAVIGATION HEADER
//----------------------------------

// For Responsive Navigation Header
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


//----------------------------------
// FOR TMDB API
//----------------------------------
const apiKey = 'a1e72fd93ed59f56e6332813b9f8dcae'; // Your TMDB API Key
const baseUrl = 'https://api.themoviedb.org/3';


//-------------------------
// FOR MOVIE FUNCTIONALITY 
//-------------------------
// Helper function to fetch Movies, Tv-Series, K-Drama, Anime, Vivamax and populate the row
const fetchMovies = async (category, rowId) => {
    try {
        let url = '';
        switch (category) {
            case 'movies':
                url = `${baseUrl}/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&vote_count.gte=500&vote_average=10&page=1`;
                break; // for Movies
            case 'tvseries':
                url = `${baseUrl}/discover/tv?api_key=${apiKey}&sort_by=popularity.desc&vote_count.gte=10000&vote_average=10&page=1`;
                break; // for TV-Series
            case 'kdrama':
                url = `${baseUrl}/discover/tv?api_key=${apiKey}&include_adult=true&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&vote_count.gte=500&with_origin_country=KR`; // for K-Drama
                break;
            case 'anime':
                url = `${baseUrl}/discover/tv?api_key=${apiKey}&sort_by=popularity.desc&vote_count.gte=700&with_genres=16&with_origin_country=JP`; // for Anime
                break;
            case 'vivamax':
                url = `${baseUrl}/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&vote_average.gte=5&vote_average.lte=10&with_companies=149142`; // for Vivamax
                break;
             
            default:
                console.log('Unknown category');
                return;
        }

        const response = await fetch(url);
        const data = await response.json();
        console.log(data);  // Log data for debugging

        const movieCards = document.getElementById(rowId);
        movieCards.innerHTML = ''; // Clear existing posters

        if (data.results && data.results.length > 0) {
            data.results.forEach(movie => {
                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');
                movieCard.style.position = 'relative'; // Ensure the card has a position context for the icon

                // Movie poster
                const moviePoster = document.createElement('img');
                moviePoster.classList.add('row__poster');
                moviePoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                moviePoster.alt = movie.title;

                // Add "Add to List" icon (Font Awesome plus icon)
                const addToListIcon = document.createElement('button');
                addToListIcon.classList.add('add-to-list-icon');
                addToListIcon.innerHTML = '<i class="fas fa-plus"></i>'; // Default plus icon

                // Check if the movie is in the local storage list
                let movieList = JSON.parse(localStorage.getItem('movieList')) || [];
                if (movieList.find(m => m.id === movie.id)) {
                    addToListIcon.querySelector('i').classList.remove('fa-plus');
                    addToListIcon.querySelector('i').classList.add('fa-minus'); // Set to minus if already in list
                }

                // Event listener for "Add to List" icon
                addToListIcon.addEventListener('click', (event) => {
                    event.stopPropagation();  // Prevent movie click event
                
                    // Toggle between plus and minus icons
                    const icon = addToListIcon.querySelector('i');
                    if (icon.classList.contains('fa-plus')) {
                        icon.classList.remove('fa-plus');
                        icon.classList.add('fa-minus');
                        
                        // Add the movie to localStorage
                        movieList.push(movie);  // Add the movie to the list
                        localStorage.setItem('movieList', JSON.stringify(movieList)); // Save back to localStorage
                    } else {
                        icon.classList.remove('fa-minus');
                        icon.classList.add('fa-plus');
                
                        // Remove movie from localStorage
                        movieList = movieList.filter(m => m.id !== movie.id);  // Remove movie by ID
                        localStorage.setItem('movieList', JSON.stringify(movieList)); // Save back to localStorage
                    }
                });

                // Append the poster and icon to the movie card
                movieCard.appendChild(moviePoster);
                movieCard.appendChild(addToListIcon);

                // Add click event to each movie poster to redirect to the movie details page
                movieCard.addEventListener('click', () => {
                    window.location.href = `movie-details.html?movie_id=${movie.id}`;
                });

                movieCards.appendChild(movieCard);
            });
        } else {
            console.log(`No results for category: ${category}`);
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the movie list from localStorage
    let movieList = JSON.parse(localStorage.getItem('movieList')) || [];

    // Get the container where movies will be displayed
    const movieListContainer = document.getElementById('movie-list-container');

    // Check if the list is empty
    if (movieList.length === 0) {
        movieListContainer.innerHTML = '<p>Your movie list is empty!</p>';
        return;
    }

    // Loop through the list of movies and display them
    movieList.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        // Movie poster
const moviePoster = document.createElement('img');
moviePoster.classList.add('row__poster'); // Same class as the main page
moviePoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
moviePoster.alt = movie.title;

        // Movie title
        const movieTitle = document.createElement('p');
        movieTitle.textContent = movie.title;

        // Append poster and title to the movie card
        movieCard.appendChild(moviePoster);
        movieCard.appendChild(movieTitle);

        // Add the movie card to the movie list container
        movieListContainer.appendChild(movieCard);

        // Add click event to each movie poster to redirect to the movie details page
        movieCard.addEventListener('click', () => {
            window.location.href = `movie-details.html?movie_id=${movie.id}`;
        });
    });
});


//-------------------------
// FOR RANDOM BANNER 
//-------------------------
        // For Random Movie Banner
const fetchBanner = async () => {
    try {
        // Fetch popular movies from the API
        const url = `${baseUrl}/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
        const response = await fetch(url);
        const data = await response.json();

        // Select a random movie from the list of popular movies
        const movie = data.results[Math.floor(Math.random() * data.results.length)];

        // ----------------------
        // Update Banner with Movie Data
        // ----------------------

        // Create and add "TOP 10" label
        const topTenLabel = document.createElement('div');
        topTenLabel.classList.add('top-ten-label');
        topTenLabel.textContent = "TOP 10";  // Text "TOP 10" added above the title
        const banner = document.querySelector('.banner');
        banner.appendChild(topTenLabel);  // Add the label to the banner

        // Set the banner title to the selected movie's title
        const bannerTitle = document.querySelector('.banner__title');
        bannerTitle.textContent = movie.title;

        // Set the banner description (limit to 150 characters for brevity)
        const bannerDescription = document.querySelector('.banner__description');
        bannerDescription.textContent = movie.overview.length > 150 ? movie.overview.substring(0, 150) + '...' : movie.overview;

        // Set the banner background image using the movie's backdrop
        banner.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

        // ----------------------
        // Play Button Functionality
        // ----------------------

        // Get the Play button
        const playButton = document.getElementById('play-button');

        // Add event listener to the Play button to navigate to movie details
        playButton.addEventListener('click', () => {
            window.location.href = `movie-details.html?movie_id=${movie.id}`;
        });

    } catch (error) {
        console.error('Error fetching banner data:', error);
    }
};

// Load a random movie for the banner when the page loads
fetchBanner();

//----------------------------
// FOR POSTER ARROW NAVIGATION
//----------------------------
const initArrowNavigation = () => {
    // Find all rows of posters (e.g., netflixOriginals, topRated, etc.)
    const allRows = document.querySelectorAll('.row__posters');

    // Loop over each row and add the scroll functionality
    allRows.forEach(rowPosters => {
        const prevButton = rowPosters.parentElement.querySelector('.arrow-button.prev');
        const nextButton = rowPosters.parentElement.querySelector('.arrow-button.next');
        let scrollAmount = 0;
        const scrollStep = 220; // Adjust scroll step to your preference

        // Check if both buttons exist
        if (prevButton && nextButton) {
            // Scroll left (previous)
            prevButton.addEventListener('click', () => {
                // Ensure we don't scroll past the start
                if (scrollAmount > 0) {
                    scrollAmount -= scrollStep;
                    rowPosters.scrollTo({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                }
            });

            // Scroll right (next)
            nextButton.addEventListener('click', () => {
                // Ensure we don't scroll past the end
                const maxScroll = rowPosters.scrollWidth - rowPosters.clientWidth;
                if (scrollAmount < maxScroll) {
                    scrollAmount += scrollStep;
                    rowPosters.scrollTo({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
};



//---------------------------
// FOR TV SHOWS FUNCTIONALITY 
//---------------------------

// Function to fetch TV shows based on category
const fetchTVShows = async (category, rowId) => {
    try {
        let url = '';
        switch (category) {
            case 'popular':
                url = `${baseUrl}/discover/tv?api_key=${apiKey}&sort_by=popularity.desc&vote_count.gte=10000&vote_average=10&page=1`;
                break;
            case 'tvseries':
                url = `${baseUrl}/discover/tv?api_key=${apiKey}&sort_by=popularity.desc&vote_count.gte=5000&vote_average=10&page=1`;
                break; // for Index POPULAR TV SHOWS
            case 'trending':
                url = `${baseUrl}/trending/tv/week?api_key=${apiKey}`;
                break;
            case 'top_rated':
                url = `${baseUrl}/tv/top_rated?api_key=${apiKey}&language=en-US&page=1`;
                break;
            case 'drama':
                url = `${baseUrl}/discover/tv?api_key=${apiKey}&with_genres=18&page=1`; // Genre ID 18 is Drama
                break;
            case 'comedy':
                url = `${baseUrl}/discover/tv?api_key=${apiKey}&with_genres=35&page=1`; // Genre ID 35 is Comedy
                break;
            case 'romance':
                url = `${baseUrl}/discover/tv?api_key=${apiKey}&with_genres=10749&page=1`; // Genre ID 10749 is Romance
                break;
            case 'documentary':
                url = `${baseUrl}/discover/tv?api_key=${apiKey}&with_genres=99&page=1`; // Genre ID 99 is Documentary
                break;
            default:
                console.log('Unknown category');
                return;
        }

        const response = await fetch(url);
        const data = await response.json();
        console.log(data);  // Log data for debugging

        const tvShowCards = document.getElementById(rowId);
        tvShowCards.innerHTML = ''; // Clear existing posters

        if (data.results && data.results.length > 0) {
            data.results.forEach(tvShow => {
                const tvShowCard = document.createElement('div');
                tvShowCard.classList.add('tv-show-card');
                tvShowCard.style.position = 'relative'; // Ensure the card has a position context for the icon

                // TV Show poster
                const tvShowPoster = document.createElement('img');
                tvShowPoster.classList.add('row__poster');
                tvShowPoster.src = `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`;
                tvShowPoster.alt = tvShow.name;

                // Add "Add to List" icon (Font Awesome plus icon)
                const addToListIcon = document.createElement('button');
                addToListIcon.classList.add('add-to-list-icon');
                addToListIcon.innerHTML = '<i class="fas fa-plus"></i>'; // Default plus icon

                // Check if the TV show is in the local storage list
                let tvShowList = JSON.parse(localStorage.getItem('tvShowList')) || [];
                if (tvShowList.find(show => show.id === tvShow.id)) {
                    addToListIcon.querySelector('i').classList.remove('fa-plus');
                    addToListIcon.querySelector('i').classList.add('fa-minus'); // Set to minus if already in list
                }

                // Event listener for "Add to List" icon
                addToListIcon.addEventListener('click', (event) => {
                    event.stopPropagation();  // Prevent TV show click event

                    // Toggle between plus and minus icons
                    const icon = addToListIcon.querySelector('i');
                    if (icon.classList.contains('fa-plus')) {
                        icon.classList.remove('fa-plus');
                        icon.classList.add('fa-minus');
                        
                        // Add the TV show to localStorage
                        tvShowList.push(tvShow);  // Add the TV show to the list
                        localStorage.setItem('tvShowList', JSON.stringify(tvShowList)); // Save back to localStorage
                    } else {
                        icon.classList.remove('fa-minus');
                        icon.classList.add('fa-plus');
                
                        // Remove TV show from localStorage
                        tvShowList = tvShowList.filter(show => show.id !== tvShow.id);  // Remove TV show by ID
                        localStorage.setItem('tvShowList', JSON.stringify(tvShowList)); // Save back to localStorage
                    }
                });

                // Append the poster and icon to the TV show card
                tvShowCard.appendChild(tvShowPoster);
                tvShowCard.appendChild(addToListIcon);

                // Add click event to each TV show poster to redirect to the details page
                tvShowCard.addEventListener('click', () => {
                    window.location.href = `tvshows-details.html?id=${tvShow.id}`;
                });

                tvShowCards.appendChild(tvShowCard);
            });
        } else {
            console.log(`No results for category: ${category}`);
        }
    } catch (error) {
        console.error('Error fetching TV shows:', error);
    }
};


const initArrowNavigation = () => {
    // Find all rows of posters (e.g., popularTVShows, topRatedTVShows, etc.)
    const allRows = document.querySelectorAll('.row__posters');

    // Loop over each row and add the scroll functionality
    allRows.forEach(rowPosters => {
        const prevButton = rowPosters.parentElement.querySelector('.arrow-button.prev');
        const nextButton = rowPosters.parentElement.querySelector('.arrow-button.next');
        let scrollAmount = 0;
        const scrollStep = 220; // Adjust scroll step to your preference

        // Check if both buttons exist
        if (prevButton && nextButton) {
            // Scroll left (previous)
            prevButton.addEventListener('click', () => {
                // Ensure we don't scroll past the start
                if (scrollAmount > 0) {
                    scrollAmount -= scrollStep;
                    rowPosters.scrollTo({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                }
            });

            // Scroll right (next)
            nextButton.addEventListener('click', () => {
                // Ensure we don't scroll past the end
                const maxScroll = rowPosters.scrollWidth - rowPosters.clientWidth;
                if (scrollAmount < maxScroll) {
                    scrollAmount += scrollStep;
                    rowPosters.scrollTo({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
};


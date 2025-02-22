const apiKey = 'a1e72fd93ed59f56e6332813b9f8dcae'; // Your TMDB API Key
const baseUrl = 'https://api.themoviedb.org/3';

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

const fetchBanner = async () => {
    try {
        // Fetch trending TV shows from the API
        const url = `${baseUrl}/trending/tv/week?api_key=${apiKey}&language=en-US`;
        const response = await fetch(url);
        const data = await response.json();

        // Get a random TV show from the list of trending TV shows
        const tvShow = data.results[Math.floor(Math.random() * data.results.length)];

        // ----------------------
        // Add "TOP 10" label to TV show banner
        // ----------------------

        // Create and add "TOP 10" label
        const topTenLabel = document.createElement('div');
        topTenLabel.classList.add('top-ten-label');
        topTenLabel.textContent = "TOP 10";  // Text "TOP 10" added above the title
        const banner = document.querySelector('.banner');
        banner.appendChild(topTenLabel);  // Add the label to the banner

        // ----------------------
        // Update Banner with TV Show Data
        // ----------------------

        // Set the banner title to the selected TV show's name
        const bannerTitle = document.querySelector('.banner__title');
        bannerTitle.textContent = tvShow.name;

        // Shorten the description (limit to 150 characters for brevity)
        const bannerDescription = document.querySelector('.banner__description');
        bannerDescription.textContent = tvShow.overview.length > 150 ? tvShow.overview.substring(0, 150) + '...' : tvShow.overview;

        // Set the background image for the banner using the TV show's backdrop
        banner.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${tvShow.backdrop_path})`;

        // ----------------------
        // Play Button Functionality
        // ----------------------

        // Get the Play button
        const playButton = document.getElementById('play-btn');

        // Add event listener to the Play button to navigate to TV show details
        playButton.addEventListener('click', () => {
            window.location.href = `tvshows-details.html?id=${tvShow.id}`;
        });

    } catch (error) {
        console.error('Error fetching banner data:', error);
    }
};

// Load a random TV show for the banner when the page loads
window.onload = fetchBanner;

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

// Toggle the search bar visibility when clicking the search icon
function toggleSearchBar() {
    const searchBar = document.querySelector('.search-bar');
    searchBar.classList.toggle('show');
}

// Close the search bar if clicked outside
document.addEventListener('click', function(event) {
    const searchBar = document.querySelector('.search-bar');
    const searchIcon = document.querySelector('.icon i.fa-search');
    const iconsContainer = document.querySelector('.icons-container');

    // Check if the click was outside the search bar or any of the icons
    if (!searchBar.contains(event.target) && !iconsContainer.contains(event.target)) {
        searchBar.classList.remove('show');
    }
});

function openSearchPage() {
    // Magbukas ug new page
    window.location.href = 'search.html';  // I-replace ang 'search.html' sa URL sa imong gustong page
}

const SERIES_ENDPOINTS = [
    { url: 'https://player.videasy.net/tv/', name: 'Server 1' },
    { url: 'https://vidsrc.cc/v2/embed/tv/', name: 'Server 2' },
    { url: 'https://111movies.com/tv/', name: 'Server 3' },
    { url: 'https://embed.rgshows.me/api/1/tv/?id=', name: 'Server 4' },
    { url: 'https://rivestream.live/embed?type=tv&id=', name: 'Server 5' },
];

const urlParams = new URLSearchParams(window.location.search);
const tvShowId = urlParams.get('id');
let currentServerIndex = 0;
let selectedSeason = null;
let selectedEpisode = null;

console.log('TV Show ID:', tvShowId);

const fetchTVShowDetails = async () => {
    try {
        const url = `${baseUrl}/tv/${tvShowId}?api_key=${apiKey}&language=en-US`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const tvShow = await response.json();

        // Populate poster and details
        const posterUrl = `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`;
        document.getElementById('tv-show-poster').src = posterUrl;

        const backdropUrl = tvShow.backdrop_path ? `https://image.tmdb.org/t/p/original${tvShow.backdrop_path}` : 'https://via.placeholder.com/1500x800?text=No+Backdrop+Available';
        document.querySelector('.blurred-background').style.backgroundImage = `url(${backdropUrl})`;

        document.getElementById('tv-show-description').textContent = tvShow.overview;

        const tvShowRating = tvShow.vote_average;
        const starContainer = document.getElementById('tv-show-rating');
        starContainer.innerHTML = '';
        const filledStars = Math.round(tvShowRating / 2);
        const emptyStars = 5 - filledStars;

        for (let i = 0; i < filledStars; i++) {
            const star = document.createElement('span');
            star.classList.add('star', 'filled');
            starContainer.appendChild(star);
        }

        for (let i = 0; i < emptyStars; i++) {
            const star = document.createElement('span');
            star.classList.add('star', 'empty');
            starContainer.appendChild(star);
        }

        const tvShowFirstAirDate = "2025-01-25"; // Example air date

        // Set the air date in the element
        document.getElementById('air-date-text').textContent = `: ${tvShowFirstAirDate}`;

        const genreContainer = document.getElementById('tv-show-genres');
        genreContainer.innerHTML = '';
        tvShow.genres.forEach(genre => {
            const genreElement = document.createElement('span');
            genreElement.classList.add('genre');
            genreElement.textContent = genre.name;
            genreContainer.appendChild(genreElement);
        });

        // Fetch Seasons
        const seasonsContainer = document.getElementById('seasons-list');
        seasonsContainer.innerHTML = ''; // Reset seasons container
        tvShow.seasons.forEach(season => {
            const seasonItem = document.createElement('li');
            const seasonImageUrl = season.poster_path
                ? `https://image.tmdb.org/t/p/w200${season.poster_path}`
                : 'https://via.placeholder.com/100x150?text=No+Image'; // Fallback image if no poster

            const seasonImage = document.createElement('img');
            seasonImage.src = seasonImageUrl;
            seasonImage.alt = `Season ${season.season_number}`;
            seasonImage.style.width = '50px';  // Adjust the size of the image
            seasonImage.style.marginRight = '10px'; // Space between the image and the text

            seasonItem.appendChild(seasonImage); // Add the image to the season list item
            seasonItem.appendChild(document.createTextNode(`Season ${season.season_number}`));

            seasonItem.addEventListener('click', () => {
                selectedSeason = season.season_number; // Track the selected season
                loadEpisodes(selectedSeason); // Load episodes for that season
                toggleDropdown('seasons-list'); // Close season dropdown
                document.getElementById('episode-btn').style.display = 'block'; // Show episode button
            });

            seasonsContainer.appendChild(seasonItem);
        });

        // Fetch More Like This TV Shows
        fetchMoreLikeThis(tvShowId);

        // Toggle Dropdown visibility
        const toggleDropdown = (dropdownId) => {
            const dropdown = document.getElementById(dropdownId);
            dropdown.classList.toggle('show');
        };

        // Load Episodes for the selected season
        const loadEpisodes = async (seasonNumber) => {
            const episodesUrl = `${baseUrl}/tv/${tvShowId}/season/${seasonNumber}?api_key=${apiKey}&language=en-US`;
            const episodesResponse = await fetch(episodesUrl);
            const episodesData = await episodesResponse.json();

            const episodesContainer = document.getElementById('episodes-list');
            episodesContainer.innerHTML = ''; // Clear previous episodes

            episodesData.episodes.forEach(episode => {
                const episodeItem = document.createElement('li');
                const episodeImage = document.createElement('img');
                const episodeImageUrl = episode.still_path
                    ? `https://image.tmdb.org/t/p/w200${episode.still_path}`
                    : 'https://via.placeholder.com/100x150?text=No+Image'; // Fallback image if no still path

                episodeImage.src = episodeImageUrl;
                episodeImage.alt = `Episode ${episode.episode_number}`;
                episodeImage.style.width = '50px'; // Adjust the size of the image
                episodeImage.style.marginRight = '10px'; // Space between the image and the text

                episodeItem.appendChild(episodeImage); // Add the image to the episode list item
                episodeItem.appendChild(document.createTextNode(`Episode ${episode.episode_number}: ${episode.name}`));

                episodeItem.addEventListener('click', () => {
                    selectedEpisode = episode.episode_number;
                    playEpisode(selectedEpisode, selectedSeason);
                });

                episodesContainer.appendChild(episodeItem);
            });
        };

        // Play selected episode
        const playEpisode = (episodeNumber, seasonNumber) => {
            const selectedServerUrl = SERIES_ENDPOINTS[currentServerIndex].url; // Get URL from the selected server
            console.log(`Trying to load from: ${selectedServerUrl}?autonext=1`);

            const iframeContainer = document.getElementById('iframe-container');
            iframeContainer.style.display = 'flex';

            const iframe = document.getElementById('movie-iframe');
            iframe.src = `${selectedServerUrl}${tvShowId}/${seasonNumber}/${episodeNumber}?autonext=1&autoplay=1`;

            iframe.onerror = function () {
                console.error('Error loading the episode content in the iframe.');
                alert('Failed to load the episode. Try a different server.');
            };
        };

        // Event listeners for the buttons
        const seasonBtn = document.getElementById('season-btn');
        seasonBtn.addEventListener('click', () => toggleDropdown('seasons-list'));

        const episodeBtn = document.getElementById('episode-btn');
        episodeBtn.addEventListener('click', () => toggleDropdown('episodes-list'));

        // Close iframe container (to hide video player)
        const closeIframeBtn = document.getElementById('close-iframe-btn');
        closeIframeBtn.addEventListener('click', () => {
            const iframeContainer = document.getElementById('iframe-container');
            iframeContainer.style.display = 'none'; // Hide iframe container when close button is clicked
            const iframe = document.getElementById('movie-iframe');
            iframe.src = ''; // Reset iframe source to stop playback
        });

// Change server dropdown logic
const changeServerBtn = document.getElementById('change-server-btn');
const serverDropdown = document.getElementById('server-dropdown');
const serverList = document.getElementById('server-list');

// Toggle dropdown when clicking Change Server
changeServerBtn.addEventListener('click', () => {
    serverDropdown.style.display = serverDropdown.style.display === 'block' ? 'none' : 'block';

    // Clear previous list
    serverList.innerHTML = '';

    // Add servers to dropdown list with custom names
    SERIES_ENDPOINTS.forEach((server, index) => {
        const serverItem = document.createElement('li');
        serverItem.textContent = server.name; // Use custom name here
        serverItem.addEventListener('click', () => {
            currentServerIndex = index; // Set the selected server index
            serverDropdown.style.display = 'none'; // Close dropdown after selecting a server
            
            const iframe = document.getElementById('movie-iframe');
            
            // Check if the selected server is 'Mythic' and add the 'autoplay' and 'autonext' parameters
            if (server.name === 'Mythic(Fast, Auto Next, Auto Play)') {
                iframe.src = `${server.url}${tvShowId}/${selectedSeason}/${selectedEpisode}?autonext=1&autoplay=1`; // Add autoplay and autonext
            }
            // Check if the selected server is 'Warrior' and add custom parameters
            else if (server.name === 'Warrior(Auto Play)') {
                iframe.src = `${server.url}${tvShowId}/${selectedSeason}/${selectedEpisode}?primaryColor=ffffff&secondaryColor=a2a2a2&iconColor=eefdec&icons=vid&player=default&title=true&poster=true&autoplay=true&nextbutton=true`; // Add custom Warrior parameters
            }
            else {
                iframe.src = `${server.url}${tvShowId}/${selectedSeason}/${selectedEpisode}`; // Load episode from the selected server without extra params
            }
        });
        serverList.appendChild(serverItem);
    });
});

    } catch (error) {
        console.error('Error fetching TV show details:', error);
    }
};

const fetchMoreLikeThis = async (tvShowId) => {
    try {
        const url = `${baseUrl}/tv/${tvShowId}/similar?api_key=${apiKey}&language=en-US`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const similarShowsContainer = document.getElementById('similar-shows-container');
        similarShowsContainer.innerHTML = ''; // Clear previous similar shows

        // Filter out shows with no poster image
        const validShows = data.results.filter(show => show.poster_path);

        // If no valid shows, show a message
        if (validShows.length === 0) {
            similarShowsContainer.innerHTML = '<p>No similar TV shows available.</p>';
            return;
        }

        // Loop through the valid TV shows and create grid items
        validShows.forEach(show => {
            const showItem = document.createElement('div');
            showItem.classList.add('similar-show'); // Add the grid item class

            // Movie Poster Image
            const showImageUrl = `https://image.tmdb.org/t/p/original${show.poster_path}`;
            const showImage = document.createElement('img');
            showImage.src = showImageUrl;
            showImage.alt = show.name || 'No Title';  // Default alt text if no name
            showImage.classList.add('similar-show-img'); // Add the image class

            showItem.appendChild(showImage); // Append the image

            // TV Show Title
            const showTitle = document.createElement('span');
            showTitle.textContent = show.name || 'Untitled TV Show'; // Fallback for title if missing
            showTitle.classList.add('show-title'); // Optional class for styling titles


            // Add click event to redirect to the selected show page
            showItem.addEventListener('click', () => {
                window.location.href = `?id=${show.id}`; // Redirect to the selected TV show
            });

            similarShowsContainer.appendChild(showItem); // Append to the container
        });
    } catch (error) {
        console.error('Error fetching similar TV shows:', error);
    }
};

fetchTVShowDetails();

// Fetch data for different TV show categories
fetchTVShows('popular', 'popularTVShows');
fetchTVShows('tvseries', 'popularTVSeries'); // for Index POPULAR TV SHOWS
fetchTVShows('trending', 'trendingTVShows');
fetchTVShows('top_rated', 'topRatedTVShows');
fetchTVShows('drama', 'dramaTVShows');
fetchTVShows('comedy', 'comedyTVShows');
fetchTVShows('romance', 'romanceTVShows');
fetchTVShows('documentary', 'documentaryTVShows');

// Fetch banner details for TV Shows
fetchBanner();

// Initialize arrow buttons functionality after fetching the TV show data
document.addEventListener('DOMContentLoaded', initArrowNavigation);

// Close Button Logic: Redirect to tvshows-details.html
const closeButton = document.getElementById('close-button');

closeButton.addEventListener('click', () => {
    window.location.href = 'tvshows_page.html'; // Redirects to the tvshows-details page
});

window.addEventListener("load", function() {
    setTimeout(function() {
        document.getElementById("loading-screen").style.display = "none";
    }, 1000); // 3000ms = 3 seconds
});

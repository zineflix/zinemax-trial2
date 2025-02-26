const apiKey = 'a1e72fd93ed59f56e6332813b9f8dcae';
const apiUrl = 'https://api.themoviedb.org/3/';

async function getRandomRecommendations() {
  const randomPage = Math.floor(Math.random() * 10) + 1; // Random page from 1 to 10
  const randomMediaType = Math.random() > 0.5 ? 'movie' : 'tv'; // Randomly choose movie or TV show

  const url = `${apiUrl}discover/${randomMediaType}?api_key=${apiKey}&page=${randomPage}&language=en-US`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const results = data.results;

    displayResults(results);
  } catch (error) {
    console.error('Error fetching data: ', error);
  }
}

function displayResults(results) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = ''; // Clear previous results

  results.forEach(item => {
    // Check if there's a valid poster_path before displaying the item
    if (!item.poster_path) return; // Skip item if there is no poster

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item');

    const posterPath = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
    const title = item.title || item.name;
    const releaseDate = item.release_date || item.first_air_date;

    // Movie or TV show ID and page link
    const itemId = item.id; // Use item.id for both movie and tv shows (the same)
    const mediaType = item.title ? 'movie' : 'tv'; // Determine if it's a movie or tv show
    
    // Create clickable poster
    const itemLink = document.createElement('a');
    itemLink.href = mediaType === 'movie' 
      ? `movie-details.html?movie_id=${itemId}` 
      : `tvshows-details.html?id=${itemId}`;  // Use the correct URL based on media type

    itemLink.innerHTML = `
      <img src="${posterPath}" alt="${title}">
    `;
    
    // Append the itemDiv to the resultsContainer
    itemDiv.appendChild(itemLink);
    resultsContainer.appendChild(itemDiv);
  });
}




//--SCRIPT to Disable Right-Click function and redirect to another page if checking Developers Tools   
// Disable Right-Click
document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

// Disable Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
document.addEventListener('keydown', function (event) {
    if (event.key === "F12" || 
        (event.ctrlKey && event.shiftKey && event.key === "I") || 
        (event.ctrlKey && event.shiftKey && event.key === "J") || 
        (event.ctrlKey && event.key === "U")) {
        event.preventDefault();
    }
});

// Redirect to Google if DevTools is Opened
setInterval(function(){
    if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200){
        window.location.href = "https://www.effectiveratecpm.com/w6gnwauzb?key=4d8f595f0136eea4d9e6431d88f478b5"; // Redirect to Adsterra Ads
    }
}, 1000);

// Prevent iFrame Embedding (Clickjacking Protection)
if (window !== window.top) {
    window.top.location = window.location;
}

// Prevent Viewing Page Source
document.onkeydown = function(e) {
    if (e.keyCode == 123) { return false; } // F12
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) { return false; } // Ctrl+Shift+I
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) { return false; } // Ctrl+Shift+J
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) { return false; } // Ctrl+U
}; 

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

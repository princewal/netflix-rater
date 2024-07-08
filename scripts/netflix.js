

/* chrome.storage.local.set({ name: "Waleed" }).then(() => {
    console.log("Value is set");
  });

  chrome.storage.local.get(["name"]).then((result) => {
    console.log("Value is " + result.name);
  }); */

chrome.runtime.sendMessage({ action: 'getTabInfo' }, (response) => {
  console.log('Received tab info:', response.url);
  if (response.url.includes("netflix.com/ca/browse/genre/")) {
    // Run your code to modify the page
    console.log("You are on a Netflix genre page!");  
    start()
  }

});

function start () {
  const listOfMovies = document.querySelectorAll('main.nm-collections-container .nm-collections-row .nm-content-horizontal-row .nm-content-horizontal-row-item')
  // console.log('all moves ', listOfMovies)

  injectCustomElement(listOfMovies)
  
}

function injectCustomElement(toList) {
  //create main element 
  let elem = document.createElement('div')
  elem.classList.add('rater-container')
  

  // create other elements for showing info inside main element
  let thumbsUp = document.createElement('div')
  thumbsUp.classList.add('thumbs-container')
  let thumbImage = document.createElement('img');
  thumbImage.src = chrome.runtime.getURL('images/question-mark.svg');
  
  thumbsUp.appendChild(thumbImage)
  elem.appendChild(thumbsUp)

  let ratingContainer = document.createElement('div')
  ratingContainer.classList.add('rating-container')
  elem.appendChild(ratingContainer)

  let selectedElements = Array.prototype.slice.call(toList, 0, 10)

  for(let i = 0; i < selectedElements.length; i++) {
    const clonedElement = elem.cloneNode(true)
    clonedElement.addEventListener('click', e => getMovieStat(e, clonedElement))
    
    selectedElements[i].appendChild(clonedElement)
   
  }
}

/**
 * THis function recieves event and elem from which we retrieve
 * the movie. That is passed to background js and in response 
 * we get the movie name which we forward it to add the ratings
 * @param {object} event 
 * @param {HTMLElement} elem 
 */
function getMovieStat(event, elem) {
  event.preventDefault()
  event.stopPropagation()

  

  const infoSibling = elem.previousElementSibling
  const movieName = infoSibling.querySelector('.nm-collections-title-name').innerText
  
  console.log(movieName)

  chrome.runtime.sendMessage({action: 'getMovieInfo', payload: {movieName}},    function(response) {
    
    if (response && response.success) {
      elem.classList.add('rated')
      putRatings(response.data, elem.querySelector('.rating-container'))
    } else {
      console.error('Error fetching movie data:', response ? response.error : 'No response from background script');
    }
  })
}

function putRatings(data, elem) {
  console.log('Received movie data:', data);
  let ratings = data["Ratings"]
  let htmlContext = `<div class="source">
    <span title="Internet Movie Database">IMD:</span>
    <span>${ratings[0].Value}</span>      
  </div>
  <div class="source">
    <span title="Rotten Tomato">RT:</span>
    <span>${ratings[1].Value}</span>      
  </div>
  <div class="source">
    <span title="Metacritic">MC:</span>
    <span>${ratings[2].Value}</span>      
  </div>`
  elem.innerHTML = htmlContext
}
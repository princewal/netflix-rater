

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
  console.log('all moves ', listOfMovies)

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
    clonedElement.addEventListener('click', getMovieStat)
    
    selectedElements[i].appendChild(clonedElement)
   
  }
}

function getMovieStat(event) {
  event.preventDefault()
  event.stopPropagation()

  const infoSibling = this.previousElementSibling
  const movieName = infoSibling.querySelector('.nm-collections-title-name').innerText
  console.log('get movie stat', infoSibling)
  console.log(movieName)
}

//API Call

/* document.addEventListener('DOMContentLoaded', function () {
    const injectedElement = document.getElementById('myInjectedElement');

    injectedElement.addEventListener('click', function () {
        // Send a message to the background service worker
        chrome.runtime.sendMessage({ action: 'performAPIRequest' }, function (response) {
            // Handle the response from the background service worker
            console.log('Received response:', response);
        });
    });
});
 */
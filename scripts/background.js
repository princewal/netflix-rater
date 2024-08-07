// console.log('background js', this)

chrome.runtime.onInstalled.addListener(({ reason }) => {
  // if (reason === 'install') {
  //   chrome.tabs.create({
  //     url: "onboarding.html"
  //   });
  // }
  // chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  //     console.log('tab', tabs)
  // })
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getTabInfo") {
    // Get the current tab information
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      let tabInfo = null;
      if (!currentTab) {
        tabInfo = {
          url: null,
          id: null,
        };
      } else {
        tabInfo = {
          title: currentTab?.title,
          url: currentTab.url,
          id: currentTab.id,
        };
      }
      // Send the tabInfo back to the content script
      sendResponse(tabInfo);
    });
    // Return true to indicate that we will respond asynchronously
    return true;
  }
  if (message.action === "getMovieInfo") {
    let movieInfo = getMovieInfo(message.payload.movieName)
      .then((data) => {
        sendResponse({ success: true, data });
      })
      .catch((error) => {
        console.error("API request failed:", error);
        sendResponse({ success: false, error: error.message });
      });

    // Return true to indicate that sendResponse will be called asynchronously
    return true;
  }
});

/**
 * Take the title of the movie and make an api call and 
 * return an object containing movie info
 * @param {string} title 
 * @returns {object} data
 */
async function getMovieInfo(title) {
  let response = await fetch(
    `https://www.omdbapi.com/?t=${title}&apikey=2d8640`
  );
  let data = await response.json();
  console.log("bck js => getmovieinfo => data", data);
  return data;
}

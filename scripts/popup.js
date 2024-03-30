console.log('popup js', this.File.name)

let currentTab

const genreLinks = document.querySelectorAll('.genre-list')
genreLinks.forEach( (link) => {
    link.addEventListener('click', e => {
        e.preventDefault()
        getCurrentTab( (tabs)=> {
            const {url, title, id, active} = tabs
            // console.log(url, title, id, active)
            if(url && url.startsWith('https://www.netflix.com/ca/browse/genre/')) {
                chrome.tabs.update(id, { active: true, url: e.target.href })
            } else {
                // If no matching tab exists, create a new tab
                chrome.tabs.create({ url: e.target.href });
            }
        })
    })
})

async function getCurrentTab(callback) {
    try {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const currentTab = tabs[0];
            callback(currentTab);
        });
        
    } catch (error) {
        console.error('Error fetching tab info:', error);
        return null
    }
  }

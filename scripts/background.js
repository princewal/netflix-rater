// console.log('background js', this)

chrome.runtime.onMessage.addListener( (request, sender, sendResponse)=> {
    console.log("request", request)
    console.log(sender)
    sendResponse({farewell: "Goodbye"})
} )
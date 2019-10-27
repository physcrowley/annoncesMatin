function sendTweet(user, tweet, tweet_type) {

    var twitterService = getTwitterService_();

    // If the Google Apps user has authorized the Twitter service
    if (twitterService.hasAccess()) {

        // Remove @ from the Twitter user name, if found
        var twitterUser = user.trim().replace(/^\@/, "");

        var api = "https://api.twitter.com/1.1/";

        // Send a public @tweet or direct message (DM)
        if (tweet_type === "DM") {
            api += "direct_messages/new.json?screen_name=" + twitterUser + "&text=" + encodeString_(tweet);
        } else if (tweet_type === "TWEET") {
            tweet = "@" + twitterUser + " " + tweet;
            api = "statuses/update.json?status=" + encodeString_(tweet);
        }

        var response = twitterService.fetch(api, {
            method: "POST",
            muteHttpExceptions: true
        });
        if (response.getResponseCode() === 200) {
            Logger.log("Tweet sent");
        } else {
            Logger.log("ERROR: " + JSON.parse(response.getContentText()).errors[0].message);
        }
    }
}

// Google Script has trouble sending tweets that contain !*()'
// so we replace these variable from the status text
function encodeString_(q) {
    var str = q;
    str = str.replace(/!/g, 'Ị');
    str = str.replace(/\*/g, '×');
    str = str.replace(/\(/g, '[');
    str = str.replace(/\)/g, ']');
    str = str.replace(/'/g, '’');
    return encodeURIComponent(str);
}

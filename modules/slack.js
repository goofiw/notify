var request = require('request');


var slack = function(message, memberSlack) {

  var url = "https://slack.com/api/chat.postMessage?" +
  "token=xoxp-4698068483-8265520598-22608987667-50318381fc&channel=%40" + 
  memberSlack + "&text=" + message + "&username=assistant&pretty=1";
  request(url, function (error, response, body) {
    console.log("slack response", response)
    if (error && response.statusCode == 200) {
      throw error
    }
  })
}
module.exports = slack;
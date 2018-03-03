// ===============================================================================
// LOAD DATA
// ===============================================================================

var fs = require("fs");

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
    // API GET Requests

    app.get("/api/friends", function(req, res) {
        var friendsData = fs.readFileSync("./data/friends.json", "utf8");
        res.json(JSON.parse("[" + friendsData + "]"));
    });

    // API POST Requests

    app.post("/api/friends", function(req, res) {
        var newFriend = req.body;
        var userResponses = newFriend.scores;
        var friendList = JSON.parse("[" + fs.readFileSync("./data/friends.json", "utf8") + "]");
        var bestMatchIndex;
        var bestMatchScore = 40;

        friendList.forEach(function(friend, index) {
            var curFriendScore = 0;
            for (var i = 0; i < 10; i++) {
                curFriendScore += Math.abs(friend.scores[i] - newFriend.scores[i]);
            }
            if (curFriendScore < bestMatchScore) {
                bestMatchScore = curFriendScore;
                bestMatchIndex = index;
            }
        });

        try {
            if(friendList.length === 0){
              fs.appendFileSync("./data/friends.json", JSON.stringify(newFriend));  
            } else{
              fs.appendFileSync("./data/friends.json", "," + JSON.stringify(newFriend));
            }
            
        } catch (err) {
            /* Handle the error */
            res.json(false);
        }
        if(bestMatchIndex === null){
          res.json({name: "No match found."});  
        } else{
          res.json(friendList[bestMatchIndex]);  
        }
        
    });

};
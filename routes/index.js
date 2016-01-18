var express = require('express');
var router = express.Router();
var request = require('request');

var STRAVA_TOKEN = process.env.STRAVA_TOKEN || null;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'I Run With Strava'
    });
});


router.get('/strava_activities', function(req, res, next) {
    // check if token exists
    if (!STRAVA_TOKEN) {
        res.status(400).send('token not found.');
        return;
    }

    var options = {
        url: 'https://www.strava.com/api/v3/athlete/activities?per_page=10',
        headers: {
            'Authorization': 'Bearer ' + STRAVA_TOKEN
        }
    };
    var callback = function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            res.send(data);
        } else {
            res.send('There was a problem with the request.')
        }
    };
    var activities = request(options, callback);
})

module.exports = router;

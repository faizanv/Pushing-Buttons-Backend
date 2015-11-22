var express = require('express');
var router = express.Router();
var request = require('request');
var Firebase = require("firebase");
var fb = new Firebase("https://pushingbuttons.firebaseio.com/");

function orderFood(callback) {
  request.post('https://api.postmates.com/v1/customers/cus_K_4gGQ9MY-HkOF/deliveries', function(error, response, body) {
    callback(JSON.parse(body));
  })
  .auth('9237cd55-54ed-472b-9cd9-7acfc2af3e1b', '', true)
  .form({
    pickup_address: "718 Ponce de Leon Ave, Atlanta, GA 30306",
    dropoff_address: "711 Techwood Dr NW, Atlanta, GA 30313",
    pickup_name: "Chipotle",
    dropoff_name: "Faizan & Amreeta",
    pickup_phone_number: "4046853531",
    dropoff_phone_number: "9546097527",
    manifest: "Burrito with chicken, brown rice, black beans, cheese, and sour cream"
  });
}

function morning(callback) {
  request.post('https://api.twilio.com/2010-04-01/Accounts/ACacc9d594b831d7af5208868049ddb9e9/Messages.json', function(error, reponse, body) {
    callback(JSON.parse(body));
  })
  .auth("ACacc9d594b831d7af5208868049ddb9e9", "53c50aa776653ae1ccdc749d131d80df", true)
  .form({
    To: "4252313721",
    From: "+14692511032",
    Body: "Good morning beautiful <3",
    MediaUrl: "http://i.imgur.com/68EexTU.jpg"
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  fb.on('value', function(dataSnapshot) {
    console.log(dataSnapshot.val());
    res.render('index', { title: dataSnapshot.val().mode });
    fb.off();
  });
});

router.get('/pushButton', function(req, res, next) {
  fb.on('value', function(dataSnapshot) {
    switch (dataSnapshot.val().mode) {
      case "orderFood":
        orderFood(function(retVal) {
          res.json(retVal);
        });
      break;
      case "morning":
        morning(function(retVal) {
          res.json(retVal);
        });
      break;
      default:
        res.send("Booty");
    }
    fb.off();
  });
});

// router.get('/morning', function(req, res, next) {
//
// });

router.get("/changeMode/:id", function(req, res, next) {
  fb.set({mode: req.params.id}, function(err) {
    if (err) {
      res.send(error);
    } else {
      res.send("booty");
    }
  });

});

module.exports = router;

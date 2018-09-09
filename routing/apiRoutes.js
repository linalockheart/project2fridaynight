require("dotenv").config();
var path = require("path");
var request = require("request");
var ensureLogin = require("connect-ensure-login");
var db = require("../models");


var NodeGeocoder = require("node-geocoder");

var options = {
  provider: "google",

  // Optional depending on the providers
  httpAdapter: "https", // Default
  apiKey: process.env.apiKey, // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};
var geocoder = NodeGeocoder(options);



module.exports = function (app) {

  app.post("/api", function (req, res) {

    var newSearch = req.body;
    var location = newSearch.location;
    geocoder.geocode(location)
      .then(function (res) {
        var latitude = res[0].latitude.toFixed(2);
        var longitude = res[0].longitude.toFixed(2);
        console.log("lat and long " + latitude + " and   " + longitude);
        return latitude + "," + longitude;
      })
      .then(function (result) {
        request({
          url: "https://api.foursquare.com/v2/venues/search",
          method: "GET",
          qs: {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            ll: result,
            query: newSearch.name,
            v: "20180323",
            limit: 5
          }
        }, function (err, result, body) {
          if (err) {
            console.error(err);
          } else {
            req.session.fsData = body;
            return res.json(JSON.parse(body));
          }
        });


      });
  });





  app.post("/api/comments",
    ensureLogin.ensureLoggedIn("/login"),
    function (req, res) {

      var data = req.body;


      db.Comment.create({
        fbUserId: data.fbUserId,
        fbUserDisplayName: data.fbUserDisplayName,
        fsVenueId: data.fsVenueId,
        body: data.newComment,


      })
        .then(function(results) {
          res.redirect("/venue/" + data.routeName + "?venue_id=" + data.fsVenueId);
        });
    });



  // Get all examples
  app.get("/api/examples",
    ensureLogin.ensureLoggedIn("/login"),
    function (
      req,
      res
    ) {
      db.Example.findAll({}).then(function (dbExamples) {
        res.json(dbExamples);
      });
    });



  // Create a new example
  app.post("/api/examples",
    ensureLogin.ensureLoggedIn("/login"),
    function (
      req,
      res
    ) {
      db.Example.create(req.body).then(function (dbExample) {
        res.json(dbExample);
      });
    });



  // Delete an example by id
  app.delete(
    "/api/examples/:id",
    ensureLogin.ensureLoggedIn("/login"),
    function (req, res) {
      db.Example.destroy({ where: { id: req.params.id } }).then(function (
        dbExample
      ) {
        res.json(dbExample);
      });
    }
  );
};



var path = require("path");

var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var cookieParser = require("cookie-parser");
var expressSession = require("express-session");
var morgan = require("morgan");
var db = require("./models");
require("dotenv").config();
//var request = require('request');


var app = express();
var PORT = process.env.PORT || 8080;

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views", "layouts")
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("./public"));
app.use(morgan("combined"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  expressSession({
    secret: "keyboard cat",
    resave: true,
    saveUnintialized: true
  })
);
require("./routing/loginRoutes.js")(app);
require("./routing/apiRoutes")(app);
require("./routing/htmlRoutes.js")(app);


var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;

console.log(path);




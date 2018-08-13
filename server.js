var cc       = require('config-multipaas'),
    fs       = require('fs'),
    http     = require("http"),
    st       = require("st"),
    Router   = require("routes-router"),
    sendJson = require("send-data/json"),
    sendHtml = require("send-data/html"),
    sendError= require("send-data/error")

var config   = cc()
var app      = Router()

// Configure the BACKEND_SERVICE host address via environment variables:
var backend_host = process.env.BACKEND_SERVICE || "http://backend-wildwestapp-wildwest.b9ad.pro-us-east-1.openshiftapps.com"
var game_js = fs.readFileSync(__dirname + '/game.js');
var game_js_response = game_js.toString().replace("'BACKEND_SERVICE'", '"'+backend_host+'"');

// Routes
app.addRoute("/status", function (req, res, opts, cb) {
  sendJson(req, res, "{status: 'ok'}")
})

app.addRoute("/assets/game.js", function (req, res, opts, cb) {
  sendHtml(req, res, {
    body: game_js_response,
    statusCode: 200,
    headers: {}
  })
});

app.addRoute("/", function (req, res, opts, cb) {
  var index_html = fs.readFileSync(__dirname + '/index.html');
  sendHtml(req, res, {
    body: index_html.toString().replace('BACKEND_SERVICE', backend_host),
    statusCode: 200,
    headers: {}
  })
});

app.addRoute("/hostname", function (req, res, opts, cb) {
  var data = "<p>Hostname: " + config.get('HOSTNAME') + "</p>";
  sendHtml(req, res, {
    body: data,
    statusCode: 200
  })
})

// Serve PatternFly deps from node_modules
// Serve static assets prefixed with '/assets', or '/node_modules'
var static_folders=['assets','node_modules'];
for(var folder in static_folders){
  app.addRoute( "/"+static_folders[folder]+"/*", st({
    path: static_folders[folder], url: static_folders[folder]
  }))
}

var server = http.createServer(app)
server.listen(config.get('PORT'), config.get('IP'), function () {
  console.log( "Listening on " + config.get('IP') + ", port " + config.get('PORT') )
});

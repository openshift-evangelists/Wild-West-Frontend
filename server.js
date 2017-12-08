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

// Routes
app.addRoute("/status", function (req, res, opts, cb) {
  sendJson(req, res, "{status: 'ok'}")
})

app.addRoute("/", function (req, res, opts, cb) {
  var data = fs.readFileSync(__dirname + '/index.html');
  sendHtml(req, res, {
    body: data.toString(),
    statusCode: 200,
    headers: {}
  })
})

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

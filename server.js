'use strict';

var config         = require('./bin/config.js'),
    express        = require('express');
var session = require('express-session');
var Keycloak = require('keycloak-connect');

// TODO: Find a proper way to disable complains on self sign certificates.
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

var app = express();
// For keycloak. See reference doc at https://www.keycloak.org/docs/latest/securing_apps/index.html#_nodejs_adapter
var memoryStore = new session.MemoryStore();
var keycloak = new Keycloak({store: memoryStore});
//session
app.use(session({
  secret: 'thisShouldBeLongAndSecret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

app.use( keycloak.middleware());

var backend_path = config.get('backend_path'),
    backend_host = config.get('backend_host');

var routes  = require('./routes/routes.js');
var status  = require('./routes/status.js');
var backend = require('./routes/backend.js');

//Simple request time logger
app.use(function(req, res, next){
  console.log("Requested: " + req.path);
  next();
});

function logToken(token, request) {
//  console.log("Request to " + request.url + " with token " + JSON.stringify(token));
  console.log("Request to " + request.url);
  return true;
}

// Static files
app.use('/assets', express.static('assets'));
app.use('/node_modules', express.static('node_modules'));
app.use('/bin', express.static('bin'));
// Status page
app.use('/status', status);
// Application
app.use('/', keycloak.protect(logToken), routes);
app.use(backend_path, backend);
// Anything else
app.get('*', function(req, res){
  res.send('Sorry, this URL is not defined');
});


app.listen(config.get('PORT'), config.get('IP'), function () {
  console.log( 'Listening on ' + config.get('IP') + ', port ' + config.get('PORT') )
  console.log( config.get('path_info') );
  if( !backend_host ){
    console.error(config.get('backend_config_error'));
  }else{
    console.log(config.get('backend_config_info'));
  }
});
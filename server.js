var config         = require('./bin/config.js'),
    fs             = require('fs'),
    http           = require('http'),
    HttpHashRouter = require('http-hash-router'),
    st             = require('st'),
    request        = require('request'),
    sendJson       = require('send-data/json'),
    sendHtml       = require('send-data/html'),
    sendError      = require('send-data/error')

var router = HttpHashRouter();

var backend_path = config.get('backend_path'),
    frontend_path= config.get('frontend_path'),
    backend_host = config.get('backend_host');

var backend_proxy = function (req, res, opts, cb) {
  if(!backend_host){
    console.error(config.get('backend_config_error'));
    sendJson(req, res, config.get('backend_config_error'));
  }else{
    // Strip our Backend path prefix before proxying the request:
    req.pipe(request('http://'+backend_host+req.url.substring(backend_path.length))).pipe(res);
  }
}
var index_page = function (req, res, opts, cb) {
  var index_html = fs.readFileSync(__dirname + '/index.html');
  if(backend_path !== '/ws'){
    index_html = index_html.toString().replace('// BACKEND_PATH_CONFIG', 'window.backend_path = \''+backend_path+'\';');
  }
  sendHtml(req, res, {
    body: index_html,
    statusCode: 200
  })
};

// Routes
router.set(backend_path+'*', backend_proxy);
router.set(frontend_path, index_page);

// Ensure that we return *something* on the default path
if( frontend_path !== '/'){
  router.set('/', function (req, res, opts, cb) {
    sendHtml(req, res, {
      body: config.get('path_info'),
      statusCode: 200
    })
  });
  // append trailing slash - ensure a valid relative path for static assets
  router.set(config.get('no_slash_frontend'), function (req, res, opts, cb) {
    res.statusCode=302;
    res.setHeader('Location', frontend_path );
    res.end();
  });
}

// Serve static assets from our static_content folders
var static_content=['assets','node_modules'];
for(var folder in static_content){
  router.set(frontend_path+static_content[folder]+"/*", st({
    path: static_content[folder], url: frontend_path+static_content[folder]
  }));
}

// TODO: these two functions are just for testing, can be deleted:
router.set(frontend_path+'status', function (req, res, opts, cb) {
  sendJson(req, res, {'status': 'ok'})
});

router.set(frontend_path+'hostname', function (req, res, opts, cb) {
  var data = '<p>Hostname: ' + config.get('HOSTNAME') + '</p>';
  sendHtml(req, res, {
    body: data,
    statusCode: 200
  })
});

// Listen
var server = http.createServer(function handler(req, res) {
  router(req, res, {}, onError);
  function onError(err) {
    if (err) {
      res.statusCode = err.statusCode || 500;
      res.end(err.message);
    }
  }
});
server.listen(config.get('PORT'), config.get('IP'), function () {
  console.log( 'Listening on ' + config.get('IP') + ', port ' + config.get('PORT') )
  console.log( config.get('path_info') );
  if( !backend_host ){
    console.error(config.get('backend_config_error'));
  }else{
    console.log(config.get('backend_config_info'));
  }
});


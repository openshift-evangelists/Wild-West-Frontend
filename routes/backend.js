var express    = require('express'),
    config     = require('../bin/config.js'),
    request    = require('request');

var router = express.Router();

var backend_path  = config.get('backend_path'),
    backend_host  = config.get('backend_host');

router.get('/*', function(req, res){
  console.log("Requested backend method");
  var backend = 'http://' + backend_host + req.url;
  console.log("Requested backend path: " + req.url);
  console.log('Backend: ' + backend);
  try{
    req.pipe(request[req.method.toLowerCase()](backend)).pipe(res);
  }catch(ex){
    console.error("An error ocurred while contacting backend service " + backend);
    console.error(ex);
  }
});

//export this router to use in our index.js
module.exports = router;
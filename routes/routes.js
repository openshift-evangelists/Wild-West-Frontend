var express    = require('express'),
    config     = require('../bin/config.js'),
    fs         = require('fs');

var backend_path  = config.get('backend_path'),
    frontend_path = config.get('frontend_path');

var router = express.Router();

// TODO: Rewrite this logic below
var index_page = function (req, res) {
  console.log("Backend_path: " + backend_path);
  var index_html = fs.readFileSync(__dirname + '/..' + '/index.html');
  if(backend_path !== '/ws'){
    index_html = index_html.toString().replace('// BACKEND_PATH_CONFIG', 'window.backend_path = \''+backend_path+'\';');
  }
  res.status(200).type('html').send(index_html);
};

router.get(frontend_path, index_page);

//export this router to use in our index.js
module.exports = router;
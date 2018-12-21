var express    = require('express'),
    config     = require('../bin/config.js');

var router = express.Router();

router.get('/', function(req, res){
  res.json({'status': 'ok', 'hostname': config.get('HOSTNAME'), 'port': config.get('PORT') })
});

//export this router to use in our index.js
module.exports = router;
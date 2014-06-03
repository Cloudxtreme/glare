var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'The CloudFlare DNS Monitoring Service' });
});
});

module.exports = router;

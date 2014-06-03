var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Glare - The CloudFlare DNS Monitoring Service' });
});

/* GET registration page. */
router.get('/register', function(req, res) {
  res.render('register', { title: 'Glare - Create an Account' });
});

/* GET login page. */
router.get('/login', function(req, res) {
  res.render('login', { title: 'Glare - Login to Your Account' });
});

module.exports = router;

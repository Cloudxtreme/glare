var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
  res.render('index', {
    title: 'Glare - The CloudFlare DNS Monitoring Service',
    user: req.user,
  });
});

router.get('/dashboard', function(req, res) {
  if (!req.user || req.user.status !== 'ENABLED') {
    return res.redirect('/login');
  }

  res.render('dashboard', {
    title: 'Glare - Dashboard',
    user: req.user,
  });
});

module.exports = router;

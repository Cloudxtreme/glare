var express = require('express');
var router = express.Router();
var passport = require('passport');
var stormpath = require('stormpath');


router.get('/register', function(req, res) {
  res.render('register', {
    title: 'Glare - Create an Account',
    error: req.flash('error')[0],
  });
});

router.post('/register', function(req, res) {
  var email = req.body.username;
  var password = req.body.password;
  var firstName = req.body['first-name'];
  var lastName = req.body['last-name'];

  if (!email || !password || !firstName || !lastName) {
    return res.render('register', {
      title: 'Glare - Create an Account',
      error: 'Missing fields.',
    });
  }

  var apiKey = new stormpath.ApiKey(process.env['STORMPATH_API_KEY_ID'], process.env['STORMPATH_API_KEY_SECRET']);
  var client = new stormpath.Client({ apiKey: apiKey });

  client.getApplication(process.env.STORMPATH_APP_HREF, function(err, app) {
    if (err) {
      return res.render('register', {
        title: 'Glare - Create an Account',
        error: 'Server error, please try again.',
      });
    }

    app.createAccount({
      givenName: firstName,
      surname: lastName,
      email: email,
      password: password,
      username: email,
    }, function(err, acc) {
      if (err) {
        return res.render('register', {
          title: 'Glare - Create an Account',
          error: err.userMessage,
        });
      } else {
        passport.authenticate('stormpath')(req, res, function() {
          return res.redirect('/dashboard');
        });
      }
    });
  });
});

router.get('/login', function(req, res) {
  res.render('login', { title: 'Glare - Login to Your Account' });
});

router.post('/login', passport.authenticate('stormpath', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: 'Invalid email or password.',
}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;

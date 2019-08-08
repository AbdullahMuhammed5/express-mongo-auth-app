var express = require('express');
var router = express.Router();
var User = require('../models/user.js')

// GET / Register
router.get('/register', (req, res, next)=>{
	return res.render("register", { title: 'Sign Up' })
})

// GET / Register
router.post('/register', (req, res, next)=>{
	if (req.body.email && req.body.username &&req.body.favoriteBook &&
		req.body.password && req.body.confirmPassword) {
		// ensure password fields is matched
		if(req.body.password !== req.body.confirmPassword){
			var error = new Error('Password doesn\'t match')
			error.status = 400
			return next(error)
		}
		var userData = {
			username: req.body.username,
			email: req.body.email,
			favoriteBook: req.body.favoriteBook,
			password: req.body.password
		}
		User.create(userData, (err, user)=>{
			if (err) {
				return next(err)
			} else {
				res.redirect('/profile')
			}
		})
	} else{
		var error = new Error('All Fields are require')
		error.status = 400
		return next(error)
	}
})

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

module.exports = router;

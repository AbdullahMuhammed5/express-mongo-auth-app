var express = require('express');
var router = express.Router();
var User = require('../models/user.js')
var middlewares = require('../middlewares')
const {rules, validation} = require('../middlewares/registerValidation')

// GET / Register
router.get('/register', middlewares.isLoggedIn, (req, res, next)=>{
	return res.render("register", { title: 'Sign Up' })
})

// POST / Register
router.post('/register', rules(), validation, (req, res, next)=>{
  	
		const {username, email, favoriteBook, password} = req.body;
		var userData = {
			username,
			email,
			favoriteBook,
			password
		}
		User.create(userData, (err, user)=>{
			if (err) {
				return next(err)
			} else {
				req.session.userId = user._id
				res.redirect('/profile')
			}
		})
})

// GET /login
router.get('/login', middlewares.isLoggedIn, (req, res, next)=>{
	return res.render('login', { title: 'Login'})
})

// POST /login
router.post('/login', (req, res, next)=>{
	if (req.body.email && req.body.password) {
		User.authenticate(req.body.email, req.body.password, function(err, user) {
			if(err || !user){
				var error = new Error("Wrong Email or Password..!!")
				error.status = 401
				return next(error)
			} else {
				req.session.userId = user._id
				return res.redirect('/profile')
			}
		});
	} else {
		var error = new Error('Email or Password doesn\'t exists')
		error.status = 400
		return next(error)
	}
})

// GET /logout
router.get('/logout', (req, res, next)=>{
	// delete session
	if (req.session) {
		req.session.destroy((err)=>{
			if (err) {
				return next(err)
			} else {
				res.redirect('/')
			}
		});
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

// GET /profile
router.get('/profile', middlewares.profileGuard, (req, res, next)=>{

	User.findById(req.session.userId, (err, user)=>{
		if (err) throw err
		res.render('profile', {title: "Profile", name: user.username, favorite: user.favoriteBook})
	})
	
})
module.exports = router;

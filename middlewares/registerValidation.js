const { check, validationResult, body  } = require('express-validator');
var User = require('../models/user.js')

const rules = () =>{
	return [
		check('username').custom(value => {
			if (!value) {
				return Promise.reject('Username is required.');
			} else{
			    return User.find({'username': value}).then(user => {
			      if (user.length > 0) {
			    	console.log(user)
			        return Promise.reject('Username already in use');
			      }
			  	});
			}
		  }),
		check('email').isEmail().withMessage('Must be email format.'),
		check('email').custom((value) => {
			return User.find({'email': value}).then(user => {
		      if (user.length > 0) {
		        return Promise.reject('email already in use');
		      }
		  	});
		}),
		check('favoriteBook', 'Favorite Book is required.').notEmpty(),
		check('password').isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
		check('confirmPassword').custom((value, { req }) => {
			if (value !== req.body.password) {
			  throw new Error('Password confirmation is incorrect');
			}
		})
	]
}

validation = (req, res, next) => {
	const errors = validationResult(req);

  	if (!errors.isEmpty()) {
  		res.locals.errors = errors.array()
  		return next()
  	} 

  	return next()
}

module.exports = {
	rules,
	validation
}

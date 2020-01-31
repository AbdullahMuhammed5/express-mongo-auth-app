var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
// var User = require('../models/user.js')

var userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		trim: true
	},
	favoriteBook: {
		type: String,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true,
	}
})

// authenticate user
userSchema.statics.authenticate = function(email, password, callback){
	User.findOne({email: email})
		.exec(function(err, user){
			if (err) {
				return callback(err)
			} else if(!user){
				var err = new Error("User not found")
				err.status = 401
				return callback(err)
			}
			bcrypt.compare(password, user.password, function(err, result) {
				if (result == true) {
					return callback(null, user)
				} else {
					return callback()
				}
			})
		})
}

userSchema.pre("save", function(next){
	var user = this
	bcrypt.hash(user.password, 10, function(err, hash) {
		if (err) {
			return next(err)
		} else {
			user.password = hash
			next()
		}
	})
})

var User = mongoose.model("User", userSchema)
module.exports = User

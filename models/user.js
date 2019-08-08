var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

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

module.exports = mongoose.model("User", userSchema)
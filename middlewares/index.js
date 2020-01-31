function isLoggedIn(req, res, next){
	if (req.session && req.session.userId) {
		return res.redirect('/profile')
	}
	return next()
}
function profileGuard(req, res, next){
	if (req.session && req.session.userId) {
		return next();
	} else {
		var error = new Error("You are not authorized to veiw this page!! Please login first.")
		error.status = 401
		return next(error)
	}
}

module.exports = {
	isLoggedIn: isLoggedIn,
	profileGuard: profileGuard
}
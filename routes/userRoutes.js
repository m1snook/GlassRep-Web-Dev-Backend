const express = require('express');
const passport = require('./../config/passport');
const authController = require('../controllers/authController');
const router = express.Router();

// get logged in user data
router.get('/me', authController.protectRoutes, (req, res) => {
	const user = req.user;
	res.json({
		user,
	});
});

// google Oauth (for Web)
router.get(
	'/auth/google',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
	})
);

router.get(
	'/auth/google/callback',
	passport.authenticate('google', { accessType: '' }),
	(_, res) => {
		res.redirect('http://localhost:3000');
	}
);

// local auth
router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);
router.patch(
	'/update-password',
	authController.protectRoutes,
	authController.updateUserPassword
);

// logout for both local and google auth
router.get('/logout', authController.logoutUser);

module.exports = router;

const AppError = require('../utils/AppError');
const fbAdmin = require('../config/firebase');
const User = require('../models/userModel');
const { ObjectId } = require('mongodb');

// Protect Routes
exports.protectRoutes = async (req, res, next) => {
	try {
		if (
			!req.headers.authorization ||
			!req.headers.authorization.startsWith('Bearer')
		) {
			req.user = null;
			return next(new AppError('you are not logged in', 401));
		}

		let idToken = req.headers.authorization.split(' ')[1];

		const decodedToken = await fbAdmin.auth().verifyIdToken(idToken, true);

		const { email, uid } = decodedToken;

		let user = await User.findOne({
			email,
			_id: uid,
		});

		if (!user) {
			user = await User.create({ email, _id: new ObjectId(uid) });
		}

		req.user = user;

		next();
	} catch (err) {
		console.log({ err });
		next(err);
	}
};
// is admin 
// restrict routes based on role
exports.restrictTo = (role) => {
	return (req, res, next) => {
		const user = req.user;

		if (user.role !== role) {
			return next(
				new AppError('you are not authorized to perform this action', 403)
			);
		}

		next();
	};
};

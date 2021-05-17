const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const { signToken, decodeToken } = require('./../utils/jwt');

// register user
exports.registerUser = async (req, res, next) => {
	try {
		const { name, email, password, passwordConfirm } = req.body;

		if (!email || !name || !password) {
			return next(new AppError('please enter all the required fields', 400));
		}

		if (password !== passwordConfirm) {
			return next(new AppError('passwords do not match', 400));
		}

		const user = await User.create({
			auth: {
				provider: 'local',
			},
			name,
			email,
			password,
			passwordConfirm,
		});

		const token = await signToken({ id: user._id }, req, res);

		user.hideSensitiveData(user);

		res.status(201).json({
			token,
			status: 'success',
			user,
		});
	} catch (err) {
		next(err);
	}
};

// login user
exports.loginUser = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return next(new AppError('please enter your credentials', 400));
		}

		const user = await User.findOne({ email, 'auth.provider': 'local' }).select(
			'+password'
		);

		if (!user || !(await user.checkPassword(password, user.password))) {
			return next(new AppError('invalid credentials', 400));
		}

		const token = await signToken({ id: user._id }, req, res);

		user.hideSensitiveData(user);

		res.status(200).json({
			token,
			status: 'success',
			user,
		});
	} catch (err) {
		next(err);
	}
};

// Logout User
exports.logoutUser = async (req, res, next) => {
	try {
		if (req.session) {
			req.logout();
			req.session = null;
		}

		res.clearCookie(process.env.JWT_COOKIE_NAME);

		res.status(200).json({
			status: 'success',
			user: req.user,
		});
	} catch (err) {
		next(err);
	}
};

// Protect Routes
exports.protectRoutes = async (req, res, next) => {
	try {
		if (!req.user) {
			let authToken;
			if (req.cookies[process.env.JWT_COOKIE_NAME]) {
				authToken = req.cookies[process.env.JWT_COOKIE_NAME];
			} else if (
				req.headers.authorization &&
				req.headers.authorization.startsWith('Bearer')
			) {
				authToken = req.headers.authorization.split(' ')[1];
			}

			const { id, iat, exp } = await decodeToken(authToken);

			const user = await User.findById(id).select('+passwordChangedAt');

			if (!user || !user.checkJwtExpires(iat, exp)) {
				return next(
					new AppError('you are not authorized. please login to continue', 401)
				);
			}

			user.hideSensitiveData(user);

			req.user = user;
		}

		next();
	} catch (err) {
		next(err);
	}
};

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

// Update Current User Password
exports.updateUserPassword = async (req, res, next) => {
	try {
		const { currentPassword, password, passwordConfirm } = req.body;

		if (password !== passwordConfirm) {
			return next(new AppError('passwords do not match', 400));
		}

		const user = await User.findById(req.user._id).select('+password');

		if (!(await user.checkPassword(currentPassword, user.password))) {
			return next(new AppError('invalid password', 400));
		}

		user.password = password;
		user.passwordConfirm = passwordConfirm;
		await user.save();

		user.hideSensitiveData(user);

		const token = await signToken({ id: user._id }, req, res);

		res.status(200).json({
			status: 'success',
			token,
			user,
		});
	} catch (err) {
		next(err);
	}
};

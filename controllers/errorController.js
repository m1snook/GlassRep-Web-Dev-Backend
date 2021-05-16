const AppError = require('./../utils/AppError');

// Duplicate Key Error (Field Already Exists)
const sendDuplicateKeyError = (err, req) => {
	let error = { ...err };
	error.statusCode = 400;

	// Creating a user with same email
	if (req.originalUrl.includes('register') && req.method === 'POST') {
		error.message = 'user with that email already exists';
	} else {
		error.message = 'this value has already been taken';
	}

	return error;
};

// JWT Error
const sendJwtError = (err) => {
	let error = { ...err };
	error.message = 'you are not logged in. please login to continue';
	error.statusCode = 401;
	return error;
};

// JWT expired error
const sendTokenExpiredError = (err) => {
	let error = { ...err };
	error.message = 'your session has expired. please login to continue';
	error.statusCode = 401;
	return error;
};

// Handling Cast Errors
const sendCastError = (err) => {
	const message = `This data does not exist`;
	return new AppError(message, 400);
};

// Handling Validation Errors
const sendValidationError = (err) => {
	let message = Object.keys(err.errors).map((field) =>
		err.errors[field].properties[0]
			? `${err.errors[field].properties[0]} `
			: ` ${err.errors[field].properties.message}`
	);
	return new AppError(message, 400);
};

//  Error
const sendError = (err, req, res) => {
	res.status(err.statusCode || 500).json({
		status: err.status || 'error',
		message: err.message || 'Something went wrong',
	});
};

module.exports = (err, req, res, next) => {
	let error = { ...err };
	if (err.code === 11000) error = sendDuplicateKeyError(err, req);
	if (err.name === 'JsonWebTokenError') error = sendJwtError(err);
	if (err.name === 'TokenExpiredError') error = sendTokenExpiredError(err);
	if (err.name === 'CastError') error = sendCastError(err);
	if (err.name === 'ValidationError') error = sendValidationError(err);

	sendError(error, req, res);
};

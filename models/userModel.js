const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
	{
		auth: {
			provider: {
				type: String,
				enum: ['google', 'local'],
				required: true,
			},
			googleId: {
				type: String,
			},
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		role: {
			type: String,
			enum: ['admin', 'customer'],
			default: 'customer',
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			unique: [true, 'user with this email already exists'],
			required: [true, 'user must provide their email id'],
			validate: [validator.isEmail, 'please provide a valid email id'],
		},
		password: {
			type: String,
			minlength: 6,
			select: false,
		},
		name: {
			type: String,
			trim: true,
			lowercase: true,
			required: [true, 'user must provide their name'],
		},
		passwordChangedAt: {
			type: Date,
		},
		cart: {
			type: [
				{
					pid: {
						type: mongoose.Schema.Types.ObjectId,
						ref: 'Product',
					},
					qty: {
						type: Number,
						min: 1,
					},
				},
			],
			default: [],
		},
	},
	{
		timestamps: true,
	}
);

userSchema.pre('save', async function (next) {
	if (!this.isModified('password') || this.auth.provider === 'google')
		return next();

	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});

userSchema.pre('save', function (next) {
	if (!this.isModified('password') || this.isNew) return next();

	this.passwordChangedAt = Date.now() - 1500;
	next();
});

userSchema.methods.checkPassword = async function (
	enteredPassword,
	dbPassword
) {
	return await bcrypt.compare(enteredPassword, dbPassword);
};

userSchema.methods.checkJwtExpires = function (issuedAt, expiresAt) {
	return expiresAt * 1000 > Date.now() && issuedAt * 1000 < Date.now();
};

userSchema.methods.hideSensitiveData = function (user) {
	user.password = undefined;
	user.passwordConfirm = undefined;
	user.passwordChangedAt = undefined;
	user.__v = undefined;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

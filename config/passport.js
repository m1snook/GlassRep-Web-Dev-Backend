const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../.env` });
const GoogleStrategy = require('passport-google-oauth20');
const passport = require('passport');
const User = require('./../models/userModel');

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id).then((user) => {
		done(null, user);
	});
});

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
			clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
			callbackURL: '/api/users/auth/google/callback',
			passReqToCallback: true,
		},
		async function (req, accessToken, __, profile, done) {
			req.accessToken = accessToken;

			try {
				let user = await User.findOne({ 'auth.googleId': profile.id });
				if (!user) {
					user = await User.create({
						auth: {
							provider: 'google',
							googleId: profile.id,
						},
						email: profile.emails[0].value,
						isVerified: profile.emails[0].verified,
						name: profile.displayName,
					});
				}

				return done(null, user);
			} catch (err) {
				return done(err, null);
			}
		}
	)
);

module.exports = passport;

const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../.env` });

const admin = require('firebase-admin');

const fbAdmin = admin.initializeApp({
	credential: admin.credential.cert({
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
		privateKey: process.env.FIREBASE_PRIVATE_KEY,
		projectId: process.env.FIREBASE_PROJECT_ID,
	}),
});

if (fbAdmin) {
	console.log('connected to Firebase services...');
}

module.exports = fbAdmin;

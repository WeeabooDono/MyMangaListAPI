const express = require('express');

const User = require('../../models/User');

const router = express.Router();

// POST /api/oauth2/google
router.post('/google', (req, res) => {
	const googleAccount = {
		googleId: req.body.googleId,
		familyName: req.body.familyName,
		givenName: req.body.givenName,
		image: req.body.image,
	};
	const { email, verified } = req.body;

	User.findOne({ 'google.googleId': googleAccount.googleId })
		.then((user) => {
			if (user) res.json({ message: 'Already registered', user });
			else {
				new User({
					google: googleAccount,
					username: `${googleAccount.familyName} ${googleAccount.givenName}`,
					email,
					isVerified: verified,
				})
					.save()
					.then((user) => res.json({ message: 'success', user }))
					.catch((error) => res.json({ message: error, user: null })); // TODO: handle error
			}
		})
		.catch((error) => res.json({ message: error, user: null })); // TODO: handle error
});

module.exports = router;

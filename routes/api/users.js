/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const router = express.Router();
const { ObjectId } = require('mongoose').Types;
const User = require('../../models/User');
const Token = require('../../models/Token');

// GET /api/users
router.get('/', (req, res) => {
	User.find({}).then((users) => {
		res.json(users);
	});
});

// GET /api/users/:identity
router.get('/:identity', (req, res) => {
	const { identity } = req.params;
	User.findOne({
		$or: [
			{ username: identity },
			{ email: identity },
		],
	}).then((user) => res.json(user));
});

// GET /api/users/:identity
router.get('/:identity/id', (req, res) => {
	const { identity } = req.params;
	User.findById(new ObjectId(identity)).then((user) => res.json(user));
});

// DELETE /api/users
router.delete('/', (req, res) => {
	const uname = req.body.username;
	User.deleteOne({ username: uname }).then((response) => {
		const deleted = response.n !== 0;
		if (deleted) res.json({ message: 'success', username: uname });
		else res.json({ message: 'fail', username: uname });
	}).catch((error) => {
		res.json({ message: error });
	});
});

// POST /api/users
router.post('/', (req, res) => {
	const {
		username, email, password, password2,
	} = req.body;
	const errors = [];

	// Check required fields
	if (!username || !email || !password || !password2) errors.push({ message: 'All fields needs to be filled' });

	// Check password match
	if (password !== password2) errors.push({ message: 'Passwords do not match' });

	// Check password length
	if (password.length < 6) errors.push({ message: 'Password should be at least 6 characters' });

	if (errors.length > 0) {
		res.json({
			errors,
			username,
			email,
			password,
			password2,
		});
	} else {
		// Check if user already exists
		User.findOne({
			$or: [
				{ email },
				{ username },
			],
		}).then((user) => {
			if (user) {
				if (user.email === email) errors.push({ message: 'Email already exists' });
				if (user.username === username) errors.push({ message: 'Username already exists' });
				res.json({
					errors,
					username,
					email,
					password,
					password2,
				});
			} else {
				const data = {
					username,
					email,
					password,
				};
				if (req.body.isVerified) data.isVerified = true;
				const newUser = new User(data);
				newUser.save()
					.then((user) => {
						res.json({ message: 'success', user });
					})
					.catch((err) => console.log(err)); // TODO: Handle le cas d'erreur
			}
		});
	}
});

// PATCH /api/users
router.patch('/', (req, res) => {
	const {
		username, email, email_old, status, roles,
	} = req.body;
	const data = { email, status, roles };
	User.findOne({ email }).then((user) => {
		if (user && email !== email_old) res.json({ message: 'email' });
		else {
			User.updateOne(
				{ username },
				{ $set: data },
			).then((response) => {
				const updated = response.n !== 0;
				if (updated) res.json({ message: 'success' });
				else res.json({ message: 'fail' });
			}).catch((error) => {
				res.json({ message: error });
			});
		}
	});
});

// PATCH /api/users
router.patch('/validate', (req, res) => {
	const { token } = req.body;

	Token.findOne({ token })
		.then((token) => {
			if (token) {
				const _id = ObjectId(token._userId);
				User.updateOne(
					{ _id },
					{
						$set: {
							isVerified: true,
						},
					},
				)
					.then((response) => {
						const updated = response.n !== 0;
						if (updated) {
							User.findOne({ _id })
								.then((user) => {
									Token.deleteMany({ _userId: _id }).then((response) => console.log(`${response.n} tokens deleted`));
									res.json({ message: 'success', user });
								}).catch((error) => {
									res.json({ message: 'fail, user doesn\'t exist' });
								});
						} else res.json({ message: 'fail' });
					})
					.catch((error) => {
						res.json({ message: error });
					});
			} else res.json({ message: 'fail' });
		});
});

// POST /api/users/generate
router.post('/generate', (req, res) => {
	const user = new User(req.body);
	user.save()
		.then((user) => res.json({ message: 'success', user }))
		.catch((err) => res.json({ message: err, user: null }));
});

module.exports = router;

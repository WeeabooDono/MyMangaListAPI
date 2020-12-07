/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { STATUS, ROLE } = require('../config/globals');

const salt = 10;

const google = new mongoose.Schema({
	googleId: {
		type: Number,
	},
	familyName: {
		type: String,
	},
	givenName: {
		type: String,
	},
	image: {
		type: String,
	},
});

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		min: 3,
		max: 30,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		min: 6,
		max: 1024,
	},
	roles: {
		type: [String],
		required: false,
		default: [ROLE.USER],
	},
	date: {
		type: Date,
		default: Date.now,
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	status: {
		type: String,
		default: STATUS[0],
		enum: STATUS,
	},
	google: {
		type: google,
	},
});

// To signup a user
userSchema.pre('save', function (next) {
	const user = this;

	if (user.isModified('password')) {
		bcrypt.genSalt(salt, (err, salt) => {
			if (err) return next(err);

			bcrypt.hash(user.password, salt, (err, hash) => {
				if (err) return next(err);
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

// To login
userSchema.methods.comparePassword = function (password, cb) {
	bcrypt.compare(password, this.password, (err, isMatch) => {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

module.exports = mongoose.model('User', userSchema);

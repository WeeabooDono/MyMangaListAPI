const mongoose = require('mongoose');

const MangaSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	author: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
	},
});

module.exports = mongoose.model('Manga', MangaSchema);

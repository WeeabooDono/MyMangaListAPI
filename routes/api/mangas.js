const express = require('express');

const router = express.Router();

const Manga = require('../../models/Manga');

// Retrieve all the mangas
router.get('/', async (req, res) => {
	try {
		const mangas = await Manga.find();
		res.json(mangas);
	} catch (error) {
		res.json({
			message: error,
		});
	}
});

// Retrieve a specific manga
router.get('/:id', async (req, res) => {
	try {
		const manga = await Manga.findById(req.params.id);
		res.json(manga);
	} catch (error) {
		res.json({
			message: error,
		});
	}
});

// Delete a specific manga
router.delete('/:id', async (req, res) => {
	try {
		const removedManga = await Manga.deleteOne({ _id: req.params.id });
		res.json(removedManga);
	} catch (error) {
		res.json({
			message: error,
		});
	}
});

// Update a specific manga (patch != put)
router.patch('/:id', async (req, res) => {
	try {
		const updatedManga = await Manga.updateOne(
			{ _id: req.params.id },
			{
				$set: {
					title: req.body.title,
					description: req.body.description,
					author: req.body.author,
				},
			},
		);
		res.json(updatedManga);
	} catch (error) {
		res.json({
			message: error,
		});
	}
});

// Insert a manga
router.post('/', async (req, res) => {
	const manga = new Manga({
		title: req.body.title,
		description: req.body.description,
		author: req.body.author,
	});

	try {
		const saveManga = await manga.save();
		res.json(saveManga);
	} catch (error) {
		res.json({
			message: error,
		});
	}
});

module.exports = router;

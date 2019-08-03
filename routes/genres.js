const express = require("express");
const router = express.Router();
const Joi = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GenreSchema = Schema({
	name: { type: String, required: true }
});

const Genre = mongoose.model("genre", GenreSchema);

router.get("/", async (req, res) => {
	const genres = await Genre.find()
		.sort({ name: 1 })
		.select({ id: 1, name: 1 });
	res.send(genres);
});

router.post("/", async (req, res) => {
	const { error } = validateGenre(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	const genre = new Genre(req.body);

	try {
		const result = await genre.save();
		res.send(result);
	} catch (ex) {
		return res.status(500).send(`Error: ${ex.message}`);
	}
});

router.put("/:id", async (req, res) => {
	try {
		const { error } = validateGenre(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		const genre = await Genre.findById(req.params.id);
		genre.name = req.body.name;
		const result = await Genre.updateOne({ _id: req.params.id }, genre);
		res.send(result);
	} catch (ex) {
		return res
			.status(404)
			.send("Error: The genre with the given ID was not found.");
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const genre = await Genre.findById(req.params.id);
		const result = await Genre.deleteOne({ _id: req.params.id });
		res.send(result);
	} catch (ex) {
		res.status(400).send("The genre with the given ID was not found.");
	}
});

router.get("/:id", async (req, res) => {
	try {
		const result = await Genre.findById(req.params.id);
		res.send(result);
	} catch (ex) {
		res.status(400).send("The genre with the given ID was not found.");
	}
});

function validateGenre(genre) {
	const schema = {
		name: Joi.string()
			.min(3)
			.required()
	};

	return Joi.validate(genre, schema);
}

module.exports = router;

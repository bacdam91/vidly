const express = require("express");
const app = express();
const genres = require("./routes/genres");
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const config = require("config");
const DB_USERNAME = config.get("db.dbUsername");
const DB_PASSWORD = config.get("db.dbPassword");

async function connectToMongo() {
	try {
		const result = await mongoose.connect(
			`mongodb://${DB_USERNAME}:${DB_PASSWORD}@localhost:27017/vidly`,
			{
				useNewUrlParser: true
			}
		);
		console.log(`Connected to port ${result.connections[0].port}`);
	} catch (ex) {
		console.log(`Error: ${ex.message}`);
	}
}

connectToMongo();

app.use(express.json());
app.use("/api/genres", genres);

app.listen(PORT, err => {
	if (err) throw err;
	console.log(`Listening on port ${PORT}...`);
});

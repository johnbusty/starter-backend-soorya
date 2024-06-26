const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("../../models/tourModel");

dotenv.config({ path: "./config.env" });
//error handling

const connectToDatabase = async () => {
	const uri =  process.env.DATABASE;
	try {
		await mongoose.connect(uri, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			autoIndex: false,
		});
		console.log("DB connected successfully!");
	} catch (error) {
		throw error;
	}
};

connectToDatabase();

//to read json file
const tour = JSON.parse(
	fs.readFileSync("./tours-simple.json", "utf-8"),
);

const importTour = async () => {
	try {
		await Tour.create(tour);
		console.log("tour parsed and created in db!");
	} catch (error) {
		console.log(error);
	}
};

const dalitTour = async () => {
	try {
		await Tour.deleteMany(tour);
		console.log("tour deleted!");
		
	} catch (error) {
		console.log(error);
	}
};

if (process.argv[2] === "--import") {
	importTour();
} else if (process.argv[2] === "--delete") {
	dalitTour();
}

console.log(process.argv);


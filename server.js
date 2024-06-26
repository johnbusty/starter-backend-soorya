const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./env" });
const app = require("./app");
//error handling



const connectToDatabase = async () => {
	const uri = process.env.DATABASE;
	try {
		mongoose.connect(uri, {
			autoIndex: false,
		});
		console.log("\x1b[36mDB connected successfully!\x1b[0m");
	} catch (error) {
		throw error;
		process.exit(1)
	}
};

connectToDatabase();

app.listen(8000, () => {
	console.log("Server is running on port 8000");
});

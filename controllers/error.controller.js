
const AppError = require("../utils/AppError");

// dev env errors
const sendDevelopmentErrors =(err, res )=>{
		res.status(err.statusCode).json({
		status: err.status,
		message: err.message || 'Unknown error',
		error: err,
		stack: err.stack
	});
}

// prod env errors
const sendProdErrors = (err, res)=>{
	// this is for the known and trusted errors
	if(isOperational){
		res.status(err.statusCode).json({
		status: err.status,
		message: err.message
		})
		// this is for the unknown errors from app
	}else{
		//* FIRST LOG IT
		console.error('\x1b[41Error:\x1b[0', err)
		
		//* THEN DISPLAY THE ERROR
		res.status(500).json({
		status: 'Error',
		message:'Something went wrong',
	})
	}
}

module.exports = function(err, req, res, next) {
	// console.log("err.stack", err.stack); // shows full stack of errors

	err.status = err.status || "internal server error";
	err.statusCode = err.statusCode || 500;

	if(process.env.NODE_ENV === 'production'){
		sendProdErrors(err, res)
	}else{
		sendDevelopmentErrors(err, res)
	}
}



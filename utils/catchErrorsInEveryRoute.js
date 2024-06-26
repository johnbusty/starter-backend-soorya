
//higher order functions for error handling

const catchErrorsInEveryRoute = (mainFunction)=>{
	//* either this code
	// return async (req,res,next)=>{
	// 	try {
	// 		await mainFunction(req,res,next)
	// 	} catch (error) {
	// 		next(error)
	// 	}
	// }

	//? or this works equally: 
	return (req, res, next)=>{
		mainFunction(req, res, next)
	}

}

module.exports = catchErrorsInEveryRoute
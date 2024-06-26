const Tour = require("../models/tourModel");
const APIfeatures = require("../utils/APIfeatures");
const catchErrorsInEveryRoute = require("../utils/catchErrorsInEveryRoute");
const AppError = require("../utils/AppError");


//middleware aliasing logic
const top5cheap = async (req, res, next) => {
	req.query.sort = "-ratingsAverage,price";
	req.query.limit = "5";
	req.query.fields = "name,price,ratingsAverage,summary,difficulty";
	next();
};


//route handlers start

const getAllTour = catchErrorsInEveryRoute(async (req, res, next) => {

		const APIfeats = new APIfeatures(Tour, req.query)
			.filter()
			.sort()
			.fields()
			.paginate();
		// console.log("APIfeats: ", APIfeats);

		const tour = await APIfeats.query;
		// console.log("final tour: ", tour);

		return res.status(200).json({
			results: tour.length,
			status: "success",
			page_number: parseInt(req.query.page, 10),
			data: {
				tour,
			},
		});

});
const getSpecificTour = catchErrorsInEveryRoute(async (req, res,next) => {
		const tourID = await Tour.findById(req.params.id);

		if(!tourID){
			return next(new AppError('Tour ID {VALUE} is not available!', 404))
		}
		const tourName = tourID

		res.status(200).json({
			status: "success",
			data:{
				tourName
			}
		});
	
});

const createNewTour = catchErrorsInEveryRoute (async (req, res,next) => {

		const newTour = await Tour.create(req.body);
		console.log(newTour);
		res.status(201).json({
			status: "success",
			data: {
				tour: newTour,
			},
		});
	
});

const updateNewTour =catchErrorsInEveryRoute( async (req, res,next) => {
		const options = {
			new: true,
			runValidators: true,
		};

		const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, options);
		if(!tour){
			return next(new AppError('Tour ID {VALUE} is not available!', 404))
			// console.log(new AppError('Tour ID {VALUE} is not available!', 404))
		}


		res.status(200).json({
			status: "success",
			data: {
				tour,
			},
		});
	});

const deleteTour = catchErrorsInEveryRoute( async (req, res,next) => {
	const tour = await Tour.findByIdAndDelete(req.params.id);
	console.log(`${req.params.id} tour is deleted!`);


	if(!tour){
		return next(new AppError('Tour ID {VALUE} is not available!', 404))
		}
	res.status(204).json({
		status: "success",
		data: null,
		msg: `deleted ${req.body}`,
	});
});

// aggregation pipelines start from here
const getTourStats = catchErrorsInEveryRoute (async (req, res,next) => {

		const stats = await Tour.aggregate([
			{
				$match: { ratingsAverage: { $gte: 4.5 } },
			},
			{
				$group: {
					_id: { $toUpper: "$difficulty" },
					numberOfTours: { $sum: 1 },
					numberOfRatings: { $sum: "$ratingsCount" },
					maximumPrice: { $max: "$price" },
					minimumPrice: { $min: "$price" },
					averagePrice: { $avg: "$price" },
					avgRating: { $avg: "$ratingsAverage" },
				},
			},
			{
				$sort: { averagePrice: 1 },
			},
			// {
			// 	$match: { _id: { $ne: "EASY" } },
			// },
		]);
		// console.log(stats);

		return res.status(200).json({
			results: stats.length,
			status: "success",
			data: {
				stats,
			},
		})})




		const getMonthlyPlan = catchErrorsInEveryRoute(async (req, res,next) => {
	const year = parseInt(req.params.year, 10);
	console.log(`Year: ${year}`);

	const plan = await Tour.aggregate([
		{
			$unwind: "$startDates",
		},
		{
			$match: {
				startDates: {
					$lte: new Date(`${year}-12-31`),
					$gte: new Date(`${year}-01-01`),
				},
			},
		},
		{
			$group: {
				_id: { $month: "$startDates" },
				numberOfTourInCertainMonth: { $sum: 1 },
				toursAccordingToMonth: { $push: "$name" },
			},
		},
		// {
		// 	$addFields: {
		// 		nameOfThatMonth: {
		// 			$dateToString: {
		// 				date: "$startDates",
		// 				format: "%b",
		// 			},
		// 		},
		// 	},
		// },
		{
			$sort: {
				numberOfTourInCertainMonth: 1,
			},
		},
		{
			$project: { _id: 0 },
		},
		{
			$limit: 5,
		},
	]);

	console.log("Aggregated Plan: ", plan);

	return res.status(200).json({
		results: plan.length,
		plan,
		status: "success",
	});
});


module.exports = {
	top5cheap,
	getAllTour,
	getSpecificTour,
	createNewTour,
	updateNewTour,
	deleteTour,
	getTourStats,
	getMonthlyPlan,
	
};

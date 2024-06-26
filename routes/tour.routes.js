const express = require("express");

//route handlers
const {
	top5cheap,
	getAllTour,
	getSpecificTour,
	createNewTour,
	updateNewTour,
	deleteTour,
	getTourStats,
	getMonthlyPlan,
	errorTestFunc
} = require("../controllers/tour.controller");

const router = express.Router();


router.use((req, res, next)=>{

	console.log('req.baseUrl',req.baseUrl )
	next()
})


router.route("/tour-stats").get(getTourStats) //aggregation pipeline
router.route("/get-monthly/:year").get(getMonthlyPlan); //aggregation pipeline
router.route("/cheapest-top-5").get(top5cheap, getAllTour); //making a middleware aliasing with new route


router
    .route("/")
    .get(getAllTour)
    .post(createNewTour)



router
	.route("/:id")
	.get(getSpecificTour)
	.patch(updateNewTour)
	.delete(deleteTour)

module.exports = router;


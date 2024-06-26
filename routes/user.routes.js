const express = require("express");
const {
  getAllusers,
  getUser,
  createNewUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

const router = express.Router();
router.route("/").get(getAllusers).post(createNewUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);


module.exports = router;

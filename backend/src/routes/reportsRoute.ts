const express = require("express");
const { CreateReport} = require("../controllers/ReportController");
const router = express.Router();

//Create new
router.post("/", CreateReport);


module.exports = router;
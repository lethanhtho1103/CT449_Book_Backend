const express = require("express");
const router = express.Router();
const customerController = require("../app/controller/CustomerController");

router.get("/", customerController.listUser);
router.get("/admin", customerController.listStaff);
// router.get("/dashboard", customerController.dashBoard);

module.exports = router;

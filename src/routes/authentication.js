const express = require("express");
const router = express.Router();
const authenticationController = require("../app/controller/AuthenticationController");

router.post("/register", authenticationController.createUser);
router.post("/register/staff", authenticationController.createStaff);
// router.post("/login", authenticationController.login);
// router.post("/loginStaff", authenticationController.loginStaff);
// router.get("/logout", authenticationController.logout);
// router.get("/info/admin/:id", authenticationController.inforStaff);
// router.put("/edit/admin/:id", authenticationController.editProfileStaff);
// router.get("/info/:id", authenticationController.inforUser);
// router.put("/edit/:id", authenticationController.editProfile);

module.exports = router;

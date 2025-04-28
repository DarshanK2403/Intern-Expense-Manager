const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", UserController.Signup);

router.post("/signin", UserController.Login);

router.get("/userdata", authMiddleware, UserController.Userdata)

router.post("/forget-password", UserController.ForgetPassword);

router.put("/update-password",authMiddleware, UserController.UpdatePassword);

router.put("/update-profile",authMiddleware, UserController.UpdateProfile);

router.put("/change-password",authMiddleware, UserController.ChangePassword);

router.put("/change-profile-picture", authMiddleware, UserController.ChangeProfilePicture);


module.exports = router;

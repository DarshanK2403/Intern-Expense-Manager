const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", UserController.Signup);

router.post("/signin", UserController.Login);

router.get("/userdata", authMiddleware, UserController.Userdata)

router.post("/forget-password", UserController.ForgetPassword);

router.put("/update-password/:userId", UserController.UpdatePassword);

router.put("/update-profile/:userId", UserController.UpdateProfile);

router.put("/change-password/:userId", UserController.ChangePassword);

router.put("/change-profile-picture/:id", UserController.ChangeProfilePicture);


module.exports = router;

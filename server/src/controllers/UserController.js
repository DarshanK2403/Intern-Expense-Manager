const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");
const mailUtil = require("../utils/MailUtil.js");
const CategoryUtil = require("../utils/CategoryUtil.js");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { resolve } = require("path");
const { rejects } = require("assert");

// Configure multer to store the file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("profileImg"); // Match field name!

const CloudinaryUtil = require("../utils/CloudinaryUtil");

const Signup = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, phone } =
    req.body;
  let errors = [];

  // Check for empty fields
  if (!firstName)
    errors.push({ param: "firstName", message: "First name is required" });
  if (!lastName)
    errors.push({ param: "lastName", message: "Last name is required" });
  if (!email) errors.push({ param: "email", message: "Email is required" });
  if (!password)
    errors.push({ param: "password", message: "Password is required" });
  if (!confirmPassword)
    errors.push({
      param: "confirmPassword",
      message: "Confirm password is required",
    });

  if (errors.length > 0) return res.status(400).json({ errors });

  // Validate password length
  if (password.length < 8) {
    return res.status(400).json({
      errors: [
        {
          param: "password",
          message: "Password must be at least 8 characters",
        },
      ],
    });
  }

  // Validate password match
  if (password !== confirmPassword) {
    return res.status(400).json({
      errors: [{ param: "confirmPassword", message: "Passwords do not match" }],
    });
  }

  // Check if email already exists
  const checkEmail = await UserModel.findOne({ email });
  if (checkEmail) {
    return res.status(400).json({
      errors: [{ param: "email", message: "Email already exists" }],
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const newUser = await UserModel.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: "67c1d766244df2991d6959b0",
    });

    await CategoryUtil.createDefaultCategoriesForUser(newUser._id);

    const htmlContent = `
    <div style="text-align: center; font-family: Arial, sans-serif;">
    <h2 style="color: #007bff;">Welcome to Expense Tracker!</h2>
    <p>We are excited to have you on board, <b>${newUser.email}</b>.</p>
    <p>Start managing your expenses efficiently today.</p>
    <a href="https://yourwebsite.com/login" 
    style="display: inline-block; background: #007bff; color: white; padding: 10px 20px; 
    text-decoration: none; font-size: 16px; border-radius: 5px;">
    Get Started
    </a>
    </div>`;

    const mail = await mailUtil
      .sendingMail(newUser.email, "Welcome to Expense Tracker", htmlContent)
      .then(() => console.log(`📩 Email sent successfully to ${newUser.email}`))
      .catch((error) => console.error("❌ Error sending email:", error));
    return res
      .status(201)
      .json({ message: "Signup successful", user: newUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await UserModel.findOne({ email }).populate("role");
  if (!user) {
    return res.status(400).json({ message: "Invalid Email" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid Password" });
  }

  const Token = await jwt.sign({id: user._id.toString()}, process.env.JWt_SECRET);
  // console.log(Token);

  res.status(200).json({ message: "Login Success", Token });
};

const Userdata = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ From decoded token

    const user = await UserModel.findById(userId).populate("role");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      img: user.profileImg,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const ForgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(200).json({ message: "User Not Found" });
    const Token = jwt.sign(user.email, process.env.JWt_SECRET);
    const htmlContent = `<div style={{ fontFamily: "Arial, sans-serif", maxWidth: 600, margin: "0 auto", padding: 20, backgroundColor: "#f4f4f4" }}>
    <div style={{ backgroundColor: "white", borderRadius: 8, padding: 30, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
            <h1 style={{ color: "#333", fontSize: 24, marginBottom: 10 }}>Reset Your Password</h1>
            <p style={{ color: "#666", lineHeight: "1.6" }}>We received a request to reset your password for FinanceTrack.</p>
        </div>
        
        <div style={{ backgroundColor: "#f9f9f9", border: "1px solid #e0e0e0", borderRadius: 6, padding: 20, marginBottom: 20 }}>
            <p style={{ color: "#333", marginBottom: 15 }}>
                Hello King Kong,
            </p>
            <p style={{ color: "#666", lineHeight: "1.6", marginBottom: 15 }}>
                You have requested to reset your password for your FinanceTrack account. 
                Click the button below to reset your password. This link will expire in 15 minutes.
            </p>
            
            <div style={{ textAlign: "center", margin: "25px 0" }}>
                <a href="http://localhost:5173/forget-password/${Token}" style={{ display: "inline-block", backgroundColor: "#4285f4", color: "white", padding: "12px 24px", textDecoration: "none", borderRadius: 6, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1 }}>
                    Reset Password
                </a>
            </div>
            
            <p style={{ color: "#666", fontSize: 12, textAlign: "center", marginTop: 15 }}>
                If you did not request a password reset, please ignore this email or contact support if you have concerns.
            </p>
        </div>
        
        <div style={{ textAlign: "center", color: "#888", fontSize: 12, paddingTop: 20, borderTop: "1px solid #e0e0e0" }}>
            <p style={{ marginBottom: 10 }}>© 2025 FinanceTrack. All rights reserved.</p>
            <p style={{ color: "#666" }}>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</div>`;
    const mailResponse = mailUtil
      .sendingMail(user.email, "Forget Password", htmlContent)
      .then(() => console.log(`📩 Email sent successfully to ${user.email}`))
      .catch((error) => console.log("❌ Error sending email:", error));
    res.status(200).json(mailResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UpdatePassword = async (req, res) => {
  const { userId } = req.params;

  try {
    const { password } = req.body;

    // Validate password
    if (!password || typeof password !== "string") {
      return res
        .status(400)
        .json({ message: "Password must be a valid string" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user password
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { password: hashedPassword } },
      { new: true }
    );

    // Check if user exists
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const UpdateProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const { firstName, lastName, phone } = req.body;

    const updateData = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { firstName: firstName, lastName: lastName, phone: phone } },
      { new: true }
    );

    if (!updateData) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Profile Updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ChangePassword = async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    // Validate password length
    if (newPassword.length < 8) {
      return res.status(400).json({
        errors: [
          {
            param: "newPassword",
            message: "New password must be at least 8 characters",
          },
        ],
      });
    }

    // Find user by ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid old password" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ChangeProfilePicture = async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from URL params

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // ✅ Ensure Multer processes the file
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) {
          console.error("Multer Error:", err);
          return reject(err);
        }
        resolve();
      });
    });

    // console.log("File Received:", req.file);
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // ✅ Upload image to Cloudinary
    const cloudinaryResponse = await CloudinaryUtil.uploadFileToCloudinary(
      req.file.buffer,
      req.file.originalname
    );

    if (!cloudinaryResponse?.cloudinaryUrl) {
      return res.status(500).json({ message: "Image upload failed" });
    }

    // ✅ Update user's profileImg field in the database
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { profileImg: cloudinaryResponse.cloudinaryUrl }, // Updating profile image
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile image updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  Signup,
  Login,
  Userdata,
  ForgetPassword,
  UpdatePassword,
  UpdateProfile,
  ChangePassword,
  ChangeProfilePicture,
};

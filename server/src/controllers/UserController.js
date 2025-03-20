const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");
const mailUtil = require("../utils/MailUtil.js");
const CategoryUtil = require("../utils/CategoryUtil.js");

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

    const categoryResponse = await CategoryUtil.createDefaultCategoriesForUser(
      newUser._id
    );
    return res
    .status(201)
    .json({ message: "Signup successful", user: newUser, categoryResponse, });

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

    const mail =  await mailUtil.sendingMail(newUser.email, "Welcome to Expense Tracker", htmlContent).then(() => console.log(`📩 Email sent successfully to ${newUser.email}`)).catch((error) => console.error("❌ Error sending email:", error));

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

  res.status(200).json({ message: "Login Success", user: user });
};

const Userdata = async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log("Requested User ID:", userId);

    // Find user by ID
    const user = await UserModel.findOne({ _id: userId }).populate("role");

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
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  Signup,
  Login,
  Userdata,
};

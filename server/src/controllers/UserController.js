const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");
const mailUtil = require("../utils/MailUtil.js");
const CategoryUtil = require("../utils/CategoryUtil.js");
const jwt = require("jsonwebtoken");

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

const ForgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(200).json({ message: "User Not Found" });
    const Token = jwt.sign(user.email, process.env.JWt_SECRET);
    const htmlContent = `
    <div style={{}} maxwidth:="" 600,="" margin:="" "20px="" auto",="" backgroundcolor:="" "white",="" borderradius:="" 12,="" boxshadow:="" "0="" 4px="" 15px="" rgba(0,="" 0,="" 0.1)",="" overflow:="" "hidden"="" }}="">   
        <div style={{}} background:="" "linear-gradient(to="" right,="" #2c5282,="" #3b82f6)",="" color:="" "white",="" padding:="" 30,="" textalign:="" "center"="" }}="">
            <div style={{}} width:="" 80,="" height:="" backgroundcolor:="" "rgba(255,255,255,0.2)",="" borderradius:="" "50%",="" display:="" "flex",="" alignitems:="" "center",="" justifycontent:="" margin:="" "0="" auto="" 20px"="" }}="">
                <svg xmlns="http://www.w3.org/2000/svg" style={{}} width:="" 48,="" height:="" color:="" "white"="" }}="" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokelinecap="round" strokelinejoin="round" strokewidth="{2}" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </div>
            <h1 style={{}} fontsize:="" 24,="" fontweight:="" "700",="" margin:="" "0"="" }}="">Password Reset</h1>
        </div>

        <div style={{}} padding:="" 30,="" color:="" "#333"="" }}="">
            <p style={{}} marginbottom:="" 15,="" fontsize:="" 16="" }}="">Hello [User Name],</p>

            <p style={{}} marginbottom:="" 15,="" color:="" "#555",="" lineheight:="" "1.5"="" }}="">
                We received a request to reset the password for your Expense Manager account. 
                If you did not make this request, please ignore this email or contact our support team.
            </p>

            <p style={{}} marginbottom:="" 20,="" color:="" "#555",="" lineheight:="" "1.5"="" }}="">
                To reset your password, click the button below. This link will be valid for 60 minutes:
            </p>

            <div style={{}} textalign:="" "center",="" marginbottom:="" 20="" }}="">
                <a href='http://localhost:5173/forget-password/${Token}' style={{}} display:="" "inline-block",="" backgroundcolor:="" "#2c5282",="" color:="" "white",="" padding:="" "12px="" 24px",="" borderradius:="" 6,="" textdecoration:="" "none",="" fontweight:="" "600",="" fontsize:="" 16="" }}="">
                    Reset Password
                </a>
            </div>

            <p style={{}} marginbottom:="" 10,="" color:="" "#555",="" fontsize:="" 14="" }}="">
                If the button does not work, copy this link:
            </p>

            <p style={{}} backgroundcolor:="" "#f4f4f4",="" padding:="" 10,="" borderradius:="" 4,="" wordbreak:="" "break-all",="" fontsize:="" 14,="" color:="" "#2c5282",="" marginbottom:="" 20="" }}="">
                [FULL_PASSWORD_RESET_LINK]
            </p>

            <div style={{}} bordertop:="" "1px="" solid="" #e0e0e0",="" paddingtop:="" 15,="" margintop:="" 20,="" fontsize:="" 14,="" color:="" "#666"="" }}="">
                <p>This link expires in 60 minutes. For security, request a new link if needed.</p>
            </div>
        </div>

        <div style={{}} backgroundcolor:="" "#f4f4f4",="" padding:="" 20,="" textalign:="" "center",="" fontsize:="" 12,="" color:="" "#666"="" }}="">
            <p style={{}} margin:="" "0="" 0="" 10px="" 0"="" }}="">© 2024 Expense Manager. All rights reserved.</p>
            <p style={{}} margin:="" "0"="" }}="">
                Support: 
                <a href="mailto:support@expensemanager.com" style={{}} color:="" "#2c5282",="" textdecoration:="" "none"="" }}="">
                    support@expensemanager.com
                </a>
            </p>
        </div>
    </div>
`;
    const mailResponse = mailUtil
      .sendingMail(user.email, "Forget Password", htmlContent)
      .then(() =>
        res.status(200).json(`📩 Email sent successfully to ${user.email}`)
      )
      .catch((error) => res.status(400).json("❌ Error sending email:", error));
    res.status(200).json(mailResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  Signup,
  Login,
  Userdata,
  ForgetPassword,
};

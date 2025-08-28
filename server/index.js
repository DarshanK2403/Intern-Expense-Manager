require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const cors = require("cors");

const allowedOrigins = [
  "https://intern-expense-manager.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));

mongoose.connect(process.env.MONGO_URI, {});

const db = mongoose.connection;
db.on("error", (err) => {
  console.log(err);
});
db.once("open", () => {
  console.log("Database connection established");
});

const UserRoute = require("./src/routes/UserRoute");
app.use("/", UserRoute);

const RoleRoute = require("./src/routes/RoleRoute");
app.use("/", RoleRoute);

const ExpenseRoute = require("./src/routes/ExpenseRoute");
app.use("/", ExpenseRoute);

const IncomeRouter = require("./src/routes/IncomeRoute");
app.use("/", IncomeRouter);

const SettingsRouter = require("./src/routes/SettingsRoute");
app.use("/", SettingsRouter);

const AdminRouter = require("./src/routes/AdminRoute");
app.use("/admin", AdminRouter);

const DashboardRoute = require("./src/routes/DashboardRoute");
app.use("/", DashboardRoute);

const VendorRoute = require("./src/routes/VendorRoute");
app.use("/", VendorRoute);

const ReportRoute = require("./src/routes/ReportRoute");
app.use("/", ReportRoute);

const PaymentRoute = require("./src/routes/PaymentRoute");
app.use("/", PaymentRoute);

const FakeRoute = require("./src/routes/FakeRoute");
app.use("/", FakeRoute);

const exportRoutes = require("./src/routes/ExportRoutes");
app.use("/", exportRoutes);

const AcitivityRoute = require("./src/routes/AcitivityRoute");
app.use("/", AcitivityRoute);

const BudgetRoute = require("./src/routes/BudgetRoutes");
app.use("/", BudgetRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

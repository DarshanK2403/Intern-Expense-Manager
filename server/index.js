require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require("morgan");

app.use(cors({
  origin: "https://financetrack-autdtpnrs-darshank2403s-projects.vercel.app/", // Allow requests from any origin (you can restrict it later)
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(morgan("dev")); // Log requests

mongoose.connect(process.env.MONGO_URI, {
});

const db = mongoose.connection;
db.on('error', (err) => {
    console.log(err);
});
db.once('open', () => {
    console.log('Database connection established');
});

const UserRoute = require('./src/routes/UserRoute');
app.use(UserRoute);

const RoleRoute = require('./src/routes/RoleRoute');
app.use(RoleRoute);

const ExpenseRoute = require('./src/routes/ExpenseRoute');
app.use('/',ExpenseRoute);

const SettingsRouter = require('./src/routes/SettingsRoute');
app.use('/', SettingsRouter)

const AdminRouter = require('./src/routes/AdminRoute')
app.use('/admin', AdminRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
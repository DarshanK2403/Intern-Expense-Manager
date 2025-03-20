const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Income = new Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  incomeDate: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    enum: ["Salary", "Business", "Freelance", "Investment", "Other"],
    required: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  receipt: {
    type: String,
  },

},
{
    timestamps: {
        required: true,
    }
});


module.exports  = Income = mongoose.model("Income", Income);
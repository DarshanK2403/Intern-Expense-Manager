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
  attachment: {
    type: String, // If you allow users to upload receipts (store as Base64 or file path)
  },

},
{
    timestamps: {
        required: true,
    }
});


module.exports  = Income = mongoose.model("Income", Income);
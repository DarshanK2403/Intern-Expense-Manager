const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IncomeSchema = new Schema({
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
  },
  category: {
    type: String,
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


const Income = mongoose.model("Income", IncomeSchema);

module.exports = Income
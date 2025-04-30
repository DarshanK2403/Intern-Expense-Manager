// models/Budget.js
const mongoose = require('mongoose');

// Define the schema for budget entries
const BudgetEntrySchema = new mongoose.Schema({
  month: {
    type: Number,
    required: true,
    min: 0,
    max: 11, // 0-11 represents Jan-Dec
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value for month'
    }
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
});

// Define the schema for budget categories
const BudgetCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    required: true,
    default: 'bg-blue-500'
  },
  entries: [BudgetEntrySchema]
});

// Define the main Budget schema
const BudgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  year: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value for year'
    }
  },
  categories: [BudgetCategorySchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add unique compound index to prevent duplicate budgets for the same user and year
BudgetSchema.index({ userId: 1, year: 1 }, { unique: true });

// Virtual property to get total budget amount across all categories and months
BudgetSchema.virtual('totalAmount').get(function() {
  return this.categories.reduce((totalAmount, category) => {
    return totalAmount + category.entries.reduce((sum, entry) => sum + entry.amount, 0);
  }, 0);
});

// Method to get the monthly total for a specific month
BudgetSchema.methods.getMonthlyTotal = function(month) {
  if (month < 0 || month > 11) {
    throw new Error('Month must be between 0 and 11');
  }
  
  return this.categories.reduce((total, category) => {
    const monthEntry = category.entries.find(entry => entry.month === month);
    return total + (monthEntry ? monthEntry.amount : 0);
  }, 0);
};

// Method to get yearly total for a specific category
BudgetSchema.methods.getCategoryTotal = function(categoryId) {
  const category = this.categories.id(categoryId);
  if (!category) {
    return 0;
  }
  
  return category.entries.reduce((total, entry) => total + entry.amount, 0);
};

// Pre-save middleware to update the updatedAt timestamp
BudgetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create and export the Budget model
const Budget = mongoose.model('Budget', BudgetSchema);

module.exports = Budget;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      Unique: true,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      Unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
      default: "67c1d766244df2991d6959b0",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      required: true,
    },
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;

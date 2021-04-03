const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    method: {
      type: {
        local: {
          confirmed: { type: Boolean, default: false },
          password: { type: String },
        },
        google: { type: String },
        facebook: { type: String },
      },
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email Id already registered"],
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);
module.exports = User;

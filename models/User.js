const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    default: "",
  },
  district: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["admin", "client"],
    default: "client",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});
userSchema.set("toObject", {
  virtuals: true,
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;

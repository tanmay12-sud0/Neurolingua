var mongoose = require("mongoose");
const { Schema } = mongoose;
const { isEmail } = require("validator");
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter an email"],
      // unique: true,
      lowercase: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    password: String,
    role: String,
    fullName: String,
    googleId: String,
    facebookId: String,
    linkedinId: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    isOnBoarding: {
      type: Boolean,
      default: false,
    },
    onType: {
      type: Schema.Types.ObjectId,
      refPath: "roleModel",
    },
    roleModel: {
      type: String,
      enum: ["Teacher", "Student"],
    },
    isOnBoarding: {
      type: Boolean,
      default: false,
    },
    token: String,
  },
  { versionKey: false, timestamps: true }
);
module.exports = mongoose.model("User", UserSchema, "User");

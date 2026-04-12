import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";


const users = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 5,
    
  },

  role: {
    type: String,
    enum: ["superAdmin", "admin", "user", "teacher", "student"],
    default: "student",
  },

  school: {
    type: String,
  required: true,
  },

  class: {
    type: String,
    default: null,
  },
  refreshToken: {
    type: String,
    select: false,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  lastLogin: {
    type: Date,
    default: null,
  },

  passwordChangedAt: {
    type: Date,
    default: null,
  },

  passwordResetToken: {
    type: String,
    select: false,
  },

},
  {
    timestamps: true,
  }
);

// password hashing
users.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

users.pre("save", async function () {
  if (!this.isModified("password") || this.isNew) return;
  this.passwordChangedAt = Date.now() - 1000;
});

users.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

users.methods.passwordChangedAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedAt = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return jwtTimestamp < changedAt;
  }
  return false;
};

users.index({ school: 1, role: 1 });

const User = mongoose.model("User", users);

export default User;
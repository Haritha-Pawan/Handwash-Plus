import mongoose, { Schema } from "mongoose";
import bycrypt from "bcryptjs";


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
    select: false,
  },

  role: { 
    type: String, 
    enum: ["superAdmin", "admin", "user"], 
    default: "user" 
  },

  school:{
    type:Schema.Types.ObjectId,
    ref:"School",
    default:null,
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

//password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bycrypt.hash(this.password, 12);
  next();
});

Userschema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bycrypt.compare(enteredPassword, this.password);
};

userSchema.methods.passwordChangedAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedAt = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return jwtTimestamp < changedAt;
  }
  return false;
};

userSchema.index({ school: 1, role: 1 });

const User = mongoose.model("User", users);

export default User;
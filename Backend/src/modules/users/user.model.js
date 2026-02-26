import mongoose from "mongoose";

const users = new mongoose.Schema({
  schoolRegNo: { 
    type: String, 
    required: true, 
    trim: true 
  },

  schoolName: { 
    type: String, 
    required: true, 
    trim: true 
  },

  name: { 
    type: String, 
    required: true, 
    trim: true 
  },

  class: { 
    type: String, 
    required: true 
  },

  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },

  password: { 
    type: String, 
    required: true 
  },

  role: { 
    type: String, 
    enum: ["superAdmin", "admin", "user","teacher","student"], 
    default: "user" 
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

const User = mongoose.model("User", users);

export default User;
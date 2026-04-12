import mongoose from "mongoose";
import User from "./user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


/**
 * @desc    Register new user
 * @route   POST /api/users/register
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, school, class: studentClass } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      school,
      class: studentClass,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/users/login
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password").populate("school class");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role, 
        ...(user.role !== 'superAdmin' && user.school && { 
          school: user.school._id || user.school,
          schoolName: user.school.name,
          ...(user.class && {
            class: user.class._id || user.class,
            className: user.class.name
          })
        })
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...(user.role !== 'superAdmin' && user.school && {
          school: {
            id: user.school._id,
            name: user.school.name
          },
          ...(user.class && {
            class: {
              id: user.class._id,
              name: user.class.name
            }
          })
        })
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all users
 * @route   GET /api/users
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").populate("school class");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get single user by ID
 * @route   GET /api/users/:id
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Prevent invalid ObjectId crash
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id).select("-password"); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);

  } catch (error) {
    console.error("GET USER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const { name, email, school, class: className } = req.body;
    if (!school || school.trim() === "") {
  return res.status(400).json({ message: "School is required" });
}

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        school,          
        class: className 
      },
      {
        new: true,      
        runValidators: true
      }
    ).select("-password"); // ❌ removed populate

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
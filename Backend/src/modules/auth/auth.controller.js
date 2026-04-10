import User from "../users/user.model.js";
import { hashPassword } from "../../@core/utils/jwt.utils.js";
import { AuthService } from "./auth.service.js";
import ResponseUtil from "../../@core/utils/response.util.js";

const authService = new AuthService();

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ResponseUtil.badRequest(res, "User already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return ResponseUtil.created(res, "User registered successfully", {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    return ResponseUtil.serverError(res, "Server error", error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return ResponseUtil.badRequest(res, "Email and password are required");
    }

    const { user, tokens } = await authService.login(email, password);

    return ResponseUtil.success(res, 200, "Login successful", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tokens
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return ResponseUtil.unauthorized(res, error.message);
  }
};
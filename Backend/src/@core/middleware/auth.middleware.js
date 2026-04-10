import jwt from "jsonwebtoken";
import { config } from "../../config/environment.config.js";
import User from "../../modules/users/user.model.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req?.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.jwt.secret);

    req.user = decoded; // { userId, email, role }

    if (decoded.role !== "superAdmin") {
      const user = await User.findById(decoded.userId).select("school");
      if (user && user.school) {
        req.user.school = user.school;
      }
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


export default authMiddleware;


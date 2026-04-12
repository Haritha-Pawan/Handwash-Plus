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

    req.user = decoded; 
    
    // Normalize user ID (Backward compatibility for modules using 'userId' vs 'id')
    const userId = decoded.id || decoded.userId;
    if (userId) {
        req.user.userId = userId.toString();
        req.user.id = userId.toString();
    }
    
    // Fallback/Validation: Ensure req.user.school is a clean hex string if not superAdmin
    if (decoded.role !== "superAdmin" && !req.user.school) {
      const user = await User.findById(decoded.id).select("school");
      if (user && user.school) {
        req.user.school = typeof user.school === 'object' ? user.school.toString() : user.school;
      }
    }     
    // Final safety: if school is still an object (e.g. from older tokens), stringify it
    if (req.user.school && typeof req.user.school === 'object') {
       req.user.school = req.user.school.toString();
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


export default authMiddleware;


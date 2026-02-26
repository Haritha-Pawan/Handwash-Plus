import jwt from "jsonwebtoken";
import { config } from "../../config/environment.config.js";

export const protect = (req, res, next) => {
  try {
    const authHeader = req?.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, config.jwt.secret);

    req.user = decoded; 

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden - required role: ${roles.join(" or ")}` 
      });
    }
    next();
  };
};

export default protect;
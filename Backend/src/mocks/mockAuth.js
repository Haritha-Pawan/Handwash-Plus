export const mockAuth = (req, res, next) => {
  req.user = {
    id: "699fe963fac309cee0d145a8",
    role: "teacher",
  };
  next();
};
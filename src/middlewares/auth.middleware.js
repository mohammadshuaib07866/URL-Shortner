import jwt from "jsonwebtoken";

export function authenticationMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res
      .status(400)
      .json({ error: "Authorization header must start with Bearer" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function ensureAuthenticated(req, res, next) {
  if (!req.user || !req.user?.id) {
    return res
      .status(401)
      .json({ error: "You must be logged in to access this resource" });
  }
  next();
}

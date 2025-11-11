import jwt from "jsonwebtoken";

export function authenticationMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  // 🔹 If there’s no token, deny access
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  // 🔹 Token must start with "Bearer"
  if (!authHeader.startsWith("Bearer ")) {
    return res
      .status(400)
      .json({ error: "Authorization header must start with Bearer" });
  }

  // 🔹 Extract token
  const token = authHeader.split(" ")[1];

  try {
    // 🔹 Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 🔹 Attach user info to request for next routes
    req.user = payload;
    next(); // continue to the next middleware or route
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

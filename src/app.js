import express from "express";
import userRoute from "../src/routes/user.routes.js";
import urlRoute from "../src/routes/url.routes.js";
import { authenticationMiddleware } from "./middlewares/auth.middleware.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(authenticationMiddleware)

// Public route
app.get("/", (req, res) => {
  return res.send("Hello, Welcome to the URL Shortener Website");
});

// Public: user login/signup routes
app.use("/user", userRoute);

// Protected: URL shortening routes
app.use("/shorten", urlRoute);

export { app };

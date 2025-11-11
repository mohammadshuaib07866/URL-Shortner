import express from "express";
import userRoute from "../src/routes/user.routes.js";
import { authenticationMiddleware } from "../src/middlewares/auth.middleware.js";

// Initalize the express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authenticationMiddleware);

app.get("/", (req, res) => {
  return res.send("Hello Welcome to URL Shortne Website");
});

app.use("/user", userRoute);
export { app };

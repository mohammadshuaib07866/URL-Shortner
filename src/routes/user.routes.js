import express from "express";
import { db } from "../db/index.js";
import { userTable } from "../models/index.js";
import jwt from "jsonwebtoken";
import {
  signupPostRequestBodySchema,
  loginPostRequestBodySchema,
} from "../validation/request.validation.js";
import { hashedPasswordWithSalt } from "../utils/hash.js";
import { getUserByEmail } from "../services/user.service.js";

const router = express.Router();

// ------------------ SIGNUP ------------------
router.post("/signup", async (req, res) => {
  try {
    // 1️⃣ Validate input
    const validationResult = await signupPostRequestBodySchema.safeParseAsync(
      req.body
    );
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors });
    }

    const { firstName, lastName, email, password } = validationResult.data;

    // 2️⃣ Check if user exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ error: `User with email ${email} already exists` });
    }

    // 3️⃣ Hash password
    const { salt, hashedPassword } = hashedPasswordWithSalt(password);

    // 4️⃣ Insert user into DB
    const [user] = await db
      .insert(userTable)
      .values({
        email,
        firstName,
        lastName,
        password: hashedPassword,
        salt,
      })
      .returning({ id: userTable.id });

    // 5️⃣ Success response
    return res.status(201).json({
      data: { userId: user.id },
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ------------------ LOGIN ------------------
router.post("/login", async (req, res) => {
  try {
    // 1️⃣ Validate input
    const validationResult = await loginPostRequestBodySchema.safeParseAsync(
      req.body
    );
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors });
    }

    const { email, password } = validationResult.data;

    // 2️⃣ Find user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ error: `User with email ${email} does not exist` });
    }

    // 3️⃣ Recreate hash and compare
    const { hashedPassword } = hashedPasswordWithSalt(password, user.salt);
    if (user.password !== hashedPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // 4️⃣ Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 5️⃣ Return token
    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

import express from "express";
import { shortenPostValidateBodySchema } from "../validation/request.validation.js";
import { db } from "../db/index.js";
import { urlsTable } from "../models/index.js";
import { nanoid } from "nanoid";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";
import { eq } from "drizzle-orm";

const router = express.Router();

// 🔒 Protected: Create short URL
router.post("/", ensureAuthenticated, async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res
      .status(401)
      .json({ error: "You must be logged in to access this resource" });
  }

  const validationResult = await shortenPostValidateBodySchema.safeParseAsync(
    req.body
  );
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  }

  const { url, code } = validationResult.data;
  const shortCode = code ?? nanoid(6);

  const [result] = await db
    .insert(urlsTable)
    .values({
      shortCode,
      targetUrl: url,
      userId,
    })
    .returning({
      id: urlsTable.id,
      shortCode: urlsTable.shortCode,
      targetUrl: urlsTable.targetUrl,
    });

  return res.status(201).json({
    id: result.id,
    shortCode: result.shortCode,
    targetUrl: result.targetUrl,
  });
});

// 🌐 Public: Redirect to the original URL
router.get("/:shortCode", async function (req, res) {
  const code = req.params.shortCode;

  const [result] = await db
    .select({ targetUrl: urlsTable.targetUrl })
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, code));

  if (!result) {
    return res.status(404).json({ error: "Invalid or expired short URL" });
  }

  return res.redirect(result.targetUrl);
});

router.delete("/:id", ensureAuthenticated, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Delete only if the URL belongs to the logged-in user
    const [result] = await db
      .delete(urlsTable)
      .where(and(eq(urlsTable.id, id), eq(urlsTable.userId, userId)));

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "URL not found or unauthorized" });
    }

    return res.status(200).json({ message: "URL deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

import { db } from "../db/index.js";
import { userTable } from "../models/user.model.js";
import {eq} from "drizzle-orm"
export async function getUserByEmail(email) {
  const [existingUser] = await db
    .select({
      id: userTable.id,
      firstName: userTable.firstName,
      lastName: userTable.lastName,
      email: userTable.email,
      salt: userTable.salt,
      password: userTable.password
    })
    .from(userTable)
    .where(eq(userTable.email, email));

  return existingUser;
}

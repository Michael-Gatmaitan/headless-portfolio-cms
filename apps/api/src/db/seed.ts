import { db } from ".";
import { users } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding the database");

  try {
    const hasdedPassword = await bcrypt.hash("123123123", 10);

    const me = await db.insert(users).values({
      email: "mchlgtmtn@gmail.com",
      name: "Michael Gatmaitan",
      passwordHash: hasdedPassword
    })
  } catch (error) {
    console.error("Error seeding exercises:", error);
  } finally {
    process.exit(0);
  }
}

seed();

import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5001"),
  MONGO_URI: z
    .string()
    .min(1, "MONGO_URI is required")
    .startsWith(
      "mongodb",
      "MONGO_URI must be a valid MongoDB connection string",
    ),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment configuration:");
  parsed.error.issues.forEach((err) => {
    console.error(`→ ${err.path.join(".")}: ${err.message}`);
  });
  process.exit(1);
}

export const env = parsed.data;

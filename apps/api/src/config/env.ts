import "dotenv/config";
import type { StringValue } from "ms";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().int().positive().default(4000),
  WEB_ORIGIN: z.string().url().default("http://localhost:3000"),
  JWT_SECRET: z.string().min(32).default("development-secret-change-before-production"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  MONGODB_URI: z.string().optional(),
  REDIS_URL: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  GROQ_MODEL: z.string().optional(),
  TAVILY_API_KEY: z.string().optional(),
  SERPER_API_KEY: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  JINA_API_KEY: z.string().optional(),
  LOCAL_UPLOAD_DIR: z.string().default("uploads")
});

export const env = envSchema.parse(process.env);

export type AppEnv = Omit<typeof env, "JWT_EXPIRES_IN"> & {
  JWT_EXPIRES_IN: StringValue | number;
};

export const typedEnv = env as AppEnv;

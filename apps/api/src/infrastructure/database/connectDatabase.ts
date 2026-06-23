import mongoose from "mongoose";
import { env } from "../../config/env.js";
import { logger } from "../../shared/logger/logger.js";

export async function connectDatabase() {

  if (!env.MONGODB_URI) {
    logger.warn("MONGODB_URI is not set; database-backed routes will be unavailable");
    return;
  }

  await mongoose.connect(env.MONGODB_URI);
  logger.info("MongoDB connected");
}

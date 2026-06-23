import { createApp } from "./app/createApp.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./infrastructure/database/connectDatabase.js";
import { logger } from "./shared/logger/logger.js";

async function main() {
  await connectDatabase();

  const app = createApp();

  app.listen(env.API_PORT, () => {
    // logger.info({ port: env.API_PORT }, "API server started");
    console.log("API server started");
  });
}

main().catch((error: unknown) => {
  logger.error({ error }, "API server failed to start");
  process.exit(1);
});

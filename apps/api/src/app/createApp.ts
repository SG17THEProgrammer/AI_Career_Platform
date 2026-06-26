import cors from "cors";
import express from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { env } from "../config/env.js";
import { registerRoutes } from "./routes.js";
import { errorHandler } from "../shared/errors/errorHandler.js";
import { logger } from "../shared/logger/logger.js";
// import { searchService } from "../infrastructure/search/index.js";
// import { pdfService } from "../infrastructure/pdf/pdf.service.js";
// import { resumeFileStorage } from "../infrastructure/storage/resumeFileStorage.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.WEB_ORIGIN,
      credentials: true
    })
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(pinoHttp({ logger }));

 app.get('/', (req, res) => {
  res.send('Hello World');
});

// app.get("/test-pdf", async (_, res) => {
//   const pdf = await pdfService.compile(`
// \\documentclass{article}
// \\begin{document}
// Hello World
// \\end{document}
// `);

//   res.contentType("application/pdf");
//   res.send(pdf);
// });

// app.get("/test-upload", async (_, res) => {
//   const pdf = await pdfService.compile(`
// \\documentclass{article}
// \\begin{document}
// Hello World
// \\end{document}
// `);

//   const file =
//     await resumeFileStorage.saveGeneratedFile(
//       pdf,
//       "test.pdf",
//       "application/pdf",
//       "test-user",
//       "tailored-resumes"
//     );

//   res.json(file);
// });

//  app.get("/search", async (_, res) => {
// const result = await searchService.search(
//     "OpenAI software engineer interview process"
//   );
//   res.json(result);
// })


  registerRoutes(app);

  app.use(errorHandler);

  return app;
}

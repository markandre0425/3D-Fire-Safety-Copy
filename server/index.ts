import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import portfinder from "portfinder";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Set the base port to 5000
  const basePort = parseInt(process.env.PORT || "5000", 10);
  
  // Configure portfinder to start looking from the base port
  portfinder.basePort = basePort;
  
  try {
    // Find an available port
    const port = await portfinder.getPortPromise();
    
    // Start the server on the available port
    server.listen({
      port,
      host: "127.0.0.1",
    }, () => {
      log(`Port ${basePort} was ${port !== basePort ? 'busy, now ' : ''}serving on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to find an available port:", err);
    process.exit(1);
  }
})();



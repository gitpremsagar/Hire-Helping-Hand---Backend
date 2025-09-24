import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { disconnectPrisma, checkDatabaseConnection } from "./lib/prisma.js";
import authRoutes from "./modules/auth/auth.routes.js";
import serviceCategoryRoutes from "./modules/serviceCategory/serviceCategory.routes.js";
import serviceSubCategoryRoutes from "./modules/serviceSubCategory/serviceSubCategory.routes.js";
import userRoleRoutes from "./modules/userRole/userRole.routes.js";
import userLanguageRoutes from "./modules/userLanguage/userLanguage.routes.js";

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/service-categories", serviceCategoryRoutes);
app.use("/api/v1/service-subcategories", serviceSubCategoryRoutes);
app.use("/api/v1/user-roles", userRoleRoutes);
app.use("/api/v1/user-languages", userLanguageRoutes);

app.get("/api/v1", (req, res) => {
  res.send("Hello From API");
});

app.get("/",(req, res) => {
  res.send("Hello From Hire Helping Hand Root Route!");
});

// Health check endpoint
app.get("/health", async (req, res) => {
  const dbConnected = await checkDatabaseConnection();
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? "healthy" : "unhealthy",
    database: dbConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to see the result`);
  
  // Check database connection on startup
  const dbConnected = await checkDatabaseConnection();
  if (dbConnected) {
    console.log("✅ Database connection established");
  } else {
    console.log("❌ Database connection failed");
  }
});

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  server.close(async () => {
    console.log("HTTP server closed");
    
    try {
      await disconnectPrisma();
      console.log("✅ Database connection closed");
      process.exit(0);
    } catch (error) {
      console.error("❌ Error during shutdown:", error);
      process.exit(1);
    }
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error("❌ Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
};

// Handle different termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});
import winston from "winston";
import { env } from "@/config/env";

const isDevelopment = env.NODE_ENV === "development";
const isTest = env.NODE_ENV === "test";

// Configure Winston logger with appropriate settings
const logger = winston.createLogger({
  level: isDevelopment ? "debug" : "info",
  // Add default meta fields
  defaultMeta: {
    service: "og-image",
    version: "0.1.0",
  },
  // Define format based on environment
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  // Configure transports based on environment
  transports: [
    // Console transport with pretty printing in development
    new winston.transports.Console({
      format:
        isDevelopment && !isTest
          ? winston.format.combine(
              winston.format.colorize(),
              winston.format.simple(),
              winston.format.printf(
                ({ timestamp, level, message, ...meta }) => {
                  const metaStr = Object.keys(meta).length
                    ? JSON.stringify(meta, null, 2)
                    : "";
                  return `${timestamp} [${level}]: ${message} ${metaStr}`;
                }
              )
            )
          : winston.format.json(),
    }),
  ],
  // Exit on error in production
  exitOnError: !isDevelopment,
});

export { logger };

// Export a simplified log interface for backward compatibility
export const log = {
  debug: logger.debug.bind(logger),
  error: logger.error.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
};

// Export types for better TypeScript support
export type LogLevel = "error" | "warn" | "info" | "debug";
export type Logger = winston.Logger;

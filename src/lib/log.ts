import { env } from "@/config/env";

type LogMethod = (...args: unknown[]) => void;

interface Logger {
  debug: LogMethod;
  error: LogMethod;
  info: LogMethod;
  warn: LogMethod;
}

const noop: LogMethod = () => {
  // Intentionally empty no-op function
};

export const log: Logger = {
  debug: env.NODE_ENV === "development" ? console.debug : noop,
  info: console.info,
  warn: console.warn,
  error: console.error,
};

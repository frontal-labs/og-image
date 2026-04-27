import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    OG_HTML_DEBUG: z
      .enum(["0", "1"])
      .default("0")
      .transform((value) => value === "1"),
  },
  client: {},
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    OG_HTML_DEBUG: process.env.OG_HTML_DEBUG,
  },
});

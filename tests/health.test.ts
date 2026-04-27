import { describe, expect, it } from "vitest";
import { GET, HEAD } from "@/app/health/route";

describe("health route", () => {
  it("returns a healthy JSON payload", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("healthy");
    expect(body.service).toBe("og-image");
    expect(body.version).toBe("0.1.0");
  });

  it("returns 200 for HEAD requests", async () => {
    const response = await HEAD();

    expect(response.status).toBe(200);
  });
});

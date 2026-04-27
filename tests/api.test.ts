import { describe, expect, it } from "vitest";
import { ValidationError } from "@/lib/error";
import { parseSearchParams } from "@/services/og-service";

describe("parseSearchParams", () => {
  it("parses valid search parameters", () => {
    const params = new URLSearchParams({
      title: "Hello World",
      description: "Test Description",
      label: "Product Update",
      theme: "light",
    });

    expect(parseSearchParams(params)).toEqual({
      title: "Hello World",
      description: "Test Description",
      label: "Product Update",
      quality: 1,
      theme: "light",
    });
  });

  it("defaults missing theme to light", () => {
    const params = new URLSearchParams();

    expect(parseSearchParams(params)).toEqual({
      title: undefined,
      description: undefined,
      label: undefined,
      quality: 1,
      theme: "light",
    });
  });

  it("throws on invalid theme values", () => {
    const params = new URLSearchParams({
      title: "Hello World",
      description: "Test Description",
      theme: "invalid",
    });

    expect(() => parseSearchParams(params)).toThrow(ValidationError);
  });

  it("parses the simplified theme variants", () => {
    for (const theme of ["light"] as const) {
      const params = new URLSearchParams({
        title: "Hello World",
        description: "Test Description",
        theme,
      });

      expect(parseSearchParams(params).theme).toBe(theme);
    }
  });

  it("allows empty title and description for the centered logo layout", () => {
    const params = new URLSearchParams();

    expect(parseSearchParams(params)).toEqual({
      title: undefined,
      description: undefined,
      label: undefined,
      quality: 1,
      theme: "light",
    });
  });

  it("parses quality from search params", () => {
    const params = new URLSearchParams({
      quality: "2",
    });

    expect(parseSearchParams(params).quality).toBe(2);
  });
});

import { describe, expect, it } from "vitest";
import { ValidationError } from "@/lib/error";
import { normalizeTheme, validateOGParams } from "@/lib/og";

describe("validateOGParams", () => {
  it("returns trimmed params when valid", () => {
    expect(
      validateOGParams(
        "  Hello World  ",
        "  Test Description  ",
        "  Product Update  ",
        "light",
        2
      )
    ).toEqual({
      title: "Hello World",
      description: "Test Description",
      label: "Product Update",
      quality: 2,
      theme: "light",
    });
  });

  it("allows empty content for the centered logo layout", () => {
    expect(validateOGParams(undefined, undefined, undefined, "light")).toEqual({
      title: undefined,
      description: undefined,
      label: undefined,
      quality: 1,
      theme: "light",
    });
  });

  it("allows title without description", () => {
    expect(validateOGParams("Title", "")).toEqual({
      title: "Title",
      description: undefined,
      label: undefined,
      quality: 1,
      theme: "light",
    });
    expect(validateOGParams("Title", undefined)).toEqual({
      title: "Title",
      description: undefined,
      label: undefined,
      quality: 1,
      theme: "light",
    });
  });

  it("allows description without title", () => {
    expect(validateOGParams("", "Description")).toEqual({
      title: undefined,
      description: "Description",
      label: undefined,
      quality: 1,
      theme: "light",
    });
    expect(validateOGParams(undefined, "Description")).toEqual({
      title: undefined,
      description: "Description",
      label: undefined,
      quality: 1,
      theme: "light",
    });
  });

  it("throws when title is too long", () => {
    expect(() => validateOGParams("a".repeat(101), "Description")).toThrow(
      ValidationError
    );
  });

  it("throws when description is too long", () => {
    expect(() => validateOGParams("Title", "a".repeat(201))).toThrow(
      ValidationError
    );
  });

  it("accepts maximum lengths", () => {
    expect(() =>
      validateOGParams(
        "a".repeat(100),
        "a".repeat(200),
        "a".repeat(40),
        "light"
      )
    ).not.toThrow();
  });

  it("throws when label is too long", () => {
    expect(() =>
      validateOGParams("Title", "Description", "a".repeat(41))
    ).toThrow(ValidationError);
  });

  it("rejects invalid quality values", () => {
    expect(() =>
      validateOGParams("Title", "Description", undefined, "light", 0)
    ).toThrow(ValidationError);
    expect(() =>
      validateOGParams("Title", "Description", undefined, "light", 5)
    ).toThrow(ValidationError);
    expect(() =>
      validateOGParams("Title", "Description", undefined, "light", "2.5")
    ).toThrow(ValidationError);
  });

  it("rejects invalid themes", () => {
    expect(() => normalizeTheme("retro")).toThrow(ValidationError);
  });

  it("defaults theme to light", () => {
    expect(normalizeTheme(undefined)).toBe("light");
  });

  it("accepts all supported themes", () => {
    expect(normalizeTheme("dark")).toBe("dark");
    expect(normalizeTheme("light")).toBe("light");
  });
});

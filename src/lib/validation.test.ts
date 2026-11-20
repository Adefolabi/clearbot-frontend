import { describe, expect, it } from "vitest";
import {
  VALID_CAMPUSES,
  isValidCampus,
  sanitizeStoredSession,
} from "./validation";

describe("campus list", () => {
  it("offers only Iwo and Ogbomosho", () => {
    expect([...VALID_CAMPUSES]).toEqual(["Iwo Campus", "Ogbomosho Campus"]);
  });

  it("rejects Abuja Campus", () => {
    expect(isValidCampus("Abuja Campus")).toBe(false);
    expect(isValidCampus("Iwo Campus")).toBe(true);
    expect(isValidCampus("Ogbomosho Campus")).toBe(true);
  });
});

describe("sanitizeStoredSession", () => {
  it("drops a saved Abuja campus but keeps the rest", () => {
    const result = sanitizeStoredSession({
      matricNumber: "BU22CSC1081",
      campus: "Abuja Campus",
    });
    expect(result).toEqual({ matricNumber: "BU22CSC1081" });
    expect("campus" in result).toBe(false);
  });

  it("keeps a valid campus untouched", () => {
    const stored = { matricNumber: "BU22CSC1081", campus: "Iwo Campus" };
    expect(sanitizeStoredSession(stored)).toEqual(stored);
  });

  it("leaves sessions without a campus alone", () => {
    const stored: { matricNumber: string; campus?: string } = {
      matricNumber: "BU22CSC1081",
    };
    expect(sanitizeStoredSession(stored)).toEqual(stored);
  });
});

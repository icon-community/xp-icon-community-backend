import { isStellarAddress } from "../../src/shared/utils/validate-util";

describe("isStellarAddress", () => {
  it("should return true for a valid Stellar address", () => {
    const validStellarAddress = "GBMLBRIU3PGVGV3TKVRTZAXTQCZ3WOBXX6K6C5CXWY6ALWATRDDKAJBD"; // Example valid address
    expect(isStellarAddress(validStellarAddress)).toBe(true);
  });

  it("should return false for an invalid Stellar address", () => {
    const invalidStellarAddress = "invalid_stellar_address";
    expect(isStellarAddress(invalidStellarAddress)).toBe(false);
  });

  it("should return false for an invalid Stellar address", () => {
    const invalidStellarAddress = "GCOIYW5VQRRHFUFLQFZUVKM3GDRZ7WRLQ4LXB23K2OYGO2KOKX3UDBZA";
    expect(isStellarAddress(invalidStellarAddress)).toBe(false);
  });

  it("should return false for an empty string", () => {
    expect(isStellarAddress("")).toBe(false);
  });

  it("should return false for a non-string input", () => {
    expect(isStellarAddress(null as unknown as string)).toBe(false);
    expect(isStellarAddress(undefined as unknown as string)).toBe(false);
    expect(isStellarAddress({} as unknown as string)).toBe(false);
  });
});

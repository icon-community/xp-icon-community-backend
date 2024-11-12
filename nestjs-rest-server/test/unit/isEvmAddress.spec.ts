// isEvmAddress.spec.ts
import { isEvmAddress } from "../../src/shared/utils/validate-util";

describe("isEvmAddress", () => {
  it("should correctly identify valid EVM addresses", () => {
    const validAddresses = [
      "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      "0x52908400098527886E0F7030069857D2E4169EE7",
      "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
    ];

    const invalidAddresses = [
      "12345",
      "0xZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ", // Invalid hex
      "some-random-string",
      "0x742d35Cc6634C0532925a3b844Bc454e4438f44", // Too short
      "742d35Cc6634C0532925a3b844Bc454e4438f44e", // Missing 0x prefix
    ];

    validAddresses.forEach((address) => {
      expect(isEvmAddress(address)).toBe(true);
    });

    invalidAddresses.forEach((address) => {
      expect(isEvmAddress(address)).toBe(false);
    });
  });
});

// isSuiAddress.spec.ts
import { isSuiAddress } from "../../src/shared/utils/validate-util";

describe("isSuiAddress", () => {
  it("should correctly identify valid SUI addresses", () => {
    const validAddresses = [
      "0xa1a4543e263b2aa7604ddafc330c18e914a4d6ba9ec73459fbca76d648affe37",
      "0x1da05298c1ff956515165cbb4f7825773fa09f372daf7730a004916a7fe4df56",
      "0xf1a2498d6a583a0bc0237cb204e589be6bbfcdc12cfb32b1b589947e6c1f166a",
    ];

    const invalidAddresses = [
      "12345",
      "0xZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ", // Invalid hex
      "some-random-string",
      "0x742d35Cc6634C0532925a3b844Bc454e4438f44", // Too short
      "f1a2498d6a583a0bc0237cb204e589be6bbfcdc12cfb32b1b5    89947e6c1f166a", // Missing 0x prefix
    ];

    validAddresses.forEach((address) => {
      expect(isSuiAddress(address)).toBe(true);
    });

    invalidAddresses.forEach((address) => {
      expect(isSuiAddress(address)).toBe(false);
    });
  });
});

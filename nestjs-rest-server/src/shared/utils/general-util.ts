export function isValidHex(str: any): boolean {
  if (typeof str !== "string") {
    return false;
  }
  const hexRegex = /^0x[0-9a-fA-F]+$/;
  return hexRegex.test(str);
}

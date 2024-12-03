export function isValidHex(str: any): boolean {
  if (typeof str !== "string") {
    return false;
  }
  const hexRegex = /^0x[0-9a-fA-F]+$/;
  return hexRegex.test(str);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function subtractDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

import { HanaNewsletterXpDetails } from "../db/schemas/UserTask.schema";

export function isHanaNewsletterXpDetails(value: object | undefined): value is HanaNewsletterXpDetails {
  return value !== undefined && value !== null && "email" in value;
}

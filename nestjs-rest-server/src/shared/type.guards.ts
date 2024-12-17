import { HanaNewsletterXpDetails, LinkSocialXpDetails } from "../db/schemas/UserTask.schema";
import { LinkSocialTaskDetailsDto, SubscribeHanaTaskDetailsDto } from "../tasks/dto/claim-task.dto";

export function isHanaNewsletterXpDetails(value: object | undefined): value is HanaNewsletterXpDetails {
  return value !== undefined && value !== null && "email" in value;
}

export function isLinkSocialXpDetails(value: object | undefined): value is LinkSocialXpDetails {
  return value !== undefined && value !== null && "provider" in value;
}

export function isSubscribeHanaTaskDetailsDto(value: object | undefined): value is SubscribeHanaTaskDetailsDto {
  return value !== undefined && value !== null && "email" in value;
}

export function isLinkSocialTaskDetailsDto(value: object | undefined): value is LinkSocialTaskDetailsDto {
  return value !== undefined && value !== null && "provider" in value;
}

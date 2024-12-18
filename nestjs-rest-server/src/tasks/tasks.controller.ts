import { BadRequestException, Body, Controller, Post, UseGuards, UsePipes } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ApiHeader } from "@nestjs/swagger";
import { ValidationPipe } from "../shared/pipes/validation.pipe";
import { UserAddress } from "../user/decorator/user.decorators";
import { TaskLabel } from "./tasks.config";
import { ClaimTaskDto } from "./dto/claim-task.dto";
import { TasksService } from "./tasks.service";
import { isLinkSocialTaskDetailsDto, isSubscribeHanaTaskDetailsDto } from "../shared/type.guards";
import { CanClaimTaskDto } from "./dto/can-claim-task.dto";

@Controller("tasks")
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Post("/claimable")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "authorization",
    description: "JWT Authorization header. E.g. 'Bearer {Token}'",
  })
  @UsePipes(new ValidationPipe())
  async claimableTaskXp(@Body() dto: ClaimTaskDto, @UserAddress() publicAddress: string): Promise<CanClaimTaskDto> {
    switch (dto.taskLabel) {
      case TaskLabel.HANA_NEWSLETTER:
        if (isSubscribeHanaTaskDetailsDto(dto.details)) {
          return await this.taskService.canClaimHanaNewsletterSubscriptionXp(
            dto.season,
            dto.details.email,
            publicAddress,
          );
        } else {
          throw new BadRequestException("Invalid details");
        }
      case TaskLabel.LINK_TWITTER_X:
        if (isLinkSocialTaskDetailsDto(dto.details)) {
          return await this.taskService.canClaimLinkSocialXp(
            dto.season,
            dto.taskLabel,
            dto.details.provider,
            publicAddress,
          );
        } else {
          throw new BadRequestException("Invalid details");
        }
      case TaskLabel.LINK_GOOGLE:
        if (isLinkSocialTaskDetailsDto(dto.details)) {
          return await this.taskService.canClaimLinkSocialXp(
            dto.season,
            dto.taskLabel,
            dto.details.provider,
            publicAddress,
          );
        } else {
          throw new BadRequestException("Invalid details");
        }
      default:
        throw new BadRequestException(`Unknown taskLabel: ${dto.taskLabel}`);
    }
  }

  @Post("/claim")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "authorization",
    description: "JWT Authorization header. E.g. 'Bearer {Token}'",
  })
  @UsePipes(new ValidationPipe())
  async claimTaskXp(@Body() dto: ClaimTaskDto, @UserAddress() publicAddress: string): Promise<void> {
    switch (dto.taskLabel) {
      case TaskLabel.HANA_NEWSLETTER:
        if (isSubscribeHanaTaskDetailsDto(dto.details)) {
          return await this.taskService.issueHanaNewsletterSubscriptionXp(dto.season, dto.details.email, publicAddress);
        } else {
          throw new BadRequestException("Invalid details");
        }
      case TaskLabel.LINK_TWITTER_X:
        if (isLinkSocialTaskDetailsDto(dto.details)) {
          return await this.taskService.issueLinkSocialXp(dto.season, dto.details.provider, publicAddress);
        } else {
          throw new BadRequestException("Invalid details");
        }
      case TaskLabel.LINK_GOOGLE:
        if (isLinkSocialTaskDetailsDto(dto.details)) {
          return await this.taskService.issueLinkSocialXp(dto.season, dto.details.provider, publicAddress);
        } else {
          throw new BadRequestException("Invalid details");
        }
      default:
        throw new BadRequestException(`Unknown taskLabel: ${dto.taskLabel}`);
    }
  }
}

import { Controller, Get, Post, Body, Param, InternalServerErrorException, UsePipes } from "@nestjs/common";
import { SeasonService } from "./season.service";
import { SeasonDto } from "./dto/season.dto";
import { CalculateSeasonReqDto } from "./dto/calculate-season-req.dto";
import { ValidationPipe } from "../shared/pipes/validation.pipe";
import { ApiParam } from "@nestjs/swagger";
import { SeasonLabelParam, TaskBySeasonParams } from "../shared/request-params/RequestParams";
import { RewardsDto } from "./dto/rewards.dto";

@Controller("season")
export class SeasonController {
  constructor(private readonly seasonService: SeasonService) {}

  @Get(":seasonLabel")
  @ApiParam({ name: "seasonLabel", required: true, description: "Season label", type: String })
  @UsePipes(new ValidationPipe())
  getSeason(@Param() params: SeasonLabelParam): Promise<SeasonDto> | InternalServerErrorException {
    try {
      return this.seasonService.getSeason(params.seasonLabel);
    } catch (e) {
      return new InternalServerErrorException({
        error: e.message,
      });
    }
  }

  @Post(":seasonLabel")
  @ApiParam({ name: "seasonLabel", required: true, description: "Season label", type: String })
  @UsePipes(new ValidationPipe())
  calculateSeason(
    @Param() params: SeasonLabelParam,
    @Body() calculateSeasonReqDto: CalculateSeasonReqDto,
  ): Promise<RewardsDto[]> | InternalServerErrorException {
    try {
      return this.seasonService.calculateSeason(params.seasonLabel, calculateSeasonReqDto);
    } catch (e) {
      return new InternalServerErrorException({
        error: e.message,
      });
    }
  }

  @Get("/:seasonLabel/task/:taskLabel")
  @ApiParam({ name: "seasonLabel", required: true, description: "Season label", type: String })
  @ApiParam({ name: "taskLabel", required: true, description: "Task label", type: String })
  @UsePipes(new ValidationPipe())
  getTaskBySeason(@Param() params: TaskBySeasonParams): void | InternalServerErrorException {
    try {
      return this.seasonService.getTaskBySeason(params.seasonLabel, params.taskLabel);
    } catch (e) {
      return new InternalServerErrorException({
        error: e.message,
      });
    }
  }
}

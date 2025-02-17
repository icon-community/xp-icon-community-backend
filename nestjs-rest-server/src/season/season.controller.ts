import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  InternalServerErrorException,
  UsePipes,
  UseInterceptors,
  Inject,
  Logger,
} from "@nestjs/common";
import { SeasonService } from "./season.service";
import { SeasonDto } from "./dto/season.dto";
import { CalculateSeasonReqDto } from "./dto/calculate-season-req.dto";
import { ValidationPipe } from "../shared/pipes/validation.pipe";
import { ApiParam } from "@nestjs/swagger";
import { SeasonLabelParam } from "../shared/request-params/RequestParams";
import { RewardsDto } from "./dto/rewards.dto";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { SEASON_CONTROLLER_CACHE_MS } from "../constants";
import { CustomCacheInterceptor } from "../shared/interceptors/custom-cache.interceptor";

@Controller("season")
@UseInterceptors(CustomCacheInterceptor)
export class SeasonController {
  private logger = new Logger("SeasonController");

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly seasonService: SeasonService,
  ) {}

  @Get(":seasonLabel")
  @ApiParam({ name: "seasonLabel", required: true, description: "Season label", type: String })
  @UsePipes(new ValidationPipe())
  getSeason(@Param() params: SeasonLabelParam): Promise<SeasonDto> {
    try {
      return this.seasonService.getSeason(params.seasonLabel);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException({
        error: e.message,
      });
    }
  }

  @Post(":seasonLabel")
  @ApiParam({ name: "seasonLabel", required: true, description: "Season label", type: String })
  async calculateSeason(
    @Param() params: SeasonLabelParam,
    @Body() calculateSeasonReqDto: CalculateSeasonReqDto,
  ): Promise<RewardsDto[]> {
    try {
      const cacheKey = `${params.seasonLabel}-${JSON.stringify(calculateSeasonReqDto)}`;
      const value = await this.cacheManager.get<RewardsDto[]>(cacheKey);

      if (value) {
        return value;
      }

      const response = await this.seasonService.calculateSeason(params.seasonLabel, calculateSeasonReqDto);

      await this.cacheManager.set(cacheKey, response, SEASON_CONTROLLER_CACHE_MS);

      return response;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException({
        error: e.message,
      });
    }
  }

  // @Get("/:seasonLabel/task/:taskLabel")
  // @ApiParam({ name: "seasonLabel", required: true, description: "Season label", type: String })
  // @ApiParam({ name: "taskLabel", required: true, description: "Task label", type: String })
  // @UsePipes(new ValidationPipe())
  // getTaskBySeason(@Param() params: TaskBySeasonParams): void {
  //   try {
  //     return this.seasonService.getTaskBySeason(params.seasonLabel, params.taskLabel);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException({
  //       error: e.message,
  //     });
  //   }
  // }
}

import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AddressValidationPipe } from "../shared/pipes/icon-eoa-address-validation-pipe.service";
import { ChallengeRequestDto } from "./dto/ChallengeRequestDto";
import { ChallengeResponseDto } from "./dto/ChallengeResponseDto";
import { TokenDto } from "./dto/token.dto";
import { ApiHeader } from "@nestjs/swagger";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("/challenge/:address")
  async getChallenge(@Param("address", AddressValidationPipe) address: string): Promise<ChallengeRequestDto> {
    return this.authService.getAuthChallenge(address);
  }

  @Post("/challenge/verify")
  @UsePipes(new ValidationPipe())
  verifyChallenge(@Body() challengeDto: ChallengeResponseDto): Promise<TokenDto> {
    return this.authService.verifyChallenge(challengeDto);
  }

  @Post("/logout")
  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: "authorization",
    description: "JWT Authorization header. E.g. 'Bearer {Token}'",
  })
  logoutUser(@Req() request: Request): Promise<void> {
    return this.authService.logoutUser(request);
  }
}

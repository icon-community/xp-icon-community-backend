import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ChallengeRequestDto } from "./dto/ChallengeRequestDto";
import { HttpService } from "@nestjs/axios";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError } from "axios";
import { XpgoConfigService } from "../config/xpgo-config.service";
import { TokenDto } from "./dto/token.dto";
import { ChallengeResponseDto } from "./dto/ChallengeResponseDto";

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: XpgoConfigService,
  ) {}

  async getAuthChallenge(address: string): Promise<ChallengeRequestDto> {
    // Call the authentication service to validate the token
    const { data } = await firstValueFrom(
      this.httpService.get<ChallengeRequestDto>(`${this.config.authServerUrl}/api/auth/challenge/${address}`).pipe(
        catchError((error: AxiosError) => {
          console.error(error?.response?.data);
          throw new InternalServerErrorException({ error: "Failed to authenticate." });
        }),
      ),
    );

    return data;
  }

  async verifyChallenge(challengeDto: ChallengeResponseDto): Promise<TokenDto> {
    // Call the authentication service to validate the token
    const { data } = await firstValueFrom(
      this.httpService
        .post<TokenDto>(`${this.config.authServerUrl}/api/auth/challenge/verify`, challengeDto, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error?.response?.data);
            throw new InternalServerErrorException({ error: "Failed to authenticate." });
          }),
        ),
    );

    return data;
  }

  async logoutUser(request: Request): Promise<void> {
    // Call the authentication service to validate the token
    await firstValueFrom(
      this.httpService
        .post<TokenDto>(
          `${this.config.authServerUrl}/api/auth/logout`,
          {},
          {
            headers: {
              // @ts-expect-error index access
              Authorization: request.headers["authorization"] as string,
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error?.response?.data);
            throw new InternalServerErrorException({ error: "Failed to logout." });
          }),
        ),
    );

    return;
  }
}

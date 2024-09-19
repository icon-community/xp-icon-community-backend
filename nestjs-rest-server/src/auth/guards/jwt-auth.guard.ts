import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { catchError, firstValueFrom } from "rxjs";
import { XpgoConfigService } from "../../config/xpgo-config.service";
import { AxiosError } from "axios";
import { AuthResDto } from "../dto/auth-res.dto";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: XpgoConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      // Extract Bearer token from Authorization header
      const authHeader = request.headers["authorization"];

      if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.length < 10) {
        throw new BadRequestException("Authorization token required");
      }

      // Call the authentication service to validate the token
      const { data } = await firstValueFrom(
        this.httpService
          .get<AuthResDto>(`${this.config.authServerUrl}/api/auth/authenticate`, {
            headers: {
              Authorization: authHeader,
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              console.error(error?.response?.data);
              throw new InternalServerErrorException({ error: "Failed to authenticate." });
            }),
          ),
      );

      if (!data.publicAddress) {
        throw new UnauthorizedException();
      }

      // Attach publicAddress to the request object
      request.publicAddress = data.publicAddress;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}

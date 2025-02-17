import { Injectable, ExecutionContext, CallHandler, Inject } from "@nestjs/common";
import { CacheInterceptor, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { Reflector } from "@nestjs/core";

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) cacheManager: Cache,
    @Inject(Reflector) protected readonly reflector: Reflector,
  ) {
    super(cacheManager, reflector);
  }

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    if (request.headers["cache-control"] === "no-cache") {
      return next.handle(); // Skip cache and return fresh data
    }

    return super.intercept(context, next);
  }
}

import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UnauthorizedException, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ShopifyHmacInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const shopifyHmac = request.headers['x-shopify-hmac-sha256'];
    const rawBody = request.rawBody;
    const secret = this.configService.get<string>('SHOPIFY_API_SECRET');

    if (!shopifyHmac || !rawBody || !secret) {
      throw new UnauthorizedException('Missing Shopify HMAC, raw body, or webhook secret.');
    }

    const hmac = crypto
      .createHmac('sha256', secret)
      .update(rawBody, 'utf8')
      .digest('base64');

    if (hmac !== shopifyHmac) {
      throw new UnauthorizedException('Invalid Shopify HMAC signature.');
    }

    return next.handle();
  }
}
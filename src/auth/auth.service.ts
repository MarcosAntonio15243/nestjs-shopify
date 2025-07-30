import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { schema } from 'src/drizzle/schema';
import { DrizzleDB } from 'src/drizzle/types/types';
import { OAuthRedirectDto, OAuthRedirectSchema } from './dto/oauth-redirect.dto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
    @Inject(DRIZZLE) private db: DrizzleDB
  ) {}

  generateAuthUrl(shop: string): string {
    if (!shop) {
      throw new BadRequestException('Shop name is required to generate the authentication URL.');
    }

    const sanitizedShop = shop.replace(/(.myshopify.com)*$/, '.myshopify.com');

    return `https://${sanitizedShop}/admin/oauth/authorize?` +
           `client_id=${this.configService.get<string>('SHOPIFY_API_KEY')}&` +
           `scope=${this.configService.get<string>('SHOPIFY_SCOPES')}&` +
           `redirect_uri=${this.configService.get<string>('HOST')}/auth/shopify/redirect&state={nonce}&grant_options[]={access_mode}`;
  }

  async exchangeCodeForToken(query: OAuthRedirectDto): Promise<string> {
    const { success, data, error } = OAuthRedirectSchema.safeParse(query);
    if (!success) {
      throw new BadRequestException(error);
    };

    const url = `https://${data.shop}/admin/oauth/access_token`;

    const payload = {
      client_id: this.configService.get<string>('SHOPIFY_API_KEY'),
      client_secret: this.configService.get<string>('SHOPIFY_API_SECRET'),
      code: data.code,
    };

    const response = await lastValueFrom(
      this.httpService.post(url, payload, {
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const accessToken = response.data.access_token;

    // Save store name and token
    const result = await this.db.insert(schema.stores).values({
      name: data.shop.split('.')[0],
      accessToken: accessToken
    }).returning();

    if (!result[0]) {
      throw new BadRequestException("Failed to save store data on redirect");
    };

    return accessToken;
  }

  async webhookSubscription(shop: string, accessToken: string) {
    const url = `https://${shop}/admin/api/2025-07/webhooks.json`;

    const payload = {
      "webhook": {
         // Will always send request after create orders
        "address": `${this.configService.get<string>('HOST')}/webhooks/orders/create`,
        "topic": "orders/create",
        "format": "json",
      },
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, payload, {
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': accessToken
          }
        })
      );
      
      return response.data;
    } catch (error: any) {
      throw new HttpException(`Erro ao registrar inscrição da loja ${shop} no webhook: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
    
  }

}

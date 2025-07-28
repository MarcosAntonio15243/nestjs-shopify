import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
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

    console.log(this.configService.get<string>('SHOPIFY_API_KEY'));
    console.log(this.configService.get<string>('SHOPIFY_API_SECRET'));
    console.log(this.configService.get<string>('HOST'));

    return `https://${sanitizedShop}/admin/oauth/authorize?` +
           `client_id=${this.configService.get<string>('SHOPIFY_API_KEY')}&` +
           `scope=${this.configService.get<string>('SHOPIFY_SCOPES')}&` +
           `redirect_uri=${this.configService.get<string>('HOST')}/auth/shopify/redirect&state={nonce}&grant_options[]={access_mode}`;
  }

  async exchangeCodeForToken(query: OAuthRedirectDto): Promise<void> {
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

    console.log(`Token recebido: ${JSON.stringify(response.data)}`);
    // Token recebido: {"access_token":"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","scope":"write_orders"}

    // Save shop name and token
    const result = await this.db.insert(schema.stores).values({
      name: data.shop.split('.')[0],
      accessToken: response.data.access_token
    }).returning();

    if (!result[0]) {
      throw new BadRequestException("Failed to save store data on redirect");
    };
  }

}

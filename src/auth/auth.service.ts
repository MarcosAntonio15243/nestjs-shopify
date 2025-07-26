import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  // private shopifyApiKey: string;
  // private shopifyScopes: string;
  // private shopifyRedirectUri: string;

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService
  ) { // <-- Injete ConfigService
    // this.shopifyApiKey = this.configService.get<string>('SHOPIFY_API_KEY') ?? 
    //   (() => { throw new Error('SHOPIFY_API_KEY não definido'); })();

    // this.shopifyScopes = this.configService.get<string>('SHOPIFY_SCOPES') ?? 
    //   (() => { throw new Error('SHOPIFY_SCOPES não definido'); })();

    // this.shopifyRedirectUri = this.configService.get<string>('SHOPIFY_REDIRECT_URI') ?? 
    //   (() => { throw new Error('SHOPIFY_REDIRECT_URI não definido'); })();
  }

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
           `redirect_uri=${this.configService.get<string>('HOST')}&state={nonce}&grant_options[]={access_mode}`;
  }

  async exchangeCodeForToken(query: any): Promise<void> {
    const url = `https://${query.shop}/admin/oauth/access_token`;

    const payload = {
      client_id: this.configService.get<string>('SHOPIFY_API_KEY'),
      client_secret: this.configService.get<string>('SHOPIFY_API_SECRET'),
      code: query.code,
    };

    const response = await lastValueFrom(
      this.httpService.post(url, payload, {
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    console.log(`Token recebido: ${JSON.stringify(response.data)}`);

    // TODO: Salvar no banco: shop, access_token, escopo, etc.
  }

}

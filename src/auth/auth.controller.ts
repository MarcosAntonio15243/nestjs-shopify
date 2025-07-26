import { Controller, Get, HttpCode, InternalServerErrorException, Query, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth/shopify')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @HttpCode(302)
  @Redirect() // Decorador do NestJS para lidar com redirecionamentos HTTP 302
  async authenticate(@Query('shop') shop: string) {
    if (!shop) {
      throw new InternalServerErrorException('Shop parameter is missing. Please provide a shop name (e.g., ?shop=yourstore.myshopify.com)');
    }

    console.log('Starting authentication...');

    const authUrl = this.authService.generateAuthUrl(shop);

    console.log(`URL Generated: ${authUrl}, returning...`);

    return { url: authUrl };
  }

  @Get('redirect')
  @HttpCode(302)
  @Redirect() // Decorador do NestJS para lidar com redirecionamentos HTTP 302
  async oauthRedirect(@Query() query: any) {
    console.log('I am redirect ' + query.code);
    
    // const response = await lastValueFrom(
    //   this.httpService.post(
    //     `https://${query.shop}/admin/oauth/access_token`,
    //     {
    //       client_id: this.configService.get("SHOPIFY_API_KEY"),
    //       client_secret: this.configService.get("SHOPIFY_API_SECRET"),
    //       code: query.code
    //     },
    //   ),
    // );

    // console.log("Token response: " + String(response.data));
    // console.log("Token response 2: " + response.data.access_token);
    // // SAVE TOKEN HERE

    await this.authService.exchangeCodeForToken(query);

    return { url: `https://${query.shop}/admin/apps?shop=${query.shop}` };
  }
  
}

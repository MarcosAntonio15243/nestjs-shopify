import { BadRequestException, Controller, Get, HttpCode, InternalServerErrorException, Query, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OAuthRedirectDto, OAuthRedirectSchema } from './dto/oauth-redirect.dto';

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

    const authUrl = this.authService.generateAuthUrl(shop);

    return { url: authUrl };
  }

  @Get('redirect')
  @HttpCode(302)
  @Redirect() // Decorador do NestJS para lidar com redirecionamentos HTTP 302
  async oauthRedirect(@Query() query: OAuthRedirectDto) {
    const { success, data, error } = OAuthRedirectSchema.safeParse(query);
    if (!success) {
      throw new BadRequestException(error);
    };

    await this.authService.exchangeCodeForToken(data);

    return { url: `https://${data.shop}/admin/apps?shop=${data.shop}` };
  }
  
}

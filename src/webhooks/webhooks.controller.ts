import { BadRequestException, Controller, Headers, HttpStatus, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { Request, Response } from 'express';
import { ShopifyHmacInterceptor } from '../common/interceptors/shopify-hmac.interceptor';

@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly webhooksService: WebhooksService,
  ) {}

  @Post("orders/create")
  @UseInterceptors(ShopifyHmacInterceptor)
  orderCreated(
    @Req() req: Request,
    @Res() res: Response
  ) {
    const rawBody = req['rawBody'];
    const shopDomain = req.headers['x-shopify-shop-domain'] as string | undefined;
    if (!shopDomain) {
      throw new BadRequestException("Shop domain not identified.")
    }
    const orderData = JSON.parse(rawBody.toString('utf8'));

    // Persist order
    this.webhooksService.saveOrder(shopDomain, orderData);

    return res.status(HttpStatus.OK).send('Webhook received and validated.');
  }

}

import { Controller, Headers, HttpStatus, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ShopifyHmacInterceptor } from 'src/common/interceptors/shopify-hmac.interceptor';

@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly webhooksService: WebhooksService,
    private readonly configService: ConfigService
  ) {}

  @Post("orders/create")
  @UseInterceptors(ShopifyHmacInterceptor)
  orderCreated(
    @Headers('x-shopify-hmac-sha256') hmac: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const rawBody = req['rawBody'];
    const orderData = JSON.parse(rawBody.toString('utf8'));

    // Persist order
    this.webhooksService.saveOrder(orderData);

    return res.status(HttpStatus.OK).send('Webhook received and validated.');
  }

}

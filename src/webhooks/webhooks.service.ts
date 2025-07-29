import { Injectable } from '@nestjs/common';
import * as crypto from "crypto";

@Injectable()
export class WebhooksService {
  constructor() {}

  validateHmac(rawBody: Buffer, hmacHeader: string, secret: string): boolean {
    const generatedHmac = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('base64');

    return crypto.timingSafeEqual(
      Buffer.from(generatedHmac),
      Buffer.from(hmacHeader)
    );
  }

}

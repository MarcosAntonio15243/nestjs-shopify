import { Inject, Injectable } from '@nestjs/common';
import * as crypto from "crypto";
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/types';
import { OrderDTO } from './dto/order.dto';
import { schema } from 'src/drizzle/schema';

@Injectable()
export class WebhooksService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

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

  async saveOrder(order: OrderDTO) {
    await this.db.insert(schema.orders).values({
      idShopify: order.id,
      financialStatus: order.financial_status,
      createdAt: new Date(order.created_at),
      updatedAt: new Date(order.updated_at),
      currency: order.currency,
      totalPrice: order.total_price,
      subtotalPrice: order.subtotal_price,
      totalTax: order.total_tax,
      totalDiscounts: order.total_discounts,
      gateway: order.gateway,
      note: order.note,
      tags: order.tags,
    });
  }

}

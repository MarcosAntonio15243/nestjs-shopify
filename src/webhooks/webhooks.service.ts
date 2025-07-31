import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as crypto from "crypto";
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/types';
import { OrderDTO } from './dto/order.dto';
import { schema } from 'src/drizzle/schema';
import { eq } from 'drizzle-orm';

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
    let customer_id: string | null = null;
    
    if (order.customer) {
      let [customer] = await this.db.select({
          id: schema.customers.id
        })
        .from(schema.customers)
        .where(eq(schema.customers.idShopify, order.customer.id));
      
      if (!customer) {
        const result1 = await this.db.insert(schema.customers).values({
          idShopify: order.customer.id,
          email: order.customer.email,
          firstName: order.customer.first_name,
          lastName: order.customer.last_name,
          phone: order.customer.phone
        }).returning({ id: schema.customers.id });

        customer = result1[0];

        if (!customer) {
          throw new BadRequestException('Failed to persist customer data');
        }
      }

      customer_id = customer.id;
    }
    
    const result2 = await this.db.insert(schema.orders).values({
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
      customerId: customer_id
    }).returning();

    const insertedOrder = result2[0];
    if (!insertedOrder) {
      throw new BadRequestException('Failed to persist order data');
    }
  }

}

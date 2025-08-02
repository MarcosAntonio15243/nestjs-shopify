import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/types';
import { OrderDTO } from '../common/dto/shopify-order.dto';
import { schema } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { OrderItemDTO } from '../common/dto/shopify-order-item.dto';
import { mapShopifyCustomerToDb, mapShopifyOrderItemToDb, mapShopifyOrderToDb } from 'src/common/mapper/shopify-order.mapper';

@Injectable()
export class WebhooksService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async saveOrder(order: OrderDTO) {
    let customer_id: string | null = null;

    if (order.customer) {
      let [customer] = await this.db.select({
          id: schema.customers.id
        })
        .from(schema.customers)
        .where(eq(schema.customers.id_shopify, order.customer.id));
      
      if (!customer) {
        const result1 = await this.db.insert(schema.customers).values(mapShopifyCustomerToDb(order.customer)).returning({ id: schema.customers.id });

        customer = result1[0];

        if (!customer) {
          throw new BadRequestException('Failed to persist customer data');
        }
      }

      customer_id = customer.id;
    }
    
    const result2 = await this.db.insert(schema.orders).values(mapShopifyOrderToDb(order, customer_id)).returning();

    const insertedOrder = result2[0];
    if (!insertedOrder) {
      throw new BadRequestException('Failed to persist order data');
    }

    await this.saveOrderItems(insertedOrder.id, order.line_items);
  }

  private async saveOrderItems(orderId: string, orderItems: OrderItemDTO[]) {
    if (!orderId || !orderItems?.length) return;

    const itemsToInsert = orderItems.map(item => mapShopifyOrderItemToDb(item, orderId));

    await this.db.insert(schema.orderItems).values(itemsToInsert);
  }

}

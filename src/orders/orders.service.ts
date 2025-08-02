import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/types';
import { schema } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class OrdersService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async getStoredOrders() {
    const orders = await this.db.select().from(schema.orders);

    const enrichedOrders = await Promise.all(
      orders.map(async ({ customer_id, ...orderWithoutCustomerId }) => {
        const customer = customer_id
          ? await this.db
              .select()
              .from(schema.customers)
              .where(eq(schema.customers.id, customer_id))
          : undefined;

        const lineItems = await this.db
          .select()
          .from(schema.orderItems)
          .where(eq(schema.orderItems.order_id, orderWithoutCustomerId.id));

        return {
          ...orderWithoutCustomerId,
          line_items: lineItems,
          customer: customer?.[0] ?? null,
        };
      }),
    );

    return enrichedOrders;
  }
}

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/types';
import { schema } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class OrdersService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async getAllStoredOrders() {
    const orders = await this.db.select().from(schema.orders);

    const enrichedOrders = await this.getEnrichedOrders(orders);

    return enrichedOrders;
  }

  async getAllStoredOrderByShopDomain(shopDomain: string) {
    let shopName = shopDomain.split('.')[0];
    let result = await this.db.select({ shopId: schema.stores.id })
      .from(schema.stores)
      .where(eq(schema.stores.name, shopName));
    
    if (!result[0]) {
      throw new BadRequestException("There is no store registered with the domain name provided.");
    }

    const { shopId } = result[0];

    const orders = await this.db.select()
      .from(schema.orders)
      .where(eq(schema.orders.store_id, shopId));

    const enrichedOrders = await this.getEnrichedOrders(orders);

    return enrichedOrders;
  }

  private async getEnrichedOrders(orders) {
    return await Promise.all(
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
  }

}

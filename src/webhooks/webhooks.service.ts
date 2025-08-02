import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/types';
import { OrderDTO } from '../common/dto/order.dto';
import { schema } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { OrderItemDTO } from '../common/dto/orderItem.dto';

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
      customerId: customer_id,
      // Address info
      shippingFirstName: order.shipping_address?.first_name,
      shippingLastName: order.shipping_address?.last_name,
      shippingAddress1: order.shipping_address?.address1,
      shippingAddress2: order.shipping_address?.address2,
      shippingCity: order.shipping_address?.city,
      shippingProvince: order.shipping_address?.province,
      shippingZip: order.shipping_address?.zip,
      shippingCountry: order.shipping_address?.country,
      shippingPhone: order.shipping_address?.phone,
    }).returning();

    const insertedOrder = result2[0];
    if (!insertedOrder) {
      throw new BadRequestException('Failed to persist order data');
    }

    await this.saveOrderItems(insertedOrder.id, order.line_items);
  }

  private async saveOrderItems(orderId: string, orderItems: OrderItemDTO[]) {
    if (!orderId || !orderItems?.length) return;

    const itemsToInsert = orderItems.map(item => ({
      idShopify: item.id,
      productId: item.product_id,
      variantId: item.variant_id,
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      price: item.price,
      orderId: orderId
    }));

    await this.db.insert(schema.orderItems).values(itemsToInsert);
  }

}

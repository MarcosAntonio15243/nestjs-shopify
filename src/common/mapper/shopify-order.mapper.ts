import { CustomerDTO } from "../dto/shopify-customer.dto";
import { OrderDTO } from "../dto/shopify-order.dto";
import { OrderItemDTO } from "../dto/shopify-order-item.dto";

export function mapShopifyOrderToDb(orderFromShopify: OrderDTO, customerId: string | null = null) {
  return {
    id_shopify: Number(orderFromShopify.id),
    financial_status: orderFromShopify.financial_status,
    created_at: new Date(orderFromShopify.created_at),
    updated_at: new Date(orderFromShopify.updated_at),
    currency: orderFromShopify.currency,
    total_price: orderFromShopify.total_price,
    subtotal_price: orderFromShopify.subtotal_price,
    total_tax: orderFromShopify.total_tax,
    total_discounts: orderFromShopify.total_discounts,
    gateway: orderFromShopify.gateway,
    note: orderFromShopify.note,
    tags: orderFromShopify.tags,
    customer_id: customerId,
    shipping_first_name: orderFromShopify.shipping_address?.first_name,
    shipping_last_name: orderFromShopify.shipping_address?.last_name,
    shipping_address_1: orderFromShopify.shipping_address?.address1,
    shipping_address_2: orderFromShopify.shipping_address?.address2,
    shipping_city: orderFromShopify.shipping_address?.city,
    shipping_province: orderFromShopify.shipping_address?.province,
    shipping_zip: orderFromShopify.shipping_address?.zip,
    shipping_country: orderFromShopify.shipping_address?.country,
    shipping_phone: orderFromShopify.shipping_address?.phone,
  };
}

export function mapShopifyCustomerToDb(customerFromShopify: CustomerDTO) {
  return {
    id_shopify: customerFromShopify.id,
    email: customerFromShopify.email,
    first_name: customerFromShopify.first_name,
    last_name: customerFromShopify.last_name,
    phone: customerFromShopify.phone
  };
}

export function mapShopifyOrderItemToDb(orderItemFromShopify: OrderItemDTO, orderId: string) {
  return {
    id_shopify: orderItemFromShopify.id,
    product_id: orderItemFromShopify.product_id,
    variant_id: orderItemFromShopify.variant_id,
    name: orderItemFromShopify.name,
    sku: orderItemFromShopify.sku,
    quantity: orderItemFromShopify.quantity,
    price: orderItemFromShopify.price,
    order_id: orderId
  };
}
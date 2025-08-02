import { OrderDTO } from "../dto/order.dto";

export function mapShopifyOrderToDb(orderFromShopify: OrderDTO) {
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
    customer_id: null, // ou associe com base no cliente da Shopify
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

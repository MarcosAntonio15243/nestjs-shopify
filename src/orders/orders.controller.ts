import { Controller, Get, InternalServerErrorException, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor (private readonly ordersService: OrdersService) {}

  @Get()
  getAllStoredOrders() {
    return this.ordersService.getAllStoredOrders();
  }

  @Get(':shopDomain')
  getAllStoredOrdersByShopDomain(@Param('shopDomain') shopDomain: string) {
    return this.ordersService.getAllStoredOrderByShopDomain(shopDomain);
  }

}

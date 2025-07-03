import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const OrderStatusResource = {
  resource: {
    model: getModelByName('OrderStatus'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Order',
      icon: 'ShoppingCart' 
    },
  },
};

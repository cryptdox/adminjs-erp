import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const OrderStatusResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('OrderStatus'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Order',
      icon: 'ShoppingCart' 
    },
    listProperties:['name', 'displayName', 'description']
  },
};

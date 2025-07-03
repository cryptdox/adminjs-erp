import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const SaleOrderResource = {
  resource: {
    model: getModelByName('SaleOrder'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Order',
      icon: 'ShoppingCart' 
    },
  },
};

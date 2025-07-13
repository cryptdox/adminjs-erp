import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const StockExchangeResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('StockExchange'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Inventory',
      icon: 'Archive' 
    },
    listProperties:['productVariant', 'warehouse', 'lot', 'batch', 'quantity']
  },
};

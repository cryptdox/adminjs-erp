import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const StockResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('Stock'),
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

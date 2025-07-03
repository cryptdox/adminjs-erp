import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const StockResource = {
  resource: {
    model: getModelByName('Stock'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Inventory',
      icon: 'Archive' 
    },
  },
};

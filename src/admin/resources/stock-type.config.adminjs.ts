import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const StockTypeResource = {
  resource: {
    model: getModelByName('StockType'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Inventory',
      icon: 'Archive' 
    },
  },
};

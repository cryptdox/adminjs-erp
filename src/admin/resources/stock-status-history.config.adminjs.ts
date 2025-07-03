import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const StockStatusHistoryResource = {
  resource: {
    model: getModelByName('StockStatusHistory'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Inventory',
      icon: 'Archive' 
    },
  },
};

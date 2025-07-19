import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const stockExchangeStatusResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('StockExchangeStatus'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Inventory',
      icon: 'Archive' 
    },
    listProperties: ['name', 'displayName']
  },
};

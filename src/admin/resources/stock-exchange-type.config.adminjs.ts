import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const StockExchangeTypeResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('StockExchangeType'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Inventory',
      icon: 'Archive' 
    },
    listProperties: ['name', 'code', 'description']
  },
};

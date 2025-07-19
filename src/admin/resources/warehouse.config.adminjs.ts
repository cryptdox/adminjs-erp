import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const WarehouseResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('Warehouse'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Inventory',
      icon: 'Archive' 
    },
    listProperties:['name', 'location', 'contact', 'capacity']
  },
};

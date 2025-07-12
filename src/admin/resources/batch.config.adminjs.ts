import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const BatchResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('Batch'),
    client: prisma,
  },
  options: {
    navigation: {
      name: 'Inventory',
      icon: 'Archive',
    },
    listProperties: ['batchNumber', 'manufactureDate', 'expiryDate'],
    properties: {
      batchNumber: {
        isTitle: true,
      },
    },
  },
};

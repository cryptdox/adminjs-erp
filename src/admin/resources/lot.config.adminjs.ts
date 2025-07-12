import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const LotResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('Lot'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Inventory',
      icon: 'Archive' 
    },
    listProperties: ['lotNumber'],
    properties: {
      lotNumber: {
        isTitle: true,
      },
    },
  },
};

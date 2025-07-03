import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const LotResource = {
  resource: {
    model: getModelByName('Lot'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Inventory',
      icon: 'Archive' 
    },
  },
};

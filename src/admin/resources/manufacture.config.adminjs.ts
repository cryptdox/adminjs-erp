import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const ManufactureResource = {
  resource: {
    model: getModelByName('Manufacture'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Manufacture',
      icon: 'Activity' 
    },
  },
};

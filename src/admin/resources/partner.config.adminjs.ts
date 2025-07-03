import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const PartnerResource = {
  resource: {
    model: getModelByName('Partner'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Finance',
      icon: 'DollarSign' 
    },
  },
};

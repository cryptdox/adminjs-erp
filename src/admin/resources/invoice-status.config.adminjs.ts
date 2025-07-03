import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const InvoiceStatusResource = {
  resource: {
    model: getModelByName('InvoiceStatus'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Finance',
      icon: 'DollarSign' 
    },
  },
};

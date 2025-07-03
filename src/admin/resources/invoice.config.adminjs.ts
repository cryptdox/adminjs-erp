import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const InvoiceResource = {
  resource: {
    model: getModelByName('Invoice'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Finance',
      icon: 'DollarSign' 
    },
  },
};

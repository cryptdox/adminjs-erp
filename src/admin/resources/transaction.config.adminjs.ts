import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const TransactionResource = {
  resource: {
    model: getModelByName('Transaction'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Accounts',
      icon: 'Book' 
    },
  },
};

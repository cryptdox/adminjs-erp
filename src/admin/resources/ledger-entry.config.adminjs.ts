import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const LedgerEntryResource = {
  resource: {
    model: getModelByName('LedgerEntry'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Accounts',
      icon: 'Book' 
    },
  },
};

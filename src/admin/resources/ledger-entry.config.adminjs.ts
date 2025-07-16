import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const LedgerEntryResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('LedgerEntry'),
    client: prisma,
  },
  options: {
    navigation: {
      name: 'Accounts',
      icon: 'Book',
    },
    listProperties: ['account', 'type', 'amount'],
    showProperties: ['account', 'type', 'amount'],
    editProperties: ['account', 'type', 'amount'],
  },
};

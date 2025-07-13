import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const TransactionResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('Transaction'),
    client: prisma,
  },
  options: {
    navigation: {
      name: 'Accounts',
      icon: 'Book',
    },
    listProperties: ['type', 'fromAccount', 'toAccount', 'amount', 'note'],
  },
};

export const InvestmentTransactionResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('Transaction'),
    client: prisma,
  },
  options: {
    id: 'Investment',
    navigation: {
      name: 'Accounts',
      icon: 'Book',
    },
    listProperties: ['fromAccount', 'amount', 'note'],
    editProperties: ['fromAccount', 'amount', 'note'],
    showProperties: ['fromAccount', 'amount', 'note'],
  },
};

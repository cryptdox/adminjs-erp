import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const AccountResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('Account'),
    client: prisma,
  },
  options: {
    navigation: {
      name: 'Accounts',
      icon: 'Book',
    },
    listProperties: ['name', 'type', 'balance'],
  },
};

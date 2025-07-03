import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const AccountResource = {
  resource: {
    model: getModelByName('Account'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Accounts',
      icon: 'Book' 
    },
  },
};

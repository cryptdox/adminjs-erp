import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const AccountTypeResource = {
  resource: {
    model: getModelByName('AccountType'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Accounts',
      icon: 'Book' 
    },
    listProperties: ['name', 'parent', 'description'],
    editProperties: ['name', 'parent', 'description'],
  },
};

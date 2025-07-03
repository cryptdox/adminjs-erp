import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const RoleResource = {
  resource: {
    model: getModelByName('Role'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'HRMS',
      icon: 'Users' 
    },
  },
};

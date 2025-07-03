import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const PermissionResource = {
  resource: {
    model: getModelByName('Permission'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'HRMS',
      icon: 'Users' 
    },
  },
};

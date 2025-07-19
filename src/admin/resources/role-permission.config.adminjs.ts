import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const RolePermissionResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('RolePermission'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'HRMS',
      icon: 'Users' 
    },
    listProperties: ['permission', 'role']
    
  },
};

import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const PermissionResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('Permission'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'HRMS',
      icon: 'Users' 
    },
    listProperties: ['resource', 'action', 'description'],
    titleProperty:'description'
  },
};

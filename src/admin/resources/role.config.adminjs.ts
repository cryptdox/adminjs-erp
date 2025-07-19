import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const RoleResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('Role'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'HRMS',
      icon: 'Users' 
    },
    listProperties: ['name', 'description']
  },
};

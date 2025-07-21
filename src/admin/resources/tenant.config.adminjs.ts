import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const TenantResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('Tenant'),
    client: prisma,
  },
  options: {
    navigation: {
      name: 'HRMS',
      icon: 'Users'
    },
    listProperties: ['name', 'email', 'phone', 'address'],
    showProperties: ['name', 'email', 'phone', 'address'],
    actions:{
      new:{
        isVisible: false
      },
      edit:{
        isVisible: false
      },
      delete:{
        isVisible: false
      }
    }
  },
};

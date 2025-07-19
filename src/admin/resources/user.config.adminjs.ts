import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const UserResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('User'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'HRMS',
      icon: 'Users' 
    },
    listProperties:['email', 'userName', 'firstName', 'lastName', 'emailVerified']
  },
};

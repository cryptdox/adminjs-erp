import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const AuditLogResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('AuditLog'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Configuration',
      icon: 'Settings' 
    },
    listProperties: ['action', 'entity', 'description', 'ipAddress', 'performedBy']
  },
};

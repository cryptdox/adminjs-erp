import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const AuditLogResource = {
  resource: {
    model: getModelByName('AuditLog'),
    client: prisma,
  },
  options: {},
};

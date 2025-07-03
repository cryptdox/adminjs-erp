import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const RolePermissionResource = {
  resource: {
    model: getModelByName('RolePermission'),
    client: prisma,
  },
  options: {},
};

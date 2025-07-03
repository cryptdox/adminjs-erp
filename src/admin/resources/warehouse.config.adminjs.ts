import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const WarehouseResource = {
  resource: {
    model: getModelByName('Warehouse'),
    client: prisma,
  },
  options: {},
};

import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const PurchaseOrderResource = {
  resource: {
    model: getModelByName('PurchaseOrder'),
    client: prisma,
  },
  options: {},
};

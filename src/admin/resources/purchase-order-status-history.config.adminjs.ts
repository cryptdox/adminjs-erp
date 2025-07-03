import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const PurchaseOrderStatusHistoryResource = {
  resource: {
    model: getModelByName('PurchaseOrderStatusHistory'),
    client: prisma,
  },
  options: {},
};

import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const SaleOrderStatusHistoryResource = {
  resource: {
    model: getModelByName('SaleOrderStatusHistory'),
    client: prisma,
  },
  options: {},
};

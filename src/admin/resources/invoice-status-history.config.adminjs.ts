import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const InvoiceStatusHistoryResource = {
  resource: {
    model: getModelByName('InvoiceStatusHistory'),
    client: prisma,
  },
  options: {},
};

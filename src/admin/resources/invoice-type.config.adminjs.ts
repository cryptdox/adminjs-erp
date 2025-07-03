import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const InvoiceTypeResource = {
  resource: {
    model: getModelByName('InvoiceType'),
    client: prisma,
  },
  options: {},
};

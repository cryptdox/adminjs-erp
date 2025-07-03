import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const InvoiceItemResource = {
  resource: {
    model: getModelByName('InvoiceItem'),
    client: prisma,
  },
  options: {},
};

import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const InvoiceResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('Invoice'),
    client: prisma,
  },
  options: {
    navigation: {
      name: 'Finance',
      icon: 'DollarSign',
    },
    listProperties: ['invoiceType', 'invoiceNumber', 'partner', 'totalAmount', 'paidAmount'],
  },
};

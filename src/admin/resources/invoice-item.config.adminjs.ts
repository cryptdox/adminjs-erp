import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const InvoiceItemResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('InvoiceItem'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Finance',
      icon: 'DollarSign' 
    },
    listProperties: ['stockExchange.productVariant', 'unitPrice', 'discount', 'discountType']
  },
};

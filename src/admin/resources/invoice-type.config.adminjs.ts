import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const InvoiceTypeResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('InvoiceType'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Finance',
      icon: 'DollarSign' 
    },
    listProperties: ['name', 'description']
  },
};

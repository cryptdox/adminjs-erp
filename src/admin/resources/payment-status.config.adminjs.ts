import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const PaymentStatusResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('PaymentStatus'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Payment',
      icon: 'Airplay' 
    },
    listProperties: ['code', 'label', 'description', 'color']
  },
};

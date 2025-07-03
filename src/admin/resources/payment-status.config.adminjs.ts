import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const PaymentStatusResource = {
  resource: {
    model: getModelByName('PaymentStatus'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Payment',
      icon: 'Airplay' 
    },
  },
};

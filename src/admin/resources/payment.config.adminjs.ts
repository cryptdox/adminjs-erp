import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const PaymentResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('Payment'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Payment',
      icon: 'Airplay' 
    },
    listProperties: ['relatedType', 'status', 'referenceNo', 'amount', 'currency', 'paymentMethod', 'paidAt'],
    
  },
};

import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const PaymentResource = {
  resource: {
    model: getModelByName('Payment'),
    client: prisma,
  },
  options: {},
};

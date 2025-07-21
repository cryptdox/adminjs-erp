import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const SubscriptionPaymentResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('SubscriptionPayment'),
    client: prisma,
  },
  options: {
    navigation: {
      name: 'HRMS',
      icon: 'Users'
    },
    listProperties: ['subscriptionPaymentFLow', 'subscriptionPaymentStatus', 'amount', 'subscriptionPaymentCoupon'],
    showProperties:['package', 'permission'],
    actions: {
      new: {
        isVisible: false,
      },
      edit: {
        isAccessible: false,
      },
      delete: {
        isAccessible: false,
      },
    },
  },
};

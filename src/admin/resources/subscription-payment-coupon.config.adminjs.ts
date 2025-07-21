import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const SubscriptionPaymentCouponResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('SubscriptionPaymentCoupon'),
    client: prisma,
  },
  options: {
    navigation: {
      name: 'HRMS',
      icon: 'Users'
    },
    listProperties: ['name', 'code', 'amount', 'maxUsage', 'count'],
    showProperties: ['name', 'code', 'amount', 'maxUsage', 'count'],
    editProperties: ['name', 'code', 'amount', 'maxUsage'],
    actions: {
      edit: {
        isAccessible: false,
      },
      delete: {
        isVisible: false,
      },
    },
  },
};

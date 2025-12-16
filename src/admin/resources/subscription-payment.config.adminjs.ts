import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ActionContext, ResourceWithOptions } from 'adminjs';

export const SubscriptionPaymentResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('SubscriptionPayment'),
    client: prisma,
  },
  options: {
    navigation: {
      name: 'HRMS',
      icon: 'Users',
    },
    listProperties: ['subscriptionPaymentFlow', 'subscriptionPaymentStatus', 'amount', 'subscriptionPaymentCoupon'],
    showProperties: ['package', 'permission'],
    actions: {
      list: {
        isVisible: (context: ActionContext) => context.currentAdmin.isSuper,
      },
      show: {
        isVisible: (context: ActionContext) => context.currentAdmin.isSuper,
      },
      new: {
        isVisible: (context: ActionContext) => false,
      },
      edit: {
        isAccessible: false,
      },
      delete: {
        isAccessible: false,
      },
      bulkDelete: {
        isAccessible: false,
      },
    },
  },
};

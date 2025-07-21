import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ActionContext, ResourceWithOptions } from 'adminjs';

export const SubscriptionPaymentCouponResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('SubscriptionPaymentCoupon'),
    client: prisma,
  },
  options: {
    navigation: {
      name: 'HRMS',
      icon: 'Users',
    },
    listProperties: ['name', 'code', 'amount', 'maxUsage', 'count'],
    showProperties: ['name', 'code', 'amount', 'maxUsage', 'count'],
    editProperties: ['name', 'code', 'amount', 'maxUsage'],
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
        isAccessible: (context: ActionContext) => false,
      },
      delete: {
        isAccessible: (context: ActionContext) => false,
      },
      bulkDelete: {
        isAccessible: (context: ActionContext) => false,
      },
    },
  },
};

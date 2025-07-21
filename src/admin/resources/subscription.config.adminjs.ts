import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ActionContext, ResourceWithOptions } from 'adminjs';

export const SubscriptionResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('Subscription'),
    client: prisma,
  },
  options: {
    navigation: {
      name: 'HRMS',
      icon: 'Users',
    },
    listProperties: ['tenant', 'package', 'startDate', 'endDate'],
    showProperties: ['tenant', 'package', 'startDate', 'endDate'],
    actions: {
      list: {
        isVisible: (context: ActionContext) => context.currentAdmin.isSuper,
      },
      show: {
        isVisible: (context: ActionContext) => context.currentAdmin.isSuper,
      },
      new: {
        isVisible: false,
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

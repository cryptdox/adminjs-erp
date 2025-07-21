import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

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
      new: {
        isVisible: false,
      },
      edit: {
        isVisible: false,
      },
      delete: {
        isVisible: false,
      },
    },
  },
};

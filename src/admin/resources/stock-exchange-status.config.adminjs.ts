import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ActionContext, ResourceWithOptions } from 'adminjs';

export const stockExchangeStatusResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('StockExchangeStatus'),
    client: prisma,
  },
  options: {
    navigation: {
      name: 'Inventory',
      icon: 'Archive',
    },
    listProperties: ['name', 'displayName'],
    actions: {
      list: {
        isVisible: (context: ActionContext) => context.currentAdmin.isSuper,
      },
      show: {
        isVisible: (context: ActionContext) => context.currentAdmin.isSuper,
      },
      new: {
        isVisible: (context: ActionContext) => context.currentAdmin.isSuper,
      },
      edit: {
        isVisible: (context: ActionContext) => context.currentAdmin.isSuper,
      },
      delete: {
        isVisible: (context: ActionContext) => context.currentAdmin.isSuper,
      },
      bulkDelete: {
        isVisible: (context: ActionContext) => context.currentAdmin.isSuper,
      },
    },
  },
};

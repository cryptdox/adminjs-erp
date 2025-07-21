import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ActionContext, ResourceWithOptions } from 'adminjs';

export const InvoiceTypeResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('InvoiceType'),
    client: prisma,
  },
  options: {
    navigation: {
      name: 'Finance',
      icon: 'DollarSign',
    },
    listProperties: ['name', 'description'],
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

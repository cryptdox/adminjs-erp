import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ActionContext, ResourceWithOptions } from 'adminjs';

export const ExpenseTypeResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('ExpenseType'),
    client: prisma,
  },
  options: {
    navigation: {
      name: 'Expense',
      icon: 'DivideCircle',
    },
    listProperties: ['name', 'displayName', 'description'],
    filterProperties: ['name', 'displayName', 'description'],
    editProperties: ['name', 'displayName', 'description'],
    showProperties: ['name', 'displayName', 'description'],
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

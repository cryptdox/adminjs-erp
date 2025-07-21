import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ActionContext } from 'adminjs';

export const UnitResource = {
  resource: {
    model: getModelByName('Unit'),
    client: prisma,
  },
  options: {
    navigation: {
      name: 'Inventory',
      icon: 'Archive',
    },
    listProperties: ['name', 'label', 'group', 'isBase', 'minValue', 'maxValue', 'step'],
    filterProperties: ['name', 'label', 'group', 'isBase', 'minValue', 'maxValue', 'step'],
    editProperties: ['name', 'label', 'group', 'isBase', 'minValue', 'maxValue', 'step', 'description'],
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

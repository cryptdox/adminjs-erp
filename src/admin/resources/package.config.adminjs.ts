import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ActionContext, ActionRequest, ResourceWithOptions } from 'adminjs';
import AdminComponents from '../components/admin.components.js';
import { actions } from '../../utils/values.js';

export const PackageResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('Package'),
    client: prisma,
  },
  options: {
    navigation: {
      name: 'HRMS',
      icon: 'Users',
    },
    listProperties: ['name', 'packageType', 'price', 'discountType', 'discount'],
    editProperties: ['name', 'packageType', 'price', 'discountType', 'discount', 'description', 'imageUrl'],
    showProperties: ['name', 'packageType', 'price', 'discountType', 'discount', 'description', 'imageUrl'],
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
        isVisible: false,
      },
      delete: {
        isVisible: false,
      },
      bulkDelete: {
        isVisible: false,
      },
    },
  },
};

import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';
import AdminComponents from '../components/admin.components.js';

export const PurchaseOrderResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('PurchaseOrder'),
    client: prisma,
  },
  options: {
    navigation: {
      name: 'Order',
      icon: 'ShoppingCart',
    },
    actions: {
      new: {
        component: AdminComponents.NewPurchaseOrder,
        hideActionHeader: true,
      },
    },
    properties: {},
  },
};

import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const PartnerResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('Partner'),
    client: prisma,
  },
  options: {
    navigation: {
      name: 'Finance',
      icon: 'DollarSign',
    },
    actions: {
      listSuppliers: {
        actionType: 'resource',
        isVisible: false,
        handler: async (request, response, context) => {
          const suppliers = await prisma.partner.findMany({
            where: { type: 'SUPPLIER', isDeleted: false },
            select: { id: true, name: true },
          });

          return {
            notice: null,
            records: [],
            data: suppliers,
          };
        },
      },
    },
  },
};

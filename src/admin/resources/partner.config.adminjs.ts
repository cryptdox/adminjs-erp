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
    filterProperties: ['type'],
    listProperties: ['type', 'name', 'phone', 'account'],
    editProperties: ['type', 'name', 'email', 'phone', 'address', 'nid'],
    // showProperties: [],
    actions: {
      new: {
        // before:{

        // },
        after: async (response, request, context) => {
          const partnerId = response.record?.params?.id;
          const partnerName = response.record?.params?.name;
          const partnerType = response.record?.params?.type;

          if (!partnerId || !partnerType) return response;

          const typeMap: Record<string, string> = {
            SUPPLIER: 'PAYABLE',
            CUSTOMER: 'RECEIVABLE',
            SHAREHOLDER: 'CAPITAL',
          };
          const accountType = await prisma.accountType.findFirst({
            where: {
              name: typeMap[partnerType],
            },
          });
          const account = await prisma.account.create({
            data: {
              name: `${partnerName} - ${typeMap[partnerType]} - Account`,
              typeId: accountType.id,
            },
          });
          await prisma.partner.update({
            data: {
              accountId: account.id,
            },
            where: {
              id: partnerId,
            },
          });
          return response;
        },
      },
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

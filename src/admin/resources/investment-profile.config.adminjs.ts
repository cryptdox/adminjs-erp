import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ActionContext, ActionRequest, ResourceWithOptions } from 'adminjs';
import { AccountHolderType, InvestmentProfile } from '@prisma/client';
import { accounts, accountTypeData, actions } from '../../utils/values.js';
import AdminComponents from '../components/admin.components.js';

export const InvestmentProfileResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('InvestmentProfile'),
    client: prisma,
  },
  options: {
    navigation: {
      name: 'Finance',
      icon: 'DollarSign',
    },
    listProperties: ['name', 'acceptingInvest', 'createdAt'],
    editProperties: ['name', 'description', 'acceptingInvest'],
    showProperties: ['name', 'description', 'acceptingInvest', 'createdAt'],
    filterProperties: ['name', 'acceptingInvest', 'Tenant'],
    actions: {
      list:{
        isAccessible: (context: ActionContext) => {
          const isSuper = context.currentAdmin.isSuper;
          const tenantId = context.currentAdmin?.tenantId;
          const hasPermission = context.currentAdmin.permission.filter(
            (p) => p.resource === context.resource.id() && p.action === actions[1]
          );
          return !isSuper && hasPermission.length;
        },
        before: async (request: ActionRequest, context: ActionContext): Promise<ActionRequest> => {
          const isSuper = context.currentAdmin.isSuper;
          const tenantId = context.currentAdmin?.tenantId;
          const { query = {} } = request;
          let newQuery = { ...query };
          if (!isSuper && tenantId) newQuery = { ...newQuery, ['filters.Tenant']: tenantId };
          request.query = newQuery;
          return request;
        },
      },
      new: {
        handler: async (request: ActionRequest, response: any, context: ActionContext) => {
          try {
            const tenantId = context.currentAdmin.tenantId ?? '';
            console.log('tenantId: ', tenantId);
            await prisma.$transaction(async (tx) => {
              const investmentProfile = await tx.investmentProfile.create({
                data: { ...request.payload, tenantId } as InvestmentProfile,
              });

              await tx.account.create({
                data: {
                  name: `InvP-${investmentProfile.name} - ${accounts[0].name}`,
                  type: {
                    connect: { name: accountTypeData[0].name },
                  },
                  InvestmentProfile: {
                    connect: { id: investmentProfile.id },
                  },
                  accountHolderType: AccountHolderType.INVESTMENT_PROFILE,
                  Tenant: {
                    connect: { id: tenantId },
                  },
                },
              });
              await tx.account.create({
                data: {
                  name: `InvP-${investmentProfile.name} - ${accounts[1].name}`,
                  type: {
                    connect: { name: accountTypeData[0].name },
                  },
                  InvestmentProfile: {
                    connect: { id: investmentProfile.id },
                  },
                  accountHolderType: AccountHolderType.INVESTMENT_PROFILE,
                  Tenant: {
                    connect: { id: tenantId },
                  },
                },
              });
              await tx.account.create({
                data: {
                  name: `InvP-${investmentProfile.name} - ${accounts[2].name}`,
                  type: {
                    connect: { name: accountTypeData[0].name },
                  },
                  InvestmentProfile: {
                    connect: { id: investmentProfile.id },
                  },
                  accountHolderType: AccountHolderType.INVESTMENT_PROFILE,
                  Tenant: {
                    connect: { id: tenantId },
                  },
                },
              });
              await tx.account.create({
                data: {
                  name: `InvP-${investmentProfile.name} - ${accounts[3].name}`,
                  type: {
                    connect: { name: accountTypeData[0].name },
                  },
                  InvestmentProfile: {
                    connect: { id: investmentProfile.id },
                  },
                  accountHolderType: AccountHolderType.INVESTMENT_PROFILE,
                  Tenant: {
                    connect: { id: tenantId },
                  },
                },
              });
              await tx.account.create({
                data: {
                  name: `InvP-${investmentProfile.name} - ${accounts[4].name}`,
                  type: {
                    connect: { name: accountTypeData[1].name },
                  },
                  InvestmentProfile: {
                    connect: { id: investmentProfile.id },
                  },
                  accountHolderType: AccountHolderType.INVESTMENT_PROFILE,
                  Tenant: {
                    connect: { id: tenantId },
                  },
                },
              });
              await tx.account.create({
                data: {
                  name: `InvP-${investmentProfile.name} - ${accounts[14].name}`,
                  type: {
                    connect: { name: accountTypeData[2].name },
                  },
                  InvestmentProfile: {
                    connect: { id: investmentProfile.id },
                  },
                  accountHolderType: AccountHolderType.INVESTMENT_PROFILE,
                  Tenant: {
                    connect: { id: tenantId },
                  },
                },
              });
            });
            return {
              record: request.payload,
              notice: {
                message: 'New investmentProfile created successfully!',
                type: 'success',
              },
              redirectUrl: context.h.resourceActionUrl({
                resourceId: context.resource._decorated.id(),
                actionName: 'list',
              }),
            };
          } catch (error) {
            console.log('error: ', error);
            return {
              record: request.payload,
              notice: {
                message: 'Something went wrong!',
                type: 'error',
              },
            };
          }
        },
        isAccessible: (context: ActionContext) => {
          const isSuper = context.currentAdmin.isSuper;
          const tenantId = context.currentAdmin?.tenantId;
          const hasPermission = context.currentAdmin.permission.filter(
            (p) => p.resource === context.resource.id() && p.action === actions[0]
          );
          return !isSuper && hasPermission.length;
        },
      },
      edit: {
        isAccessible: (context: ActionContext) => {
          const isSuper = context.currentAdmin.isSuper;
          const tenantId = context.currentAdmin?.tenantId;
          const hasPermission = context.currentAdmin.permission.filter(
            (p) => p.resource === context.resource.id() && p.action === actions[2]
          );
          return !isSuper && hasPermission.length;
        },
      },
      delete: {
        isAccessible: (context: ActionContext) => {
          const isSuper = context.currentAdmin.isSuper;
          const tenantId = context.currentAdmin?.tenantId;
          const hasPermission = context.currentAdmin.permission.filter(
            (p) => p.resource === context.resource.id() && p.action === actions[3]
          );
          return !isSuper && hasPermission.length;
        },
      },
      bulkDelete: {
        isAccessible: (context: ActionContext) => {
          const isSuper = context.currentAdmin.isSuper;
          const tenantId = context.currentAdmin?.tenantId;
          const hasPermission = context.currentAdmin.permission.filter(
            (p) => p.resource === context.resource.id() && p.action === actions[3]
          );
          return !isSuper && hasPermission.length;
        },
      },
      // listSuppliers: {
      //   actionType: 'resource',
      //   isVisible: false,
      //   handler: async (request, response, context) => {
      //     const suppliers = await prisma.investmentProfile.findMany({
      //       where: { type: 'SUPPLIER', isDeleted: false },
      //       select: { id: true, name: true },
      //     });
      //     return {
      //       notice: null,
      //       records: [],
      //       data: suppliers,
      //     };
      //   },
      // },
    },
    properties: {
      Tenant: {
        components: {
          filter: AdminComponents.SelectTenant,
        },
      },
    },
  },
};

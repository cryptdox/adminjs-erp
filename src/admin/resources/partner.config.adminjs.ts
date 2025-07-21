import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ActionContext, ActionRequest, ResourceWithOptions } from 'adminjs';
import AdminComponents from '../components/admin.components.js';
import { actions } from '../../utils/values.js';
import { Partner } from '@prisma/client';
import { accounts, accountTypeData } from '../../utils/values.js';

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
    filterProperties: ['type', 'Tenant'],
    listProperties: ['type', 'name', 'phone', 'account'],
    editProperties: ['type', 'name', 'email', 'phone', 'address', 'nid'],
    actions: {
      list: {
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
        isAccessible: (context: ActionContext) => {
          const isSuper = context.currentAdmin.isSuper;
          const tenantId = context.currentAdmin?.tenantId;
          const hasPermission = context.currentAdmin.permission.filter(
            (p) => p.resource === context.resource.id() && p.action === actions[0]
          );
          return !isSuper && hasPermission.length;
        },
        handler: async (request: ActionRequest, response: any, context: ActionContext) => {
          try {
            const tenantId = context.currentAdmin.tenantId ?? '';
            await prisma.$transaction(async (tx) => {
              const partner = await tx.partner.create({
                data: { ...request.payload, tenantId } as Partner,
              });
              await tx.account.create({
                data: {
                  name: `${partner.name} - ${accounts[0].name}`,
                  type: {
                    connect: { name: accountTypeData[0].name },
                  },
                  Partner: {
                    connect: { id: partner.id },
                  },
                  Tenant: {
                    connect: { id: tenantId },
                  },
                },
              });
              await tx.account.create({
                data: {
                  name: `${partner.name} - ${accounts[1].name}`,
                  type: {
                    connect: { name: accountTypeData[0].name },
                  },
                  Partner: {
                    connect: { id: partner.id },
                  },
                  Tenant: {
                    connect: { id: tenantId },
                  },
                },
              });
              await tx.account.create({
                data: {
                  name: `${partner.name} - ${accounts[2].name}`,
                  type: {
                    connect: { name: accountTypeData[0].name },
                  },
                  Partner: {
                    connect: { id: partner.id },
                  },
                  Tenant: {
                    connect: { id: tenantId },
                  },
                },
              });
              await tx.account.create({
                data: {
                  name: `${partner.name} - ${accounts[3].name}`,
                  type: {
                    connect: { name: accountTypeData[0].name },
                  },
                  Partner: {
                    connect: { id: partner.id },
                  },
                  Tenant: {
                    connect: { id: tenantId },
                  },
                },
              });
              await tx.account.create({
                data: {
                  name: `${partner.name} - ${accounts[4].name}`,
                  type: {
                    connect: { name: accountTypeData[1].name },
                  },
                  Partner: {
                    connect: { id: partner.id },
                  },
                  Tenant: {
                    connect: { id: tenantId },
                  },
                },
              });
            });
            return {
              record: request.payload,
              notice: {
                message: 'New partner added successfully!',
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
    properties: {
      Tenant: {
        components: {
          filter: AdminComponents.SelectTenant,
        },
      },
    },
  },
};

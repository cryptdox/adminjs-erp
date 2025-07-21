import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import AdminJS, { ActionContext, ActionRequest, ResourceWithOptions, ValidationError } from 'adminjs';
import AdminComponents from '../components/admin.components.js';
import { actions } from '../../utils/values.js';

export const InvestmentProfileInvestorResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('InvestmentProfileInvestor'),
    client: prisma,
  },
  options: {
    navigation: {
      name: 'Finance',
      icon: 'DollarSign',
    },
    listProperties: ['investmentProfile', 'investor', 'percent'],
    filterProperties: ['investmentProfile', 'investor', 'Tenant'],
    editProperties: ['investmentProfile', 'investor', 'percent'],
    showProperties: ['investmentProfile', 'investor', 'percent', 'createdAt'],
    actions: {
      new: {
        before: async (request, context) => {
          const isExists = await prisma.investmentProfileInvestor.findFirst({
            where: {
              investmentProfileId: request.payload.investmentProfile,
              investorId: request.payload.investor,
            },
          });

          if (isExists) {
            throw new ValidationError(
              {},
              {
                message: 'This investment already exists!',
              }
            );
          }
          return request;
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
    },
    properties: {
      Tenant: {
        components: {
          filter: AdminComponents.SelectTenant,
        },
      },
      investor: {
        components: {
          edit: AdminComponents.SelectShareHolder,
          filter: AdminComponents.SelectShareHolder,
        },
      },
      investmentProfile: {
        components: {
          edit: AdminComponents.SelectInvestmentProfile,
          filter: AdminComponents.SelectInvestmentProfile,
        },
      },
    },
  },
};

import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ActionContext, ActionRequest, ResourceWithOptions } from 'adminjs';
import AdminComponents from '../components/admin.components.js';
import { actions } from '../../utils/values.js';

export const ManufactureInputResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('ManufactureInput'),
    client: prisma,
  },
  options: {
    navigation: {
      name: 'Manufacture',
      icon: 'Activity',
    },
    filterProperties: ['Tenant'],
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

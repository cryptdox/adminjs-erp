import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ActionContext, ActionRequest, ResourceWithOptions } from 'adminjs';
import AdminComponents from '../components/admin.components.js';
import { orderSchema } from '../validations.js';
import * as Yup from 'yup';

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
        before: async (request: ActionRequest) => {
          return request;
        },
        handler: async (request: ActionRequest, response: any, context: ActionContext) => {
          try {
            const validatedData = await orderSchema.validate(request.payload, { abortEarly: false });

            return {
              record: validatedData,
              notice: {
                message: 'New purchase order done!',
                type: 'success',
              },
              redirectUrl: context.h.resourceActionUrl({
                resourceId: context.resource._decorated.id(),
                actionName: 'list',
              }),
            };
          } catch (error) {
            if (error instanceof Yup.ValidationError) {
              const errorMap = error.inner.reduce(
                (acc, curr) => {
                  if (curr.path) acc[curr.path] = curr.message;
                  return acc;
                },
                {} as Record<string, string>
              );

              return {
                record: request.payload,
                notice: {
                  message: 'Validation failed',
                  type: 'error',
                },
                meta: {
                  errors: errorMap,
                },
              };
            }

            return {
              record: request.payload,
              notice: {
                message: 'Internal server error',
                type: 'error',
              },
            };
          }
        },
        after: (response: any, request: ActionRequest, context: ActionContext) => {
          return response;
        },
      },
    },
    properties: {},
  },
};

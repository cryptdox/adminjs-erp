import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ActionContext, ActionRequest, ResourceWithOptions } from 'adminjs';
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
        before: async (request: ActionRequest) => {
          console.log("before request.payload: ", request.payload)
          // if (request.payload.password) {
          //   request.payload = {
          //     ...request.payload,
          //     encryptedPassword: await bcrypt.hash(request.payload.password, 10),
          //     password: undefined,
          //   };
          // }
          return request;
        },
        handler: async (request: ActionRequest, response: any, context: ActionContext) => {

          console.log("handler request.payload: ", request.payload)
          console.log("handler response: ", response)
          console.log("handler context: ", context)
          const user = context.record;
          console.log("user: ", user)
          // const Cars = context._admin.findResource('Car');
          // const userCar = Car.findOne(context.record.param('carId'))
          return {
            record: {ab: "abir", ...request.payload},
            // redirectUrl: 
          };
        },
        after: (response: any, request: ActionRequest, context: ActionContext) => {
          console.log("response: ", response)
          return response;
        },
      },
    },
    properties: {},
  },
};

import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import AdminJS, { ActionContext, ActionRequest, ResourceWithOptions, ValidationError } from 'adminjs';
import AdminComponents from '../components/admin.components.js';

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
    filterProperties: ['investmentProfile', 'investor'],
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
      },
    },
    properties: {
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

import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ActionContext, ActionRequest, ResourceWithOptions } from 'adminjs';
import { AccountHolderType, InvestmentProfile } from '@prisma/client';
import { accounts, accountTypeData } from '../../utils/values.js';

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
    actions: {
      new: {
        handler: async (request: ActionRequest, response: any, context: ActionContext) => {
          try {
            await prisma.$transaction(async (tx) => {
              const investmentProfile = await tx.investmentProfile.create({
                data: request.payload as InvestmentProfile,
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
  },
};

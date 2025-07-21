import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ActionContext, ActionRequest, ResourceWithOptions } from 'adminjs';
import AdminComponents from '../components/admin.components.js';
import { LedgerEntryType, TransactionType } from '@prisma/client';
import { accounts } from '../../utils/values.js';

export const TransactionResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('Transaction'),
    client: prisma,
  },
  options: {
    navigation: {
      name: 'Accounts',
      icon: 'Book',
    },
    listProperties: ['type', 'fromAccount', 'toAccount', 'amount', 'note'],
  },
};

export const InvestmentTransactionResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('Transaction'),
    client: prisma,
  },
  options: {
    id: 'Investment',
    navigation: {
      name: 'Accounts',
      icon: 'Book',
    },
    listProperties: ['fromAccount', 'amount', 'note'],
    editProperties: ['fromAccount', 'toAccount', 'amount', 'note'],
    // editProperties: ['fromAccount', 'amount', 'note', 'from', 'to'],
    showProperties: ['fromAccount', 'amount', 'note'],
    actions: {
      list: {
        before: async (request, context) => {
          if (!request.query?.filters) request.query = { ...request.query, filters: {} };
          request.query.filters = {
            ...request.query.filters,
            type: TransactionType.INVESTMENT,
          };
          return request;
        },
      },
      new: {
        handler: async (request: ActionRequest, response: any, context: ActionContext) => {
          try {
            await prisma.$transaction(async (tx) => {
              const investmentProfileAssetAccount = await tx.account.findFirst({
                where: {
                  name: {
                    contains: 'Cash',
                    mode: 'insensitive',
                  },
                  investmentProfileId: request.payload.toAccount
                },
              });

              const investmentProfileEquityAccount = await tx.account.findFirst({
                where: {
                  name: {
                    contains: accounts[14].name,
                    mode: 'insensitive',
                  },
                  investmentProfileId: request.payload.toAccount
                },
              });

              const shareHolderAssetAccount = await tx.account.findFirst({
                where: {
                  partnerId: request.payload.fromAccount,
                  name: {
                    contains: 'Cash',
                    mode: 'insensitive',
                  },
                },
              });

              const shareHolderReceivableAccount = await tx.account.findFirst({
                where: {
                  partnerId: request.payload.fromAccount,
                  name: {
                    contains: accounts[3].name,
                    mode: 'insensitive',
                  },
                },
              });

              const shareHolderTransaction = await tx.transaction.create({
                data: {
                  amount: request.payload.amount,
                  fromAccount: { connect: { id: shareHolderAssetAccount.id } },
                  toAccount: { connect: { id: shareHolderReceivableAccount.id } },
                  type: TransactionType.INVESTMENT,
                },
              });

              await tx.ledgerEntry.create({
                data: {
                  transaction: { connect: { id: shareHolderTransaction.id } },
                  amount: request.payload.amount,
                  account: { connect: { id: shareHolderReceivableAccount.id } },
                  type: LedgerEntryType.DEBIT,
                },
              });

              await tx.ledgerEntry.create({
                data: {
                  transaction: { connect: { id: shareHolderTransaction.id } },
                  amount: request.payload.amount,
                  account: { connect: { id: shareHolderAssetAccount.id } },
                  type: LedgerEntryType.CREDIT,
                },
              });

              const companyTransaction = await tx.transaction.create({
                data: {
                  amount: request.payload.amount,
                  fromAccount: { connect: { id: investmentProfileEquityAccount.id } },
                  toAccount: { connect: { id: investmentProfileAssetAccount.id } },
                  type: TransactionType.RECEIVE_INVESTMENT,
                  firstTransaction: { connect: { id: shareHolderTransaction.id } },
                },
              });

              await tx.ledgerEntry.create({
                data: {
                  transaction: { connect: { id: companyTransaction.id } },
                  amount: request.payload.amount,
                  account: { connect: { id: investmentProfileAssetAccount.id } },
                  type: LedgerEntryType.DEBIT,
                },
              });

              await tx.ledgerEntry.create({
                data: {
                  transaction: { connect: { id: companyTransaction.id } },
                  amount: request.payload.amount,
                  account: { connect: { id: investmentProfileEquityAccount.id } },
                  type: LedgerEntryType.CREDIT,
                },
              });
            });
            return {
              record: request.payload,
              notice: {
                message: 'Investment successfully done!',
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
    },
    properties: {
      fromAccount: {
        components: {
          edit: AdminComponents.SelectShareHolder,
        },
      },
      toAccount: {
        components: {
          edit: AdminComponents.SelectInvestmentProfile,
        },
      },
      // from: {
      //   availableValues: [
      //     { label: 'Cash', value: 'Cash' },
      //     { label: 'Bank', value: 'Bank' },
      //   ],
      // },
      // to: {
      //   availableValues: [
      //     { label: 'Cash', value: 'Cash' },
      //     { label: 'Bank', value: 'Bank' },
      //   ],
      // },
    },
  },
};

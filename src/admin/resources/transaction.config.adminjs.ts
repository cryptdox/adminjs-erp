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
    editProperties: ['fromAccount', 'amount', 'note', 'from', 'to'],
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
              const orgAssetAccount = await tx.account.findFirst({
                where: {
                  name: {
                    contains: request.payload.to ?? 'Cash',
                    mode: 'insensitive',
                  },
                  isOrganizationAccount: accounts[0].isOrganizationAccount,
                },
              });

              const orgEquityAccount = await tx.account.findFirst({
                where: {
                  name: accounts[14].name,
                  isOrganizationAccount: accounts[0].isOrganizationAccount,
                },
              });

              const shareHolderAssetAccount = await tx.account.findFirst({
                where: {
                  partnerId: request.payload.fromAccountId,
                  name: {
                    contains: request.payload.from ?? 'Cash',
                    mode: 'insensitive',
                  },
                },
              });

              const shareHolderReceivableAccount = await tx.account.findFirst({
                where: {
                  partnerId: request.payload.fromAccountId,
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
                  fromAccount: { connect: { id: orgEquityAccount.id } },
                  toAccount: { connect: { id: orgAssetAccount.id } },
                  type: TransactionType.RECEIVE_INVESTMENT,
                  firstTransaction: { connect: { id: shareHolderTransaction.id } },
                },
              });

              await tx.ledgerEntry.create({
                data: {
                  transaction: { connect: { id: companyTransaction.id } },
                  amount: request.payload.amount,
                  account: { connect: { id: orgAssetAccount.id } },
                  type: LedgerEntryType.DEBIT,
                },
              });

              await tx.ledgerEntry.create({
                data: {
                  transaction: { connect: { id: companyTransaction.id } },
                  amount: request.payload.amount,
                  account: { connect: { id: orgEquityAccount.id } },
                  type: LedgerEntryType.DEBIT,
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
      from: {
        isVisible: {
          list: false,
          filter: false,
          show: true,
          edit: true,
        },
        availableValues: [
          { label: 'Cash', value: 'Cash' },
          { label: 'Bank', value: 'Bank' },
        ],
      },
      to: {
        isVisible: {
          list: false,
          filter: false,
          show: true,
          edit: true,
        },
        availableValues: [
          { label: 'Cash', value: 'Cash' },
          { label: 'Bank', value: 'Bank' },
        ],
      },
    },
  },
};

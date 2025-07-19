import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ActionContext, ActionRequest, ResourceWithOptions } from 'adminjs';
import AdminComponents from '../components/admin.components.js';
import { saleOrderSchema } from '../validations.js';
import * as Yup from 'yup';
import { accounts, expenseStatus, invoiceType, stockExchangeStatus } from '../../utils/values.js';
import { LedgerEntryType, TransactionType } from '@prisma/client';

export const SaleOrderResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('SaleOrder'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Order',
      icon: 'ShoppingCart' 
    },
    listProperties: ['orderNumber', 'partner', 'orderDate'],
    actions: {
      new: {
        component: AdminComponents.NewSaleOrder,
        hideActionHeader: true,
        before: async (request: ActionRequest) => {
          return request;
        },
        handler: async (request: ActionRequest, response: any, context: ActionContext) => {
          try {
            const validatedData = await saleOrderSchema.validate(request.payload, { abortEarly: false });
            const userId = context?.currentAdmin?.user?.id;
            const now = new Date();
            const datePart = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
            const timePart = now.toTimeString().slice(0, 8).replace(/:/g, ''); // HHMMSS
            const dateTimePart = `${datePart}${timePart}`;
            const randomPart = () => Math.floor(1000 + Math.random() * 9000); // 4-digit random

            // TO DO DB OPERATION
            const payload = request.payload;

            console.log('payload: ', payload);

            const processStockItems = () => {
              const stockItems = payload.stockItems;
              let totalPaid = 0;
              let totalStockPrice = 0;

              const processedItems = stockItems.map((item) => {
                const { unitPrice, quantity, discount, discountType, paid } = item;

                const totalPrice = unitPrice * quantity;

                let totalDiscount = 0;
                if (discountType?.value === 'percent') {
                  totalDiscount = (totalPrice * discount) / 100;
                } else if (discountType?.value === 'amount') {
                  totalDiscount = discount;
                }

                const afterDiscountPrice = totalPrice - totalDiscount;

                totalPaid += paid;
                totalStockPrice += afterDiscountPrice;

                return {
                  ...item,
                  totalPrice,
                  totalDiscount,
                  afterDiscountPrice,
                };
              });

              let totalGlobalDiscount = 0;
              if (payload?.globalDiscountType?.value === 'percent') {
                totalGlobalDiscount = (totalStockPrice * payload.globalDiscount) / 100;
              } else if (payload?.globalDiscountType?.value === 'amount') {
                totalGlobalDiscount = payload.globalDiscount;
              }
              totalStockPrice = totalStockPrice - totalGlobalDiscount;

              return {
                stockItems: processedItems,
                totalPaid,
                totalStockPrice,
              };
            };

            await prisma.$transaction(async (tx) => {
              // 0. Get Supplier Details
              const supplierCashAccount = await tx.account.findFirst({
                where: {
                  partnerId: payload.selectedSupplier?.value,
                  name: {
                    contains: accounts[0].name,
                    mode: 'insensitive',
                  },
                },
              });

              const supplierInventoryAccount = await tx.account.findFirst({
                where: {
                  partnerId: payload.selectedSupplier?.value,
                  name: {
                    contains: accounts[2].name,
                    mode: 'insensitive',
                  },
                },
              });

              const supplierReceivableAccount = await tx.account.findFirst({
                where: {
                  partnerId: payload.selectedSupplier?.value,
                  name: {
                    contains: accounts[3].name,
                    mode: 'insensitive',
                  },
                },
              });

              const orgCashAccount = await tx.account.findFirst({
                where: {
                  name: {
                    contains: accounts[0].name,
                    mode: 'insensitive',
                  },
                  isOrganizationAccount: accounts[0].isOrganizationAccount,
                },
              });

              const orgInventoryAccount = await tx.account.findFirst({
                where: {
                  name: {
                    contains: accounts[2].name,
                    mode: 'insensitive',
                  },
                  isOrganizationAccount: accounts[0].isOrganizationAccount,
                },
              });

              const orgPayableAccount = await tx.account.findFirst({
                where: {
                  name: {
                    contains: accounts[4].name,
                    mode: 'insensitive',
                  },
                  isOrganizationAccount: accounts[4].isOrganizationAccount,
                },
              });

              // 1. Create PurchaseOrder
              const purchaseOrder = await tx.purchaseOrder.create({
                data: {
                  orderNumber: `PO-${dateTimePart}`,
                  orderDate: now,
                  note: payload.note,
                  partner: {
                    connect: { id: payload.selectedSupplier?.value ?? '' },
                  },
                },
              });

              // 2. Create Invoice linked to PurchaseOrder
              const invoice = await tx.invoice.create({
                data: {
                  invoiceNumber: `INV-${dateTimePart}`,
                  invoiceDate: now,
                  totalAmount: payload.grandTotal,
                  paidAmount: payload.totalPaidAmount,
                  note: payload.note,
                  discountType: payload.globalDiscountType.value == 'percent' ? 'PERCENT' : 'AMOUNT',
                  discount: payload.globalDiscount,
                  PurchaseOrder: {
                    connect: { id: purchaseOrder.id ?? '' },
                  },
                  invoiceType: {
                    connect: { name: invoiceType[1].name },
                  },
                  partner: {
                    connect: { id: payload.selectedSupplier?.value },
                  },
                  CreatedBy: {
                    connect: { id: userId },
                  },
                },
              });

              const companyTransaction = await tx.transaction.create({
                data: {
                  amount: processStockItems().totalStockPrice,
                  fromAccount: { connect: { id: orgInventoryAccount.id } },
                  toAccount: { connect: { id: orgPayableAccount.id } },
                  type: TransactionType.SUPPLIER_PAYMENT,
                },
              });

              await tx.ledgerEntry.create({
                data: {
                  transaction: { connect: { id: companyTransaction.id } },
                  amount: processStockItems().totalStockPrice,
                  account: { connect: { id: orgInventoryAccount.id } },
                  type: LedgerEntryType.DEBIT,
                },
              });

              await tx.ledgerEntry.create({
                data: {
                  transaction: { connect: { id: companyTransaction.id } },
                  amount: processStockItems().totalStockPrice,
                  account: { connect: { id: orgPayableAccount.id } },
                  type: LedgerEntryType.CREDIT,
                },
              });

              const supplierTransaction = await tx.transaction.create({
                data: {
                  amount: processStockItems().totalStockPrice,
                  fromAccount: { connect: { id: supplierReceivableAccount.id } },
                  toAccount: { connect: { id: supplierInventoryAccount.id } },
                  type: TransactionType.SUPPLIER_PAYMENT,
                },
              });

              await tx.ledgerEntry.create({
                data: {
                  transaction: { connect: { id: supplierTransaction.id } },
                  amount: processStockItems().totalStockPrice,
                  account: { connect: { id: supplierReceivableAccount.id } },
                  type: LedgerEntryType.DEBIT,
                },
              });

              await tx.ledgerEntry.create({
                data: {
                  transaction: { connect: { id: supplierTransaction.id } },
                  amount: processStockItems().totalStockPrice,
                  account: { connect: { id: supplierInventoryAccount.id } },
                  type: LedgerEntryType.CREDIT,
                },
              });

              if (processStockItems().totalPaid > 0) {
                const companyPaidTransaction = await tx.transaction.create({
                  data: {
                    amount: processStockItems().totalPaid,
                    fromAccount: { connect: { id: orgCashAccount.id } },
                    toAccount: { connect: { id: orgPayableAccount.id } },
                    type: TransactionType.SUPPLIER_PAYMENT,
                  },
                });

                await tx.ledgerEntry.create({
                  data: {
                    transaction: { connect: { id: companyPaidTransaction.id } },
                    amount: processStockItems().totalPaid,
                    account: { connect: { id: orgPayableAccount.id } },
                    type: LedgerEntryType.DEBIT,
                  },
                });

                await tx.ledgerEntry.create({
                  data: {
                    transaction: { connect: { id: companyPaidTransaction.id } },
                    amount: processStockItems().totalPaid,
                    account: { connect: { id: orgCashAccount.id } },
                    type: LedgerEntryType.CREDIT,
                  },
                });

                const supplierReceivedTransaction = await tx.transaction.create({
                  data: {
                    amount: processStockItems().totalPaid,
                    fromAccount: { connect: { id: supplierReceivableAccount.id } },
                    toAccount: { connect: { id: supplierCashAccount.id } },
                    type: TransactionType.SUPPLIER_PAYMENT,
                  },
                });

                await tx.ledgerEntry.create({
                  data: {
                    transaction: { connect: { id: supplierReceivedTransaction.id } },
                    amount: processStockItems().totalPaid,
                    account: { connect: { id: supplierCashAccount.id } },
                    type: LedgerEntryType.DEBIT,
                  },
                });

                await tx.ledgerEntry.create({
                  data: {
                    transaction: { connect: { id: supplierReceivedTransaction.id } },
                    amount: processStockItems().totalPaid,
                    account: { connect: { id: supplierReceivableAccount.id } },
                    type: LedgerEntryType.CREDIT,
                  },
                });
              }

              const lot = await tx.lot.create({
                data: {
                  lotNumber: `LOT-${dateTimePart}`,
                },
              });

              for (const item of payload.stockItems) {
                const batch = await tx.batch.create({
                  data: {
                    batchNumber: `BATCH-${dateTimePart}-${randomPart()}`,
                    manufactureDate: item.manufactureDate ? new Date(item.manufactureDate) : undefined,
                    expiryDate: item.expiryDate ? new Date(item.expiryDate) : undefined,
                  },
                });

                const stockExchange = await tx.stockExchange.create({
                  data: {
                    productVariant: {
                      connect: { id: item.variant.value },
                    },
                    warehouse: {
                      connect: { id: item.warehouse.value },
                    },
                    batch: {
                      connect: { id: batch.id },
                    },
                    lot: {
                      connect: { id: lot.id },
                    },
                    CreatedBy: {
                      connect: { id: userId },
                    },
                    quantity: item.quantity,
                    note: `Purchase order: ${purchaseOrder.orderNumber}`,
                    StockExchangeStatus: {
                      connect: { name: stockExchangeStatus[5].name ?? '' },
                    },
                  },
                });

                const invoiceItem = await tx.invoiceItem.create({
                  data: {
                    invoiceId: invoice.id,
                    stockId: stockExchange.id,
                    unitPrice: item.unitPrice,
                    discountType: item.discountType.value == 'percent' ? 'PERCENT' : 'AMOUNT',
                    discount: item.discount,
                  },
                });

                item.receivedQuantity > 0 &&
                  (await tx.stockExchange.create({
                    data: {
                      productVariant: {
                        connect: { id: item.variant.value },
                      },
                      warehouse: {
                        connect: { id: item.warehouse.value },
                      },
                      batch: {
                        connect: { id: batch.id },
                      },
                      lot: {
                        connect: { id: lot.id },
                      },
                      CreatedBy: {
                        connect: { id: userId },
                      },
                      quantity: item.receivedQuantity,
                      note: `Purchase order: ${purchaseOrder.orderNumber}`,
                      StockExchangeStatus: {
                        connect: { name: stockExchangeStatus[0].name ?? '' },
                      },
                    },
                  }));

                if (item.expenses?.length) {
                  for (const e of item.expenses) {
                    await tx.expense.create({
                      data: {
                        orderNumber: purchaseOrder.orderNumber,
                        partner: { connect: { id: e.partner.value ?? '' } },
                        expenseType: { connect: { id: e.expenseType.value ?? '' } },
                        orderDate: now,
                        note: e.note,
                        InvoiceItem: { connect: { id: invoiceItem.id } },
                        ExpenseStatus: { connect: { name: expenseStatus[0].name ?? '' } },
                      },
                    });

                    const companyTransaction = await tx.transaction.create({
                      data: {
                        amount: e.totalAmount,
                        fromAccount: { connect: { id: orgCashAccount.id } },
                        toAccount: { connect: { id: orgPayableAccount.id } },
                        type: TransactionType.EXPENSE,
                        // firstTransaction: { connect: { id: shareHolderTransaction.id } },
                      },
                    });

                    await tx.ledgerEntry.create({
                      data: {
                        transaction: { connect: { id: companyTransaction.id } },
                        amount: e.totalAmount,
                        account: { connect: { id: orgCashAccount.id } },
                        type: LedgerEntryType.DEBIT,
                      },
                    });

                    await tx.ledgerEntry.create({
                      data: {
                        transaction: { connect: { id: companyTransaction.id } },
                        amount: e.totalAmount,
                        account: { connect: { id: orgPayableAccount.id } },
                        type: LedgerEntryType.CREDIT,
                      },
                    });

                    const expThrough = await tx.account.findFirst({
                      where: {
                        partnerId: e.partner.value,
                        name: {
                          contains: accounts[3].name,
                          mode: 'insensitive',
                        },
                      },
                    });

                    const expOn = await tx.account.findFirst({
                      where: {
                        partnerId: e.partner.value,
                        name: {
                          contains: accounts[2].name,
                          mode: 'insensitive',
                        },
                      },
                    });

                    const expenseOnTransaction = await tx.transaction.create({
                      data: {
                        amount: e.totalAmount,
                        fromAccount: { connect: { id: expOn.id } },
                        toAccount: { connect: { id: expThrough.id } },
                        type: TransactionType.EXPENSE,
                        firstTransaction: { connect: { id: companyTransaction.id } },
                      },
                    });

                    await tx.ledgerEntry.create({
                      data: {
                        transaction: { connect: { id: expenseOnTransaction.id } },
                        amount: e.totalAmount,
                        account: { connect: { id: expThrough.id } },
                        type: LedgerEntryType.DEBIT,
                      },
                    });

                    await tx.ledgerEntry.create({
                      data: {
                        transaction: { connect: { id: expenseOnTransaction.id } },
                        amount: e.totalAmount,
                        account: { connect: { id: expOn.id } },
                        type: LedgerEntryType.CREDIT,
                      },
                    });

                    if (e.paidAmount) {
                      await tx.expense.create({
                        data: {
                          orderNumber: purchaseOrder.orderNumber,
                          partner: { connect: { id: e.partner.value } },
                          expenseType: { connect: { id: e.expenseType.value } },
                          orderDate: now,
                          note: e.note,
                          InvoiceItem: { connect: { id: invoiceItem.id } },
                          ExpenseStatus: {
                            connect: {
                              name: e.paidAmount == e.totalAmount ? expenseStatus[2].name : expenseStatus[1].name,
                            },
                          },
                        },
                      });

                      const companyTransaction = await tx.transaction.create({
                        data: {
                          amount: e.paidAmount,
                          fromAccount: { connect: { id: orgPayableAccount.id } },
                          toAccount: { connect: { id: orgCashAccount.id } },
                          type: TransactionType.EXPENSE,
                          // firstTransaction: { connect: { id: shareHolderTransaction.id } },
                        },
                      });

                      await tx.ledgerEntry.create({
                        data: {
                          transaction: { connect: { id: companyTransaction.id } },
                          amount: e.paidAmount,
                          account: { connect: { id: orgCashAccount.id } },
                          type: LedgerEntryType.DEBIT,
                        },
                      });

                      await tx.ledgerEntry.create({
                        data: {
                          transaction: { connect: { id: companyTransaction.id } },
                          amount: e.paidAmount,
                          account: { connect: { id: orgCashAccount.id } },
                          type: LedgerEntryType.CREDIT,
                        },
                      });

                      const expCash = await tx.account.findFirst({
                        where: {
                          partnerId: e.partner.value,
                          name: {
                            contains: accounts[0].name,
                            mode: 'insensitive',
                          },
                        },
                      });

                      const expenseOnTransaction = await tx.transaction.create({
                        data: {
                          amount: e.totalAmount,
                          fromAccount: { connect: { id: expThrough.id } },
                          toAccount: { connect: { id: expCash.id } },
                          type: TransactionType.EXPENSE,
                          firstTransaction: { connect: { id: companyTransaction.id } },
                        },
                      });

                      await tx.ledgerEntry.create({
                        data: {
                          transaction: { connect: { id: expenseOnTransaction.id } },
                          amount: e.totalAmount,
                          account: { connect: { id: expCash.id } },
                          type: LedgerEntryType.DEBIT,
                        },
                      });

                      await tx.ledgerEntry.create({
                        data: {
                          transaction: { connect: { id: expenseOnTransaction.id } },
                          amount: e.totalAmount,
                          account: { connect: { id: expThrough.id } },
                          type: LedgerEntryType.CREDIT,
                        },
                      });
                    }
                  }
                }
              }
              // 4. Global Expenses
              for (const exp of payload.expenses) {
                await tx.expense.create({
                  data: {
                    orderNumber: purchaseOrder.orderNumber,
                    partner: { connect: { id: exp.partner.value ?? '' } },
                    expenseType: { connect: { id: exp.expenseType.value ?? '' } },
                    orderDate: now,
                    note: exp.note,
                    Invoice: { connect: { id: invoice.id } },
                    ExpenseStatus: {
                      connect: {
                        name: exp.paidAmount == exp.totalAmount ? expenseStatus[2].name : expenseStatus[1].name,
                      },
                    },
                  },
                });

                const companyTransaction = await tx.transaction.create({
                  data: {
                    amount: exp.totalAmount,
                    fromAccount: { connect: { id: orgCashAccount.id } },
                    toAccount: { connect: { id: orgPayableAccount.id } },
                    type: TransactionType.EXPENSE,
                    // firstTransaction: { connect: { id: shareHolderTransaction.id } },
                  },
                });

                await tx.ledgerEntry.create({
                  data: {
                    transaction: { connect: { id: companyTransaction.id } },
                    amount: exp.totalAmount,
                    account: { connect: { id: orgCashAccount.id } },
                    type: LedgerEntryType.DEBIT,
                  },
                });

                await tx.ledgerEntry.create({
                  data: {
                    transaction: { connect: { id: companyTransaction.id } },
                    amount: exp.totalAmount,
                    account: { connect: { id: orgPayableAccount.id } },
                    type: LedgerEntryType.CREDIT,
                  },
                });

                const expThrough = await tx.account.findFirst({
                  where: {
                    partnerId: exp.partner.value,
                    name: {
                      contains: accounts[3].name,
                      mode: 'insensitive',
                    },
                  },
                });

                const expOn = await tx.account.findFirst({
                  where: {
                    partnerId: exp.partner.value,
                    name: {
                      contains: accounts[2].name,
                      mode: 'insensitive',
                    },
                  },
                });

                const expenseOnTransaction = await tx.transaction.create({
                  data: {
                    amount: exp.totalAmount,
                    fromAccount: { connect: { id: expOn.id } },
                    toAccount: { connect: { id: expThrough.id } },
                    type: TransactionType.EXPENSE,
                    firstTransaction: { connect: { id: companyTransaction.id } },
                  },
                });

                await tx.ledgerEntry.create({
                  data: {
                    transaction: { connect: { id: expenseOnTransaction.id } },
                    amount: exp.totalAmount,
                    account: { connect: { id: expThrough.id } },
                    type: LedgerEntryType.DEBIT,
                  },
                });

                await tx.ledgerEntry.create({
                  data: {
                    transaction: { connect: { id: expenseOnTransaction.id } },
                    amount: exp.totalAmount,
                    account: { connect: { id: expOn.id } },
                    type: LedgerEntryType.CREDIT,
                  },
                });

                if (exp.paidAmount) {
                  await tx.expense.create({
                    data: {
                      orderNumber: purchaseOrder.orderNumber,
                      partner: { connect: { id: exp.partner.value } },
                      expenseType: { connect: { id: exp.expenseType.value } },
                      orderDate: now,
                      note: exp.note,
                      Invoice: { connect: { id: invoice.id } },
                      ExpenseStatus: {
                        connect: {
                          name: exp.paidAmount == exp.totalAmount ? expenseStatus[2].name : expenseStatus[1].name,
                        },
                      },
                    },
                  });

                  const companyTransaction = await tx.transaction.create({
                    data: {
                      amount: exp.paidAmount,
                      fromAccount: { connect: { id: orgPayableAccount.id } },
                      toAccount: { connect: { id: orgCashAccount.id } },
                      type: TransactionType.EXPENSE,
                      // firstTransaction: { connect: { id: shareHolderTransaction.id } },
                    },
                  });

                  await tx.ledgerEntry.create({
                    data: {
                      transaction: { connect: { id: companyTransaction.id } },
                      amount: exp.paidAmount,
                      account: { connect: { id: orgCashAccount.id } },
                      type: LedgerEntryType.DEBIT,
                    },
                  });

                  await tx.ledgerEntry.create({
                    data: {
                      transaction: { connect: { id: companyTransaction.id } },
                      amount: exp.paidAmount,
                      account: { connect: { id: orgCashAccount.id } },
                      type: LedgerEntryType.CREDIT,
                    },
                  });

                  const expCash = await tx.account.findFirst({
                    where: {
                      partnerId: exp.partner.value,
                      name: {
                        contains: accounts[0].name,
                        mode: 'insensitive',
                      },
                    },
                  });

                  const expenseOnTransaction = await tx.transaction.create({
                    data: {
                      amount: exp.totalAmount,
                      fromAccount: { connect: { id: expThrough.id } },
                      toAccount: { connect: { id: expCash.id } },
                      type: TransactionType.EXPENSE,
                      firstTransaction: { connect: { id: companyTransaction.id } },
                    },
                  });

                  await tx.ledgerEntry.create({
                    data: {
                      transaction: { connect: { id: expenseOnTransaction.id } },
                      amount: exp.totalAmount,
                      account: { connect: { id: expCash.id } },
                      type: LedgerEntryType.DEBIT,
                    },
                  });

                  await tx.ledgerEntry.create({
                    data: {
                      transaction: { connect: { id: expenseOnTransaction.id } },
                      amount: exp.totalAmount,
                      account: { connect: { id: expThrough.id } },
                      type: LedgerEntryType.CREDIT,
                    },
                  });
                }
              }
            });

            return {
              record: validatedData,
              // record: request.payload,
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
            console.log('error: ', error);
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
  },
};

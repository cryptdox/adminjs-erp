import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ActionContext, ActionRequest, ResourceWithOptions } from 'adminjs';
import AdminComponents from '../components/admin.components.js';
import { orderSchema } from '../validations.js';
import * as Yup from 'yup';
import { expenseStatus, invoiceType, stockExchangeStatus } from '../../utils/values.js';

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
    listProperties: ['orderNumber', 'partner', 'orderDate'],
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
            const userId = context?.currentAdmin?.user?.id;
            const now = new Date();
            const datePart = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
            const timePart = now.toTimeString().slice(0, 8).replace(/:/g, ''); // HHMMSS
            const dateTimePart = `${datePart}${timePart}`;
            const randomPart = () => Math.floor(1000 + Math.random() * 9000); // 4-digit random

            // TO DO DB OPERATION
            const payload = request.payload;

            await prisma.$transaction(async (tx) => {
              // 0. Get Supplier Details
              const supplier = await tx.partner.findUnique({
                where: {
                  id: payload.selectedSupplier?.value,
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
                  account: {
                    connect: { id:  '' },
                    // connect: { id: supplier.accountId ?? '' },
                  },
                  CreatedBy: {
                    connect: { id: userId },
                  },
                },
              });

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
                      connect: { name: stockExchangeStatus[4].name ?? '' },
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

                    e.paidAmount &&
                      (await tx.expense.create({
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
                      }));
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
    properties: {},
  },
};

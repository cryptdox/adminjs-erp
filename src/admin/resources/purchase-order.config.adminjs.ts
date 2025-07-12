import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ActionContext, ActionRequest, ResourceWithOptions } from 'adminjs';
import AdminComponents from '../components/admin.components.js';
import { orderSchema } from '../validations.js';
import * as Yup from 'yup';
import { expenseStatus, invoiceType, stockStatus } from '../../utils/values.js';

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
            // const validatedData = await orderSchema.validate(request.payload, { abortEarly: false });
            const userId = context?.currentAdmin?.user?.id;

            console.log('userId: ', userId);

            // TO DO DB OPERATION
            const payload = request.payload;
            const date = new Date();

            await prisma.$transaction(async (tx) => {
              // 0. Get Supplier Details
              const supplier = await tx.partner.findUnique({
                where: {
                  id: payload.selectedSupplier?.value,
                },
              });

              console.log('supplier', supplier);

              // 1. Create PurchaseOrder
              const purchaseOrder = await tx.purchaseOrder.create({
                data: {
                  orderNumber: payload.orderNumber,
                  orderDate: date,
                  note: payload.note,
                  partner: {
                    connect: { id: payload.selectedSupplier?.value ?? '' },
                  },
                },
              });
              console.log('purchaseOrder', purchaseOrder);

              // 2. Create Invoice linked to PurchaseOrder
              const invoice = await tx.invoice.create({
                data: {
                  invoiceNumber: `INV-${payload.orderNumber}`,
                  invoiceDate: date,
                  totalAmount: payload.grandTotal,
                  paidAmount: payload.totalPaidAmount,
                  note: payload.note,
                  PurchaseOrder: {
                    connect: { id: purchaseOrder.id ?? '' },
                  },
                  invoiceType: {
                    connect: { name: invoiceType[1].name },
                  },
                  account: {
                    connect: { id: supplier.accountId ?? '' },
                  },
                  CreatedBy: {
                    connect: { id: userId },
                  },
                },
              });
              console.log('invoice', invoice);

              const lot = await tx.lot.create({
                data: {
                  lotNumber: `LOT-${date}`,
                },
              });

              console.log('lot', lot);
              for (const item of payload.stockItems) {
                const batch = await tx.batch.create({
                  data: {
                    batchNumber: `BATCH-${date}`,
                    manufactureDate: item.manufactureDate ? new Date(item.manufactureDate) : undefined,
                    expiryDate: item.expiryDate ? new Date(item.expiryDate) : undefined,
                  },
                });

                const stock = await tx.stock.create({
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
                    StockStatus: {
                      connect: { name: stockStatus[4].name ?? '' },
                    },
                  },
                });

                const invoiceItem = await tx.invoiceItem.create({
                  data: {
                    invoiceId: invoice.id,
                    stockId: stock.id,
                    unitPrice: item.unitPrice,
                    discountType: item.discountType.value == 'percent' ? 'PERCENT' : 'AMOUNT',
                    discount: item.discount,
                  },
                });

                item.receivedQuantity > 0 &&
                  (await tx.stock.create({
                    data: {
                      productVariant: {
                        connect: { id: item.variant.value },
                      },
                      warehouse: {
                        connect: { id: item.warehouse.value },
                      },
                      batch: {
                        connect: { id: item.batch.value },
                      },
                      lot: {
                        connect: { id: item.lot.value },
                      },
                      CreatedBy: {
                        connect: { id: userId },
                      },
                      quantity: item.receivedQuantity,
                      note: `Purchase order: ${purchaseOrder.orderNumber}`,
                      StockStatus: {
                        connect: { name: stockStatus[0].name ?? '' },
                      },
                    },
                  }));

                if (item.expenses?.length) {
                  for (const e of item.expenses) {
                    await tx.expense.create({
                      data: {
                        orderNumber: `EXP-ITEM-${item.id}`,
                        partner: { connect: { id: e.partner.value } },
                        expenseType: { connect: { id: e.expenseType.value } },
                        orderDate: date,
                        note: e.note,
                        InvoiceItem: { connect: { id: invoiceItem.id } },
                        ExpenseStatus: { connect: { name: expenseStatus[0].name ?? '' } },
                      },
                    });

                    e.paidAmount &&
                      (await tx.expense.create({
                        data: {
                          orderNumber: `EXP-ITEM-${item.id}`,
                          partner: { connect: { id: e.partner.value } },
                          expenseType: { connect: { id: e.expenseType.value } },
                          orderDate: date,
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
                    orderNumber: `EXP-${purchaseOrder.orderNumber}`,
                    partner: { connect: { id: exp.partner.value } },
                    expenseType: { connect: { id: exp.expenseType.value } },
                    orderDate: date,
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
              // record: validatedData,
              record: request.payload,
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

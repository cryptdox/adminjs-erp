import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateCommonInput } from './dto/create-common.input.js';
import { UpdateCommonInput } from './dto/update-common.input.js';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';
import { expenseStatus, expenseType, invoiceType, paymentStatus, stockExchangeStatus, stockExchangeType } from '../utils/values.js';

@Injectable()
export class CommonService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  create(createCommonInput: CreateCommonInput) {
    return 'This action adds a new common';
  }

  findAll() {
    return `This action returns all common`;
  }

  findOne(id: number) {
    return `This action returns a #${id} common`;
  }

  update(id: number, updateCommonInput: UpdateCommonInput) {
    return `This action updates a #${id} common`;
  }

  remove(id: number) {
    return `This action removes a #${id} common`;
  }

  initDBStatus() {
    // ["RESET", ]
    // let value = 'RESET';
    let value = 'INSERT';
    return value;
  }

  async saltRounds() {
    return 10;
  }

  async bcryptPassword(password: string) {
    const saltRounds = await this.saltRounds();
    return await bcrypt.hash(password, saltRounds);
  }

  async isPasswordMatch(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async resetDB() {
    await this.prisma.$transaction(
      async (tx) => {
        // 1. Delete in safe dependency order
        await tx.saleOrderStatusHistory.deleteMany();
        await tx.purchaseOrderStatusHistory.deleteMany();

        await tx.invoiceItem.deleteMany();
        await tx.transaction.deleteMany();
        await tx.ledgerEntry.deleteMany();
        await tx.invoice.deleteMany();
        await tx.payment.deleteMany();

        await tx.manufactureInput.deleteMany();
        await tx.manufactureOutput.deleteMany();
        await tx.manufacture.deleteMany();
        await tx.stockExchange.deleteMany();

        await tx.variant.deleteMany();
        await tx.product.deleteMany();
        await tx.productCategory.deleteMany();
        await tx.warehouse.deleteMany();
        await tx.lot.deleteMany();
        await tx.batch.deleteMany();
        await tx.stockExchangeStatus.deleteMany();
        await tx.stockExchangeType.deleteMany();

        await tx.purchaseOrder.deleteMany();
        await tx.saleOrder.deleteMany();
        await tx.expense.deleteMany();

        await tx.partner.deleteMany();
        await tx.shareHolderProfitShare.deleteMany();

        await tx.account.deleteMany();
        await tx.accountType.deleteMany();

        await tx.auditLog.deleteMany();

        await tx.settingOption.deleteMany();
        await tx.setting.deleteMany();
        await tx.settingType.deleteMany();

        await tx.invoiceType.deleteMany();
        await tx.orderStatus.deleteMany();
        await tx.expenseType.deleteMany();

        await tx.paymentStatus.deleteMany();
        await tx.relatedType.deleteMany();

        await tx.rolePermission.deleteMany();
        await tx.permission.deleteMany();
        await tx.role.deleteMany();
        await tx.user.deleteMany();

        await tx.unit.deleteMany();

        // 1. Insert roles
        await tx.role.createMany({
          data: [
            { name: 'ADMIN', description: 'System Administrator' },
            { name: 'MANAGER', description: 'Manager Access' },
            { name: 'USER', description: 'Basic User' },
          ],
          skipDuplicates: true,
        });

        // 2. Insert permissions
        // Define your list of all relevant table names as resources
        const resources = [
          'User',
          'Role',
          'Permission',
          'RolePermission',
          'Product',
          'ProductCategory',
          'Variant',
          'Warehouse',
          'Stock',
          'stockExchangeStatus',
          'StockExchangeType',
          'stockExchangeStatusHistory',
          'Lot',
          'Batch',
          'Manufacture',
          'ManufactureInput',
          'ManufactureOutput',
          'AccountType',
          'Account',
          'Transaction',
          'LedgerEntry',
          'Partner',
          'ShareHolderProfitShare',
          'InvoiceType',
          'InvoiceStatus',
          'Invoice',
          'InvoiceItem',
          'InvoiceStatusHistory',
          'OrderStatus',
          'PurchaseOrder',
          'PurchaseOrderStatusHistory',
          'SaleOrder',
          'SaleOrderStatusHistory',
          'ExpenseType',
          'Expense',
          'ExpenseStatus',
          'ExpenseStatusHistory',
          'PaymentStatus',
          'RelatedType',
          'Payment',
          'AuditLog',
          'Setting',
          'SettingType',
          'SettingOption',
        ];

        // Standard actions
        const actions = ['create', 'read', 'update', 'delete'];

        // Generate all combinations
        const permissionsData = [];

        for (const resource of resources) {
          for (const action of actions) {
            permissionsData.push({
              resource,
              action,
              description: `${action.toUpperCase()} permission for ${resource}`,
            });
          }
        }

        // Insert permissions (skip duplicates due to unique constraint)
        await tx.permission.createMany({
          data: permissionsData,
          skipDuplicates: true,
        });

        // Step 1: Get ADMIN role
        const adminRole = await tx.role.findFirst({
          where: { name: 'ADMIN' },
        });

        if (adminRole) {
          // Step 2: Get all permissions
          const allPermissions = await tx.permission.findMany();

          // Step 3: Insert RolePermission for ADMIN
          for (const permission of allPermissions) {
            await tx.rolePermission.upsert({
              where: {
                roleId_permissionId: {
                  roleId: adminRole.id,
                  permissionId: permission.id,
                },
              },
              update: {},
              create: {
                roleId: adminRole.id,
                permissionId: permission.id,
              },
            });
          }
        }

        const managerAllowedActions: Record<string, string[]> = {
          // Full CRUD for operational entries
          Invoice: ['create', 'read', 'update'],
          InvoiceItem: ['create', 'read', 'update'],
          SaleOrder: ['create', 'read', 'update'],
          PurchaseOrder: ['create', 'read', 'update'],
          Expense: ['create', 'read', 'update'],
          Payment: ['create', 'read', 'update'],

          // Read/Update for master data
          Product: ['read', 'update'],
          ProductCategory: ['read'],
          Variant: ['read'],
          Stock: ['read'],
          Warehouse: ['read'],
          Partner: ['read', 'update'],

          // Read-only for config & sensitive tables
          User: ['read'],
          Role: ['read'],
          Permission: ['read'],
          Setting: ['read'],
          Account: ['read'],
          LedgerEntry: ['read'],
          Transaction: ['read'],
          Manufacture: ['read'],
        };

        const managerRole = await tx.role.findFirst({
          where: { name: 'MANAGER' },
        });

        if (managerRole) {
          const allPermissions = await tx.permission.findMany();

          for (const permission of allPermissions) {
            const allowedActions = managerAllowedActions[permission.resource];
            if (allowedActions?.includes(permission.action)) {
              await tx.rolePermission.upsert({
                where: {
                  roleId_permissionId: {
                    roleId: managerRole.id,
                    permissionId: permission.id,
                  },
                },
                update: {},
                create: {
                  roleId: managerRole.id,
                  permissionId: permission.id,
                },
              });
            }
          }
        }

        const userAllowedActions: Record<string, string[]> = {
          // Can view personal-related records
          Invoice: ['read'],
          InvoiceItem: ['read'],
          SaleOrder: ['read', 'create'],
          PurchaseOrder: ['read'],
          Expense: ['read', 'create'],
          Payment: ['read'],
          Partner: ['read', 'update'],

          // Can view products & stockExchange
          Product: ['read'],
          Variant: ['read'],
          Stock: ['read'],
          Warehouse: ['read'],

          // Can view own profile
          User: ['read'],

          // Read-only on basic lookup/config
          Setting: ['read'],
          Account: ['read'],
        };

        const userRole = await tx.role.findFirst({
          where: { name: 'USER' },
        });

        if (userRole) {
          const allPermissions = await tx.permission.findMany();

          for (const permission of allPermissions) {
            const allowedActions = userAllowedActions[permission.resource];
            if (allowedActions?.includes(permission.action)) {
              await tx.rolePermission.upsert({
                where: {
                  roleId_permissionId: {
                    roleId: userRole.id,
                    permissionId: permission.id,
                  },
                },
                update: {},
                create: {
                  roleId: userRole.id,
                  permissionId: permission.id,
                },
              });
            }
          }
        }

        // 5. Create admin user
        const hashedPassword = await this.bcryptPassword('admin');

        if (adminRole) {
          await tx.user.create({
            data: {
              userName: 'admin',
              email: 'admin@example.com',
              password: hashedPassword,
              roleId: adminRole.id,
            },
          });
        }

        // PRODUCT CATEGORY SEED
        await tx.productCategory.createMany({
          data: [
            { name: 'Mobile' },
            { name: 'Accessories', parentId: undefined },
            { name: 'Charger', parentId: undefined },
          ],
        });

        // Fetch categories for foreign key use
        const [mobileCategory] = await tx.productCategory.findMany({
          where: { name: 'Mobile' },
        });

        // UNIT SEED
        await tx.unit.createMany({
          data: [
            { name: 'kg', label: 'Kilogram', group: 'WEIGHT', isBase: true },
            { name: 'g', label: 'Gram', group: 'WEIGHT' },
            { name: 'liter', label: 'Liter', group: 'VOLUME', isBase: true },
            { name: 'ml', label: 'Milliliter', group: 'VOLUME' },
            { name: 'pcs', label: 'Piece', group: 'COUNT', isBase: true },
          ],
        });

        // Fetch units for conversion linking
        const [kg, g, liter, ml] = await Promise.all([
          tx.unit.findUnique({ where: { name: 'kg' } }),
          tx.unit.findUnique({ where: { name: 'g' } }),
          tx.unit.findUnique({ where: { name: 'liter' } }),
          tx.unit.findUnique({ where: { name: 'ml' } }),
        ]);

        // UNIT CONVERSIONS
        await tx.unitConversion.createMany({
          data: [
            { fromUnitId: kg.id, toUnitId: g.id, multiplier: 1000, note: '1 kg = 1000 g' },
            { fromUnitId: g.id, toUnitId: kg.id, multiplier: 0.001, note: '1 g = 0.001 kg' },
            { fromUnitId: liter.id, toUnitId: ml.id, multiplier: 1000, note: '1 L = 1000 mL' },
            { fromUnitId: ml.id, toUnitId: liter.id, multiplier: 0.001, note: '1 mL = 0.001 L' },
          ],
        });

        // PRODUCTS
        const product = await tx.product.create({
          data: {
            name: 'Samsung Galaxy S24',
            sku: 'SGS24-BLK-128',
            categoryId: mobileCategory.id,
          },
        });

        // VARIANT
        await tx.variant.createMany({
          data: [
            {
              productId: product.id,
              attributes: { name: 'BLACK-128', color: 'Black', storage: '128GB' },
            },
            {
              productId: product.id,
              attributes: { name: 'SILVER-256', color: 'Silver', storage: '256GB' },
            },
          ],
        });

        await tx.warehouse.createMany({
          data: [
            { name: 'Main Warehouse', location: 'Dhaka HQ', contact: '017xxxxxxxx' },
            { name: 'Backup Warehouse', location: 'Chattogram' },
          ],
          skipDuplicates: true,
        });

        await tx.stockExchangeType.createMany({
          data: stockExchangeType,
          skipDuplicates: true,
        });

        await tx.stockExchangeStatus.createMany({
          data: stockExchangeStatus,
          skipDuplicates: true,
        });

        // Seed default account types (basic chart of accounts)
        // await tx.accountType.createMany({
        //   data: [
        //     { name: 'ASSET', description: 'Cash, bank, and other assets' },
        //     { name: 'LIABILITY', description: 'Loans, payables, etc.' },
        //     { name: 'EQUITY', description: 'Owner capital and retained earnings' },
        //     { name: 'REVENUE', description: 'Sales income and other revenues' },
        //     { name: 'EXPENSE', description: 'Operating and administrative expenses' },
        //   ],
        //   skipDuplicates: true,
        // });
        // 1. Create parent account types
        const parents = await Promise.all([
          tx.accountType.create({
            data: {
              name: 'ASSET',
              description: 'Represents company-owned resources such as cash, inventory, and property',
            },
          }),
          tx.accountType.create({
            data: {
              name: 'LIABILITY',
              description: 'Obligations the company owes to external parties, such as loans or payables',
            },
          }),
          tx.accountType.create({
            data: {
              name: 'EQUITY',
              description: 'Owner’s residual interest after liabilities are subtracted from assets',
            },
          }),
          tx.accountType.create({
            data: {
              name: 'INCOME',
              description: 'Revenue generated from core operations such as product sales or services',
            },
          }),
          tx.accountType.create({
            data: {
              name: 'EXPENSE',
              description: 'Costs incurred in running daily business operations, like rent and salaries',
            },
          }),
          tx.accountType.create({
            data: {
              name: 'PAYABLE',
              description: 'Payable Accounts',
            },
          }),
          tx.accountType.create({
            data: {
              name: 'RECEIVABLE',
              description: 'Accounts Receivable',
            },
          }),
          tx.accountType.create({
            data: {
              name: 'CAPITAL',
              description: 'Capital Accounts',
            },
          }),
        ]);

        // Map parent names to their generated IDs
        // const parentMap = parents.reduce(
        //   (acc, parent) => {
        //     acc[parent.name] = parent.id;
        //     return acc;
        //   },
        //   {} as Record<string, string>
        // );

        // // 2. Create child account types linked to parents
        // await tx.accountType.createMany({
        //   data: [
        //     // Children of ASSET
        //     { name: 'Current Asset', parentId: parentMap['ASSET'] },
        //     { name: 'Fixed Asset', parentId: parentMap['ASSET'] },

        //     // Children of LIABILITY
        //     { name: 'Current Liability', parentId: parentMap['LIABILITY'] },
        //     { name: 'Long-term Liability', parentId: parentMap['LIABILITY'] },

        //     // Children of EQUITY
        //     { name: 'Owner Capital', parentId: parentMap['EQUITY'] },
        //     { name: 'Retained Earnings', parentId: parentMap['EQUITY'] },

        //     // Children of INCOME
        //     { name: 'Sales Revenue', parentId: parentMap['INCOME'] },
        //     { name: 'Service Revenue', parentId: parentMap['INCOME'] },

        //     // Children of EXPENSE
        //     { name: 'Salary Expense', parentId: parentMap['EXPENSE'] },
        //     { name: 'Rent Expense', parentId: parentMap['EXPENSE'] },
        //     { name: 'Utilities Expense', parentId: parentMap['EXPENSE'] },
        //   ],
        //   skipDuplicates: true,
        // });

        // const currentLiability = await tx.accountType.create({
        //   data: { name: 'Current Liability', parentId: parentMap['LIABILITY'] },
        // });

        // const longTermLiability = await tx.accountType.create({
        //   data: { name: 'Long-term Liability', parentId: parentMap['LIABILITY'] },
        // });

        // // Children of Current Liability
        // const accountsPayable = await tx.accountType.create({
        //   data: { name: 'Accounts Payable', parentId: currentLiability.id },
        // });

        // await tx.accountType.createMany({
        //   data: [
        //     { name: "Supplier Payable ['LIABILITY']", parentId: accountsPayable.id },
        //     { name: "Other Payable ['LIABILITY']", parentId: accountsPayable.id },
        //     { name: "Accrued Expenses ['LIABILITY']", parentId: currentLiability.id },
        //     { name: "Notes Payable ['LIABILITY']", parentId: longTermLiability.id },
        //     { name: "Mortgage Payable ['LIABILITY']", parentId: longTermLiability.id },
        //   ],
        // });

        // Seed default invoice types
        await tx.invoiceType.createMany({
          data: invoiceType,
          skipDuplicates: true,
        });

        // Seed default order statuses (for both purchase and sale orders)
        await tx.orderStatus.createMany({
          data: [
            { name: 'pending', displayName: 'Pending', description: 'Order placed but not fulfilled' },
            { name: 'partial', displayName: 'Partially Fulfilled', description: 'Some items processed' },
            { name: 'completed', displayName: 'Completed', description: 'Order fully completed' },
            { name: 'cancelled', displayName: 'Cancelled', description: 'Order cancelled' },
          ],
          skipDuplicates: true,
        });

        // Seed default expense types
        await tx.expenseType.createMany({
          data: expenseType,
          skipDuplicates: true,
        });

        // Seed default expense statuses
        await tx.expenseStatus.createMany({
          data: expenseStatus,
          skipDuplicates: true,
        });

        // Seed default payment statuses
        await tx.paymentStatus.createMany({
          data: paymentStatus,
          skipDuplicates: true,
        });

        // Seed related types for polymorphic relation in payments
        await tx.relatedType.createMany({
          data: [
            { code: 'PURCHASE_ORDER', label: 'Purchase Order', description: 'Payment related to purchase order' },
            { code: 'SALE_ORDER', label: 'Sale Order', description: 'Payment related to sale order' },
            { code: 'EXPENSE', label: 'Expense', description: 'Payment related to an expense' },
          ],
          skipDuplicates: true,
        });

        // Seed common setting types with optional UI component hints
        await tx.settingType.createMany({
          data: [
            { name: 'TEXT', label: 'Text', description: 'Plain text field', uiComponent: 'input' },
            { name: 'NUMBER', label: 'Number', description: 'Numeric value field', uiComponent: 'number' },
            { name: 'BOOLEAN', label: 'Yes/No', description: 'True or false toggle', uiComponent: 'switch' },
            { name: 'DATE', label: 'Date', description: 'Date picker field', uiComponent: 'date' },
            { name: 'JSON', label: 'JSON', description: 'Structured JSON data', uiComponent: 'textarea' },
            { name: 'SELECT', label: 'Dropdown', description: 'Choose one from options', uiComponent: 'select' },
          ],
          skipDuplicates: true,
        });

        const selectType = await tx.settingType.findFirst({
          where: { name: 'SELECT' },
        });

        // Example: create currency setting with options if `SELECT` type exists
        if (selectType) {
          const currencySetting = await tx.setting.create({
            data: {
              key: 'currency',
              value: 'bdt', // default
              group: 'finance',
              description: 'Preferred system currency',
              typeId: selectType.id,
            },
          });

          await tx.settingOption.createMany({
            data: [
              { settingId: currencySetting.id, label: 'BDT', value: 'bdt', sortOrder: 1 },
              { settingId: currencySetting.id, label: 'USD', value: 'usd', sortOrder: 2 },
              { settingId: currencySetting.id, label: 'EUR', value: 'eur', sortOrder: 3 },
            ],
            skipDuplicates: true,
          });
        }

        const settingsToInsert = [
          {
            key: 'company_name',
            value: 'Sky Zone BD',
            group: 'general',
            description: 'Your company’s display name',
            typeName: 'TEXT',
          },
          {
            key: 'company_email',
            value: 'info@skyzone.com.bd',
            group: 'general',
            description: 'Official email address',
            typeName: 'TEXT',
          },
          {
            key: 'default_tax_rate',
            value: '15',
            group: 'finance',
            description: 'Default VAT or Tax percentage',
            typeName: 'NUMBER',
          },
          {
            key: 'enable_notifications',
            value: 'true',
            group: 'system',
            description: 'Toggle system-wide notifications',
            typeName: 'BOOLEAN',
          },
          {
            key: 'fiscal_year_start',
            value: '2025-07-01',
            group: 'finance',
            description: 'Fiscal year starting date',
            typeName: 'DATE',
          },
          {
            key: 'default_currency',
            value: 'bdt',
            group: 'finance',
            description: 'Default currency for transactions',
            typeName: 'SELECT', // attach options separately
          },
        ];

        for (const item of settingsToInsert) {
          const type = await tx.settingType.findFirst({ where: { name: item.typeName } });

          if (type) {
            await tx.setting.upsert({
              where: { key: item.key },
              update: {
                value: item.value,
                description: item.description,
                group: item.group,
                typeId: type.id,
              },
              create: {
                key: item.key,
                value: item.value,
                description: item.description,
                group: item.group,
                typeId: type.id,
              },
            });
          }
        }
      },
      {
        maxWait: 10000, // 10 seconds max wait to connect to prisma
        timeout: 120000, // 120 seconds
      }
    );

    return '✅ Database reset complete. Roles, permissions, and default user created.';
  }
}

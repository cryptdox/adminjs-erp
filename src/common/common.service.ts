import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateCommonInput } from './dto/create-common.input.js';
import { UpdateCommonInput } from './dto/update-common.input.js';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';

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
    // 1. Delete in safe dependency order
    await this.prisma.invoiceStatusHistory.deleteMany();
    await this.prisma.saleOrderStatusHistory.deleteMany();
    await this.prisma.purchaseOrderStatusHistory.deleteMany();
    await this.prisma.expenseStatusHistory.deleteMany();
    await this.prisma.stockStatusHistory.deleteMany();

    await this.prisma.invoiceItem.deleteMany();
    await this.prisma.transaction.deleteMany();
    await this.prisma.ledgerEntry.deleteMany();
    await this.prisma.invoice.deleteMany();
    await this.prisma.payment.deleteMany();

    await this.prisma.manufactureInput.deleteMany();
    await this.prisma.manufactureOutput.deleteMany();
    await this.prisma.manufacture.deleteMany();
    await this.prisma.stock.deleteMany();

    await this.prisma.variant.deleteMany();
    await this.prisma.product.deleteMany();
    await this.prisma.productCategory.deleteMany();
    await this.prisma.warehouse.deleteMany();
    await this.prisma.lot.deleteMany();
    await this.prisma.batch.deleteMany();
    await this.prisma.stockStatus.deleteMany();
    await this.prisma.stockType.deleteMany();

    await this.prisma.purchaseOrder.deleteMany();
    await this.prisma.saleOrder.deleteMany();
    await this.prisma.expense.deleteMany();

    await this.prisma.partner.deleteMany();
    await this.prisma.shareHolderProfitShare.deleteMany();

    await this.prisma.account.deleteMany();
    await this.prisma.accountType.deleteMany();

    await this.prisma.auditLog.deleteMany();

    await this.prisma.settingOption.deleteMany();
    await this.prisma.setting.deleteMany();
    await this.prisma.settingType.deleteMany();

    await this.prisma.invoiceType.deleteMany();
    await this.prisma.orderStatus.deleteMany();
    await this.prisma.expenseType.deleteMany();

    await this.prisma.paymentStatus.deleteMany();
    await this.prisma.relatedType.deleteMany();

    await this.prisma.rolePermission.deleteMany();
    await this.prisma.permission.deleteMany();
    await this.prisma.role.deleteMany();
    await this.prisma.user.deleteMany();

    // 1. Insert roles
    await this.prisma.role.createMany({
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
      'StockStatus',
      'StockType',
      'StockStatusHistory',
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
    await this.prisma.permission.createMany({
      data: permissionsData,
      skipDuplicates: true,
    });

    // Step 1: Get ADMIN role
    const adminRole = await this.prisma.role.findFirst({
      where: { name: 'ADMIN' },
    });

    if (adminRole) {
      // Step 2: Get all permissions
      const allPermissions = await this.prisma.permission.findMany();

      // Step 3: Insert RolePermission for ADMIN
      for (const permission of allPermissions) {
        await this.prisma.rolePermission.upsert({
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

    const managerRole = await this.prisma.role.findFirst({
      where: { name: 'MANAGER' },
    });

    if (managerRole) {
      const allPermissions = await this.prisma.permission.findMany();

      for (const permission of allPermissions) {
        const allowedActions = managerAllowedActions[permission.resource];
        if (allowedActions?.includes(permission.action)) {
          await this.prisma.rolePermission.upsert({
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

      // Can view products & stock
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

    const userRole = await this.prisma.role.findFirst({
      where: { name: 'USER' },
    });

    if (userRole) {
      const allPermissions = await this.prisma.permission.findMany();

      for (const permission of allPermissions) {
        const allowedActions = userAllowedActions[permission.resource];
        if (allowedActions?.includes(permission.action)) {
          await this.prisma.rolePermission.upsert({
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
      await this.prisma.user.create({
        data: {
          userName: 'admin',
          email: 'admin@example.com',
          password: hashedPassword,
          roleId: adminRole.id,
        },
      });
    }

    // PRODUCT CATEGORY SEED
    await this.prisma.productCategory.createMany({
      data: [
        { name: 'Mobile' },
        { name: 'Accessories', parentId: undefined },
        { name: 'Charger', parentId: undefined },
      ],
    });

    // Fetch categories for foreign key use
    const [mobileCategory] = await this.prisma.productCategory.findMany({
      where: { name: 'Mobile' },
    });

    // UNIT SEED
    await this.prisma.unit.createMany({
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
      this.prisma.unit.findUnique({ where: { name: 'kg' } }),
      this.prisma.unit.findUnique({ where: { name: 'g' } }),
      this.prisma.unit.findUnique({ where: { name: 'liter' } }),
      this.prisma.unit.findUnique({ where: { name: 'ml' } }),
    ]);

    // UNIT CONVERSIONS
    await this.prisma.unitConversion.createMany({
      data: [
        { fromUnitId: kg.id, toUnitId: g.id, multiplier: 1000, note: '1 kg = 1000 g' },
        { fromUnitId: g.id, toUnitId: kg.id, multiplier: 0.001, note: '1 g = 0.001 kg' },
        { fromUnitId: liter.id, toUnitId: ml.id, multiplier: 1000, note: '1 L = 1000 mL' },
        { fromUnitId: ml.id, toUnitId: liter.id, multiplier: 0.001, note: '1 mL = 0.001 L' },
      ],
    });

    // PRODUCTS
    const product = await this.prisma.product.create({
      data: {
        name: 'Samsung Galaxy S24',
        sku: 'SGS24-BLK-128',
        categoryId: mobileCategory.id,
      },
    });

    // VARIANT
    await this.prisma.variant.createMany({
      data: [
        {
          productId: product.id,
          attributes: { color: 'Black', storage: '128GB' },
        },
        {
          productId: product.id,
          attributes: { color: 'Silver', storage: '256GB' },
        },
      ],
    });

    await this.prisma.warehouse.createMany({
      data: [
        { name: 'Main Warehouse', location: 'Dhaka HQ', contact: '017xxxxxxxx' },
        { name: 'Backup Warehouse', location: 'Chattogram' },
      ],
      skipDuplicates: true,
    });

    await this.prisma.stockType.createMany({
      data: [
        { code: 'PURCHASE_IN', name: 'Purchase In', description: 'Stock from purchase orders' },
        { code: 'SALE_OUT', name: 'Sale Out', description: 'Stock sold to customer' },
        { code: 'DAMAGE_OUT', name: 'Damage Out', description: 'Stock damaged or lost' },
        { code: 'ADJUSTMENT_IN', name: 'Adjustment In', description: 'Manual stock increase' },
        { code: 'ADJUSTMENT_OUT', name: 'Adjustment Out', description: 'Manual stock decrease' },
      ],
      skipDuplicates: true,
    });

    await this.prisma.stockStatus.createMany({
      data: [
        { name: 'in_stock', displayName: 'In Stock' },
        { name: 'reserved', displayName: 'Reserved' },
        { name: 'damaged', displayName: 'Damaged' },
        { name: 'returned', displayName: 'Returned' },
      ],
      skipDuplicates: true,
    });

    // Seed default account types (basic chart of accounts)
    await this.prisma.accountType.createMany({
      data: [
        { name: 'ASSET', description: 'Cash, bank, and other assets' },
        { name: 'LIABILITY', description: 'Loans, payables, etc.' },
        { name: 'EQUITY', description: 'Owner capital and retained earnings' },
        { name: 'REVENUE', description: 'Sales income and other revenues' },
        { name: 'EXPENSE', description: 'Operating and administrative expenses' },
      ],
      skipDuplicates: true,
    });

    // Seed default invoice types
    await this.prisma.invoiceType.createMany({
      data: [
        { name: 'STOCK_SALES', description: 'Sales of stock items' },
        { name: 'STOCK_PURCHASE', description: 'Purchase of stock items' },
        { name: 'OTHER_SALES', description: 'Service or non-stock sales' },
        { name: 'OTHER_PURCHASE', description: 'Service or non-stock purchases' },
        { name: 'EXPENSE', description: 'Recorded expense invoices' },
      ],
      skipDuplicates: true,
    });

    // Seed default invoice statuses
    await this.prisma.invoiceStatus.createMany({
      data: [
        { name: 'UNPAID', description: 'No payment made yet' },
        { name: 'PARTIAL', description: 'Partially paid' },
        { name: 'PAID', description: 'Fully paid' },
        { name: 'CANCELLED', description: 'Invoice cancelled' },
      ],
      skipDuplicates: true,
    });

    // Seed default order statuses (for both purchase and sale orders)
    await this.prisma.orderStatus.createMany({
      data: [
        { name: 'pending', displayName: 'Pending', description: 'Order placed but not fulfilled' },
        { name: 'partial', displayName: 'Partially Fulfilled', description: 'Some items processed' },
        { name: 'completed', displayName: 'Completed', description: 'Order fully completed' },
        { name: 'cancelled', displayName: 'Cancelled', description: 'Order cancelled' },
      ],
      skipDuplicates: true,
    });

    // Seed default expense types
    await this.prisma.expenseType.createMany({
      data: [
        { name: 'PURCHASE', displayName: 'Purchase Order', description: 'Cost related to stock purchase' },
        { name: 'SALE', displayName: 'Sales Related', description: 'Sales operational expense' },
        { name: 'RETURN', displayName: 'Returned Goods', description: 'Expense from customer returns' },
        { name: 'OTHER', displayName: 'Other Expense', description: 'Miscellaneous operational expense' },
      ],
      skipDuplicates: true,
    });

    // Seed default expense statuses
    await this.prisma.expenseStatus.createMany({
      data: [
        { name: 'pending', displayName: 'Pending', description: 'Expense yet to be processed' },
        { name: 'partial', displayName: 'Partially Paid', description: 'Expense partially covered' },
        { name: 'completed', displayName: 'Completed', description: 'Expense fully paid or settled' },
        { name: 'cancelled', displayName: 'Cancelled', description: 'Invalidated or withdrawn expense' },
      ],
      skipDuplicates: true,
    });

    // Seed default payment statuses
    await this.prisma.paymentStatus.createMany({
      data: [
        { code: 'PENDING', label: 'Pending', description: 'Payment not yet made', color: '#facc15' },
        { code: 'COMPLETED', label: 'Payment Complete', description: 'Payment fully made', color: '#4ade80' },
        { code: 'FAILED', label: 'Failed', description: 'Payment attempt failed', color: '#f87171' },
        { code: 'CANCELLED', label: 'Cancelled', description: 'Payment was cancelled', color: '#a3a3a3' },
        { code: 'REFUNDED', label: 'Refunded', description: 'Payment returned', color: '#60a5fa' },
      ],
      skipDuplicates: true,
    });

    // Seed related types for polymorphic relation in payments
    await this.prisma.relatedType.createMany({
      data: [
        { code: 'PURCHASE_ORDER', label: 'Purchase Order', description: 'Payment related to purchase order' },
        { code: 'SALE_ORDER', label: 'Sale Order', description: 'Payment related to sale order' },
        { code: 'EXPENSE', label: 'Expense', description: 'Payment related to an expense' },
      ],
      skipDuplicates: true,
    });

    // Seed common setting types with optional UI component hints
    await this.prisma.settingType.createMany({
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

    const selectType = await this.prisma.settingType.findFirst({
      where: { name: 'SELECT' },
    });

    // Example: create currency setting with options if `SELECT` type exists
    if (selectType) {
      const currencySetting = await this.prisma.setting.create({
        data: {
          key: 'currency',
          value: 'bdt', // default
          group: 'finance',
          description: 'Preferred system currency',
          typeId: selectType.id,
        },
      });

      await this.prisma.settingOption.createMany({
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
      const type = await this.prisma.settingType.findFirst({ where: { name: item.typeName } });

      if (type) {
        await this.prisma.setting.upsert({
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

    return '✅ Database reset complete. Roles, permissions, and default user created.';
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateCommonInput } from './dto/create-common.input.js';
import { UpdateCommonInput } from './dto/update-common.input.js';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';
import {
  accounts,
  accountTypeData,
  actions,
  freeTrialTenantData,
  expenseStatus,
  expenseType,
  fullAccessLifeTimeTenantData,
  invoiceType,
  managerAllowedActions,
  packages,
  paymentStatus,
  resources,
  stockExchangeStatus,
  stockExchangeType,
  userAllowedActions,
} from '../utils/values.js';
import { DiscountType, Prisma, PrismaClient, SubscriptionPaymentFLow, SubscriptionPaymentStatus } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/client';
import { exec } from 'child_process';
import { promisify } from 'util';
import { generateRandomCode, getDateAfterDays, getUsernameFromEmail } from '../utils/common.js';

const execAsync = promisify(exec);

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
    let value = 'RESET';
    // let value = 'INSERT';
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
        const exists = await tx.user.count();
        if (exists) return;
        await this.insertUserRolePackagePermission(tx);
        await this.createFullAccessLifeTimeTenant(tx)
        await this.createFreeTrialTenantData(tx)
        // await this.createInventoryInfo(tx);
        // await this.createAccountingInfo(tx);
        // await this.createOrderInfo(tx);
        // await this.createSettingsInfo(tx);
      },
      {
        maxWait: 10000, // 10 seconds max wait to connect to prisma
        timeout: 120000, // 120 seconds
      }
    );
    return '✅ Database reset complete. Roles, permissions, and default user created.';
  }

  async insertUserRolePackagePermission(
    tx: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >
  ) {
    // 1. Generate all permission combinations
    const permissionsData = [];
    for (const resource of resources) {
      for (const action of actions) {
        permissionsData.push({
          name: `${action.toUpperCase()} ${resource}`,
          resource,
          action,
          description: `${action.toUpperCase()} permission for ${resource}`,
        });
      }
    }

    // 2. Insert permissions (skip duplicates due to unique constraint)
    await tx.permission.createMany({
      data: permissionsData,
      skipDuplicates: true,
    });

    // 3. Insert All Packages and Permissions
    await tx.package.createMany({
      data: packages.map(({ modules, ...rest }) => ({ ...rest })),
      skipDuplicates: true,
    });

    for (const pkg of packages) {
      for (const mod of pkg.modules) {
        for (const act of actions) {
          await tx.packagePermission.create({
            data: {
              permission: {
                connect: {
                  name: `${act.toUpperCase()} ${mod}`,
                },
              },
              package: {
                connect: {
                  name: pkg.name,
                },
              },
            },
          });
        }
      }
    }

    // 4. Insert All Roles
    await tx.role.createMany({
      data: [
        { name: 'ADMIN', description: 'System Administrator' },
        { name: 'MANAGER', description: 'Manager Access' },
        { name: 'USER', description: 'Basic User' },
      ],
      skipDuplicates: true,
    });

    // 5. Operation on ALl Permissions
    const allPermissions = await tx.permission.findMany();

    for (const permission of allPermissions) {
      // 5.1. Set ADMIN Role Permissions
      const adminRole = await tx.role.findFirst({
        where: { name: 'ADMIN' },
      });
      if (adminRole) {
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
        // 5.1.1 Create admin user
        const hashedPassword = await this.bcryptPassword('admin');
        await tx.user.create({
          data: {
            userName: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            roleId: adminRole.id,
          },
        });
      }

      // 5.2. Set MANAGER Role Permissions
      const managerRole = await tx.role.findFirst({
        where: { name: 'MANAGER' },
      });
      if (managerRole) {
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

      // 5.3. Set USER Role Permissions
      const userRole = await tx.role.findFirst({
        where: { name: 'USER' },
      });
      if (userRole) {
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
  }

  async createFullAccessLifeTimeTenant(
    tx: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >
  ) {
    const fullERPLifeTimePackage = await tx.package.findUnique({
      where: {
        name: packages[12].name,
      },
      include: {
        PackagePermission: true,
      },
    });

    const tenant = await tx.tenant.create({
      data: fullAccessLifeTimeTenantData,
    });

    // const subscriptionPaymentCoupon = await tx.subscriptionPaymentCoupon.create({
    //   data: {
    //     code: generateRandomCode(),
    //     amount: 0,
    //     discountType: DiscountType.AMOUNT,
    //     count: 0,
    //     maxUsage: 1,
    //   },
    // });

    const subscriptionPayment = await tx.subscriptionPayment.create({
      data: {
        amount: 0,
        paymentInfo: '',
        // subscriptionPaymentCoupon: {
        //   connect: { id: subscriptionPaymentCoupon.id },
        // },
        subscriptionPaymentFLow: SubscriptionPaymentFLow.CASH_IN,
        subscriptionPaymentStatus: SubscriptionPaymentStatus.DONE,
      },
    });

    // await tx.subscriptionPaymentCoupon.update({
    //   data: {
    //     count: subscriptionPaymentCoupon.count + 1,
    //   },
    //   where: {
    //     id: subscriptionPaymentCoupon.id,
    //   },
    // });

    await tx.subscription.create({
      data: {
        tenant: {
          connect: { id: tenant.id },
        },
        package: {
          connect: { id: fullERPLifeTimePackage.id },
        },
        startDate: new Date(),
        subscriptionPayment: {
          connect: { id: subscriptionPayment.id },
        },
      },
    });

    const role = await tx.role.create({
      data: {
        name: 'ADMIN',
        description: 'Tenant Administrator',
        Tenant: {
          connect: { id: tenant.id },
        },
      },
    });

    for (const permission of fullERPLifeTimePackage.PackagePermission) {
      await tx.rolePermission.create({
        data: {
          role: {
            connect: { id: role.id },
          },
          permission: {
            connect: { id: permission.id },
          },
          Tenant: {
            connect: { id: tenant.id },
          },
        },
      });
    }

    const hashedPassword = await this.bcryptPassword('admin');
    const user = await tx.user.create({
      data: {
        userName: getUsernameFromEmail(tenant.email),
        email: tenant.email,
        firstName: tenant.name,
        phone: tenant.phone,
        address: tenant.address,
        password: hashedPassword,
        Role: {
          connect: { id: role.id },
        },
        Tenant: {
          connect: { id: tenant.id },
        },
      },
    });
  }

  async createFreeTrialTenantData(
    tx: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >
  ) {
    const fullERPLifeTimePackage = await tx.package.findUnique({
      where: {
        name: packages[0].name,
      },
      include: {
        PackagePermission: true,
      },
    });

    const tenant = await tx.tenant.create({
      data: freeTrialTenantData,
    });

    // const subscriptionPaymentCoupon = await tx.subscriptionPaymentCoupon.create({
    //   data: {
    //     code: generateRandomCode(),
    //     amount: 0,
    //     discountType: DiscountType.AMOUNT,
    //     count: 0,
    //     maxUsage: 1,
    //   },
    // });

    const subscriptionPayment = await tx.subscriptionPayment.create({
      data: {
        amount: 0,
        paymentInfo: '',
        // subscriptionPaymentCoupon: {
        //   connect: { id: subscriptionPaymentCoupon.id },
        // },
        subscriptionPaymentFLow: SubscriptionPaymentFLow.CASH_IN,
        subscriptionPaymentStatus: SubscriptionPaymentStatus.DONE,
      },
    });

    // await tx.subscriptionPaymentCoupon.update({
    //   data: {
    //     count: subscriptionPaymentCoupon.count + 1,
    //   },
    //   where: {
    //     id: subscriptionPaymentCoupon.id,
    //   },
    // });

    await tx.subscription.create({
      data: {
        tenant: {
          connect: { id: tenant.id },
        },
        package: {
          connect: { id: fullERPLifeTimePackage.id },
        },
        startDate: new Date(),
        endDate: getDateAfterDays(),
        subscriptionPayment: {
          connect: { id: subscriptionPayment.id },
        },
      },
    });

    const role = await tx.role.create({
      data: {
        name: 'ADMIN',
        description: 'Tenant Administrator',
        Tenant: {
          connect: { id: tenant.id },
        },
      },
    });

    for (const permission of fullERPLifeTimePackage.PackagePermission) {
      await tx.rolePermission.create({
        data: {
          role: {
            connect: { id: role.id },
          },
          permission: {
            connect: { id: permission.id },
          },
          Tenant: {
            connect: { id: tenant.id },
          },
        },
      });
    }

    const hashedPassword = await this.bcryptPassword('admin');
    const user = await tx.user.create({
      data: {
        userName: getUsernameFromEmail(tenant.email),
        email: tenant.email,
        firstName: tenant.name,
        phone: tenant.phone,
        address: tenant.address,
        password: hashedPassword,
        Role: {
          connect: { id: role.id },
        },
        Tenant: {
          connect: { id: tenant.id },
        },
      },
    });
  }

  async createInventoryInfo(
    tx: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >
  ) {
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
          name: 'BLACK-128',
          productId: product.id,
          attributes: { name: 'BLACK-128', color: 'Black', storage: '128GB' },
        },
        {
          name: 'SILVER-256',
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
  }

  async createAccountingInfo(
    tx: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >
  ) {
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
    const parents = await Promise.all(accountTypeData.map((data) => tx.accountType.create({ data })));

    // 2. Create Default Accounts
    // ✅ Map the name to ID for later use
    const accountTypeMap: Record<string, string> = {};

    for (const parent of parents) {
      accountTypeMap[parent.name] = parent.id;
    }

    for (const account of accounts) {
      await tx.account.create({
        data: {
          name: account.name,
          typeId: accountTypeMap[account.type],
          isOrganizationAccount: account.isOrganizationAccount,
          isDefault: true,
        },
      });
    }

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
  }

  async createOrderInfo(
    tx: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >
  ) {
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
  }

  async createSettingsInfo(
    tx: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >
  ) {
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
  }

  async createInfo(
    tx: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >
  ) {}
}

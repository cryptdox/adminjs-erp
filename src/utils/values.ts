import { DiscountType, PackageType, UnitGroup } from '@prisma/client';

export const invoiceType = [
  { name: 'STOCK_SALES', description: 'Sales of stockExchange items' },
  { name: 'STOCK_PURCHASE', description: 'Purchase of stockExchange items' },
  { name: 'OTHER_SALES', description: 'Service or non-stockExchange sales' },
  { name: 'OTHER_PURCHASE', description: 'Service or non-stockExchange purchases' },
  { name: 'EXPENSE', description: 'Recorded expense invoices' },
];

export const expenseType = [
  { name: 'PURCHASE', displayName: 'Purchase Order', description: 'Cost related to stockExchange purchase' },
  { name: 'SALE', displayName: 'Sales Related', description: 'Sales operational expense' },
  { name: 'RETURN', displayName: 'Returned Goods', description: 'Expense from customer returns' },
  { name: 'OTHER', displayName: 'Other Expense', description: 'Miscellaneous operational expense' },
];

export const stockExchangeType = [
  { code: 'PURCHASE_IN', name: 'Purchase In', description: 'Stock from purchase orders' },
  { code: 'SALE_OUT', name: 'Sale Out', description: 'Stock sold to customer' },
  { code: 'DAMAGE_OUT', name: 'Damage Out', description: 'Stock damaged or lost' },
  { code: 'ADJUSTMENT_IN', name: 'Adjustment In', description: 'Manual stockExchange increase' },
  { code: 'ADJUSTMENT_OUT', name: 'Adjustment Out', description: 'Manual stockExchange decrease' },
];

export const stockExchangeStatus = [
  { name: 'STOCK_IN', displayName: 'Stock IN' },
  { name: 'STOCK_OUT', displayName: 'Stock Out' },
  { name: 'RESERVED', displayName: 'Reserved' },
  { name: 'DAMAGED', displayName: 'Damaged' },
  { name: 'RETURNED', displayName: 'Returned' },
  { name: 'IN_TRANSIT', displayName: 'In Transit' },
  { name: 'UNDER_QC', displayName: 'Under Quality Check' },
  { name: 'EXPIRED', displayName: 'Expired' },
  { name: 'ON_HOLD', displayName: 'On Hold' },
  { name: 'BLOCKED', displayName: 'Blocked' },
  { name: 'MISSING', displayName: 'Missing' },
];

export const expenseStatus = [
  { name: 'PENDING', displayName: 'Pending', description: 'Expense yet to be processed' },
  { name: 'PARTIAL', displayName: 'Partially Paid', description: 'Expense partially covered' },
  { name: 'COMPLETED', displayName: 'Completed', description: 'Expense fully paid or settled' },
  { name: 'CANCELLED', displayName: 'Cancelled', description: 'Invalidated or withdrawn expense' },
];

export const paymentStatus = [
  { code: 'PENDING', label: 'Pending', description: 'Payment not yet made', color: '#facc15' },
  { code: 'COMPLETED', label: 'Payment Complete', description: 'Payment fully made', color: '#4ade80' },
  { code: 'FAILED', label: 'Failed', description: 'Payment attempt failed', color: '#f87171' },
  { code: 'CANCELLED', label: 'Cancelled', description: 'Payment was cancelled', color: '#a3a3a3' },
  { code: 'REFUNDED', label: 'Refunded', description: 'Payment returned', color: '#60a5fa' },
];

export const orderStatus = [
  { name: 'PENDING', displayName: 'Pending', description: 'Order placed but not fulfilled' },
  { name: 'PARTIAL', displayName: 'Partially Fulfilled', description: 'Some items processed' },
  { name: 'COMPLETED', displayName: 'Completed', description: 'Order fully completed' },
  { name: 'CANCELLED', displayName: 'Cancelled', description: 'Order cancelled' },
];

export const accounts = [
  // ASSET
  { name: 'Cash', type: 'ASSET', isOrganizationAccount: true },
  { name: 'Bank', type: 'ASSET', isOrganizationAccount: true },
  { name: 'Inventory', type: 'ASSET', isOrganizationAccount: true },
  { name: 'Accounts Receivable', type: 'ASSET', isOrganizationAccount: true },

  // LIABILITY
  { name: 'Accounts Payable', type: 'LIABILITY', isOrganizationAccount: true },
  { name: 'Loan Payable', type: 'LIABILITY', isOrganizationAccount: true },
  { name: 'Tax Payable', type: 'LIABILITY', isOrganizationAccount: true },

  // INCOME
  { name: 'Sales Revenue', type: 'INCOME', isOrganizationAccount: true },
  { name: 'Service Income', type: 'INCOME', isOrganizationAccount: true },

  // EXPENSE
  { name: 'Purchase Expense', type: 'EXPENSE', isOrganizationAccount: true },
  { name: 'Operating Expenses', type: 'EXPENSE', isOrganizationAccount: true },
  { name: 'Salary Expense', type: 'EXPENSE', isOrganizationAccount: true },
  { name: 'Transportation Expense', type: 'EXPENSE', isOrganizationAccount: true },
  { name: 'Discounts Given', type: 'EXPENSE', isOrganizationAccount: true },

  // EQUITY
  { name: "Owner's Equity", type: 'EQUITY', isOrganizationAccount: true },
  { name: 'Retained Earnings', type: 'EQUITY', isOrganizationAccount: true },
];

export const accountTypeData = [
  {
    name: 'ASSET',
    description: 'Represents company-owned resources such as cash, inventory, and property',
  },
  {
    name: 'LIABILITY',
    description: 'Obligations the company owes to external parties, such as loans or payables',
  },
  {
    name: 'EQUITY',
    description: 'Owner’s residual interest after liabilities are subtracted from assets',
  },
  {
    name: 'INCOME',
    description: 'Revenue generated from core operations such as product sales or services',
  },
  {
    name: 'EXPENSE',
    description: 'Costs incurred in running daily business operations, like rent and salaries',
  },
  {
    name: 'PAYABLE',
    description: 'Payable Accounts',
  },
  {
    name: 'RECEIVABLE',
    description: 'Accounts Receivable',
  },
  {
    name: 'CAPITAL',
    description: 'Capital Accounts',
  },
];

export const units = [
  { name: 'kg', label: 'Kilogram', group: UnitGroup.WEIGHT, isBase: true, step: 1 },
  { name: 'g', label: 'Gram', group: UnitGroup.WEIGHT, step: 10 },
  { name: 'liter', label: 'Liter', group: UnitGroup.VOLUME, isBase: true, step: 1 },
  { name: 'ml', label: 'Milliliter', group: UnitGroup.VOLUME, step: 10 },
  { name: 'pcs', label: 'Piece', group: UnitGroup.COUNT, isBase: true, step: 1 },
];

export const settingsType = [
  { name: 'TEXT', label: 'Text', description: 'Plain text field', uiComponent: 'input' },
  { name: 'NUMBER', label: 'Number', description: 'Numeric value field', uiComponent: 'number' },
  { name: 'BOOLEAN', label: 'Yes/No', description: 'True or false toggle', uiComponent: 'switch' },
  { name: 'DATE', label: 'Date', description: 'Date picker field', uiComponent: 'date' },
  { name: 'JSON', label: 'JSON', description: 'Structured JSON data', uiComponent: 'textarea' },
  { name: 'SELECT', label: 'Dropdown', description: 'Choose one from options', uiComponent: 'select' },
];

export const resources = [
  'Tenant',
  'Subscription',
  'Package',
  'PackagePermission',
  'SubscriptionPayment',
  'User',
  'Role',
  'Permission',
  'RolePermission',
  'ProductCategory',
  'Unit',
  'UnitConversion',
  'Product',
  'Variant',
  'Warehouse',
  'Batch',
  'Lot',
  'StockExchangeType',
  'StockExchangeStatus',
  'StockExchange',
  'Manufacture',
  'ManufactureInput',
  'ManufactureOutput',
  'AccountType',
  'Account',
  'Transaction',
  'LedgerEntry',
  'Partner',
  'InvestmentProfile',
  'InvestmentProfileInvestor',
  'ShareHolderProfitShare',
  'InvoiceType',
  'Invoice',
  'InvoiceItem',
  'OrderStatus',
  'PurchaseOrder',
  'PurchaseOrderStatusHistory',
  'SaleOrder',
  'SaleOrderStatusHistory',
  'ExpenseType',
  'Expense',
  'ExpenseStatus',
  'Payment',
  'AuditLog',
  'SettingType',
  'SettingOption',
  'Setting',
];

// Standard actions
export const actions = ['create', 'read', 'update', 'delete'];

export const managerAllowedActions: Record<string, string[]> = {
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
  StockExchange: ['read'],
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

export const userAllowedActions: Record<string, string[]> = {
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
  StockExchange: ['read'],
  Warehouse: ['read'],

  // Can view own profile
  User: ['read'],

  // Read-only on basic lookup/config
  Setting: ['read'],
  Account: ['read'],
};

export const tenantModules = {
  userManagement: ['User', 'Role', 'RolePermission'],

  inventoryManagement: ['ProductCategory', 'Product', 'Variant', 'Warehouse', 'Batch', 'Lot', 'StockExchange'],

  manufacturing: ['Manufacture', 'ManufactureInput', 'ManufactureOutput'],

  accounting: ['Account', 'Transaction', 'LedgerEntry'],

  partners: ['Partner', 'InvestmentProfile', 'InvestmentProfileInvestor', 'ShareHolderProfitShare'],

  invoicing: ['Invoice', 'InvoiceItem'],

  orders: ['PurchaseOrder', 'PurchaseOrderStatusHistory', 'SaleOrder', 'SaleOrderStatusHistory'],

  expenses: ['Expense'],

  payments: ['Payment'],

  audit: ['AuditLog'],

  settings: ['Setting'],
};

const basicModule = [...tenantModules.userManagement, ...tenantModules.inventoryManagement];
const manufacturingProModule = [
  ...tenantModules.userManagement,
  ...tenantModules.inventoryManagement,
  ...tenantModules.manufacturing,
  ...tenantModules.orders,
];
const accountingSuiteModule = [
  ...tenantModules.accounting,
  ...tenantModules.partners,
  ...tenantModules.payments,
  ...tenantModules.expenses,
  ...tenantModules.audit,
];

const fullModule = [
  ...tenantModules.accounting,
  ...tenantModules.audit,
  ...tenantModules.expenses,
  ...tenantModules.inventoryManagement,
  ...tenantModules.invoicing,
  ...tenantModules.manufacturing,
  ...tenantModules.orders,
  ...tenantModules.partners,
  ...tenantModules.payments,
  ...tenantModules.settings,
  ...tenantModules.userManagement,
];

export const packages = [
  {
    name: 'Free Trial',
    description: 'Essential features including user management and inventory control.',
    imageUrl: 'https://example.com/images/basic-package.png',
    price: 29.99,
    discountType: DiscountType.PERCENT,
    discount: 5.0,
    packageType: PackageType.MONTHLY,
    modules: manufacturingProModule,
  },
  {
    name: 'Basic (MONTHLY)',
    description: 'Essential features including user management and inventory control.',
    imageUrl: 'https://example.com/images/basic-package.png',
    price: 29.99,
    discountType: DiscountType.PERCENT,
    discount: 5.0,
    packageType: PackageType.MONTHLY,
    modules: basicModule,
  },
  {
    name: 'Basic (YEARLY)',
    description: 'Essential features including user management and inventory control.',
    imageUrl: 'https://example.com/images/basic-package.png',
    price: 29.99,
    discountType: DiscountType.PERCENT,
    discount: 5.0,
    packageType: PackageType.YEARLY,
    modules: basicModule,
  },
  {
    name: 'Basic (LIFE_TIME)',
    description: 'Essential features including user management and inventory control.',
    imageUrl: 'https://example.com/images/basic-package.png',
    price: 29.99,
    discountType: DiscountType.PERCENT,
    discount: 5.0,
    packageType: PackageType.LIFE_TIME,
    modules: basicModule,
  },
  {
    name: 'Manufacturing Pro (MONTHLY)',
    description: 'Advanced manufacturing and order management features plus basic modules.',
    imageUrl: 'https://example.com/images/manufacturing-pro.png',
    price: 79.99,
    discountType: DiscountType.PERCENT,
    discount: 10.0,
    packageType: PackageType.MONTHLY,
    modules: manufacturingProModule,
  },
  {
    name: 'Manufacturing Pro (YEARLY)',
    description: 'Advanced manufacturing and order management features plus basic modules.',
    imageUrl: 'https://example.com/images/manufacturing-pro.png',
    price: 79.99,
    discountType: DiscountType.PERCENT,
    discount: 10.0,
    packageType: PackageType.YEARLY,
    modules: manufacturingProModule,
  },
  {
    name: 'Manufacturing Pro (LIFE_TIME)',
    description: 'Advanced manufacturing and order management features plus basic modules.',
    imageUrl: 'https://example.com/images/manufacturing-pro.png',
    price: 79.99,
    discountType: DiscountType.PERCENT,
    discount: 10.0,
    packageType: PackageType.LIFE_TIME,
    modules: manufacturingProModule,
  },
  {
    name: 'Accounting Suite (MONTHLY)',
    description: 'Full accounting, partners, payments, expenses and audit features.',
    imageUrl: 'https://example.com/images/accounting-suite.png',
    price: 99.99,
    discountType: DiscountType.AMOUNT,
    discount: 20.0,
    packageType: PackageType.MONTHLY,
    modules: accountingSuiteModule,
  },
  {
    name: 'Accounting Suite (YEARLY)',
    description: 'Full accounting, partners, payments, expenses and audit features.',
    imageUrl: 'https://example.com/images/accounting-suite.png',
    price: 99.99,
    discountType: DiscountType.AMOUNT,
    discount: 20.0,
    packageType: PackageType.YEARLY,
    modules: accountingSuiteModule,
  },
  {
    name: 'Accounting Suite (LIFE_TIME)',
    description: 'Full accounting, partners, payments, expenses and audit features.',
    imageUrl: 'https://example.com/images/accounting-suite.png',
    price: 99.99,
    discountType: DiscountType.AMOUNT,
    discount: 20.0,
    packageType: PackageType.LIFE_TIME,
    modules: accountingSuiteModule,
  },
  {
    name: 'Full ERP (MONTHLY)',
    description: 'Complete ERP system with access to all modules and features.',
    imageUrl: 'https://example.com/images/full-erp.png',
    price: 199.99,
    discountType: DiscountType.PERCENT,
    discount: 15.0,
    packageType: PackageType.MONTHLY,
    modules: fullModule,
  },
  {
    name: 'Full ERP (YEARLY)',
    description: 'Complete ERP system with access to all modules and features.',
    imageUrl: 'https://example.com/images/full-erp.png',
    price: 199.99,
    discountType: DiscountType.PERCENT,
    discount: 15.0,
    packageType: PackageType.YEARLY,
    modules: fullModule,
  },
  {
    name: 'Full ERP (LIFE_TIME)',
    description: 'Complete ERP system with access to all modules and features.',
    imageUrl: 'https://example.com/images/full-erp.png',
    price: 199.99,
    discountType: DiscountType.PERCENT,
    discount: 15.0,
    packageType: PackageType.LIFE_TIME,
    modules: fullModule,
  },
];

export const fullAccessLifeTimeTenantData = {
  name: 'Full Access Tenant',
  email: 'full.access@example.com',
  phone: '+8801300000000',
  address: '123 Main St, Springfield, IL 62704, USA',
};

export const freeTrialTenantData = {
  name: 'Free Trial Tenant',
  email: 'free.trial@example.com',
  phone: '+8801300000001',
  address: '123 Main St, Springfield, IL 62704, USA',
};

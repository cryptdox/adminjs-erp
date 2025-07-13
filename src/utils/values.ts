export const invoiceType = [
  { name: 'STOCK_SALES', description: 'Sales of stockExchange items' },
  { name: 'STOCK_PURCHASE', description: 'Purchase of stockExchange items' },
  { name: 'OTHER_SALES', description: 'Service or non-stockExchange sales' },
  { name: 'OTHER_PURCHASE', description: 'Service or non-stockExchange purchases' },
  { name: 'EXPENSE', description: 'Recorded expense invoices' },
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

export const expenseType = [
  { name: 'PURCHASE', displayName: 'Purchase Order', description: 'Cost related to stockExchange purchase' },
  { name: 'SALE', displayName: 'Sales Related', description: 'Sales operational expense' },
  { name: 'RETURN', displayName: 'Returned Goods', description: 'Expense from customer returns' },
  { name: 'OTHER', displayName: 'Other Expense', description: 'Miscellaneous operational expense' },
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

export const resources = [
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
  Stock: ['read'],
  Warehouse: ['read'],

  // Can view own profile
  User: ['read'],

  // Read-only on basic lookup/config
  Setting: ['read'],
  Account: ['read'],
};

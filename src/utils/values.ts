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

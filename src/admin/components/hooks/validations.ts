import * as Yup from 'yup';

export type ValidationErrors = {
  [fieldPath: string]: string;
};

export const selectedValueSchema = Yup.object({
  value: Yup.string().required('Value is required'),
  // label: Yup.string().required(),
  // label is often just for display
});

export const expenseSchema = Yup.object({
  id: Yup.string().nullable(),
  partner: selectedValueSchema.required('Partner is required'),
  expenseType: selectedValueSchema.required('Expense type is required'),
  totalAmount: Yup.number().moreThan(0, 'Total amount must be > 0').required('Required'),
  paidAmount: Yup.number().min(0, 'Paid amount cannot be negative').required('Required'),
  note: Yup.string().nullable(),
});

export const stockItemSchema = Yup.object({
  id: Yup.string().nullable(),
  product: selectedValueSchema.required('Product is required'),
  variant: selectedValueSchema.required('Variant is required'),
  warehouse: selectedValueSchema.required('Warehouse is required'),
  manufactureDate: Yup.string().required('Manufacture date is required'),
  expiryDate: Yup.string().required('Expiry date is required'),
  unitPrice: Yup.number().moreThan(0, 'Unit price must be > 0').required('Required'),
  quantity: Yup.number().moreThan(0, 'Quantity must be > 0').required('Required'),
  paid: Yup.number().min(0, 'Paid cannot be negative').required('Required'),
  receivedQuantity: Yup.number().min(0, 'Received quantity cannot be negative').required('Required'),
  discount: Yup.number().min(0, 'Discount cannot be negative').required('Required'),
  totalPrice: Yup.number().required('Total price is required'),
  totalDiscount: Yup.number().required('Total discount is required'),
  afterDiscountPrice: Yup.number().required('After discount price is required'),
  totalExpense: Yup.number().required('Total expense is required'),
  totalCost: Yup.number().required('Total cost is required'),
  totalCostAfterDiscount: Yup.number().required('Total cost after discount is required'),
  remain: Yup.number().required('Remaining amount is required'),
  discountType: selectedValueSchema.required('Discount type is required'),
  expenses: Yup.array().of(expenseSchema),
});

export const orderSchema = Yup.object({
  orderNumber: Yup.string().required('Order number is required'),
  selectedSupplier: selectedValueSchema.required('Supplier is required'),
  note: Yup.string().nullable(),
  stockItems: Yup.array().of(stockItemSchema).min(1, 'At least one stock item is required').required(),
  expenses: Yup.array().of(expenseSchema),
  globalDiscount: Yup.number().min(0, 'Global discount cannot be negative').required('Required'),
  globalDiscountType: selectedValueSchema.required('Discount type is required'),
  totalPaidAmount: Yup.number().min(0, 'Total paid must not be less than 0').required('Required'),
  totalRemainAmount: Yup.number().min(0, 'Remain amount cannot be negative').required('Required'),
  grandTotal: Yup.number().moreThan(0, 'Grand total must be > 0').required('Required'),
});

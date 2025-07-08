import { BasePropertyProps } from 'adminjs';
import { useState, useEffect } from 'react';

export interface StockItemInput {
  id: string;
  productId: string;
  variantId: string;
  warehouseId: string;
  manufactureDate: string;
  expiryDate: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  paid: number;
  receivedQuantity: number;
  discount: number;
  remain: number;
  discountType: { value: 'amount'; label: '$ - Amount' } | { value: 'percent'; label: '% - Percent' };
  discountPrice: number;
}

export interface ExpenseInput {
  id: string;
  partnerId: string;
  expenseTypeId: string;
  totalAmount: number;
  paidAmount: number;
  note?: string;
}

export interface Partner {
  id: string;
  name: string;
  type: 'SUPPLIER' | 'CUSTOMER' | 'SHAREHOLDER';
}

export interface Product {
  id: string;
  name: string;
}

export interface Variant {
  id: string;
  name: string;
  productId: string;
}

export interface Warehouse {
  id: string;
  name: string;
}

export interface ExpenseType {
  id: string;
  name: string;
}

export const useNewPurchaseOrder = (props: BasePropertyProps) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [stockItems, setStockItems] = useState<StockItemInput[]>([]);
  const [expenses, setExpenses] = useState<ExpenseInput[]>([]);

  const [globalDiscount, setGlobalDiscount] = useState<number>(0);
  const [globalDiscountType, setGlobalDiscountType] = useState<
    { value: 'amount'; label: '$ - Amount' } | { value: 'percent'; label: '% - Percent' }
  >({ value: 'amount', label: '$ - Amount' });

  // Initialize order number once
  useEffect(() => {
    const newOrderNum = `PO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-001`;
    setOrderNumber(newOrderNum);
  }, []);

  // Fetchers for data
  const fetchSuppliers = async (): Promise<Partner[]> => {
    const res = await fetch('/admin/api/resources/Partner/actions/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filters: { type: 'SUPPLIER' }, page: 1, perPage: 100 }),
    });
    const result = await res.json();
    return result.records.map((r: any) => ({
      id: r.params.id,
      name: r.params.name,
      type: r.params.type,
    }));
  };

  const fetchProducts = async (): Promise<Product[]> => {
    const res = await fetch('/admin/api/resources/Product/actions/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 1, perPage: 100 }),
    });
    const result = await res.json();
    return result.records.map((r: any) => ({
      id: r.params.id,
      name: r.params.name,
    }));
  };

  const fetchVariants = async (productId: string): Promise<Variant[]> => {
    const res = await fetch('/admin/api/resources/Variant/actions/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filters: { productId },
        page: 1,
        perPage: 100,
      }),
    });
    const result = await res.json();
    return result.records.map((r: any) => ({
      id: r.params.id,
      name: r.params.name,
      productId: r.params.productId,
    }));
  };

  const fetchWarehouses = async (): Promise<Warehouse[]> => {
    const res = await fetch('/admin/api/resources/Warehouse/actions/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: 1, perPage: 100 }),
    });
    const result = await res.json();
    return result.records.map((r: any) => ({
      id: r.params.id,
      name: r.params.name,
    }));
  };

  const fetchExpenseTypes = (): ExpenseType[] => [
    { id: 'et1', name: 'Transport' },
    { id: 'et2', name: 'Custom Duty' },
  ];

  // Add a new stock item with default discount type = 'amount'
  const addStockItem = () => {
    setStockItems((prev) => [
      ...prev,
      {
        id: `stockitem-${Date.now()}`,
        productId: '',
        variantId: '',
        warehouseId: '',
        manufactureDate: '',
        expiryDate: '',
        unitPrice: 0,
        quantity: 0,
        receivedQuantity: 0,
        totalPrice: 0,
        paid: 0,
        discount: 0,
        remain: 0,
        discountType: { value: 'amount', label: '$ - Amount' },
        discountPrice: 0,
      },
    ]);
  };

  // Remove stock item by id
  const removeStockItem = (id: string) => {
    setStockItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Update stock item and calculate totals & remain
  const updateStockItem = (id: string, data: Partial<StockItemInput>) => {
    setStockItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        // If discountType changed then reset the discount amount
        if (data?.discountType?.value && data?.discountType?.value !== item.discountType.value) data.discount = 0;

        const updated = { ...item, ...data };

        // Calculate gross = unitPrice * quantity
        const gross = updated.unitPrice * updated.quantity;

        // Calculate discount properly based on discountType
        const discount = updated.discountType.value === 'percent' ? (gross * updated.discount) / 100 : updated.discount;

        // totalPrice = gross before discount (kept as gross here for clarity)
        // or you can set totalPrice = gross - discount, depending on your logic
        const totalPrice = gross;

        // discountPrice  = totalPrice - discount
        const discountPrice = totalPrice - discount;

        // Keep max paid amount in discount price
        let paid = 0
        if (updated.paid > discountPrice) paid == discountPrice;
        else paid = updated.paid

        // remain = totalPrice - discount - paid
        const remain = totalPrice - discount - paid;

        return {
          ...updated,
          totalPrice,
          remain,
          discountPrice,
          paid
        };
      })
    );
  };

  // Update discount type for stock item
  const updateDiscountType = (
    id: string,
    data: { discountType: { value: 'amount'; label: '$ - Amount' } | { value: 'percent'; label: '% - Percent' } }
  ) => {
    updateStockItem(id, data);
  };

  // Add new expense
  const addExpenseItem = () => {
    setExpenses((prev) => [
      ...prev,
      {
        id: `expenseitem-${Date.now()}`,
        partnerId: '',
        expenseTypeId: '',
        totalAmount: 0,
        paidAmount: 0,
        note: '',
      },
    ]);
  };

  // Remove expense by id
  const removeExpenseItem = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  // Update expense item
  const updateExpenseItem = (id: string, data: Partial<ExpenseInput>) => {
    setExpenses((prev) => prev.map((item) => (item.id === id ? { ...item, ...data } : item)));
  };

  // Calculate expense per unit for a stock item (unitPrice + expense per quantity)
  const calculateExpensePerUnit = (item: StockItemInput): number => {
    const totalExpense = expenses.reduce((sum, e) => sum + e.totalAmount, 0);
    const totalQty = stockItems.reduce((sum, i) => sum + i.quantity, 0);
    return item.unitPrice + (totalQty > 0 ? totalExpense / totalQty : 0);
  };

  // ========== Calculations ==========

  // Sum of (unitPrice * quantity) for all stock items (gross)
  const totalStockAmount = stockItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  // Sum of all discounts on stock items (calculated based on type)
  const totalItemDiscount = stockItems.reduce((sum, i) => {
    const gross = i.unitPrice * i.quantity;
    const discount = i.discountType.value == 'percent' ? (gross * i.discount) / 100 : i.discount;
    return sum + discount;
  }, 0);

  // Sum of totalAmount of all expenses
  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.totalAmount, 0);

  // Sum of paid amounts on stock items
  const totalStockPaid = stockItems.reduce((sum, i) => sum + i.paid, 0);

  // Sum of paid amounts on expenses
  const totalExpensePaid = expenses.reduce((sum, e) => sum + e.paidAmount, 0);

  // Total paid (stock + expense)
  const totalPaidAmount = totalStockPaid + totalExpensePaid;

  // Global discount amount calculated from globalDiscount and type
  const globalDiscountAmount =
    globalDiscountType.value == 'percent'
      ? ((totalStockAmount - totalItemDiscount) * globalDiscount) / 100
      : globalDiscount;

  // Grand total = stock total - item discounts - global discount + expenses
  const grandTotal = totalStockAmount - totalItemDiscount - globalDiscountAmount + totalExpenseAmount;

  // Total remain amount = grand total - total paid amount
  const totalRemainAmount = grandTotal - totalPaidAmount;

  // Dummy handlers for UI
  const handleCancel = () => {
    console.log('Cancelled');
  };

  const handleOrder = () => {
    console.log('Order Submitted', {
      orderNumber,
      selectedSupplier,
      note,
      stockItems,
      expenses,
      globalDiscount,
      globalDiscountType,
      totalPaidAmount,
      totalRemainAmount,
      grandTotal,
    });
  };

  const handleFullPurchase = () => {
    console.log('Full Purchase Submitted');
  };

  return {
    orderNumber,
    selectedSupplier,
    setSelectedSupplier,
    note,
    setNote,
    stockItems,
    addStockItem,
    removeStockItem,
    updateStockItem,
    updateDiscountType,
    expenses,
    addExpenseItem,
    removeExpenseItem,
    updateExpenseItem,
    globalDiscount,
    setGlobalDiscount,
    globalDiscountType,
    setGlobalDiscountType,
    fetchSuppliers,
    fetchProducts,
    fetchVariants,
    fetchWarehouses,
    fetchExpenseTypes,
    calculateExpensePerUnit,
    totalStockAmount,
    totalExpenseAmount,
    totalItemDiscount,
    globalDiscountAmount,
    grandTotal,
    totalPaidAmount,
    totalRemainAmount,
    handleCancel,
    handleOrder,
    handleFullPurchase,
  };
};

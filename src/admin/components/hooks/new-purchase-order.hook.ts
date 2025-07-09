import { BasePropertyProps } from 'adminjs';
import { useState, useEffect } from 'react';

export interface SelectedValue {
  value: string;
  label: string;
}

export interface StockItemInput {
  id: string;
  product: SelectedValue;
  variant: SelectedValue;
  warehouse: SelectedValue;
  manufactureDate: string;
  expiryDate: string;
  unitPrice: number;
  quantity: number;
  paid: number;
  receivedQuantity: number;
  discount: number;
  totalPrice: number;
  totalDiscount: number;
  afterDiscountPrice: number;
  totalExpense: number;
  totalCost: number;
  totalCostAfterDiscount: number;
  remain: number;
  discountType: SelectedValue;
  expenses?: ExpenseInput[]; // 🔥 Add this to support per-item expenses
}

export interface ExpenseInput {
  id: string;
  partner: SelectedValue;
  expenseType: SelectedValue;
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
  const [globalDiscountType, setGlobalDiscountType] = useState<SelectedValue>({ value: 'amount', label: '$ - Amount' });

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

  const fetchExpenseTypes = async (): Promise<ExpenseType[]> => {
    const res = await fetch('/admin/api/resources/ExpenseType/actions/list', {
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

  // Add a new stock item with default discount type = 'amount'
  const addStockItem = () => {
    setStockItems((prev) => [
      ...prev,
      {
        id: `stockitem-${Date.now()}`,
        product: undefined,
        variant: undefined,
        warehouse: undefined,
        manufactureDate: '',
        expiryDate: '',
        unitPrice: 0,
        quantity: 0,
        receivedQuantity: 0,
        paid: 0,
        discount: 0,
        discountType: { value: 'amount', label: '$ - Amount' },
        expenses: [],
        totalPrice: 0,
        totalDiscount: 0,
        afterDiscountPrice: 0,
        totalExpense: 0,
        totalCost: 0,
        totalCostAfterDiscount: 0,
        remain: 0,
      },
    ]);
  };

  // Remove stock item by id
  const removeStockItem = (id: string) => {
    setStockItems((prev) => prev.filter((item) => item.id !== id));
  };
  const updateStockItem = (id: string, data: Partial<StockItemInput>) => {
    setStockItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        // Reset discount if discountType changed
        if (data?.discountType?.value && data?.discountType?.value !== item.discountType.value) {
          data.discount = 0;
        }

        const updated = { ...item, ...data };

        const gross = updated.unitPrice * updated.quantity;

        // Calculate discount
        const discountAmount =
          updated.discountType.value === 'percent' ? (gross * updated.discount) / 100 : updated.discount;

        const totalPrice = gross;
        const discountPrice = totalPrice - discountAmount;

        // Ensure paid is not more than discountPrice
        let paid = updated.paid;
        if (paid > discountPrice) paid = discountPrice;

        const remain = discountPrice - paid;

        // Per-item expenses total
        const totalExpense = updated.expenses?.reduce((sum, exp) => sum + (exp.totalAmount || 0), 0) ?? 0;

        const totalDiscount = discountAmount;
        const afterDiscountPrice = discountPrice;

        const totalCost = gross + totalExpense;
        const totalCostAfterDiscount = discountPrice + totalExpense;

        return {
          ...updated,
          totalPrice,
          totalDiscount,
          afterDiscountPrice,
          totalExpense,
          totalCost,
          totalCostAfterDiscount,
          discountPrice,
          remain,
          paid,
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

  // NEW: stockItem expense handlers
  const addStockItemExpense = (stockId: string) => {
    setStockItems((prev) =>
      prev.map((item) =>
        item.id === stockId
          ? {
              ...item,
              expenses: [
                ...item.expenses,
                {
                  id: `stockexpense-${Date.now()}`,
                  partner: undefined,
                  expenseType: undefined,
                  totalAmount: 0,
                  paidAmount: 0,
                  note: '',
                },
              ],
            }
          : item
      )
    );
  };

  const addExpenseToStockItem = (stockItemId: string) => {
    setStockItems((prev) =>
      prev.map((item) =>
        item.id === stockItemId
          ? {
              ...item,
              expenses: [
                ...(item.expenses || []),
                {
                  id: `stock-expense-${Date.now()}`,
                  partner: undefined,
                  expenseType: undefined,
                  totalAmount: 0,
                  paidAmount: 0,
                  note: '',
                },
              ],
            }
          : item
      )
    );
  };

  const updateStockItemExpense = (stockItemId: string, expenseId: string, data: Partial<ExpenseInput>) => {
    setStockItems((prev) =>
      prev.map((item) => {
        if (item.id !== stockItemId) return item;

        // Update expenses
        const updatedExpenses = (item.expenses || []).map((exp) => (exp.id === expenseId ? { ...exp, ...data } : exp));

        // Recalculate expense total
        const totalExpense = updatedExpenses.reduce((sum, exp) => sum + (exp.totalAmount || 0), 0);

        // Recompute financials
        const gross = item.unitPrice * item.quantity;

        const discountAmount = item.discountType.value === 'percent' ? (gross * item.discount) / 100 : item.discount;

        const discountPrice = gross - discountAmount;

        const paid = Math.min(item.paid, discountPrice);
        const remain = discountPrice - paid;

        const totalCost = gross + totalExpense;
        const totalCostAfterDiscount = discountPrice + totalExpense;

        return {
          ...item,
          expenses: updatedExpenses,
          totalExpense,
          totalCost,
          totalCostAfterDiscount,
          totalDiscount: discountAmount,
          afterDiscountPrice: discountPrice,
          discountPrice,
          remain,
          paid,
        };
      })
    );
  };

  const removeStockItemExpense = (stockItemId: string, expenseId: string) => {
    setStockItems((prev) =>
      prev.map((item) =>
        item.id === stockItemId
          ? {
              ...item,
              expenses: (item.expenses || []).filter((exp) => exp.id !== expenseId),
            }
          : item
      )
    );
  };

  // Add new expense
  const addExpenseItem = () => {
    setExpenses((prev) => [
      ...prev,
      {
        id: `expenseitem-${Date.now()}`,
        partner: undefined,
        expenseType: undefined,
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
    // const globalDiscountAmount = globalDiscountType.value === 'percent' ? (totalStockAmount * globalDiscount) / 100 : item.discount;
    const globalExpense = expenses.reduce((sum, e) => sum + e.totalAmount, 0);
    const itemGross = item.unitPrice * item.quantity;
    const globalExpensePerUnit = ((itemGross / totalStockAmount) * globalExpense) / (item.quantity || 1);
    const globalDiscountPerUnit = ((itemGross / totalStockAmount) * globalDiscountAmount) / (item.quantity || 1);

    const itemExpenseTotal = (item.expenses || []).reduce((sum, e) => sum + e.totalAmount, 0);
    const itemExpensePerUnit = itemExpenseTotal / (item.quantity || 1);

    const discountAmount =
      item.discountType.value === 'percent' ? (item.unitPrice * item.quantity * item.discount) / 100 : item.discount;

    const discountPerUnit = discountAmount / (item.quantity || 1);

    console.log(item.unitPrice, globalExpensePerUnit, itemExpensePerUnit, discountPerUnit, globalDiscountPerUnit);

    return (
      (item.unitPrice || 0) +
      (globalExpensePerUnit || 0) +
      (itemExpensePerUnit || 0) -
      (discountPerUnit || 0) -
      (globalDiscountPerUnit || 0)
    );
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
  const globalExpenseAmount = expenses.reduce((sum, e) => sum + e.totalAmount, 0);

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

  // // Grand total = stock total - item discounts - global discount + expenses
  // const grandTotal = totalStockAmount - totalItemDiscount - globalDiscountAmount + globalExpenseAmount;
  const totalStockItemExpenses = stockItems.reduce(
    (sum, i) => sum + (i.expenses?.reduce((s, e) => s + e.totalAmount, 0) || 0),
    0
  );

  const totalExpenseAmount = globalExpenseAmount + totalStockItemExpenses;

  const grandTotal =
    totalStockAmount - totalItemDiscount - globalDiscountAmount + globalExpenseAmount + totalStockItemExpenses;

  // Total remain amount = grand total - total paid amount
  const totalRemainAmount = grandTotal - totalPaidAmount;

  const getTotalGlobalExpensePaid = expenses.reduce((sum, expense) => sum + (expense.paidAmount || 0), 0);

  const getTotalStockItemExpensePaid : number = 
    stockItems.reduce((totalPaid, item) => {
      const itemExpensePaid = (item.expenses || []).reduce((sum, exp) => sum + (exp.paidAmount || 0), 0);
      return totalPaid + itemExpensePaid;
    }, 0);
  

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
    addStockItemExpense,
    removeStockItemExpense,
    updateStockItemExpense,
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
    globalExpenseAmount,
    totalStockItemExpenses,
    totalExpenseAmount,
    totalItemDiscount,
    globalDiscountAmount,
    grandTotal,
    totalPaidAmount,
    totalRemainAmount,
    handleCancel,
    handleOrder,
    handleFullPurchase,
    getTotalGlobalExpensePaid,
    getTotalStockItemExpensePaid
  };
};

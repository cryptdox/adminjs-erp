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
  discount: number;
  remain: number;
  discountType: 'percent' | 'amount' | '';
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
  const [globalDiscountType, setGlobalDiscountType] = useState<'amount' | 'percent'>('amount');

  useEffect(() => {
    const newOrderNum = `PO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-001`;
    setOrderNumber(newOrderNum);
  }, []);

  // ========== Fetchers ==========
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

  // ========== Handlers ==========
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
        totalPrice: 0,
        paid: 0,
        discount: 0,
        remain: 0,
        discountType: '',
      },
    ]);
  };

  const removeStockItem = (id: string) => {
    setStockItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateStockItem = (id: string, data: Partial<StockItemInput>) => {
    setStockItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, ...data };
        const gross = updated.unitPrice * updated.quantity;
        const discount =
          updated.discountType === 'percent'
            ? (gross * updated.discount) / 100
            : updated.discount;

        const total = gross;
        const remain = total - discount - updated.paid;

        return {
          ...updated,
          totalPrice: total,
          remain: remain,
        };
      })
    );
  };

  const updateDiscountType = (id: string, data: { discountType: 'percent' | 'amount' | '' }) => {
    updateStockItem(id, data);
  };

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

  const removeExpenseItem = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const updateExpenseItem = (id: string, data: Partial<ExpenseInput>) => {
    setExpenses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...data } : item))
    );
  };

  const calculateExpensePerUnit = (item: StockItemInput): number => {
    const totalExpense = expenses.reduce((sum, e) => sum + e.totalAmount, 0);
    const totalQty = stockItems.reduce((sum, i) => sum + i.quantity, 0);
    return item.unitPrice + (totalQty > 0 ? totalExpense / totalQty : 0);
  };

  // ========== Calculations ==========
  const totalStockAmount = stockItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  const totalItemDiscount = stockItems.reduce((sum, i) => {
    const gross = i.unitPrice * i.quantity;
    const discount = i.discountType === 'percent' ? (gross * i.discount) / 100 : i.discount;
    return sum + discount;
  }, 0);

  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.totalAmount, 0);

  const globalDiscountAmount =
    globalDiscountType === 'percent'
      ? ((totalStockAmount - totalItemDiscount) * globalDiscount) / 100
      : globalDiscount;

  const grandTotal = totalStockAmount - totalItemDiscount - globalDiscountAmount + totalExpenseAmount;

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
    handleCancel,
    handleOrder,
    handleFullPurchase,
  };
};

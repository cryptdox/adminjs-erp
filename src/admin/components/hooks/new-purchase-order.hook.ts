import { useState, useEffect } from "react";

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
  type: "SUPPLIER" | "CUSTOMER" | "SHAREHOLDER";
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

export const useNewPurchaseOrder = () => {
  // Form state
  const [orderNumber, setOrderNumber] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [stockItems, setStockItems] = useState<StockItemInput[]>([]);
  const [expenses, setExpenses] = useState<ExpenseInput[]>([]);

  // Dummy data fetchers (simulate API)
  const fetchSuppliers = (): Partner[] => [
    { id: "sup1", name: "Supplier One", type: "SUPPLIER" },
    { id: "sup2", name: "Supplier Two", type: "SUPPLIER" },
  ];

  const fetchProducts = (): Product[] => [
    { id: "prod1", name: "Product One" },
    { id: "prod2", name: "Product Two" },
  ];

  const fetchVariants = (productId: string): Variant[] => {
    if (productId === "prod1") {
      return [
        { id: "var1", name: "Size M", productId: "prod1" },
        { id: "var2", name: "Size L", productId: "prod1" },
      ];
    }
    if (productId === "prod2") {
      return [{ id: "var3", name: "Color Red", productId: "prod2" }];
    }
    return [];
  };

  const fetchWarehouses = (): Warehouse[] => [
    { id: "wh1", name: "Warehouse A" },
    { id: "wh2", name: "Warehouse B" },
  ];

  const fetchExpenseTypes = (): ExpenseType[] => [
    { id: "et1", name: "Transport" },
    { id: "et2", name: "Custom Duty" },
  ];

  // Auto-generate order number
  useEffect(() => {
    const newOrderNum = `PO-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-001`;
    setOrderNumber(newOrderNum);
  }, []);

  // Add / Remove / Update Stock Item
  const addStockItem = () => {
    setStockItems((prev) => [
      ...prev,
      {
        id: `stockitem-${Date.now()}`,
        productId: "",
        variantId: "",
        warehouseId: "",
        manufactureDate: "",
        expiryDate: "",
        unitPrice: 0,
        quantity: 0,
        totalPrice: 0,
      },
    ]);
  };

  const removeStockItem = (id: string) => {
    setStockItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateStockItem = (id: string, data: Partial<StockItemInput>) => {
    setStockItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...data } : item))
    );
  };

  // Add / Remove / Update Expense Item
  const addExpenseItem = () => {
    setExpenses((prev) => [
      ...prev,
      {
        id: `expenseitem-${Date.now()}`,
        partnerId: "",
        expenseTypeId: "",
        totalAmount: 0,
        paidAmount: 0,
        note: "",
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

  // Derived Data
  const calculateExpensePerUnit = (item: StockItemInput): number => {
    const totalExpense = expenses.reduce((sum, e) => sum + e.totalAmount, 0);
    const totalQty = stockItems.reduce((sum, i) => sum + i.quantity, 0);
    const perUnitExpense = totalQty > 0 ? totalExpense / totalQty : 0;
    return item.unitPrice + perUnitExpense;
  };

  const totalStockAmount = stockItems.reduce((sum, i) => sum + i.totalPrice, 0);
  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.totalAmount, 0);
  const grandTotal = totalStockAmount + totalExpenseAmount;

  // Submission handlers
  const handleCancel = () => {
    console.log("Cancel clicked");
    // Reset or redirect logic here
  };

  const handleOrder = () => {
    console.log("Order submitted", {
      orderNumber,
      selectedSupplier,
      note,
      stockItems,
      expenses,
    });
    // API submit logic
  };

  const handleFullPurchase = () => {
    console.log("Full purchase submitted (fully paid)", {
      orderNumber,
      selectedSupplier,
      note,
      stockItems,
      expenses,
    });
    // Submission with full payment assumption
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
    expenses,
    addExpenseItem,
    removeExpenseItem,
    updateExpenseItem,
    fetchSuppliers,
    fetchProducts,
    fetchVariants,
    fetchWarehouses,
    fetchExpenseTypes,
    calculateExpensePerUnit,
    totalStockAmount,
    totalExpenseAmount,
    grandTotal,
    handleCancel,
    handleOrder,
    handleFullPurchase,
  };
};

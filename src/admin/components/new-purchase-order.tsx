import React from "react";
import { useNewPurchaseOrder } from "./hooks/new-purchase-order.hook.js";
import { Input, Label, TextArea } from "@adminjs/design-system";

const NewPurchaseOrder = () => {
  const {
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
  } = useNewPurchaseOrder();

  const suppliers = fetchSuppliers();
  const products = fetchProducts();
  const warehouses = fetchWarehouses();
  const expenseTypes = fetchExpenseTypes();

  return (
    <div className="!w-full !p-6 !bg-white !rounded-md !shadow-md">
      <h2 className="!text-2xl !font-bold !mb-6 !text-gray-800">New Purchase Order</h2>

      <div className="!grid !grid-cols-1 !sm:grid-cols-2 !gap-4 !mb-6">
        <div>
          <Label className="!block !font-semibold !text-gray-700 !mb-1">Order Number</Label>
          <Input
            type="text"
            value={orderNumber}
            readOnly
            className="!w-full !p-2 !border !rounded-md !bg-gray-100 !text-gray-700"
          />
        </div>

        <div>
          <Label className="!block !font-semibold !text-gray-700 !mb-1">Supplier</Label>
          <select
            value={selectedSupplier || ""}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            className="!w-full !p-2 !border !rounded-md !focus:outline-none !focus:ring-2 !focus:ring-indigo-500"
          >
            <option value="">Select Supplier</option>
            {suppliers.map((sup) => (
              <option key={sup.id} value={sup.id}>
                {sup.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="!mb-6">
        <Label className="!block !font-semibold !text-gray-700 !mb-1">Note</Label>
        <TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="!w-full !p-2 !border !rounded-md !resize-none !focus:outline-none !focus:ring-2 !focus:ring-indigo-500"
          placeholder="Optional notes"
        />
      </div>

      <h3 className="!text-xl !font-semibold !mb-4 !text-gray-800">Stock Items</h3>
      {stockItems.map((item) => {
        const variants = fetchVariants(item.productId);
        const calculatedUnit = calculateExpensePerUnit(item).toFixed(2);
        return (
          <div
            key={item.id}
            className="!border !border-gray-300 !rounded-md !p-4 !mb-4 !bg-gray-50"
          >
            <div className="!grid !grid-cols-1 !sm:grid-cols-3 !gap-4">
              <select
                value={item.productId}
                onChange={(e) => updateStockItem(item.id, { productId: e.target.value, variantId: "" })}
                className="!w-full !p-2 !border !rounded-md"
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <select
                value={item.variantId}
                onChange={(e) => updateStockItem(item.id, { variantId: e.target.value })}
                disabled={!item.productId}
                className="!w-full !p-2 !border !rounded-md"
              >
                <option value="">Select Variant</option>
                {variants.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
              <select
                value={item.warehouseId}
                onChange={(e) => updateStockItem(item.id, { warehouseId: e.target.value })}
                className="!w-full !p-2 !border !rounded-md"
              >
                <option value="">Select Warehouse</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
              <Input
                type="date"
                value={item.manufactureDate}
                onChange={(e) => updateStockItem(item.id, { manufactureDate: e.target.value })}
                className="!w-full !p-2 !border !rounded-md"
              />
              <Input
                type="date"
                value={item.expiryDate}
                onChange={(e) => updateStockItem(item.id, { expiryDate: e.target.value })}
                className="!w-full !p-2 !border !rounded-md"
              />
              <Input
                type="number"
                value={item.unitPrice}
                onChange={(e) => {
                  const unitPrice = Number(e.target.value);
                  updateStockItem(item.id, { unitPrice, totalPrice: unitPrice * item.quantity });
                }}
                className="!w-full !p-2 !border !rounded-md"
              />
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const quantity = Number(e.target.value);
                  updateStockItem(item.id, { quantity, totalPrice: quantity * item.unitPrice });
                }}
                className="!w-full !p-2 !border !rounded-md"
              />
              <Input
                type="number"
                value={item.totalPrice}
                readOnly
                className="!w-full !p-2 !border !rounded-md !bg-gray-100"
              />
              <Input
                type="text"
                readOnly
                value={`Cost/Unit: ${calculatedUnit}`}
                className="!w-full !p-2 !border !rounded-md !bg-yellow-100 !text-sm !text-gray-700"
              />
            </div>
            <button
              onClick={() => removeStockItem(item.id)}
              className="!mt-2 !px-4 !py-1 !bg-red-500 !text-white !rounded-md"
            >
              Remove
            </button>
          </div>
        );
      })}
      <button
        onClick={addStockItem}
        className="!mb-4 !px-4 !py-2 !bg-indigo-600 !text-white !rounded-md"
      >
        + Add Stock Item
      </button>

      <h3 className="!text-xl !font-semibold !mb-4 !text-gray-800">Expenses</h3>
      {expenses.map((exp) => (
        <div
          key={exp.id}
          className="!border !border-gray-300 !rounded-md !p-4 !mb-4 !bg-gray-50"
        >
          <div className="!grid !grid-cols-1 !sm:grid-cols-3 !gap-4">
            <select
              value={exp.partnerId}
              onChange={(e) => updateExpenseItem(exp.id, { partnerId: e.target.value })}
              className="!w-full !p-2 !border !rounded-md"
            >
              <option value="">Select Partner</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <select
              value={exp.expenseTypeId}
              onChange={(e) => updateExpenseItem(exp.id, { expenseTypeId: e.target.value })}
              className="!w-full !p-2 !border !rounded-md"
            >
              <option value="">Select Type</option>
              {expenseTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <Input
              type="number"
              value={exp.totalAmount}
              onChange={(e) => updateExpenseItem(exp.id, { totalAmount: Number(e.target.value) })}
              className="!w-full !p-2 !border !rounded-md"
            />
            <Input
              type="number"
              value={exp.paidAmount}
              onChange={(e) => updateExpenseItem(exp.id, { paidAmount: Number(e.target.value) })}
              className="!w-full !p-2 !border !rounded-md"
            />
            <TextArea
              rows={2}
              value={exp.note}
              onChange={(e) => updateExpenseItem(exp.id, { note: e.target.value })}
              className="!w-full !p-2 !border !rounded-md !sm:col-span-3"
              placeholder="Optional note"
            />
          </div>
          <button
            onClick={() => removeExpenseItem(exp.id)}
            className="!mt-2 !px-4 !py-1 !bg-red-500 !text-white !rounded-md"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={addExpenseItem}
        className="!mb-6 !px-4 !py-2 !bg-green-600 !text-white !rounded-md"
      >
        + Add Expense
      </button>

      <div className="!mb-6 !text-right !font-semibold">
        <p>Total Stock: {totalStockAmount.toFixed(2)}</p>
        <p>Total Expense: {totalExpenseAmount.toFixed(2)}</p>
        <p>Grand Total: {grandTotal.toFixed(2)}</p>
      </div>

      <div className="!flex !justify-end !space-x-4">
        <button
          className="!px-6 !py-2 !border !rounded-md !hover:bg-gray-100"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          className="!px-6 !py-2 !bg-indigo-600 !text-white !rounded-md"
          onClick={handleOrder}
        >
          Order
        </button>
        <button
          className="!px-6 !py-2 !bg-green-600 !text-white !rounded-md"
          onClick={handleFullPurchase}
        >
          Full Purchase
        </button>
      </div>
    </div>
  );
};

export default NewPurchaseOrder;

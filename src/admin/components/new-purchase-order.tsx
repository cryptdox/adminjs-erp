import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  Label,
  Select,
  TextArea,
} from "@adminjs/design-system";
import { BasePropertyProps } from "adminjs";
import { useNewPurchaseOrder } from "./hooks/new-purchase-order.hook.js";

type Variant = { id: string; name: string };

const NewPurchaseOrder = (props: BasePropertyProps) => {
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
    getTotalStockItemExpensePaid,
    totalStockPaid,
    totalRemainAmountForStockItem,
    updateGlobalDiscountType,
    errors
  } = useNewPurchaseOrder(props);

  console.log("errors: ", errors)

  const [suppliers, setSuppliers] = useState<{ id: string; name: string; }[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [variantMap, setVariantMap] = useState<Record<string, Variant[]>>({});
  const [warehouses, setWarehouses] = useState<{ id: string; name: string }[]>([]);
  const [expenseTypes, setExpenseTypes] = useState<{ id: string; name: string }[]>([]);
  const [variantLoader, setVariantLoader] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      const [suppliersData, productsData, warehousesData, expenseTypesData] =
        await Promise.all([
          fetchSuppliers(),
          fetchProducts(),
          fetchWarehouses(),
          fetchExpenseTypes(),
        ]);
      setSuppliers(suppliersData);
      setProducts(productsData);
      setWarehouses(warehousesData);
      setExpenseTypes(expenseTypesData);
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadVariants = async () => {
      setVariantLoader(true);
      const productIds = [
        ...new Set(stockItems.map((item) => item.product.value).filter(Boolean)),
      ];
      const newMap: Record<string, Variant[]> = {};
      for (const productId of productIds) {
        const variants = await fetchVariants(productId);
        newMap[productId as string] = variants;
      }
      setVariantMap(newMap);
      setVariantLoader(false);
    };
    loadVariants();
  }, [stockItems.map((i) => i.product?.value).join(",")]);

  return (
    <div className="!w-full !p-6 !bg-white !rounded-md !shadow-md">
      <h2 className="!text-3xl !font-semibold !mb-6 !text-indigo-500 !pb-3">
        🛒 New Purchase Order
      </h2>


      {/* Order Number and Supplier */}
      <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-4 !mb-6">
        <div>
          <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block">Order Number</Label>
          <div className="!w-full !text-md !font-semibold !p-2 !rounded-md !bg-indigo-50 !text-indigo-800 border border-indigo-200 shadow-sm">
            {orderNumber}
          </div>
        </div>

        <div>
          <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block">Supplier</Label>
          <Select
            value={selectedSupplier || ""}
            onChange={(selected) => setSelectedSupplier(selected || "")}
            options={suppliers.map((sup) => ({
              value: sup.id,
              label: sup.name,
            }))}
            isDisabled={!suppliers.length}
            isLoading={!suppliers.length}
            placeholder="Select Supplier"
            className="!w-full custom-partner-select !border !border-slate-300 !rounded-md !shadow-sm !transition focus:!ring-2 focus:!ring-indigo-500"
          />
          {errors.selectedSupplier && <p className="!pt-2 !text-red-600">{errors.selectedSupplier}</p>}
        </div>
      </div>

      {/* Note */}
      <div className="!mb-6">
        <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block">Note</Label>
        <TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Optional notes"
          className="!w-full !p-3 !border !border-gray-300 !rounded-md !resize-none focus:!border-indigo-500 focus:!ring-1 focus:!ring-indigo-300 !transition !duration-200 !ease-in-out !bg-white !text-gray-800"
        />
        {errors.note && <p className="!pt-2 !text-red-600">{errors.note}</p>}
      </div>


      {/* Stock Items */}
      <h3 className="!text-xl !font-semibold !text-indigo-500 !pb-2">
        Stock Items
      </h3>
      {errors[`stockItems`] && (<p className="!py-2 !text-red-600">{errors[`stockItems`]}</p>)}
      <div className="!mb-4"></div>

      {stockItems.map((item, index) => {
        const variants = item.product?.value ? variantMap[item.product?.value] : [];
        const calculatedUnit = calculateExpensePerUnit(item).toFixed(2);
        return (
          <div
            key={item.id}
            className="!border !border-indigo-200 !rounded-xl !p-5 !mb-6 !bg-indigo-50/20 shadow-sm transition hover:shadow-md"
          >
            {/* 1st row: Product, Variant, Warehouse */}
            <div className="!grid !grid-cols-1 md:!grid-cols-3 !gap-4">
              <div>
                <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block">Product</Label>
                <Select
                  value={item.product || undefined}
                  onChange={(selected) =>
                    updateStockItem(item.id, {
                      product: selected || undefined,
                      variant: undefined,
                    })
                  }
                  options={products.map((p) => ({
                    value: p.id,
                    label: p.name,
                  }))}
                  placeholder="Select Product"
                  className="!w-full !border !border-slate-300 !rounded-md !shadow-sm !transition focus:!ring-2 focus:!ring-indigo-500"
                />
                {errors[`stockItems[${index}].product.value`] && (<p className="!pt-2 !text-red-600">{errors[`stockItems[${index}].product.value`]}</p>)}
              </div>

              <div>
                <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block">Variant</Label>
                <Select
                  value={item?.variant || undefined}
                  onChange={(selected) =>
                    updateStockItem(item.id, { variant: selected || undefined })
                  }
                  options={variants?.map((v) => ({
                    value: v.id,
                    label: v.name,
                  }))}
                  isDisabled={!item.product}
                  isLoading={variantLoader}
                  placeholder="Select Variant"
                  className="!w-full !border !border-slate-300 !rounded-md !shadow-sm !transition focus:!ring-2 focus:!ring-indigo-500"
                />
                {errors[`stockItems[${index}].variant.value`] && (<p className="!pt-2 !text-red-600">{errors[`stockItems[${index}].variant.value`]}</p>)}
              </div>

              <div>
                <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block">Warehouse</Label>
                <Select
                  value={item.warehouse || undefined}
                  onChange={(selected) =>
                    updateStockItem(item.id, { warehouse: selected || undefined })
                  }
                  options={warehouses.map((w) => ({
                    value: w.id,
                    label: w.name,
                  }))}
                  placeholder="Select Warehouse"
                  className="!w-full !border !border-slate-300 !rounded-md !shadow-sm !transition focus:!ring-2 focus:!ring-indigo-500"
                />
                {errors[`stockItems[${index}].warehouse.value`] && (<p className="!pt-2 !text-red-600">{errors[`stockItems[${index}].warehouse.value`]}</p>)}
              </div>
            </div>


            {/* 2nd row: Manufacture + Expiry Date */}
            <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-4 !mt-4">
              <div>
                <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block">Manufacture Date</Label>
                <Input
                  type="date"
                  value={item.manufactureDate}
                  onChange={(e) =>
                    updateStockItem(item.id, {
                      manufactureDate: e.target.value,
                    })
                  }
                  className="!w-full !border !border-slate-300 !rounded-md !shadow-sm focus:!ring-2 focus:!ring-emerald-500 !transition"
                />
                {errors[`stockItems[${index}].manufactureDate`] && (<p className="!pt-2 !text-red-600">{errors[`stockItems[${index}].manufactureDate`]}</p>)}
              </div>
              <div>
                <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block">Expiry Date</Label>
                <Input
                  type="date"
                  value={item.expiryDate}
                  onChange={(e) =>
                    updateStockItem(item.id, {
                      expiryDate: e.target.value,
                    })
                  }
                  className="!w-full !border !border-slate-300 !rounded-md !shadow-sm focus:!ring-2 focus:!ring-rose-500 !transition"
                />
                {errors[`stockItems[${index}].expiryDate`] && (<p className="!pt-2 !text-red-600">{errors[`stockItems[${index}].expiryDate`]}</p>)}
              </div>
            </div>

            {/* 3rd row: Unit Price + Quantity */}
            <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-4 !mt-4">
              <div>
                <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block">Unit Price</Label>
                <Input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) =>
                    updateStockItem(item.id, {
                      unitPrice: Number(e.target.value),
                    })
                  }
                  min={0}
                  className="!w-full !border !border-slate-300 !rounded-md !shadow-sm focus:!ring-2 focus:!ring-indigo-500 !transition"
                />
                {errors[`stockItems[${index}].unitPrice`] && (<p className="!pt-2 !text-red-600">{errors[`stockItems[${index}].unitPrice`]}</p>)}
              </div>
              <div>
                <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block">Quantity</Label>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateStockItem(item.id, {
                      quantity: Number(e.target.value),
                    })
                  }
                  min={0}
                  className="!w-full !border !border-slate-300 !rounded-md !shadow-sm focus:!ring-2 focus:!ring-indigo-500 !transition"
                />
                {errors[`stockItems[${index}].quantity`] && (<p className="!pt-2 !text-red-600">{errors[`stockItems[${index}].quantity`]}</p>)}
              </div>
            </div>

            <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-4 !mt-4">
              <div>
                <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block">Discount</Label>
                <Input
                  type="number"
                  value={item.discount}
                  onChange={(e) => {
                    const inputValue = Number(e.target.value);
                    const cappedValue = Math.min(inputValue, 100);
                    updateStockItem(item.id, {
                      discount: Number(item.discountType.value == 'percent' ? cappedValue : e.target.value),
                    })
                  }}
                  className="!w-full !border !border-slate-300 !rounded-md !shadow-sm focus:!ring-2 focus:!ring-yellow-400 !transition"
                />
                {errors[`stockItems[${index}].discount`] && (<p className="!pt-2 !text-red-600">{errors[`stockItems[${index}].discount`]}</p>)}
              </div>

              <div>
                <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block">Discount Type</Label>
                <Select
                  value={item.discountType || { value: "amount", label: "$ - Amount" }}
                  onChange={(selected) =>
                    updateDiscountType(item.id, {
                      discountType: selected || { value: "amount", label: "$ - Amount" }
                    })
                  }
                  options={[
                    { value: "percent", label: "% - Percent" },
                    { value: "amount", label: "$ - Amount" },
                  ]}
                  placeholder="Select Discount Type"
                  className="!w-full !bg-green-100"
                />
                {errors[`stockItems[${index}].discountType`] && (<p className="!pt-2 !text-red-600">{errors[`stockItems[${index}].discountType`]}</p>)}
              </div>
            </div>
            <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-4 !mt-4">
              <div>
                <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block">Paid Amount</Label>
                <div className="!flex !items-center !gap-3">
                  <Input
                    type="number"
                    value={item.paid}
                    onChange={(e) => {
                      const inputValue = Number(e.target.value);
                      const cappedValue = Math.min(inputValue, item.afterDiscountPrice);
                      updateStockItem(item.id, { paid: cappedValue });
                    }}
                    min={0}
                    max={item.afterDiscountPrice}
                    className="!w-full !border border-slate-300 !rounded-md !shadow-sm focus:!ring-2 focus:!ring-indigo-500 !transition"
                  />
                  {errors[`stockItems[${index}].paid`] && (<p className="!pt-2 !text-red-600">{errors[`stockItems[${index}].paid`]}</p>)}
                  <div className="!flex !items-center !gap-1">
                    <input
                      type="checkbox"
                      id={`auto-paid-${item.id}`}
                      checked={item.paid === item.afterDiscountPrice}
                      onChange={(e) =>
                        updateStockItem(item.id, {
                          paid: e.target.checked ? item.afterDiscountPrice : 0,
                        })
                      }
                      className="!w-4 !h-4 !accent-indigo-600"
                    />
                    <label htmlFor={`auto-paid-${item.id}`} className="!text-sm !text-gray-600">All</label>
                  </div>
                </div>
              </div>

              <div>
                <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block">Received Quantity</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={item.receivedQuantity}
                    onChange={(e) => {
                      const inputValue = Number(e.target.value);
                      const cappedValue = Math.min(inputValue, item.quantity);
                      updateStockItem(item.id, { receivedQuantity: cappedValue });
                    }}
                    min={0}
                    max={item.quantity}
                    className="!w-full !border !border-slate-300 !rounded-md !shadow-sm focus:!ring-2 focus:!ring-indigo-500 !transition"
                  />
                  {errors[`stockItems[${index}].receivedQuantity`] && (<p className="!pt-2 !text-red-600">{errors[`stockItems[${index}].receivedQuantity`]}</p>)}
                  <div className="!flex !items-center !gap-1">
                    <input
                      type="checkbox"
                      id={`auto-receive-${item.id}`}
                      checked={item.receivedQuantity === item.quantity}
                      onChange={(e) =>
                        updateStockItem(item.id, {
                          receivedQuantity: e.target.checked ? item.quantity : 0,
                        })
                      }
                      className="!w-4 !h-4 !accent-indigo-600"
                    />
                    <label htmlFor={`auto-receive-${item.id}`} className="!text-sm !text-gray-600">All</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Stock Item Expenses */}
            <div className="!mt-6">
              <Label className="!text-sm !font-bold !text-indigo-600 !mb-2 !block">Item Expenses</Label>

              {item?.expenses.map((exp, exp_index) => (
                <div
                  key={exp.id}
                  className="!grid !grid-cols-1 md:!grid-cols-2 !gap-4 !mb-4 !p-4 !rounded-md !bg-white !border !border-gray-200"
                >
                  <div className="!w-full">
                    <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block">Expense Type</Label>
                    <Select
                      value={exp.expenseType || undefined}
                      onChange={(selected) =>
                        updateStockItemExpense(item.id, exp.id, { expenseType: selected || undefined })
                      }
                      options={expenseTypes.map((et) => ({ value: et.id, label: et.name }))}
                      placeholder="Expense Type"
                      className="!w-full"
                    />
                    {errors[`stockItems[${index}].expenses[${exp_index}].expenseType.value`] && (<p className="!pt-2 !text-red-600">{errors[`stockItems[${index}].expenses[${exp_index}].expenseType.value`]}</p>)}
                  </div>

                  <div className="!w-full">
                    <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block">Expense To</Label>
                    <Select
                      value={exp.partner || undefined}
                      onChange={(selected) =>
                        updateStockItemExpense(item.id, exp.id, { partner: selected || undefined })
                      }
                      options={suppliers.map((p) => ({ value: p.id, label: p.name }))}
                      placeholder="Partner"
                      className="!w-full"
                    />
                    {errors[`stockItems[${index}].expenses[${exp_index}].partner.value`] && (<p className="!pt-2 !text-red-600">{errors[`stockItems[${index}].expenses[${exp_index}].partner.value`]}</p>)}
                  </div>

                  <div className="!w-full">
                    <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block">Amount</Label>
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={exp.totalAmount}
                      onChange={(e) =>
                        updateStockItemExpense(item.id, exp.id, { totalAmount: Number(e.target.value) })
                      }
                      min={0}
                      className="!w-full"
                    />
                    {errors[`stockItems[${index}].expenses[${exp_index}].totalAmount`] && (<p className="!pt-2 !text-red-600">{errors[`stockItems[${index}].expenses[${exp_index}].totalAmount`]}</p>)}
                  </div>

                  <div className="!w-full">
                    <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block">Paid Amount</Label>
                    <Input
                      type="number"
                      placeholder="Paid"
                      value={exp.paidAmount}
                      onChange={(e) =>
                        updateStockItemExpense(item.id, exp.id, { paidAmount: Number(e.target.value) })
                      }
                      min={0}
                      className="!w-full"
                    />
                    {errors[`stockItems[${index}].expenses[${exp_index}].paidAmount`] && (<p className="!pt-2 !text-red-600">{errors[`stockItems[${index}].expenses[${exp_index}].paidAmount`]}</p>)}
                  </div>

                  <div className="!w-full md:!col-span-2">
                    <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block">Note</Label>
                    <Input
                      type="text"
                      placeholder="Note (optional)"
                      value={exp.note || ''}
                      onChange={(e) =>
                        updateStockItemExpense(item.id, exp.id, { note: e.target.value })
                      }
                      className="!w-full"
                    />
                    {errors[`stockItems[${index}].expenses[${exp_index}].note`] && (<p className="!pt-2 !text-red-600">{errors[`stockItems[${index}].expenses[${exp_index}].note`]}</p>)}
                  </div>

                  <div className="!w-full md:!col-span-2 !flex !justify-end">
                    <Button
                      variant="danger"
                      className="!text-sm !px-4 !py-1 !rounded-md !mt-2"
                      onClick={() => removeStockItemExpense(item.id, exp.id)}
                    >
                      Remove Stock Expense
                    </Button>
                  </div>
                </div>
              ))}

              <div className="!mt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => addStockItemExpense(item.id)}
                  className="!text-sm !rounded-md !border-none"
                >
                  + Add Expense
                </Button>
              </div>
            </div>

            <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-4 !mt-4">
              <div>
                <Label className="!text-sm !font-semibold !text-gray-700 !mb-1 !block">Total Price</Label>
                <Input
                  type="number"
                  value={item.totalPrice}
                  readOnly
                  className="!w-full !bg-indigo-50 !text-indigo-800 !font-semibold !border !border-indigo-200 !rounded-md !shadow-sm"
                />
              </div>

              <div>
                <Label className="!text-sm !font-semibold !text-gray-700 !mb-1 !block">Total Discount</Label>
                <Input
                  type="number"
                  value={item.totalDiscount}
                  readOnly
                  className="!w-full !bg-indigo-50 !text-indigo-800 !font-semibold !border !border-indigo-200 !rounded-md !shadow-sm"
                />
              </div>

              <div>
                <Label className="!text-sm !font-semibold !text-gray-700 !mb-1 !block">After Discount (Price)</Label>
                <Input
                  type="number"
                  value={item.afterDiscountPrice}
                  readOnly
                  className="!w-full !bg-indigo-50 !text-indigo-800 !font-semibold !border !border-indigo-200 !rounded-md !shadow-sm"
                />
              </div>

              <div>
                <Label className="!text-sm !font-semibold !text-gray-700 !mb-1 !block">Total Expense</Label>
                <Input
                  type="number"
                  value={item.totalExpense}
                  readOnly
                  className="!w-full !bg-indigo-50 !text-indigo-800 !font-semibold !border !border-indigo-200 !rounded-md !shadow-sm"
                />
              </div>

              <div>
                <Label className="!text-sm !font-semibold !text-gray-700 !mb-1 !block">Total Cost</Label>
                <Input
                  type="number"
                  value={item.totalCost}
                  readOnly
                  className="!w-full !bg-indigo-50 !text-indigo-800 !font-semibold !border !border-indigo-200 !rounded-md !shadow-sm"
                />
              </div>

              <div>
                <Label className="!text-sm !font-semibold !text-gray-700 !mb-1 !block">Total Cost After Discount</Label>
                <Input
                  type="number"
                  value={item.totalCostAfterDiscount}
                  readOnly
                  className="!w-full !bg-indigo-50 !text-indigo-800 !font-semibold !border !border-indigo-200 !rounded-md !shadow-sm"
                />
              </div>

              <div>
                <Label className="!text-sm !font-semibold !text-gray-700 !mb-1 !block">Remain Price After Pay</Label>
                <Input
                  type="number"
                  value={item.remain}
                  readOnly
                  className="!w-full !bg-indigo-50 !text-indigo-800 !font-semibold !border !border-indigo-200 !rounded-md !shadow-sm"
                />
              </div>

              <div>
                <Label className="!text-sm !font-semibold !text-gray-700 !mb-1 !block">Cost / Unit</Label>
                <Input
                  type="text"
                  readOnly
                  value={`Cost / Unit: ${calculatedUnit}`}
                  className="!w-full !bg-indigo-50 !text-indigo-800 !font-semibold !border !border-indigo-200 !rounded-md !shadow-sm"
                />
              </div>
            </div>

            <div className="!flex !justify-end !mt-6">
              <Button
                variant="danger"
                className="!px-4 !py-1 !rounded-md !text-sm !transition"
                onClick={() => removeStockItem(item.id)}
              >
                Remove Stock Item
              </Button>
            </div>
          </div>
        );
      })}
      <Button
        onClick={addStockItem}
        variant="primary"
        className="!mb-6 !font-medium !px-4 !py-1 !rounded-md !transition !duration-200 !border-none"
      >
        + Add Stock Item
      </Button>


      {/* Expenses Section */}
      <h3 className="!text-xl !font-semibold !mb-4 !text-indigo-500 !pb-2">
        Expenses
      </h3>

      {expenses.map((exp, index) => (
        <div
          key={exp.id}
          className="!border !border-indigo-200 !rounded-xl !p-5 !mb-6 !bg-indigo-50/20 shadow-sm transition hover:shadow-md"
        >
          <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-4">
            <div>
              <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block"> Expense To</Label>
              <Select
                value={exp.partner || undefined}
                onChange={(selected) =>
                  updateExpenseItem(exp.id, { partner: selected || undefined })
                }
                options={suppliers.map((s) => ({
                  value: s.id,
                  label: s.name,
                }))}
                placeholder="Select Partner"
                isDisabled={!suppliers.length}
                isLoading={!suppliers.length}
                className="!w-full custom-partner-select !border !border-slate-300 !rounded-md !shadow-sm !transition focus:!ring-2 focus:!ring-indigo-500"
              />
              {errors[`expenses[${index}].partner.value`] && (<p className="!pt-2 !text-red-600">{errors[`expenses[${index}].partner.value`]}</p>)}
            </div>

            <div>
              <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block"> Type
              </Label>
              <Select
                value={exp.expenseType || undefined}
                onChange={(selected) =>
                  updateExpenseItem(exp.id, { expenseType: selected || undefined })
                }
                options={expenseTypes.map((t) => ({
                  value: t.id,
                  label: t.name,
                }))}
                placeholder="Select Type"
                className="!w-full !border !border-slate-300 !rounded-md !shadow-sm !transition focus:!ring-2 focus:!ring-indigo-500"
              />
              {errors[`expenses[${index}].expenseType.value`] && (<p className="!pt-2 !text-red-600">{errors[`expenses[${index}].expenseType.value`]}</p>)}
            </div>

            <div>
              <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block"> Amount
              </Label>
              <Input
                type="number"
                value={exp.totalAmount}
                onChange={(e) =>
                  updateExpenseItem(exp.id, {
                    totalAmount: Number(e.target.value),
                  })
                }
                className="!w-full !border !border-slate-300 !rounded-md !shadow-sm !transition focus:!ring-2 focus:!ring-emerald-500"
              />
              {errors[`expenses[${index}].totalAmount`] && (<p className="!pt-2 !text-red-600">{errors[`expenses[${index}].totalAmount`]}</p>)}
            </div>

            <div>
              <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block"> Paid Amount
              </Label>
              <Input
                type="number"
                value={exp.paidAmount}
                onChange={(e) =>
                  updateExpenseItem(exp.id, {
                    paidAmount: Number(e.target.value),
                  })
                }
                className="!w-full !border !border-slate-300 !rounded-md !shadow-sm !transition focus:!ring-2 focus:!ring-indigo-500"
              />
              {errors[`expenses[${index}].paidAmount`] && (<p className="!pt-2 !text-red-600">{errors[`expenses[${index}].paidAmount`]}</p>)}
            </div>

            <div className="!col-span-1 sm:!col-span-2">
              <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block"> Note</Label>
              <TextArea
                rows={2}
                value={exp.note}
                onChange={(e) => updateExpenseItem(exp.id, { note: e.target.value })}
                placeholder="Optional note"
                className="!w-full !border !border-slate-300 !rounded-md !shadow-sm !resize-none !transition focus:!ring-2 focus:!ring-yellow-400"
              />
              {errors[`expenses[${index}].note`] && (<p className="!pt-2 !text-red-600">{errors[`expenses[${index}].note`]}</p>)}
            </div>
          </div>

          <div className="!flex !justify-end !mt-6">
            <Button
              variant="danger"
              className="!px-4 !py-1 !rounded-md !text-sm !transition"
              onClick={() => removeExpenseItem(exp.id)}
            >
              Remove Global Expense
            </Button>
          </div>

        </div>
      ))}

      <Button
        onClick={addExpenseItem}
        variant="primary"
        className="!mb-6 !font-medium !px-4 !py-1 !rounded-md !transition !duration-200 !border-none"
      >
        + Add Expense
      </Button>

      {/* Global Discount */}
      <div className="!border !border-gray-300 !rounded-md !p-4 !mb-6 !bg-gray-50 !w-full md:!w-1/2 md:!ml-auto">
        <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block">Global Discount</Label>
        <div className="!grid !grid-cols-2 !gap-4 !mt-2">
          <Input
            type="number"
            value={globalDiscount}
            min={0}
            onChange={(e) => {
              const inputValue = Number(e.target.value);
              const cappedValue = Math.min(inputValue, 100);
              setGlobalDiscount(Number(globalDiscountType.value == 'percent' ? cappedValue : e.target.value))
            }}
            className="!w-full !border !border-gray-300 !rounded-md !shadow-sm focus:!ring-2 focus:!ring-indigo-500 !transition"
            placeholder="Discount Value"
          />
          {errors[`globalDiscount`] && (<p className="!pt-2 !text-red-600">{errors[`globalDiscount`]}</p>)}
          <Select
            value={globalDiscountType}
            onChange={(selected) => updateGlobalDiscountType(selected)}
            options={[
              { value: "percent", label: "% - Percent" },
              { value: "amount", label: "$ - Amount" },
            ]}
            className="!w-full !border !border-gray-300 !rounded-md !shadow-sm focus:!ring-2 focus:!ring-indigo-500 !transition"
          />
          {errors[`globalDiscountType`] && (<p className="!pt-2 !text-red-600">{errors[`globalDiscountType`]}</p>)}
        </div>
      </div>

      {/* Totals Summary */}
      <div className="!w-full lg:!w-3/4 md:!ml-auto !grid !grid-rows-7 !grid-cols-3 !gap-y-4 !border !border-gray-300 !rounded-md !p-4 !my-4 !bg-gray-50">
        <div className="!text-left !font-medium !text-gray-700">Total Stock Item Price</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-red-600 !font-semibold">
          {totalStockAmount.toFixed(2)}
        </div>

        <div className="!text-left !font-medium !text-gray-700">Total Stock Item Discount</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-yellow-600 !font-semibold">
          {totalItemDiscount.toFixed(2)}
        </div>

        <div className="!text-left !font-medium !text-gray-700">Global Discount</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-purple-600 !font-semibold">
          {Number(globalDiscountAmount).toFixed(2) || 0}
        </div>

        <div className="!text-left !font-medium !text-gray-700">Total Stock Item Expense</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-blue-800 !font-semibold">
          {totalStockItemExpenses.toFixed(2)}
        </div>

        <div className="!text-left !font-medium !text-gray-700">Total Global Expense</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-indigo-600 !font-semibold">
          {globalExpenseAmount.toFixed(2)}
        </div>

        <div className="!text-left !font-medium !text-gray-700">Total Expense</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-red-800 !font-semibold">
          {totalExpenseAmount.toFixed(2)}
        </div>

        <div className="!text-left !font-medium !text-gray-700">Grand Total</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-green-600 !font-semibold">
          {grandTotal.toFixed(2)}
        </div>



        <div className="!text-left !font-medium !text-gray-700">Total Paid For Stock Item</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-teal-600 !font-semibold">
          {totalStockPaid.toFixed(2)}
        </div>

        <div className="!text-left !font-medium !text-gray-700">Total Paid For Stock Item Expense</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-teal-600 !font-semibold">
          {getTotalStockItemExpensePaid.toFixed(2)}
        </div>

        <div className="!text-left !font-medium !text-gray-700">Total Paid For Global Expense</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-teal-600 !font-semibold">
          {getTotalGlobalExpensePaid.toFixed(2)}
        </div>

        <div className="!text-left !font-medium !text-gray-700">Total Paid</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-teal-600 !font-semibold">
          {totalPaidAmount.toFixed(2)}
        </div>

        <div className="!text-left !font-medium !text-gray-700">Total Remain For Stock Item</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-orange-600 !font-semibold">
          {totalRemainAmountForStockItem.toFixed(2)}
        </div>

        <div className="!text-left !font-medium !text-gray-700">Total Remain </div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-orange-600 !font-semibold">
          {totalRemainAmount.toFixed(2)}
        </div>
        <div className="!col-span-3">
          {errors[`grandTotal`] && (<p className="!pt-2 !text-red-600">{errors[`grandTotal`]}</p>)}
          {errors[`totalPaidAmount`] && (<p className="!pt-2 !text-red-600">{errors[`totalPaidAmount`]}</p>)}
          {errors[`totalRemainAmount`] && (<p className="!pt-2 !text-red-600">{errors[`totalRemainAmount`]}</p>)}
        </div>
      </div>


      {/* Action Buttons */}
      <Box className="!flex !justify-end !gap-4 !mt-6">
        <Button
          variant="danger"
          onClick={handleCancel}
          className="!px-4 !py-2 !rounded-md !text-sm !font-medium !transition"
        >
          Cancel
        </Button>

        <Button
          variant="primary"
          onClick={handleOrder}
          className="!px-4 !py-2 !rounded-md !text-sm !font-medium !transition"
        >
          Order
        </Button>

        <Button
          variant="success"
          onClick={handleFullPurchase}
          className="!px-4 !py-2 !rounded-md !text-sm !font-medium !transition"
        >
          Full Purchase
        </Button>
      </Box>

    </div>
  );
};

export default NewPurchaseOrder;

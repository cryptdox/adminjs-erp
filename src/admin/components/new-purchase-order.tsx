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
    totalItemDiscount,
    globalDiscount,
    setGlobalDiscount,
    globalDiscountType,
    setGlobalDiscountType,
    totalExpenseAmount,
    grandTotal,
    totalPaidAmount,
    totalRemainAmount,
    handleCancel,
    handleOrder,
    handleFullPurchase,
  } = useNewPurchaseOrder(props);

  const [suppliers, setSuppliers] = useState<{
    id: string;
    name: string;
  }[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [variantMap, setVariantMap] = useState<Record<string, Variant[]>>({});
  const [warehouses, setWarehouses] = useState<{ id: string; name: string }[]>(
    []
  );
  const [expenseTypes, setExpenseTypes] = useState<{ id: string; name: string }[]>(
    []
  );
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
        ...new Set(stockItems.map((item) => item.productId).filter(Boolean)),
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
  }, [stockItems.map((i) => i.productId).join(",")]);

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
      </div>


      {/* Stock Items */}
      <h3 className="!text-xl !font-semibold !mb-4 !text-indigo-500 !pb-2">
        Stock Items
      </h3>

      {stockItems.map((item) => {
        const variants = item.productId ? variantMap[item.productId] || [] : [];
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
                  value={item.productId || ""}
                  onChange={(selected) =>
                    updateStockItem(item.id, {
                      productId: selected || "",
                      variantId: "",
                    })
                  }
                  options={products.map((p) => ({
                    value: p.id,
                    label: p.name,
                  }))}
                  placeholder="Select Product"
                  className="!w-full !border !border-slate-300 !rounded-md !shadow-sm !transition focus:!ring-2 focus:!ring-indigo-500"
                />
              </div>

              <div>
                <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block">Variant</Label>
                <Select
                  value={item.variantId || ""}
                  onChange={(selected) =>
                    updateStockItem(item.id, { variantId: selected || "" })
                  }
                  options={variants.map((v) => ({
                    value: v.id,
                    label: v.name,
                  }))}
                  isDisabled={!item.productId}
                  isLoading={variantLoader}
                  placeholder="Select Variant"
                  className="!w-full !border !border-slate-300 !rounded-md !shadow-sm !transition focus:!ring-2 focus:!ring-indigo-500"
                />
              </div>

              <div>
                <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block">Warehouse</Label>
                <Select
                  value={item.warehouseId || ""}
                  onChange={(selected) =>
                    updateStockItem(item.id, { warehouseId: selected || "" })
                  }
                  options={warehouses.map((w) => ({
                    value: w.id,
                    label: w.name,
                  }))}
                  placeholder="Select Warehouse"
                  className="!w-full !border !border-slate-300 !rounded-md !shadow-sm !transition focus:!ring-2 focus:!ring-indigo-500"
                />
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
                  className="!w-full !border !border-slate-300 !rounded-md !shadow-sm focus:!ring-2 focus:!ring-indigo-500 !transition"
                />
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
                  className="!w-full !border !border-slate-300 !rounded-md !shadow-sm focus:!ring-2 focus:!ring-indigo-500 !transition"
                />
              </div>
            </div>

            <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-4 !mt-4">
              <div>
                <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block">Discount</Label>
                <Input
                  type="number"
                  value={item.discount}
                  onChange={(e) =>
                    updateStockItem(item.id, {
                      discount: Number(e.target.value),
                    })
                  }
                  className="!w-full !border !border-slate-300 !rounded-md !shadow-sm focus:!ring-2 focus:!ring-yellow-400 !transition"
                />
              </div>

              <div>
                <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block">Discount Type</Label>
                <Select
                  value={item.discountType || ""}
                  onChange={(selected) =>
                    updateDiscountType(item.id, {
                      discountType: selected || {
                        value: "amount",
                        label: "$ - Amount",
                      },
                    })
                  }
                  options={[
                    { value: "percent", label: "% - Percent" },
                    { value: "amount", label: "$ - Amount" },
                  ]}
                  placeholder="Select Discount Type"
                  className="!w-full"
                />
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
                      const cappedValue = Math.min(inputValue, item.discountPrice);
                      updateStockItem(item.id, { paid: cappedValue });
                    }}
                    max={item.discountPrice}
                    className="!w-full !border border-slate-300 !rounded-md !shadow-sm focus:!ring-2 focus:!ring-indigo-500 !transition"
                  />
                  <div className="!flex !items-center !gap-1">
                    <input
                      type="checkbox"
                      id={`auto-paid-${item.id}`}
                      checked={item.paid === item.discountPrice}
                      onChange={(e) =>
                        updateStockItem(item.id, {
                          paid: e.target.checked ? item.discountPrice : 0,
                        })
                      }
                      className="!w-4 !h-4 !accent-indigo-600"
                    />
                    <label htmlFor={`auto-paid-${item.id}`} className="!text-sm !text-gray-600">All</label>
                  </div>
                </div>
              </div>

              <div>
                <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block">Quantity</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={item.receivedQuantity}
                    onChange={(e) => {
                      const inputValue = Number(e.target.value);
                      const cappedValue = Math.min(inputValue, item.quantity);
                      updateStockItem(item.id, { receivedQuantity: cappedValue });
                    }}
                    max={item.quantity}
                    className="!w-full !border !border-slate-300 !rounded-md !shadow-sm focus:!ring-2 focus:!ring-indigo-500 !transition"
                  />
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
                <Label className="!text-sm !font-semibold !text-gray-700 !mb-1 !block">Discounted Price</Label>
                <Input
                  type="number"
                  value={item.discountPrice}
                  readOnly
                  className="!w-full !bg-indigo-50 !text-indigo-800 !font-semibold !border !border-indigo-200 !rounded-md !shadow-sm"
                />
              </div>

              <div>
                <Label className="!text-sm !font-semibold !text-gray-700 !mb-1 !block">Remaining</Label>
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
                className="!px-5 !py-2 !rounded-md !text-sm !transition"
                onClick={() => removeStockItem(item.id)}
              >
                Remove
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

      {expenses.map((exp) => (
        <div
          key={exp.id}
          className="!border !border-indigo-200 !rounded-xl !p-5 !mb-6 !bg-indigo-50/20 shadow-sm transition hover:shadow-md"
        >
          <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-4">
            <div>
              <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block"> Expense To</Label>
              <Select
                value={exp.partnerId || ""}
                onChange={(selected) =>
                  updateExpenseItem(exp.id, { partnerId: selected || "" })
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
            </div>

            <div>
              <Label className="!text-sm !font-semibold !text-gray-500 !mb-1 !block"> Type
              </Label>
              <Select
                value={exp.expenseTypeId || ""}
                onChange={(selected) =>
                  updateExpenseItem(exp.id, { expenseTypeId: selected || "" })
                }
                options={expenseTypes.map((t) => ({
                  value: t.id,
                  label: t.name,
                }))}
                placeholder="Select Type"
                className="!w-full !border !border-slate-300 !rounded-md !shadow-sm !transition focus:!ring-2 focus:!ring-indigo-500"
              />
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
            </div>
          </div>

          <div className="!flex !justify-end !mt-6">
            <Button
              variant="danger"
              className="!px-5 !py-2 !rounded-md !text-sm !transition"
              onClick={() => removeExpenseItem(exp.id)}
            >
              Remove
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
            onChange={(e) => setGlobalDiscount(Number(e.target.value))}
            className="!w-full !border !border-gray-300 !rounded-md !shadow-sm focus:!ring-2 focus:!ring-indigo-500 !transition"
            placeholder="Discount Value"
          />
          <Select
            value={globalDiscountType}
            onChange={(selected) =>
              setGlobalDiscountType(
                selected || { value: "amount", label: "$ - Amount" }
              )
            }
            options={[
              { value: "percent", label: "% - Percent" },
              { value: "amount", label: "$ - Amount" },
            ]}
            className="!w-full !border !border-gray-300 !rounded-md !shadow-sm focus:!ring-2 focus:!ring-indigo-500 !transition"
          />
        </div>
      </div>

      {/* Totals Summary */}
      <div className="!w-full md:!w-1/2 md:!ml-auto !grid !grid-rows-7 !grid-cols-3 !gap-y-4 !border !border-gray-300 !rounded-md !p-4 !my-4 !bg-gray-50">
        <div className="!text-left !font-medium !text-gray-700">Total Stock</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-red-600 !font-semibold">
          {totalStockAmount.toFixed(2)}
        </div>

        <div className="!text-left !font-medium !text-gray-700">Total Item Discount</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-yellow-600 !font-semibold">
          {totalItemDiscount.toFixed(2)}
        </div>

        <div className="!text-left !font-medium !text-gray-700">Global Discount</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-purple-600 !font-semibold">
          {globalDiscountType.value === "percent"
            ? (
              ((totalStockAmount - totalItemDiscount) * globalDiscount) /
              100
            ).toFixed(2)
            : Number(globalDiscount).toFixed(2)}
        </div>

        <div className="!text-left !font-medium !text-gray-700">Total Expense</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-indigo-600 !font-semibold">
          {totalExpenseAmount.toFixed(2)}
        </div>

        <div className="!text-left !font-medium !text-gray-700">Grand Total</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-green-600 !font-semibold">
          {grandTotal.toFixed(2)}
        </div>

        <div className="!text-left !font-medium !text-gray-700">Total Paid</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-teal-600 !font-semibold">
          {totalPaidAmount.toFixed(2)}
        </div>

        <div className="!text-left !font-medium !text-gray-700">Total Remain</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-orange-600 !font-semibold">
          {totalRemainAmount.toFixed(2)}
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

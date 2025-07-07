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
      <h2 className="!text-2xl !font-bold !mb-6 !text-gray-800">
        New Purchase Order
      </h2>

      {/* Order Number and Supplier */}
      <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-4 !mb-6">
        <div>
          <Label>Order Number</Label>
          <Label className="!w-full !text-md !font-semibold !p-2 !bg-gray-100 !text-gray-700">
            {orderNumber}
          </Label>
        </div>

        <div>
          <Label>Supplier</Label>
          <Select
            value={selectedSupplier || ""}
            onChange={(selected) => setSelectedSupplier(selected || "")}
            options={suppliers.map((sup) => ({
              value: sup.id,
              label: sup.name,
            }))}
            placeholder="Select Supplier"
            className="!w-full"
          />
        </div>
      </div>

      {/* Note */}
      <div className="!mb-6">
        <Label>Note</Label>
        <TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="!w-full !p-2 !border !rounded-md !resize-none"
          placeholder="Optional notes"
        />
      </div>

      {/* Stock Items */}
      <h3 className="!text-lg !mb-4 !text-gray-800">Stock Items</h3>
      {stockItems.map((item) => {
        const variants = item.productId ? variantMap[item.productId] || [] : [];
        const calculatedUnit = calculateExpensePerUnit(item).toFixed(2);
        return (
          <div
            key={item.id}
            className="!border !border-gray-300 !rounded-md !p-4 !mb-4 !bg-gray-50"
          >
            <div className="!grid !grid-cols-1 md:!grid-cols-3 !gap-4">
              <div>
                <Label>Product</Label>
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
                  className="!w-full"
                />
              </div>

              <div>
                <Label>Variant</Label>
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
                  className="!w-full"
                />
              </div>

              <div>
                <Label>Warehouse</Label>
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
                  className="!w-full"
                />
              </div>
            </div>

            <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-4 !mt-4">
              <div>
                <Label>Manufacture Date</Label>
                <Input
                  type="date"
                  value={item.manufactureDate}
                  onChange={(e) =>
                    updateStockItem(item.id, {
                      manufactureDate: e.target.value,
                    })
                  }
                  className="!w-full"
                />
              </div>
              <div>
                <Label>Expiry Date</Label>
                <Input
                  type="date"
                  value={item.expiryDate}
                  onChange={(e) =>
                    updateStockItem(item.id, {
                      expiryDate: e.target.value,
                    })
                  }
                  className="!w-full"
                />
              </div>
            </div>

            <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-4 !mt-4">
              <div>
                <Label>Unit Price</Label>
                <Input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) =>
                    updateStockItem(item.id, {
                      unitPrice: Number(e.target.value),
                    })
                  }
                  className="!w-full"
                />
              </div>
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateStockItem(item.id, {
                      quantity: Number(e.target.value),
                    })
                  }
                  className="!w-full"
                />
              </div>
            </div>

            <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-4 !mt-4">
              <div>
                <Label>Paid Amount</Label>
                <Input
                  type="number"
                  value={item.paid}
                  onChange={(e) =>
                    updateStockItem(item.id, {
                      paid: Number(e.target.value),
                    })
                  }
                  className="!w-full"
                />
              </div>
              <div>
                <Label>Received Quantity</Label>
                <Input
                  type="number"
                  value={item.receivedQuantity}
                  onChange={(e) =>
                    updateStockItem(item.id, {
                      receivedQuantity: Number(e.target.value),
                    })
                  }
                  className="!w-full"
                />
              </div>
            </div>

            <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-4 !mt-4">
              <div>
                <Label>Discount</Label>
                <Input
                  type="number"
                  value={item.discount}
                  onChange={(e) =>
                    updateStockItem(item.id, {
                      discount: Number(e.target.value),
                    })
                  }
                  className="!w-full"
                />
              </div>
              <div>
                <Label>Discount Type</Label>
                <Select
                  value={item.discountType || ""}
                  onChange={(selected) =>
                    updateDiscountType(item.id, {
                      discountType: selected || { value: "amount", label: "$ - Amount" },
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
                <Label>Total Price</Label>
                <Input
                  type="number"
                  value={item.totalPrice}
                  readOnly
                  className="!w-full !bg-gray-100 !text-green-700"
                />
              </div>
              <div>
                <Label>After Discount</Label>
                <Input
                  type="number"
                  value={item.totalPrice - (item.discountType.value == "percent" ? (Number(item.totalPrice * item.discount) / 100) : Number(item.discount.toFixed(2)))}
                  readOnly
                  className="!w-full !bg-gray-100 !text-green-700"
                />
              </div>
            </div>

            <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-4 !mt-4">
              <div>
                <Label>Remain</Label>
                <Input
                  type="number"
                  value={item.remain}
                  readOnly
                  className="!w-full !bg-gray-100 !text-green-700"
                />
              </div>
              <div>
                <Label>Current - Cost / Unit</Label>
                <Input
                  type="text"
                  readOnly
                  value={`Cost / Unit: ${calculatedUnit}`}
                  className="!w-full !bg-gray-100 !text-green-700"
                />
              </div>
            </div>

            <div className="!flex !justify-end !mt-4">
              <Button
                variant="danger"
                className="!mt-4"
                // className="!w-full"
                onClick={() => removeStockItem(item.id)}
              >
                Remove
              </Button>
            </div>
          </div>
        );
      })}

      <Button onClick={addStockItem} className="!mb-6">
        + Add Stock Item
      </Button>

      {/* Expenses Section */}
      <h3 className="!text-lg !mb-4 !text-gray-800">Expenses</h3>

      {expenses.map((exp) => (
        <div
          key={exp.id}
          className="!border !border-gray-300 !rounded-md !p-4 !mb-4 !bg-gray-50"
        >
          <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-4">
            <div>
              <Label>Expense To</Label>
              <Select
                value={exp.partnerId || ""}
                onChange={(selected) =>
                  updateExpenseItem(exp.id, { partnerId: selected || "" })
                }
                options={suppliers.map((s) => ({
                  value: s.id,
                  label: s.name,
                }))}
                className="!w-full"
              />
            </div>

            <div>
              <Label>Type</Label>
              <Select
                value={exp.expenseTypeId || ""}
                onChange={(selected) =>
                  updateExpenseItem(exp.id, { expenseTypeId: selected || "" })
                }
                options={expenseTypes.map((t) => ({
                  value: t.id,
                  label: t.name,
                }))}
                className="!w-full"
              />
            </div>

            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                value={exp.totalAmount}
                onChange={(e) =>
                  updateExpenseItem(exp.id, {
                    totalAmount: Number(e.target.value),
                  })
                }
                className="!w-full"
              />
            </div>

            <div>
              <Label>Paid Amount</Label>
              <Input
                type="number"
                value={exp.paidAmount}
                onChange={(e) =>
                  updateExpenseItem(exp.id, {
                    paidAmount: Number(e.target.value),
                  })
                }
                className="!w-full"
              />
            </div>

            <div className="sm:col-span-2">
              <Label>Note</Label>
              <TextArea
                rows={2}
                value={exp.note}
                onChange={(e) =>
                  updateExpenseItem(exp.id, { note: e.target.value })
                }
                className="!w-full"
              />
            </div>
          </div>

          <div className="!flex !justify-end !mt-4">
            <Button variant="danger" onClick={() => removeExpenseItem(exp.id)}>
              Remove
            </Button>
          </div>
        </div>
      ))}

      <Button onClick={addExpenseItem} className="!mb-6">
        + Add Expense
      </Button>

      {/* Global Discount */}
      <div className="!border !border-gray-300 !rounded-md !p-4 !mb-6 !bg-gray-50 !w-full md:!w-1/2 md:!ml-auto">
        <Label>Global Discount</Label>
        <div className="!grid !grid-cols-2 !gap-4 !mt-2">
          <Input
            type="number"
            value={globalDiscount}
            onChange={(e) => setGlobalDiscount(Number(e.target.value))}
            className="!w-full"
            placeholder="Discount Value"
          />
          <Select
            value={globalDiscountType}
            onChange={(selected) => setGlobalDiscountType(selected || "amount")}
            options={[
              { value: "percent", label: "% - Percent" },
              { value: "amount", label: "$ - Amount" },
            ]}
            className="!w-full"
          />
        </div>
      </div>

      {/* Totals Summary */}
      <div className="!w-full md:!w-1/2 md:!ml-auto !grid !grid-rows-7 !grid-cols-3 !gap-y-4 !border !border-gray-300 !rounded-md !p-4 !my-4 !bg-gray-50">
        <div className="!text-left">Total Stock</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-red-600">
          {totalStockAmount.toFixed(2)}
        </div>

        <div className="!text-left">Total Item Discount</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-yellow-600">
          {totalItemDiscount.toFixed(2)}
        </div>

        <div className="!text-left">Global Discount</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-purple-600">
          {globalDiscountType.value === "percent"
            ? ((totalStockAmount - totalItemDiscount) * globalDiscount) / 100
            : globalDiscount.toFixed(2)}
        </div>

        <div className="!text-left">Total Expense</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-indigo-600">
          {totalExpenseAmount.toFixed(2)}
        </div>

        <div className="!text-left">Grand Total</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-green-600">
          {grandTotal.toFixed(2)}
        </div>

        <div className="!text-left">Total Paid</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-blue-600">
          {totalPaidAmount.toFixed(2)}
        </div>

        <div className="!text-left">Total Remain</div>
        <div className="!text-center">:</div>
        <div className="!text-right !text-orange-600">
          {totalRemainAmount.toFixed(2)}
        </div>
      </div>

      {/* Action Buttons */}
      <Box
        display="flex"
        justifyContent="flex-end"
        gap="lg"
        className="!flex !justify-end !space-x-4"
      >
        <Button variant="danger" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleOrder}>
          Order
        </Button>
        <Button variant="success" onClick={handleFullPurchase}>
          Full Purchase
        </Button>
      </Box>
    </div>
  );
};

export default NewPurchaseOrder;

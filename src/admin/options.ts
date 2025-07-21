import { AdminJSOptions } from 'adminjs';

import componentLoader from './component-loader.js';
import { UserResource } from './resources/user.config.adminjs.js';
import { RoleResource } from './resources/role.config.adminjs.js';
import { PermissionResource } from './resources/permission.config.adminjs.js';
import { RolePermissionResource } from './resources/role-permission.config.adminjs.js';
import { ProductCategoryResource } from './resources/product-category.config.adminjs.js';
import { ProductResource } from './resources/product.config.adminjs.js';
import { VariantResource } from './resources/variant.config.adminjs.js';
import { WarehouseResource } from './resources/warehouse.config.adminjs.js';
import { BatchResource } from './resources/batch.config.adminjs.js';
import { LotResource } from './resources/lot.config.adminjs.js';
import { StockExchangeTypeResource } from './resources/stock-exchange-type.config.adminjs.js';
import { stockExchangeStatusResource } from './resources/stock-exchange-status.config.adminjs.js';
import { StockExchangeResource } from './resources/stock-exchange.config.adminjs.js';
import { ManufactureResource } from './resources/manufacture.config.adminjs.js';
import { ManufactureInputResource } from './resources/manufacture-input.config.adminjs.js';
import { ManufactureOutputResource } from './resources/manufacture-output.config.adminjs.js';
import { AccountTypeResource } from './resources/account-type.config.adminjs.js';
import { AccountResource } from './resources/account.config.adminjs.js';
import { InvestmentTransactionResource, TransactionResource } from './resources/transaction.config.adminjs.js';
import { LedgerEntryResource } from './resources/ledger-entry.config.adminjs.js';
import { PartnerResource } from './resources/partner.config.adminjs.js';
import { ShareHolderProfitShareResource } from './resources/share-holder-profit-share.config.adminjs.js';
import { InvoiceTypeResource } from './resources/invoice-type.config.adminjs.js';
import { InvoiceResource } from './resources/invoice.config.adminjs.js';
import { InvoiceItemResource } from './resources/invoice-item.config.adminjs.js';
import { OrderStatusResource } from './resources/order-status.config.adminjs.js';
import { PurchaseOrderResource } from './resources/purchase-order.config.adminjs.js';
import { PurchaseOrderStatusHistoryResource } from './resources/purchase-order-status-history.config.adminjs.js';
import { SaleOrderResource } from './resources/sale-order.config.adminjs.js';
import { SaleOrderStatusHistoryResource } from './resources/sale-order-status-history.config.adminjs.js';
import { ExpenseTypeResource } from './resources/expense-type.config.adminjs.js';
import { ExpenseResource } from './resources/expense.config.adminjs.js';
import { ExpenseStatusResource } from './resources/expense-status.config.adminjs.js';
import { PaymentStatusResource } from './resources/payment-status.config.adminjs.js';
import { RelatedTypeResource } from './resources/related-type.config.adminjs.js';
import { PaymentResource } from './resources/payment.config.adminjs.js';
import { AuditLogResource } from './resources/audit-log.config.adminjs.js';
import { SettingOptionResource } from './resources/setting-option.config.adminjs.js';
import { SettingTypeResource } from './resources/setting-type.config.adminjs.js';
import { SettingResource } from './resources/setting.config.adminjs.js';
import AdminComponents from './components/admin.components.js';
import applicationCOnfiguration from '../utils/config.js';
import { UnitResource } from './resources/unit.config.adminjs.js';
import { UnitConversionResource } from './resources/unit-conversion.config.adminjs.js';
import { InvestmentProfileResource } from './resources/investment-profile.config.adminjs.js';
import { InvestmentProfileInvestorResource } from './resources/invetment-profile-investor.config.adminjs.js';
import { TenantResource } from './resources/tenant.config.adminjs.js';
import { SubscriptionResource } from './resources/subscription.config.adminjs.js';
import { PackageResource } from './resources/package.config.adminjs.js';
import { PackagePermissionResource } from './resources/package-permission.config.adminjs.js';
import { SubscriptionPaymentCouponResource } from './resources/subscription-payment-coupon.config.adminjs.js';
import { SubscriptionPaymentResource } from './resources/subscription-payment.config.adminjs.js';

const options: AdminJSOptions = {
  componentLoader,
  rootPath: '/admin',
  assets: {
    styles: ['/styles/index.css', '/styles/output.css'],
  },
  branding: {
    logo: '/images/logo.svg',
    favicon: '/images/favicon.svg',
    companyName: applicationCOnfiguration.companyName,
  },
  dashboard: {
    component: AdminComponents.Dashboard,
  },
  resources: [
    UserResource,
    RoleResource,
    PermissionResource,
    RolePermissionResource,
    TenantResource,
    SubscriptionResource,
    PackageResource,
    PackagePermissionResource,
    SubscriptionPaymentCouponResource,
    SubscriptionPaymentResource,
    UnitResource,
    UnitConversionResource,
    ProductCategoryResource,
    ProductResource,
    VariantResource,
    WarehouseResource,
    BatchResource,
    LotResource,
    StockExchangeTypeResource,
    stockExchangeStatusResource,
    StockExchangeResource,
    ManufactureResource,
    ManufactureInputResource,
    ManufactureOutputResource,
    AccountTypeResource,
    AccountResource,
    InvestmentTransactionResource,
    TransactionResource,
    LedgerEntryResource,
    InvestmentProfileResource,
    InvestmentProfileInvestorResource,
    PartnerResource,
    ShareHolderProfitShareResource,
    InvoiceTypeResource,
    InvoiceResource,
    InvoiceItemResource,
    OrderStatusResource,
    PurchaseOrderResource,
    PurchaseOrderStatusHistoryResource,
    SaleOrderResource,
    SaleOrderStatusHistoryResource,
    ExpenseTypeResource,
    ExpenseResource,
    ExpenseStatusResource,
    PaymentStatusResource,
    RelatedTypeResource,
    PaymentResource,
    AuditLogResource,
    SettingOptionResource,
    SettingTypeResource,
    SettingResource,
  ],
  // databases: [],
};

export default options;

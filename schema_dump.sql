--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Ubuntu 17.5-1.pgdg24.04+1)
-- Dumped by pg_dump version 17.5 (Ubuntu 17.5-1.pgdg24.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DiscountType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DiscountType" AS ENUM (
    'PERCENT',
    'AMOUNT'
);


ALTER TYPE public."DiscountType" OWNER TO postgres;

--
-- Name: LedgerEntryType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LedgerEntryType" AS ENUM (
    'DEBIT',
    'CREDIT'
);


ALTER TYPE public."LedgerEntryType" OWNER TO postgres;

--
-- Name: PartnerType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PartnerType" AS ENUM (
    'SUPPLIER',
    'CUSTOMER',
    'SHAREHOLDER'
);


ALTER TYPE public."PartnerType" OWNER TO postgres;

--
-- Name: UnitGroup; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UnitGroup" AS ENUM (
    'WEIGHT',
    'VOLUME',
    'COUNT'
);


ALTER TYPE public."UnitGroup" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    name text NOT NULL,
    "typeId" text NOT NULL,
    balance numeric(65,30) DEFAULT 0.0 NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Account" OWNER TO postgres;

--
-- Name: AccountType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AccountType" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "parentId" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AccountType" OWNER TO postgres;

--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AuditLog" (
    id text NOT NULL,
    action text NOT NULL,
    entity text NOT NULL,
    "entityId" text,
    description text,
    data jsonb,
    "ipAddress" text,
    "userAgent" text,
    "performedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AuditLog" OWNER TO postgres;

--
-- Name: Batch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Batch" (
    id text NOT NULL,
    "batchNumber" text NOT NULL,
    "manufactureDate" timestamp(3) without time zone,
    "expiryDate" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Batch" OWNER TO postgres;

--
-- Name: Expense; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Expense" (
    id text NOT NULL,
    "orderNumber" text NOT NULL,
    "expenseTypeId" text NOT NULL,
    "partnerId" text NOT NULL,
    "orderDate" timestamp(3) without time zone NOT NULL,
    note text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" text,
    "expenseStatusId" text NOT NULL,
    "invoiceId" text,
    "invoiceItemId" text
);


ALTER TABLE public."Expense" OWNER TO postgres;

--
-- Name: ExpenseStatus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ExpenseStatus" (
    id text NOT NULL,
    name text NOT NULL,
    "displayName" text NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ExpenseStatus" OWNER TO postgres;

--
-- Name: ExpenseType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ExpenseType" (
    id text NOT NULL,
    name text NOT NULL,
    "displayName" text NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ExpenseType" OWNER TO postgres;

--
-- Name: Invoice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Invoice" (
    id text NOT NULL,
    "invoiceNumber" text NOT NULL,
    "invoiceTypeId" text NOT NULL,
    "accountId" text NOT NULL,
    "invoiceDate" timestamp(3) without time zone NOT NULL,
    "dueDate" timestamp(3) without time zone,
    "totalAmount" numeric(65,30) DEFAULT 0.0 NOT NULL,
    "paidAmount" numeric(65,30) DEFAULT 0.0 NOT NULL,
    note text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "purchaseOrderId" text,
    "saleOrderId" text,
    "userId" text
);


ALTER TABLE public."Invoice" OWNER TO postgres;

--
-- Name: InvoiceItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."InvoiceItem" (
    id text NOT NULL,
    name text,
    "invoiceId" text NOT NULL,
    "stockId" text NOT NULL,
    "unitPrice" numeric(65,30),
    discount numeric(65,30),
    "discountType" public."DiscountType" DEFAULT 'AMOUNT'::public."DiscountType" NOT NULL,
    note text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."InvoiceItem" OWNER TO postgres;

--
-- Name: InvoiceType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."InvoiceType" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."InvoiceType" OWNER TO postgres;

--
-- Name: LedgerEntry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LedgerEntry" (
    id text NOT NULL,
    "accountId" text NOT NULL,
    "transactionId" text NOT NULL,
    type public."LedgerEntryType" NOT NULL,
    amount numeric(65,30) NOT NULL,
    "balanceAfter" numeric(65,30) NOT NULL,
    note text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LedgerEntry" OWNER TO postgres;

--
-- Name: Lot; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Lot" (
    id text NOT NULL,
    "lotNumber" text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Lot" OWNER TO postgres;

--
-- Name: Manufacture; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Manufacture" (
    id text NOT NULL,
    type text NOT NULL,
    "startedAt" timestamp(3) without time zone NOT NULL,
    "completedAt" timestamp(3) without time zone,
    note text,
    "isActive" boolean DEFAULT false NOT NULL,
    "isAllowed" boolean DEFAULT false NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Manufacture" OWNER TO postgres;

--
-- Name: ManufactureInput; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ManufactureInput" (
    id text NOT NULL,
    "manufactureId" text NOT NULL,
    "stockId" text NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    "isAllowed" boolean DEFAULT false NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ManufactureInput" OWNER TO postgres;

--
-- Name: ManufactureOutput; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ManufactureOutput" (
    id text NOT NULL,
    "manufactureId" text NOT NULL,
    "stockId" text NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    "isAllowed" boolean DEFAULT false NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ManufactureOutput" OWNER TO postgres;

--
-- Name: OrderStatus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderStatus" (
    id text NOT NULL,
    name text NOT NULL,
    "displayName" text NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."OrderStatus" OWNER TO postgres;

--
-- Name: Partner; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Partner" (
    id text NOT NULL,
    name text NOT NULL,
    type public."PartnerType" NOT NULL,
    email text,
    phone text,
    address text,
    nid text,
    "userId" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "accountId" text
);


ALTER TABLE public."Partner" OWNER TO postgres;

--
-- Name: Payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Payment" (
    id text NOT NULL,
    amount double precision NOT NULL,
    currency text DEFAULT 'BDT'::text NOT NULL,
    "paymentMethod" text NOT NULL,
    "paidAt" timestamp(3) without time zone,
    "referenceNo" text,
    note text,
    "statusId" text NOT NULL,
    "relatedTypeId" text NOT NULL,
    "relatedId" text NOT NULL,
    "createdById" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Payment" OWNER TO postgres;

--
-- Name: PaymentStatus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PaymentStatus" (
    id text NOT NULL,
    code text NOT NULL,
    label text NOT NULL,
    description text,
    color text
);


ALTER TABLE public."PaymentStatus" OWNER TO postgres;

--
-- Name: Permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Permission" (
    id text NOT NULL,
    resource text NOT NULL,
    action text NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Permission" OWNER TO postgres;

--
-- Name: Product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Product" (
    id text NOT NULL,
    name text NOT NULL,
    sku text,
    "categoryId" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Product" OWNER TO postgres;

--
-- Name: ProductCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProductCategory" (
    id text NOT NULL,
    name text NOT NULL,
    "parentId" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ProductCategory" OWNER TO postgres;

--
-- Name: PurchaseOrder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PurchaseOrder" (
    id text NOT NULL,
    "orderNumber" text NOT NULL,
    "partnerId" text NOT NULL,
    "orderDate" timestamp(3) without time zone NOT NULL,
    note text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PurchaseOrder" OWNER TO postgres;

--
-- Name: PurchaseOrderStatusHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PurchaseOrderStatusHistory" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "statusId" text NOT NULL,
    "changedById" text,
    note text,
    "changedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PurchaseOrderStatusHistory" OWNER TO postgres;

--
-- Name: RelatedType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RelatedType" (
    id text NOT NULL,
    code text NOT NULL,
    label text NOT NULL,
    description text
);


ALTER TABLE public."RelatedType" OWNER TO postgres;

--
-- Name: Role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Role" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Role" OWNER TO postgres;

--
-- Name: RolePermission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RolePermission" (
    id text NOT NULL,
    "roleId" text NOT NULL,
    "permissionId" text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."RolePermission" OWNER TO postgres;

--
-- Name: SaleOrder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SaleOrder" (
    id text NOT NULL,
    "orderNumber" text NOT NULL,
    "partnerId" text NOT NULL,
    "orderDate" timestamp(3) without time zone NOT NULL,
    note text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SaleOrder" OWNER TO postgres;

--
-- Name: SaleOrderStatusHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SaleOrderStatusHistory" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "statusId" text NOT NULL,
    "changedById" text,
    note text,
    "changedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SaleOrderStatusHistory" OWNER TO postgres;

--
-- Name: Setting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Setting" (
    id text NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    "typeId" text NOT NULL,
    "group" text,
    description text,
    "isEditable" boolean DEFAULT true NOT NULL,
    "isVisible" boolean DEFAULT true NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Setting" OWNER TO postgres;

--
-- Name: SettingOption; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SettingOption" (
    id text NOT NULL,
    label text NOT NULL,
    value text NOT NULL,
    "settingId" text NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SettingOption" OWNER TO postgres;

--
-- Name: SettingType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SettingType" (
    id text NOT NULL,
    name text NOT NULL,
    label text NOT NULL,
    description text,
    "uiComponent" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SettingType" OWNER TO postgres;

--
-- Name: ShareHolderProfitShare; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ShareHolderProfitShare" (
    id text NOT NULL,
    "partnerId" text NOT NULL,
    month integer NOT NULL,
    year integer NOT NULL,
    "sharePercent" numeric(65,30) NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ShareHolderProfitShare" OWNER TO postgres;

--
-- Name: Stock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Stock" (
    id text NOT NULL,
    "productVariantId" text NOT NULL,
    "warehouseId" text NOT NULL,
    "lotId" text,
    "batchId" text,
    note text,
    quantity integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdById" text,
    "stockExchangeStatusId" text,
    "stockExchangeTypeId" text
);


ALTER TABLE public."Stock" OWNER TO postgres;

--
-- Name: stockExchangeStatus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."stockExchangeStatus" (
    id text NOT NULL,
    name text NOT NULL,
    "displayName" text NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."stockExchangeStatus" OWNER TO postgres;

--
-- Name: StockExchangeType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StockExchangeType" (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."StockExchangeType" OWNER TO postgres;

--
-- Name: Transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Transaction" (
    id text NOT NULL,
    "fromAccountId" text NOT NULL,
    "toAccountId" text NOT NULL,
    amount numeric(65,30) DEFAULT 0.0 NOT NULL,
    type text NOT NULL,
    note text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "invoiceId" text
);


ALTER TABLE public."Transaction" OWNER TO postgres;

--
-- Name: Unit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Unit" (
    id text NOT NULL,
    name text NOT NULL,
    label text NOT NULL,
    "group" public."UnitGroup",
    "isBase" boolean DEFAULT false NOT NULL,
    "minValue" double precision,
    "maxValue" double precision,
    step double precision,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Unit" OWNER TO postgres;

--
-- Name: UnitConversion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UnitConversion" (
    id text NOT NULL,
    "fromUnitId" text NOT NULL,
    "toUnitId" text NOT NULL,
    multiplier double precision NOT NULL,
    note text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."UnitConversion" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    "firstName" text,
    "lastName" text,
    "userName" text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "emailVerified" boolean DEFAULT true NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "roleId" text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: Variant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Variant" (
    id text NOT NULL,
    name text,
    "productId" text NOT NULL,
    attributes jsonb NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Variant" OWNER TO postgres;

--
-- Name: Warehouse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Warehouse" (
    id text NOT NULL,
    name text NOT NULL,
    location text,
    contact text,
    capacity integer,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAllowed" boolean DEFAULT true NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Warehouse" OWNER TO postgres;

--
-- Name: AccountType AccountType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AccountType"
    ADD CONSTRAINT "AccountType_pkey" PRIMARY KEY (id);


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: Batch Batch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Batch"
    ADD CONSTRAINT "Batch_pkey" PRIMARY KEY (id);


--
-- Name: ExpenseStatus ExpenseStatus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExpenseStatus"
    ADD CONSTRAINT "ExpenseStatus_pkey" PRIMARY KEY (id);


--
-- Name: ExpenseType ExpenseType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExpenseType"
    ADD CONSTRAINT "ExpenseType_pkey" PRIMARY KEY (id);


--
-- Name: Expense Expense_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expense"
    ADD CONSTRAINT "Expense_pkey" PRIMARY KEY (id);


--
-- Name: InvoiceItem InvoiceItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InvoiceItem"
    ADD CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY (id);


--
-- Name: InvoiceType InvoiceType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InvoiceType"
    ADD CONSTRAINT "InvoiceType_pkey" PRIMARY KEY (id);


--
-- Name: Invoice Invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_pkey" PRIMARY KEY (id);


--
-- Name: LedgerEntry LedgerEntry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LedgerEntry"
    ADD CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY (id);


--
-- Name: Lot Lot_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lot"
    ADD CONSTRAINT "Lot_pkey" PRIMARY KEY (id);


--
-- Name: ManufactureInput ManufactureInput_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ManufactureInput"
    ADD CONSTRAINT "ManufactureInput_pkey" PRIMARY KEY (id);


--
-- Name: ManufactureOutput ManufactureOutput_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ManufactureOutput"
    ADD CONSTRAINT "ManufactureOutput_pkey" PRIMARY KEY (id);


--
-- Name: Manufacture Manufacture_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Manufacture"
    ADD CONSTRAINT "Manufacture_pkey" PRIMARY KEY (id);


--
-- Name: OrderStatus OrderStatus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderStatus"
    ADD CONSTRAINT "OrderStatus_pkey" PRIMARY KEY (id);


--
-- Name: Partner Partner_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Partner"
    ADD CONSTRAINT "Partner_pkey" PRIMARY KEY (id);


--
-- Name: PaymentStatus PaymentStatus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentStatus"
    ADD CONSTRAINT "PaymentStatus_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: Permission Permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_pkey" PRIMARY KEY (id);


--
-- Name: ProductCategory ProductCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductCategory"
    ADD CONSTRAINT "ProductCategory_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: PurchaseOrderStatusHistory PurchaseOrderStatusHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrderStatusHistory"
    ADD CONSTRAINT "PurchaseOrderStatusHistory_pkey" PRIMARY KEY (id);


--
-- Name: PurchaseOrder PurchaseOrder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrder"
    ADD CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY (id);


--
-- Name: RelatedType RelatedType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RelatedType"
    ADD CONSTRAINT "RelatedType_pkey" PRIMARY KEY (id);


--
-- Name: RolePermission RolePermission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY (id);


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- Name: SaleOrderStatusHistory SaleOrderStatusHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SaleOrderStatusHistory"
    ADD CONSTRAINT "SaleOrderStatusHistory_pkey" PRIMARY KEY (id);


--
-- Name: SaleOrder SaleOrder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SaleOrder"
    ADD CONSTRAINT "SaleOrder_pkey" PRIMARY KEY (id);


--
-- Name: SettingOption SettingOption_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SettingOption"
    ADD CONSTRAINT "SettingOption_pkey" PRIMARY KEY (id);


--
-- Name: SettingType SettingType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SettingType"
    ADD CONSTRAINT "SettingType_pkey" PRIMARY KEY (id);


--
-- Name: Setting Setting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Setting"
    ADD CONSTRAINT "Setting_pkey" PRIMARY KEY (id);


--
-- Name: ShareHolderProfitShare ShareHolderProfitShare_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ShareHolderProfitShare"
    ADD CONSTRAINT "ShareHolderProfitShare_pkey" PRIMARY KEY (id);


--
-- Name: stockExchangeStatus stockExchangeStatus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."stockExchangeStatus"
    ADD CONSTRAINT "stockExchangeStatus_pkey" PRIMARY KEY (id);


--
-- Name: StockExchangeType StockExchangeType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StockExchangeType"
    ADD CONSTRAINT "StockExchangeType_pkey" PRIMARY KEY (id);


--
-- Name: Stock Stock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stock"
    ADD CONSTRAINT "Stock_pkey" PRIMARY KEY (id);


--
-- Name: Transaction Transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY (id);


--
-- Name: UnitConversion UnitConversion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UnitConversion"
    ADD CONSTRAINT "UnitConversion_pkey" PRIMARY KEY (id);


--
-- Name: Unit Unit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Unit"
    ADD CONSTRAINT "Unit_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Variant Variant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Variant"
    ADD CONSTRAINT "Variant_pkey" PRIMARY KEY (id);


--
-- Name: Warehouse Warehouse_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Warehouse"
    ADD CONSTRAINT "Warehouse_pkey" PRIMARY KEY (id);


--
-- Name: AccountType_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "AccountType_name_key" ON public."AccountType" USING btree (name);


--
-- Name: ExpenseStatus_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ExpenseStatus_name_key" ON public."ExpenseStatus" USING btree (name);


--
-- Name: ExpenseType_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ExpenseType_name_key" ON public."ExpenseType" USING btree (name);


--
-- Name: IX_User_RoleId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_User_RoleId" ON public."User" USING btree ("roleId");


--
-- Name: InvoiceItem_invoiceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "InvoiceItem_invoiceId_idx" ON public."InvoiceItem" USING btree ("invoiceId");


--
-- Name: InvoiceType_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "InvoiceType_name_key" ON public."InvoiceType" USING btree (name);


--
-- Name: Invoice_invoiceNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON public."Invoice" USING btree ("invoiceNumber");


--
-- Name: OrderStatus_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "OrderStatus_name_key" ON public."OrderStatus" USING btree (name);


--
-- Name: Partner_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Partner_email_key" ON public."Partner" USING btree (email);


--
-- Name: Partner_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Partner_userId_key" ON public."Partner" USING btree ("userId");


--
-- Name: PaymentStatus_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PaymentStatus_code_key" ON public."PaymentStatus" USING btree (code);


--
-- Name: Permission_resource_action_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Permission_resource_action_key" ON public."Permission" USING btree (resource, action);


--
-- Name: Product_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Product_name_idx" ON public."Product" USING btree (name);


--
-- Name: PurchaseOrder_orderNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PurchaseOrder_orderNumber_key" ON public."PurchaseOrder" USING btree ("orderNumber");


--
-- Name: RelatedType_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "RelatedType_code_key" ON public."RelatedType" USING btree (code);


--
-- Name: RolePermission_roleId_permissionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON public."RolePermission" USING btree ("roleId", "permissionId");


--
-- Name: Role_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Role_name_key" ON public."Role" USING btree (name);


--
-- Name: SaleOrder_orderNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SaleOrder_orderNumber_key" ON public."SaleOrder" USING btree ("orderNumber");


--
-- Name: SettingType_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SettingType_name_key" ON public."SettingType" USING btree (name);


--
-- Name: Setting_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Setting_key_key" ON public."Setting" USING btree (key);


--
-- Name: ShareHolderProfitShare_partnerId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ShareHolderProfitShare_partnerId_key" ON public."ShareHolderProfitShare" USING btree ("partnerId");


--
-- Name: stockExchangeStatus_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "stockExchangeStatus_name_key" ON public."stockExchangeStatus" USING btree (name);


--
-- Name: StockExchangeType_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "StockExchangeType_code_key" ON public."StockExchangeType" USING btree (code);


--
-- Name: Stock_stockExchangeTypeId_warehouseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Stock_stockExchangeTypeId_warehouseId_idx" ON public."Stock" USING btree ("stockExchangeTypeId", "warehouseId");


--
-- Name: UnitConversion_fromUnitId_toUnitId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UnitConversion_fromUnitId_toUnitId_key" ON public."UnitConversion" USING btree ("fromUnitId", "toUnitId");


--
-- Name: Unit_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Unit_name_key" ON public."Unit" USING btree (name);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_userName_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_userName_key" ON public."User" USING btree ("userName");


--
-- Name: AccountType AccountType_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AccountType"
    ADD CONSTRAINT "AccountType_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."AccountType"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Account Account_typeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES public."AccountType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AuditLog AuditLog_performedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Expense Expense_expenseStatusId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expense"
    ADD CONSTRAINT "Expense_expenseStatusId_fkey" FOREIGN KEY ("expenseStatusId") REFERENCES public."ExpenseStatus"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Expense Expense_expenseTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expense"
    ADD CONSTRAINT "Expense_expenseTypeId_fkey" FOREIGN KEY ("expenseTypeId") REFERENCES public."ExpenseType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Expense Expense_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expense"
    ADD CONSTRAINT "Expense_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Expense Expense_invoiceItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expense"
    ADD CONSTRAINT "Expense_invoiceItemId_fkey" FOREIGN KEY ("invoiceItemId") REFERENCES public."InvoiceItem"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Expense Expense_partnerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expense"
    ADD CONSTRAINT "Expense_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES public."Partner"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Expense Expense_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expense"
    ADD CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: InvoiceItem InvoiceItem_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InvoiceItem"
    ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: InvoiceItem InvoiceItem_stockId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InvoiceItem"
    ADD CONSTRAINT "InvoiceItem_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES public."Stock"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Invoice Invoice_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Invoice Invoice_invoiceTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_invoiceTypeId_fkey" FOREIGN KEY ("invoiceTypeId") REFERENCES public."InvoiceType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Invoice Invoice_purchaseOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES public."PurchaseOrder"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invoice Invoice_saleOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_saleOrderId_fkey" FOREIGN KEY ("saleOrderId") REFERENCES public."SaleOrder"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invoice Invoice_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LedgerEntry LedgerEntry_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LedgerEntry"
    ADD CONSTRAINT "LedgerEntry_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LedgerEntry LedgerEntry_transactionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LedgerEntry"
    ADD CONSTRAINT "LedgerEntry_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES public."Transaction"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ManufactureInput ManufactureInput_manufactureId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ManufactureInput"
    ADD CONSTRAINT "ManufactureInput_manufactureId_fkey" FOREIGN KEY ("manufactureId") REFERENCES public."Manufacture"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ManufactureInput ManufactureInput_stockId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ManufactureInput"
    ADD CONSTRAINT "ManufactureInput_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES public."Stock"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ManufactureOutput ManufactureOutput_manufactureId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ManufactureOutput"
    ADD CONSTRAINT "ManufactureOutput_manufactureId_fkey" FOREIGN KEY ("manufactureId") REFERENCES public."Manufacture"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ManufactureOutput ManufactureOutput_stockId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ManufactureOutput"
    ADD CONSTRAINT "ManufactureOutput_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES public."Stock"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Partner Partner_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Partner"
    ADD CONSTRAINT "Partner_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Partner Partner_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Partner"
    ADD CONSTRAINT "Partner_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Payment Payment_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Payment Payment_relatedTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_relatedTypeId_fkey" FOREIGN KEY ("relatedTypeId") REFERENCES public."RelatedType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Payment Payment_statusId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES public."PaymentStatus"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProductCategory ProductCategory_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductCategory"
    ADD CONSTRAINT "ProductCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."ProductCategory"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Product Product_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."ProductCategory"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PurchaseOrderStatusHistory PurchaseOrderStatusHistory_changedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrderStatusHistory"
    ADD CONSTRAINT "PurchaseOrderStatusHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PurchaseOrderStatusHistory PurchaseOrderStatusHistory_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrderStatusHistory"
    ADD CONSTRAINT "PurchaseOrderStatusHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."PurchaseOrder"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PurchaseOrderStatusHistory PurchaseOrderStatusHistory_statusId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrderStatusHistory"
    ADD CONSTRAINT "PurchaseOrderStatusHistory_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES public."OrderStatus"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PurchaseOrder PurchaseOrder_partnerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrder"
    ADD CONSTRAINT "PurchaseOrder_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES public."Partner"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RolePermission RolePermission_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public."Permission"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RolePermission RolePermission_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SaleOrderStatusHistory SaleOrderStatusHistory_changedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SaleOrderStatusHistory"
    ADD CONSTRAINT "SaleOrderStatusHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SaleOrderStatusHistory SaleOrderStatusHistory_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SaleOrderStatusHistory"
    ADD CONSTRAINT "SaleOrderStatusHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."SaleOrder"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SaleOrderStatusHistory SaleOrderStatusHistory_statusId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SaleOrderStatusHistory"
    ADD CONSTRAINT "SaleOrderStatusHistory_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES public."OrderStatus"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SaleOrder SaleOrder_partnerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SaleOrder"
    ADD CONSTRAINT "SaleOrder_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES public."Partner"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SettingOption SettingOption_settingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SettingOption"
    ADD CONSTRAINT "SettingOption_settingId_fkey" FOREIGN KEY ("settingId") REFERENCES public."Setting"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Setting Setting_typeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Setting"
    ADD CONSTRAINT "Setting_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES public."SettingType"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ShareHolderProfitShare ShareHolderProfitShare_partnerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ShareHolderProfitShare"
    ADD CONSTRAINT "ShareHolderProfitShare_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES public."Partner"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Stock Stock_batchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stock"
    ADD CONSTRAINT "Stock_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES public."Batch"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Stock Stock_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stock"
    ADD CONSTRAINT "Stock_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Stock Stock_lotId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stock"
    ADD CONSTRAINT "Stock_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES public."Lot"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Stock Stock_productVariantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stock"
    ADD CONSTRAINT "Stock_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES public."Variant"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Stock Stock_stockExchangeStatusId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stock"
    ADD CONSTRAINT "Stock_stockExchangeStatusId_fkey" FOREIGN KEY ("stockExchangeStatusId") REFERENCES public."stockExchangeStatus"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Stock Stock_stockExchangeTypeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stock"
    ADD CONSTRAINT "Stock_stockExchangeTypeId_fkey" FOREIGN KEY ("stockExchangeTypeId") REFERENCES public."StockExchangeType"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Stock Stock_warehouseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stock"
    ADD CONSTRAINT "Stock_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public."Warehouse"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transaction Transaction_fromAccountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_fromAccountId_fkey" FOREIGN KEY ("fromAccountId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transaction Transaction_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Transaction Transaction_toAccountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_toAccountId_fkey" FOREIGN KEY ("toAccountId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UnitConversion UnitConversion_fromUnitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UnitConversion"
    ADD CONSTRAINT "UnitConversion_fromUnitId_fkey" FOREIGN KEY ("fromUnitId") REFERENCES public."Unit"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UnitConversion UnitConversion_toUnitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UnitConversion"
    ADD CONSTRAINT "UnitConversion_toUnitId_fkey" FOREIGN KEY ("toUnitId") REFERENCES public."Unit"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Variant Variant_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Variant"
    ADD CONSTRAINT "Variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--


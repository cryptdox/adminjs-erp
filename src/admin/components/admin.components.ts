import * as url from 'url';
import componentLoader from '../component-loader.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const AdminComponents = {
  // Property Show Components
  Dashboard: componentLoader.add('Dashboard', `${__dirname}dashboard`),

  // PURCHASE ORDER
  NewPurchaseOrder: componentLoader.add('NewPurchaseOrder', `${__dirname}new-purchase-order`),

  // SALE ORDER
  NewSaleOrder: componentLoader.add('NewSaleOrder', `${__dirname}new-sale-order`),
  
  // SELECT PICKER
  SelectShareHolder: componentLoader.add('SelectShareHolder', `${__dirname}select/share-holder`),
  SelectInvestmentProfile: componentLoader.add('SelectInvestmentProfile', `${__dirname}select/investment-profile`),
};

export default AdminComponents;

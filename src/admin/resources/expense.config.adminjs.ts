import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const ExpenseResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('Expense'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Expense',
      icon: 'DivideCircle' 
    },
    listProperties: ['partner', 'expenseType', 'orderNumber', 'orderDate', 'note']
  },
};

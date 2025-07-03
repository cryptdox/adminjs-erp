import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const ExpenseStatusResource = {
  resource: {
    model: getModelByName('ExpenseStatus'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Expense',
      icon: 'DivideCircle' 
    },
  },
};

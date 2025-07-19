import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const ExpenseStatusResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('ExpenseStatus'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Expense',
      icon: 'DivideCircle' 
    },
    listProperties: ['name', 'displayName', 'description']
  },
};

import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const ExpenseTypeResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('ExpenseType'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Expense',
      icon: 'DivideCircle' 
    },
    listProperties: ['name', 'displayName', 'description'],
    filterProperties: ['name', 'displayName', 'description'],
    editProperties: ['name', 'displayName', 'description'],
    showProperties: ['name', 'displayName', 'description'],
  },
};

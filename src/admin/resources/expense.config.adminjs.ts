import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const ExpenseResource = {
  resource: {
    model: getModelByName('Expense'),
    client: prisma,
  },
  options: {},
};

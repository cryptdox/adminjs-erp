import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const ExpenseTypeResource = {
  resource: {
    model: getModelByName('ExpenseType'),
    client: prisma,
  },
  options: {},
};

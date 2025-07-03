import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const ExpenseStatusHistoryResource = {
  resource: {
    model: getModelByName('ExpenseStatusHistory'),
    client: prisma,
  },
  options: {},
};

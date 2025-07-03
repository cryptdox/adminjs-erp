import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const BatchResource = {
  resource: {
    model: getModelByName('Batch'),
    client: prisma,
  },
  options: {},
};

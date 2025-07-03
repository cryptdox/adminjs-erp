import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const ManufactureOutputResource = {
  resource: {
    model: getModelByName('ManufactureOutput'),
    client: prisma,
  },
  options: {},
};

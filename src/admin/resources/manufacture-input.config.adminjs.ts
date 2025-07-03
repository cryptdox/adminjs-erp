import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const ManufactureInputResource = {
  resource: {
    model: getModelByName('ManufactureInput'),
    client: prisma,
  },
  options: {},
};

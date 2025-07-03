import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const ShareHolderProfitShareResource = {
  resource: {
    model: getModelByName('ShareHolderProfitShare'),
    client: prisma,
  },
  options: {},
};

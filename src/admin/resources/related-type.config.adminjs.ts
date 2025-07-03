import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const RelatedTypeResource = {
  resource: {
    model: getModelByName('RelatedType'),
    client: prisma,
  },
  options: {},
};

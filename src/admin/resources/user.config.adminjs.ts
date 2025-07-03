import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const UserResource = {
  resource: {
    model: getModelByName('User'),
    client: prisma,
  },
  options: {},
};

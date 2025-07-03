import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const SettingTypeResource = {
  resource: {
    model: getModelByName('SettingType'),
    client: prisma,
  },
  options: {},
};

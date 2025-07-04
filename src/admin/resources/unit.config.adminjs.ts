import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const UnitResource = {
  resource: {
    model: getModelByName('Unit'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Inventory',
      icon: 'Archive'
    },
    listProperties: ['name', 'label', 'group', 'isBase', 'minValue', 'maxValue', 'step'],
    filterProperties: ['name', 'label', 'group', 'isBase', 'minValue', 'maxValue', 'step'],
    editProperties: ['name', 'label', 'group', 'isBase', 'minValue', 'maxValue', 'step', 'description'],
  },
};

import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const UnitConversionResource = {
  resource: {
    model: getModelByName('UnitConversion'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Inventory',
      icon: 'Archive' 
    },
    listProperties: ['fromUnit', 'multiplier', 'toUnit', 'note'],
    filterProperties: ['fromUnit', 'multiplier', 'toUnit', 'note'],
    editProperties: ['fromUnit', 'multiplier', 'toUnit', 'note'],
  },
};

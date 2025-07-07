import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const VariantResource = {
  resource: {
    model: getModelByName('Variant'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Inventory',
      icon: 'Archive' 
    },
    listProperties: ['name', 'product', 'attributes'],
    filterProperties: ['name', 'product', 'attributes'],
    editProperties: ['name', 'product', 'attributes'],
  },
};

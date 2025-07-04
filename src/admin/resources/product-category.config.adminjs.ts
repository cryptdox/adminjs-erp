import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const ProductCategoryResource = {
  resource: {
    model: getModelByName('ProductCategory'),
    client: prisma,
  },
  options: {
    navigation: {
      name: 'Inventory',
      icon: 'Archive' 
    },
    listProperties: ['name', 'parent'],
    filterProperties: ['name', 'parent'],
    editProperties: ['name', 'parent'],
  },
};

import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const PackageResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('Package'),
    client: prisma,
  },
  options: {
    navigation: {
      name: 'HRMS',
      icon: 'Users'
    },
    listProperties: ['name', 'packageType', 'price', 'discountType', 'discount'],
    editProperties:['name', 'packageType', 'price', 'discountType', 'discount', 'description', 'imageUrl'],
    showProperties:['name', 'packageType', 'price', 'discountType', 'discount', 'description', 'imageUrl'],
    actions: {
      new: {
        isVisible: false,
      },
      // edit: {
      //   isVisible: false,
      // },
      delete: {
        isVisible: false,
      },
    },
  },
};

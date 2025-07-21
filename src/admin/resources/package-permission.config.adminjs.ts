import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const PackagePermissionResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('PackagePermission'),
    client: prisma,
  },
  options: {
    navigation: {
      name: 'HRMS',
      icon: 'Users'
    },
    listProperties: ['package', 'permission'],
    showProperties:['package', 'permission'],
    actions: {
      new: {
        isVisible: false,
      },
      edit: {
        isVisible: false,
      },
      delete: {
        isVisible: false,
      },
    },
  },
};

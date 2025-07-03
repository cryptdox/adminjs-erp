import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const SettingResource = {
  resource: {
    model: getModelByName('Setting'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Configuration',
      icon: 'Settings' 
    },
  },
};

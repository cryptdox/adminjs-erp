import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';

export const SettingOptionResource = {
  resource: {
    model: getModelByName('SettingOption'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Configuration',
      icon: 'Settings' 
    },
  },
};

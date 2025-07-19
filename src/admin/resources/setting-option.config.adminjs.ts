import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const SettingOptionResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('SettingOption'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Configuration',
      icon: 'Settings' 
    },
    listProperties: ['label', 'value', 'setting']
  },
};

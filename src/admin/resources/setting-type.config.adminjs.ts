import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const SettingTypeResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('SettingType'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Configuration',
      icon: 'Settings' 
    },
    listProperties: ['label', 'name', 'description', 'uiComponent']
  },
};

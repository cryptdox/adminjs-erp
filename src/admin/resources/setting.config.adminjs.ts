import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/prisma.service.js';
import { ResourceWithOptions } from 'adminjs';

export const SettingResource: ResourceWithOptions = {
  resource: {
    model: getModelByName('Setting'),
    client: prisma,
  },
  options: {
    navigation: { 
      name: 'Configuration',
      icon: 'Settings' 
    },
    listProperties: ['key', 'value', 'type', 'group', 'description'],
    titleProperty: 'description'
  },
};

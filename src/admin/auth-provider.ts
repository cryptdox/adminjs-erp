import { DefaultAuthProvider } from 'adminjs';
import * as bcrypt from 'bcrypt';

import componentLoader from './component-loader.js';
import { DEFAULT_ADMIN } from './constants.js';
import { prisma } from '../prisma/prisma.service.js';

/**
 * Make sure to modify "authenticate" to be a proper authentication method
 */

const provider = new DefaultAuthProvider({
  componentLoader,
  authenticate: async ({ email, password }) => {
    let user = await prisma.user.findFirst({ where: { email } });
    console.log('user: ', user);
    let matched = await bcrypt.compare(password, user.password);
    let permission = await prisma.permission.findMany({
      where: {
        roles: {
          some: {
            roleId: user.roleId,
          },
        },
      },
    });

    if (matched) {
      return { email, user, permission };
    }

    return null;
  },
});

export default provider;

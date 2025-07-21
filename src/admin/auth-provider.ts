import { DefaultAuthProvider } from 'adminjs';
import * as bcrypt from 'bcrypt';
import componentLoader from './component-loader.js';
import { prisma } from '../prisma/prisma.service.js';

/**
 * Make sure to modify "authenticate" to be a proper authentication method
 */

const provider = new DefaultAuthProvider({
  componentLoader,
  authenticate: async ({ email, password }) => {
    let user = await prisma.user.findFirst({ where: { email } });
    if (!user) return null;
    let matched = await bcrypt.compare(password, user.password);
    if (matched) {
      const isSuper = user?.isSuper;
      const tenantId = user?.tenantId;
      //
      // CHECK TENANT< SUBSCRIPTION PACKAGE AND SUPER HERE
      //
      let permission = await prisma.permission.findMany({
        where: {
          roles: {
            some: {
              roleId: user.roleId,
            },
          },
        },
      });
      return { email, isSuper, tenantId, user, permission };
    }
    return null;
  },
});

export default provider;

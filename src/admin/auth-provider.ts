import { DefaultAuthProvider } from 'adminjs';

import componentLoader from './component-loader.js';
import { DEFAULT_ADMIN } from './constants.js';
import { prisma } from '../prisma/prisma.service.js';

/**
 * Make sure to modify "authenticate" to be a proper authentication method
 */

const provider = new DefaultAuthProvider({
  componentLoader,
  authenticate: async ({ email, password }) => {
    
    let user = await prisma.user.findFirst({where:{email}})
    console.log("user: ", user)

    if (email === DEFAULT_ADMIN.email) {
      return { email };
    }

    return null;
  },
});

export default provider;

import { IResolvers } from 'graphql-tools';

import Context from './models/Context';
import User from './models/User';

const resolverMap: IResolvers = {
  Query: {
    users: async (parent, args, context: Context, info) => {
      const users = await new User().fetchAll();

      return users.serialize();
    },
    user: async (parent, args, context: Context, info) => {
      const { id } = args;

      if (!id) {
        return null;
      }

      const user = await new User().where({ id }).fetch();

      return user.serialize();
    }
  }
};

export default resolverMap;

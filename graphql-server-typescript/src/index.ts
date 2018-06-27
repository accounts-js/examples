import * as mongoose from 'mongoose';
import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import { ApolloServer, makeExecutableSchema } from 'apollo-server';
import MongoDBInterface from '@accounts/mongo';
import { createJSAccountsGraphQL } from '@accounts/graphql-api';
import { DatabaseManager } from '@accounts/database-manager';

const start = async () => {
  await mongoose.connect(
    'mongodb://localhost:27017/accounts-js-graphql-example'
  );
  const mongoConn = mongoose.connection;

  const userStorage = new MongoDBInterface(mongoConn);
  // Create database manager (create user, find users, sessions etc) for Accounts-js
  const accountsDb = new DatabaseManager({
    sessionStorage: userStorage,
    userStorage,
  });

  const accountsServer = new AccountsServer(
    { db: accountsDb, tokenSecret: 'secret' },
    {
      password: new AccountsPassword(),
    }
  );

  const { schema, extendWithResolvers } = createJSAccountsGraphQL(
    accountsServer,
    { extend: false }
  );
  // Schema only is not enough, we need to hook on resolvers with its provided function.
  const resolvers = extendWithResolvers([]);
  const finalSchema = makeExecutableSchema({ typeDefs: schema, resolvers });

  const server = new ApolloServer({ schema: finalSchema });

  server.listen(4000).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};

start();

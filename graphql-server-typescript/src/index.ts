import * as mongoose from 'mongoose';
import { AccountsServer } from '@accounts/server';
import { AccountsPassword } from '@accounts/password';
import { ApolloServer, makeExecutableSchema } from 'apollo-server';
import MongoDBInterface from '@accounts/mongo';
import { createAccountsGraphQL, accountsContext } from '@accounts/graphql-api';
import { DatabaseManager } from '@accounts/database-manager';

const start = async () => {
  // Create database connection
  await mongoose.connect(
    'mongodb://localhost:27017/accounts-js-graphql-example'
  );
  const mongoConn = mongoose.connection;

  // Build a storage for storing users
  const userStorage = new MongoDBInterface(mongoConn);
  // Create database manager (create user, find users, sessions etc) for Accounts-js
  const accountsDb = new DatabaseManager({
    sessionStorage: userStorage,
    userStorage,
  });

  // Create accounts server that holds a lower level of all accounts operations
  const accountsServer = new AccountsServer(
    { db: accountsDb, tokenSecret: 'secret' },
    {
      password: new AccountsPassword(),
    }
  );

  // Create GraphQL schema (with resolvers) for accounts server, exposes a GraphQL API
  const { typeDefs, resolvers } = createAccountsGraphQL(accountsServer, {
    extend: false,
  });

  // Only schema is not enough, we need to hook on resolvers with its provided function.
  // @ts-ignore
  const finalSchema = makeExecutableSchema({ typeDefs, resolvers });

  // Create the Apollo Server that takes a schema and configures internal stuff
  const server = new ApolloServer({
    schema: finalSchema,
    context: ({ req }) => accountsContext(req),
  });

  server.listen(4000).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
};

start();

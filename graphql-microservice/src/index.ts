import { AccountsServer } from '@accounts/boost';
import {
  makeExecutableSchema,
  mergeSchemas,
  makeRemoteExecutableSchema,
  introspectSchema,
} from 'graphql-tools';
import { HttpLink } from 'apollo-link-http';
import { ApolloServer } from 'apollo-server';
import fetch from 'node-fetch';

(async () => {
  const accountsServer = await new AccountsServer().listen();

  const link = new HttpLink({ uri: accountsServer.url, fetch });

  const remoteSchema = await introspectSchema(link);

  const executableRemoteSchema = makeRemoteExecutableSchema({
    schema: remoteSchema,
    link,
  });

  const executableLocalSchema = makeExecutableSchema({
    typeDefs: `
      type Query {
        publicData: String
        privateData: String
      }
    `,
  });

  const apolloServer = await new ApolloServer({
    schema: mergeSchemas({
      schemas: [executableLocalSchema, executableRemoteSchema],
    }),
  }).listen();

  console.log(`GraphQL server running at ${apolloServer.url}`);
})();

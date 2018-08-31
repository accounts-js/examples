import accountsBoost from '@accounts/boost';
import {
  makeExecutableSchema,
  mergeSchemas,
  makeRemoteExecutableSchema,
  introspectSchema,
} from 'graphql-tools';
import { HttpLink } from 'apollo-link-http';
import { ApolloServer } from 'apollo-server';
import fetch from 'node-fetch';

const accountsServerUri = 'http://localhost:4003/';

(async () => {
  const link = new HttpLink({ uri: accountsServerUri, fetch });

  const remoteSchema = await introspectSchema(link);

  const executableRemoteSchema = makeRemoteExecutableSchema({
    schema: remoteSchema,
    link,
  });

  const executableLocalSchema = makeExecutableSchema({
    typeDefs: `
      type Query {
        publicField: String
        privateField: String @auth
      }
    `,
  });

  const accounts = await accountsBoost();

  const apolloServer = await new ApolloServer({
    schema: mergeSchemas({
      schemas: [executableLocalSchema, executableRemoteSchema],
    }),
  }).listen();

  console.log(`GraphQL server running at ${apolloServer.url}`);
})();

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
import { setContext } from 'apollo-link-context';

const accountsServerUri = 'http://localhost:4003/';

(async () => {
  const accounts = (await accountsBoost({
    tokenSecret: 'terrible secret',
    micro: true,
  })).graphql();

  const http = new HttpLink({ uri: accountsServerUri, fetch });

  const link = setContext((request, previousContext) => {
    if (!previousContext.graphqlContext) {
      return {};
    }
    return {
      headers: {
        'accounts-access-token': previousContext.graphqlContext.authToken,
      },
    };
  }).concat(http);

  const remoteSchema = await introspectSchema(link);

  const executableRemoteSchema = makeRemoteExecutableSchema({
    schema: remoteSchema,
    link,
  });

  const typeDefs = `
    type PrivateType @auth {
      privateField: String
    }

    type Query {
      publicField: String
      privateField: String @auth
      privateType: PrivateType
      privateFieldWithAuthResolver: String
    }

    type Mutation {
      _: String
    }
    `;

  const resolvers = {
    PrivateType: {
      privateField: () => 'private',
    },
    Query: {
      publicField: () => 'public',
      privateField: () => 'private',
      privateType: () => '',
      privateFieldWithAuthResolver: accounts.auth((root, args, context) => {
        return 'private';
      }),
    },
  };

  const executableLocalSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const apolloServer = await new ApolloServer({
    schema: mergeSchemas({
      schemas: [executableLocalSchema, executableRemoteSchema],
      schemaDirectives: {},
    }),
    context: ({ req }) => accounts.context(req),
  }).listen();

  console.log(`GraphQL server running at ${apolloServer.url}`);
})();

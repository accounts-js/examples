import { AccountsServer } from '@accounts/boost';
import { makeExecutableSchema, mergeSchemas } from 'graphql-tools';
import { ApolloServer } from 'apollo-server';
import { merge } from 'lodash';

(async () => {
  const accountsGraphQL = new AccountsServer({
    // token: 'bad secret'
  }).graphql();

  const typeDefs = `
  type PrivateType @auth {
    field: String
  }

  type Query {
    publicField: String
    privateField: String @auth
    privateType: PrivateType
  }

  type Mutation {
    _: String
  }
  `;

  const resolvers = {
    Query: {
      publicField: () => 'public',
      privateField: () => 'private',
      privateType: () => ({
        field: () => 'private',
      }),
    },
  };

  const apolloServer = await new ApolloServer({
    typeDefs: [typeDefs, accountsGraphQL.typeDefs],
    resolvers: merge(accountsGraphQL.resolvers, resolvers),
    schemaDirectives: {
      ...accountsGraphQL.schemaDirectives,
    },
  }).listen();

  console.log(`GraphQL server running at ${apolloServer.url}`);
})();

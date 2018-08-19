import { AccountsServer } from '@accounts/boost';
import { makeExecutableSchema, mergeSchemas } from 'graphql-tools';
import { ApolloServer } from 'apollo-server';
import { merge } from 'lodash';

const accountsGraphQL = new AccountsServer({
  tokenSecret: 'bad secret',
} as any).graphql();

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

const apolloServer = new ApolloServer({
  typeDefs: [typeDefs, accountsGraphQL.typeDefs],
  resolvers: merge(accountsGraphQL.resolvers, resolvers),
  schemaDirectives: {
    ...accountsGraphQL.schemaDirectives,
  },
  context: ({ req }) => accountsGraphQL.accountsContext(req),
} as any)
  .listen()
  .then(res => {
    console.log(`GraphQL server running at ${res.url}`);
  });

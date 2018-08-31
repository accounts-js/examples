import accountsBoost from '@accounts/boost';
import { makeExecutableSchema, mergeSchemas } from 'graphql-tools';
import { ApolloServer } from 'apollo-server';
import { merge } from 'lodash';

(async () => {
  const accounts = (await accountsBoost({
    tokenSecret: 'terrible secret',
  })).graphql();

  const typeDefs = `
    type PrivateType @auth {
      field: String
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
    Query: {
      publicField: () => 'public',
      privateField: () => 'private',
      privateType: () => ({
        field: () => 'private',
      }),
      privateFieldWithAuthResolver: accounts.auth((root, args, context) => {
        return 'private';
      }),
    },
  };

  const apolloServer = new ApolloServer({
    typeDefs: [typeDefs, accounts.typeDefs],
    resolvers: merge(accounts.resolvers, resolvers),
    schemaDirectives: {
      ...accounts.schemaDirectives,
    },
    context: ({ req }) => accounts.context(req),
  } as any)
    .listen()
    .then(res => {
      console.log(`GraphQL server running at ${res.url}`);
    });
})();

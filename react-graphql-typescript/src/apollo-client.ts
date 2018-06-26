import ApolloClient from 'apollo-boost';

export const apolloClient = new ApolloClient({
  uri: 'http://localhost:8002/graphql',
});

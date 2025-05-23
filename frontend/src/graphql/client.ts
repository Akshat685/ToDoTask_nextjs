import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { getCookie, deleteCookie } from "@/utils/cookies";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = typeof window !== "undefined" ? getCookie("token") : null;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      console.error(`GraphQL Error: ${message}`);
      if (message.includes("Authentication") || message.includes("logged in")) {
        if (typeof window !== "undefined") {
          deleteCookie("token");
          window.location.href = "/login";
        }
      }
    });
  }
  if (networkError) console.error(`Network Error: ${networkError}`);
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
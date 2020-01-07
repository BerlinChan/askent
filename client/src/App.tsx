import React from "react";
import Router from "./routes";
import createApolloClient from "./graphql/createApolloClient";
import { ApolloProvider } from "@apollo/react-hooks";

const apolloClient = createApolloClient();

const App: React.FC = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <Router />
    </ApolloProvider>
  );
};

export default App;

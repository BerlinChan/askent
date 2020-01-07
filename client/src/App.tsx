import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import loadable from "@loadable/component";
import Loading from "./components/Loading";
import { PrivateRoute } from "./components/PrivateRoute";
import Layout from "./components/Layout";
import createApolloClient from "./graphql/createApolloClient";
import { ApolloProvider } from "@apollo/react-hooks";

const HomeComponent = loadable(() => import("./routes/home"), {
  fallback: <Loading />
});
const LoginComponent = loadable(() => import("./routes/login"), {
  fallback: <Loading />
});
const SignupComponent = loadable(() => import("./routes/signup"), {
  fallback: <Loading />
});
const AdminComponent = loadable(() => import("./routes/admin"), {
  fallback: <Loading />
});
const AboutComponent = loadable(() => import("./routes/about"), {
  fallback: <Loading />
});

const apolloClient = createApolloClient();

const App: React.FC = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        <Layout>
          <div>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/admin">Admin</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>

            <hr />

            {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
            <Switch>
              <Route exact path="/">
                <HomeComponent />
              </Route>
              <Route path="/login">
                <LoginComponent />
              </Route>
              <Route path="/signup">
                <SignupComponent />
              </Route>
              <PrivateRoute path="/admin">
                <AdminComponent />
              </PrivateRoute>
              <Route path="/about">
                <AboutComponent />
              </Route>
            </Switch>
          </div>
        </Layout>
      </Router>
    </ApolloProvider>
  );
};

export default App;

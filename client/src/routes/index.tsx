import React from "react";
import loadable from "@loadable/component";
import Loading from "../components/Loading";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { PrivateRoute } from "../components/PrivateRoute";
import Layout from "../components/Layout";

const theme = createMuiTheme();

export const HomeComponent = loadable(() => import("./home"), {
  fallback: <Loading />
});
export const LoginComponent = loadable(() => import("./login"), {
  fallback: <Loading />
});
export const SignupComponent = loadable(() => import("./signup"), {
  fallback: <Loading />
});
export const AdminComponent = loadable(() => import("./admin"), {
  fallback: <Loading />
});
export const AboutComponent = loadable(() => import("./about"), {
  fallback: <Loading />
});
export const DemoComponent = loadable(() => import("./demo"), {
  fallback: <Loading />
});

const Router = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Layout>
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
            <Route path="/demo">
              <DemoComponent />
            </Route>
          </Switch>
        </Layout>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default Router;

import React from "react";
import loadable from "@loadable/component";
import { PrivateRoute } from "../components/PrivateRoute";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { SnackbarProvider } from "notistack";
import Loading from "../components/Loading";
import { AUTH_TOKEN } from "../constant";

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
  const token = localStorage.getItem(AUTH_TOKEN);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>
          <Switch>
            <Route exact path="/" component={HomeComponent} />
            <Route path="/login">
              {token ? <Redirect to="/admin" /> : <LoginComponent />}
            </Route>
            <Route path="/signup">
              {token ? <Redirect to="/admin" /> : <SignupComponent />}
            </Route>
            <Redirect exact path="/admin" to="/admin/events" />
            <PrivateRoute path="/admin">
              <AdminComponent />
            </PrivateRoute>
            <Route path="/about" component={AboutComponent} />
            <Route path="/demo" component={DemoComponent} />
          </Switch>
        </SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default Router;

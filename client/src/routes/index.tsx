import React from "react";
import loadable from "@loadable/component";
import  PrivateRoute  from "../components/PrivateRoute";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Loading from "../components/Loading";
import Providers from "../components/Providers";
import { AUTH_TOKEN } from "../constant";

const HomeComponent = loadable(() => import("./home"), {
  fallback: <Loading />
});
const LoginComponent = loadable(() => import("./login"), {
  fallback: <Loading />
});
const SignupComponent = loadable(() => import("./signup"), {
  fallback: <Loading />
});
const AdminComponent = loadable(() => import("./admin"), {
  fallback: <Loading />
});
const EventComponent = loadable(() => import("./event"), {
  fallback: <Loading />
});
const AboutComponent = loadable(() => import("./about"), {
  fallback: <Loading />
});
const DemoComponent = loadable(() => import("./demo"), {
  fallback: <Loading />
});
const Error401Component = loadable(() => import("./error/401"), {
  fallback: <Loading />
});
const Error404Component = loadable(() => import("./error/404"), {
  fallback: <Loading />
});

const Router = () => {
  const token = localStorage.getItem(AUTH_TOKEN);

  return (
    <Providers>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={HomeComponent} />
          <Route path="/login">
            {token ? <Redirect to="/admin" /> : <LoginComponent />}
          </Route>
          <Route path="/signup">
            {token ? <Redirect to="/admin" /> : <SignupComponent />}
          </Route>

          <PrivateRoute path="/admin">
            <AdminComponent />
          </PrivateRoute>
          <PrivateRoute path={`/event`}>
            <EventComponent />
          </PrivateRoute>

          <Route path="/about" component={AboutComponent} />
          <Route path="/demo" component={DemoComponent} />

          <Route path="/unauthorized" component={Error401Component} />
          <Route path="*" component={Error404Component} />
        </Switch>
      </BrowserRouter>
    </Providers>
  );
};

export default Router;

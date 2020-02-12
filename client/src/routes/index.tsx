import React from "react";
import loadable from "@loadable/component";
import PrivateRoute from "../components/PrivateRoute";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Loading from "../components/Loading";
import Providers from "../components/Providers";

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
  return (
    <Providers>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={HomeComponent} />
          <Route path="/login" component={LoginComponent} />
          <Route path="/signup" component={SignupComponent} />

          <Redirect exact path="/admin" to="/admin/events" />
          <PrivateRoute path="/admin">
            <AdminComponent />
          </PrivateRoute>

          <Redirect exact path="/event" to="/" />
          <Route path="/event/:id" component={EventComponent} />

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

import React from "react";
import { AdminHeader } from "../../components/Header";
import { Switch, useRouteMatch } from "react-router-dom";
import { PrivateRoute } from "../../components/PrivateRoute";
import Loading from "../../components/Loading";
import loadable from "@loadable/component";
import { Container } from "@material-ui/core";

const EventsComponent = loadable(() => import("./events"), {
  fallback: <Loading />
});
const AnalyticsComponent = loadable(() => import("./analytics"), {
  fallback: <Loading />
});
const EventComponent = loadable(() => import("./event"), {
  fallback: <Loading />
});

const Admin: React.FC = () => {
  let { path } = useRouteMatch();

  return (
    <React.Fragment>
      <AdminHeader />
      <Container maxWidth="lg">
        <Switch>
          <PrivateRoute path={`${path}/events`}>
            <EventsComponent />
          </PrivateRoute>
          <PrivateRoute path={`${path}/analytics`}>
            <AnalyticsComponent />
          </PrivateRoute>
          <PrivateRoute path={`${path}/event`}>
            <EventComponent />
          </PrivateRoute>
        </Switch>
      </Container>
    </React.Fragment>
  );
};

export default Admin;

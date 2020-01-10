import React from "react";
import { AdminHeader } from "../../components/Header";
import { Switch, useRouteMatch } from "react-router-dom";
import { PrivateRoute } from "../../components/PrivateRoute";
import Loading from "../../components/Loading";
import loadable from "@loadable/component";

const EventsComponent = loadable(() => import("./events"), {
  fallback: <Loading />
});
const AnalyticsComponent = loadable(() => import("./analytics"), {
  fallback: <Loading />
});

const Admin: React.FC = () => {
  let { path } = useRouteMatch();

  return (
    <React.Fragment>
      <AdminHeader />
      <Switch>
        <PrivateRoute path={`${path}/events`}>
          <EventsComponent />
        </PrivateRoute>
        <PrivateRoute path={`${path}/analytics`}>
          <AnalyticsComponent />
        </PrivateRoute>
      </Switch>
    </React.Fragment>
  );
};

export default Admin;

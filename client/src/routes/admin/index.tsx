import React from "react";
import AdminHeader from "./AdminHeader";
import { Switch, Redirect, useRouteMatch } from "react-router-dom";
import  PrivateRoute  from "../../components/PrivateRoute";
import Loading from "../../components/Loading";
import Layout from "../../components/Layout";
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
    <Layout
      header={<AdminHeader />}
      body={
        <Switch>
          <Redirect exact path={path} to={`${path}/events`} />
          <PrivateRoute path={`${path}/events`}>
            <EventsComponent />
          </PrivateRoute>
          <PrivateRoute path={`${path}/analytics`}>
            <AnalyticsComponent />
          </PrivateRoute>
        </Switch>
      }
    />
  );
};

export default Admin;

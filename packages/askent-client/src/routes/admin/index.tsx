import React from "react";
import AdminHeader from "./AdminHeader";
import { Switch, Redirect, useRouteMatch } from "react-router-dom";
import PrivateRoute from "../../components/PrivateRoute";
import Loading from "../../components/Loading";
import { Layout } from "../../components/Layout";
import loadable from "@loadable/component";

const EventsComponent = loadable(() => import("./events"), {
  fallback: <Loading />,
});
const AnalyticsComponent = loadable(() => import("./analytics"), {
  fallback: <Loading />,
});
const AdminEventComponent = loadable(() => import("./event"), {
  fallback: <Loading />,
});

const Admin: React.FC = () => {
  let { path } = useRouteMatch();
  const [searchString, setSearchString] = React.useState<string>("");

  return (
    <Switch>
      <Redirect exact path={`${path}/event`} to={`${path}/events`} />
      <PrivateRoute path={`${path}/event/:id`}>
        <AdminEventComponent />
      </PrivateRoute>

      <Layout
        header={
          <AdminHeader
            searchString={searchString}
            setSearchString={setSearchString}
          />
        }
        body={
          <Switch>
            <PrivateRoute path={`${path}/events`}>
              <EventsComponent searchString={searchString} />
            </PrivateRoute>
            <PrivateRoute path={`${path}/analytics`}>
              <AnalyticsComponent />
            </PrivateRoute>
          </Switch>
        }
      />
    </Switch>
  );
};

export default Admin;

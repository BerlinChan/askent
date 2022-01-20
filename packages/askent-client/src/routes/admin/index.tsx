import React from "react";
import AdminHeader from "./AdminHeader";
import { Routes, Route, Redirect, useMatch } from "react-router-dom";
import RequireAuth from "../../components/RequireAuth";
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
  let { path } = useMatch();
  const [searchString, setSearchString] = React.useState<string>("");

  return (
    <Routes>
      <Redirect exact path={`${path}/event`} to={`${path}/events`} />
      <Route
        path={`${path}/event/:id`}
        element={
          <RequireAuth>
            <AdminEventComponent />
          </RequireAuth>
        }
      />

      <Layout
        header={
          <AdminHeader
            searchString={searchString}
            setSearchString={setSearchString}
          />
        }
        body={
          <Routes>
            <Route
              path={`${path}/events`}
              element={
                <RequireAuth>
                  <EventsComponent searchString={searchString} />
                </RequireAuth>
              }
            />
            <Route
              path={`${path}/analytics`}
              element={
                <RequireAuth>
                  <AnalyticsComponent />
                </RequireAuth>
              }
            />
          </Routes>
        }
      />
    </Routes>
  );
};

export default Admin;

import React from "react";
import AdminHeader from "./AdminHeader";
import { Routes, Route } from "react-router-dom";
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
  const [searchString, setSearchString] = React.useState<string>("");

  return (
    <Routes>
      <Route
        path={`event/:id/*`}
        element={
          <RequireAuth>
            <AdminEventComponent />
          </RequireAuth>
        }
      />

      <Route
        element={
          <Layout
            header={
              <AdminHeader
                searchString={searchString}
                setSearchString={setSearchString}
              />
            }
          />
        }
      >
        <Route
          index
          element={
            <RequireAuth>
              <EventsComponent searchString={searchString} />
            </RequireAuth>
          }
        />
        <Route
          path={`events`}
          element={
            <RequireAuth>
              <EventsComponent searchString={searchString} />
            </RequireAuth>
          }
        />
        <Route
          path={`analytics`}
          element={
            <RequireAuth>
              <AnalyticsComponent />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
};

export default Admin;

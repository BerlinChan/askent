import React from "react";
import AdminHeader from "./AdminHeader";
import { Routes, Route } from "react-router-dom";
import RequireAuth from "../../components/RequireAuth";
import { Layout } from "../../components/Layout";

const EventsComponent = React.lazy(() => import("./events"));
const AnalyticsComponent = React.lazy(() => import("./analytics"));
const AdminEventComponent = React.lazy(() => import("./event"));

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

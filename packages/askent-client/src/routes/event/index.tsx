import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import RequireAuth from "../../components/RequireAuth";
import { useEventForLoginQuery } from "../../generated/graphqlHooks";
import { WallThemeProvider } from "../../components/Providers";

const EventLoginComponent = React.lazy(() => import("./login"));
const LiveComponent = React.lazy(() => import("./live"));
const WallComponent = React.lazy(() => import("./wall"));

const Event: React.FC = () => {
  let { id } = useParams<{ id: string }>();
  const eventForLoginQuery = useEventForLoginQuery({
    variables: { eventId: id as string },
  });

  return (
    <Routes>
      <Route
        index
        element={
          <React.Suspense fallback={<Loading />}>
            <EventLoginComponent eventQuery={eventForLoginQuery} />
          </React.Suspense>
        }
      />
      <Route
        path={`login`}
        element={
          <React.Suspense fallback={<Loading />}>
            <EventLoginComponent eventQuery={eventForLoginQuery} />
          </React.Suspense>
        }
      />

      <Route
        path={`live/*`}
        element={
          <RequireAuth>
            <React.Suspense fallback={<Loading />}>
              <LiveComponent />
            </React.Suspense>
          </RequireAuth>
        }
      />
      <Route
        path={`wall`}
        element={
          <RequireAuth>
            <React.Suspense fallback={<Loading />}>
              <WallThemeProvider>
                <WallComponent />
              </WallThemeProvider>
            </React.Suspense>
          </RequireAuth>
        }
      />
    </Routes>
  );
};

export default Event;

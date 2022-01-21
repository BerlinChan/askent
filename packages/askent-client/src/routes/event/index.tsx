import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import loadable from "@loadable/component";
import RequireAuth from "../../components/RequireAuth";
import { useEventForLoginQuery } from "../../generated/graphqlHooks";
import { WallThemeProvider } from "../../components/Providers";

const EventLoginComponent = loadable(() => import("./login"), {
  fallback: <Loading />,
});
const LiveComponent = loadable(() => import("./live"), {
  fallback: <Loading />,
});
const WallComponent = loadable(() => import("./wall"), {
  fallback: <Loading />,
});

const Event: React.FC = () => {
  let { id } = useParams<{ id: string }>();
  const eventForLoginQuery = useEventForLoginQuery({
    variables: { eventId: id as string },
  });

  return (
    <Routes>
      <Route
        index
        element={<EventLoginComponent eventQuery={eventForLoginQuery} />}
      />
      <Route
        path={`login`}
        element={<EventLoginComponent eventQuery={eventForLoginQuery} />}
      />

      <Route
        path={`live/*`}
        element={
          <RequireAuth>
            <LiveComponent />
          </RequireAuth>
        }
      />
      <Route
        path={`wall`}
        element={
          <RequireAuth>
            <WallThemeProvider>
              <WallComponent />
            </WallThemeProvider>
          </RequireAuth>
        }
      />
    </Routes>
  );
};

export default Event;

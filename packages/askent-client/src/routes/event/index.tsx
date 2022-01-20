import React from "react";
import {
  Routes,
  Route,
  useMatch,
  Redirect,
  useParams,
} from "react-router-dom";
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
  let { path } = useMatch();
  let { id } = useParams<{ id: string }>();
  const eventForLoginQuery = useEventForLoginQuery({
    variables: { eventId: id },
  });

  return (
    <Routes>
      <Redirect exact path={path} to={`${path}/login`} />
      <Route path={`${path}/login`}>
        <EventLoginComponent eventQuery={eventForLoginQuery} />
      </Route>

      <Route
        path={`${path}/live`}
        element={
          <RequireAuth>
            <LiveComponent />
          </RequireAuth>
        }
      />
      <Route
        path={`${path}/wall`}
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

import React from "react";
import {
  Switch,
  Route,
  useRouteMatch,
  Redirect,
  useParams
} from "react-router-dom";
import Loading from "../../components/Loading";
import loadable from "@loadable/component";
import PrivateRoute from "../../components/PrivateRoute";
import { useEventForLoginQuery } from "../../generated/graphqlHooks";
import { WallThemeProvider } from "../../components/Providers";

const EventLoginComponent = loadable(() => import("./login"), {
  fallback: <Loading />
});
const LiveComponent = loadable(() => import("./live"), {
  fallback: <Loading />
});
const WallComponent = loadable(() => import("./wall"), {
  fallback: <Loading />
});

const Event: React.FC = () => {
  let { path } = useRouteMatch();
  let { id } = useParams();
  const eventForLoginQuery = useEventForLoginQuery({
    variables: { eventId: id as string }
  });

  return (
    <Switch>
      <Redirect exact path={path} to={`${path}/login`} />
      <Route path={`${path}/login`}>
        <EventLoginComponent eventQuery={eventForLoginQuery} />
      </Route>

      <PrivateRoute path={`${path}/live`}>
        <LiveComponent />
      </PrivateRoute>
      <PrivateRoute path={`${path}/wall`}>
        <WallThemeProvider>
          <WallComponent />
        </WallThemeProvider>
      </PrivateRoute>
    </Switch>
  );
};

export default Event;

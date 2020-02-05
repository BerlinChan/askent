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
import { AudienceRoute } from "../../components/Route";
import { useEventForLoginQuery } from "../../generated/graphqlHooks";

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

      <AudienceRoute path={`${path}/live`}>
        <LiveComponent />
      </AudienceRoute>
      <Route path={`${path}/wall`} component={WallComponent} />
    </Switch>
  );
};

export default Event;

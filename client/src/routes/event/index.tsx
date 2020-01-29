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
import LiveEventHeader from "./LiveEventHeader";
import { useLiveEventQuery } from "../../generated/graphqlHooks";

const EventLoginComponent = loadable(() => import("./login"), {
  fallback: <Loading />
});
const LiveQuestionsComponent = loadable(() => import("./questions"), {
  fallback: <Loading />
});

const Event: React.FC = () => {
  let { path } = useRouteMatch();
  let { id } = useParams();
  const liveEventQuery = useLiveEventQuery({
    variables: { eventId: id as string }
  });

  return (
    <Switch>
      <Redirect exact path={`${path}`} to={`${path}/login`} />
      <Route path={`${path}/login`} component={EventLoginComponent} />

      <LiveEventHeader
        eventQuery={liveEventQuery}
        body={
          <Switch>
            <AudienceRoute path={`${path}/questions`}>
              <LiveQuestionsComponent />
            </AudienceRoute>
          </Switch>
        }
      />
    </Switch>
  );
};

export default Event;

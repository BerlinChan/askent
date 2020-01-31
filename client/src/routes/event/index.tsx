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
import Layout from "../../components/Layout";
import LiveEventHeader from "./LiveEventHeader";
import { useEventForLoginQuery } from "../../generated/graphqlHooks";

const EventLoginComponent = loadable(() => import("./login"), {
  fallback: <Loading />
});
const LiveQuestionsComponent = loadable(() => import("./questions"), {
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
      <Redirect exact path={`${path}`} to={`${path}/login`} />
      <Route path={`${path}/login`}>
        <EventLoginComponent eventQuery={eventForLoginQuery} />
      </Route>

      <Layout
        header={<LiveEventHeader eventQuery={eventForLoginQuery} />}
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

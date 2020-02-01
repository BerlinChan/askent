import React from "react";
import {
  Switch,
  Route,
  useRouteMatch,
  Redirect,
  useParams,
  useLocation
} from "react-router-dom";
import Loading from "../../components/Loading";
import loadable from "@loadable/component";
import { AudienceRoute } from "../../components/Route";
import Layout from "../../components/Layout";
import LiveEventHeader from "./LiveEventHeader";
import {
  useEventForLoginQuery,
  useLiveEventLazyQuery,
  useMeAudienceLazyQuery
} from "../../generated/graphqlHooks";

const EventLoginComponent = loadable(() => import("./login"), {
  fallback: <Loading />
});
const LiveQuestionsComponent = loadable(() => import("./questions"), {
  fallback: <Loading />
});

const Event: React.FC = () => {
  let { path } = useRouteMatch();
  const { pathname } = useLocation();
  let { id } = useParams();
  const eventForLoginQuery = useEventForLoginQuery({
    variables: { eventId: id as string }
  });
  const [liveEventLazyQuery, liveEventQueryResult] = useLiveEventLazyQuery();
  const [meAudienceLazyQuery, meAudienceQueryResult] = useMeAudienceLazyQuery();

  React.useEffect(() => {
    if (!pathname.endsWith("/login")) {
      meAudienceLazyQuery();
      liveEventLazyQuery({ variables: { eventId: id as string } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Switch>
      <Redirect exact path={`${path}`} to={`${path}/login`} />
      <Route path={`${path}/login`}>
        <EventLoginComponent eventQuery={eventForLoginQuery} />
      </Route>

      <Layout
        header={
          <LiveEventHeader
            userQueryResult={meAudienceQueryResult}
            eventQueryResult={liveEventQueryResult}
          />
        }
        body={
          <Switch>
            <AudienceRoute path={`${path}/questions`}>
              <LiveQuestionsComponent
                userQueryResult={meAudienceQueryResult}
                eventQueryResult={liveEventQueryResult}
              />
            </AudienceRoute>
          </Switch>
        }
      />
    </Switch>
  );
};

export default Event;

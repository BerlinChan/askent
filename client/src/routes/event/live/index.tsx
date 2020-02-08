import React from "react";
import { Switch, Redirect, useRouteMatch, useParams } from "react-router-dom";
import Loading from "../../../components/Loading";
import loadable from "@loadable/component";
import { AudienceRoute } from "../../../components/Route";
import Layout from "../../../components/Layout";
import LiveEventHeader from "./LiveEventHeader";
import {
  useLiveEventQuery,
  useMeAudienceQuery,
  useLiveEventUpdatedSubscription
} from "../../../generated/graphqlHooks";

const LiveQuestionsComponent = loadable(() => import("./questions"), {
  fallback: <Loading />
});

const Live: React.FC = () => {
  let { path } = useRouteMatch();
  let { id } = useParams();
  const meAudienceQueryResult = useMeAudienceQuery();
  const liveEventQueryResult = useLiveEventQuery({
    variables: { eventId: id as string }
  });

  useLiveEventUpdatedSubscription({
    variables: { eventId: id as string }
  });

  return (
    <Switch>
      <Redirect exact path={path} to={`${path}/questions`} />

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

export default Live;

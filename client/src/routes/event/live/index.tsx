import React from "react";
import { Switch, Redirect, useRouteMatch, useParams } from "react-router-dom";
import Loading from "../../../components/Loading";
import loadable from "@loadable/component";
import PrivateRoute from "../../../components/PrivateRoute";
import Layout from "../../../components/Layout";
import LiveEventHeader from "./LiveEventHeader";
import {
  useEventByIdQuery,
  useMeQuery,
  // useEventUpdatedSubscription
} from "../../../generated/graphqlHooks";

const LiveQuestionsComponent = loadable(() => import("./questions"), {
  fallback: <Loading />
});

const Live: React.FC = () => {
  let { path } = useRouteMatch();
  let { id } = useParams();
  const meQueryResult = useMeQuery();
  const eventByIdQueryResult = useEventByIdQuery({
    variables: { eventId: id as string }
  });

  // useEventUpdatedSubscription({
  //   variables: { eventId: id as string }
  // });

  return (
    <Switch>
      <Redirect exact path={path} to={`${path}/questions`} />

      <Layout
        disableContainer
        header={<LiveEventHeader eventQueryResult={eventByIdQueryResult} />}
        body={
          <Switch>
            <PrivateRoute path={`${path}/questions`}>
              <LiveQuestionsComponent
                userQueryResult={meQueryResult}
                eventQueryResult={eventByIdQueryResult}
              />
            </PrivateRoute>
          </Switch>
        }
      />
    </Switch>
  );
};

export default Live;

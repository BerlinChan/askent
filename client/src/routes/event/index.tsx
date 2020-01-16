import React from "react";
import { match } from "react-router";
import { Switch, useRouteMatch, Redirect } from "react-router-dom";
import PrivateRoute from "../../components/PrivateRoute";
import Loading from "../../components/Loading";
import loadable from "@loadable/component";
import EventHeader from "./EventHeader";
import Layout from "../../components/Layout";
import { useEventQuery } from "../../generated/graphqlHooks";

const QuestionsComponent = loadable(() => import("./questions"), {
  fallback: <Loading />
});

export type EventRouteParams = { id: string };

const Event: React.FC = () => {
  let routeMatch = useRouteMatch<EventRouteParams>("/event/:id") as match<
    EventRouteParams
  >;
  const { path, params } = routeMatch;
  // TODO: generate short id for event
  const eventQuery = useEventQuery({ variables: { eventId: params.id } });

  return (
    <Layout
      header={<EventHeader eventQuery={eventQuery} routeMatch={routeMatch} />}
      body={
        <Switch>
          <Redirect exact path={`${path}`} to={`${path}/questions`} />
          <PrivateRoute path={`${path}/questions`}>
            <QuestionsComponent eventQuery={eventQuery} />
          </PrivateRoute>
        </Switch>
      }
    />
  );
};

export default Event;

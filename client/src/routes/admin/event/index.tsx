import React from "react";
import { Switch, useRouteMatch, Redirect, useParams } from "react-router-dom";
import PrivateRoute from "../../../components/PrivateRoute";
import Loading from "../../../components/Loading";
import loadable from "@loadable/component";
import EventHeader from "./EventHeader";
import Layout from "../../../components/Layout";
import { useEventByMeQuery } from "../../../generated/graphqlHooks";

const QuestionsComponent = loadable(() => import("./questions"), {
  fallback: <Loading />
});
const PollsComponent = loadable(() => import("./polls"), {
  fallback: <Loading />
});

const Event: React.FC = () => {
  const { path } = useRouteMatch();
  const { id } = useParams();
  // TODO: generate short id for event
  const eventByMeQuery = useEventByMeQuery({ variables: { eventId: id as string } });

  return (
    <Layout
      header={<EventHeader eventByMeQuery={eventByMeQuery} />}
      body={
        <Switch>
          <Redirect exact path={`${path}`} to={`${path}/questions`} />
          <PrivateRoute path={`${path}/questions`}>
            <QuestionsComponent eventByMeQuery={eventByMeQuery} />
          </PrivateRoute>
          <PrivateRoute path={`${path}/polls`}>
            <PollsComponent />
          </PrivateRoute>
        </Switch>
      }
    />
  );
};

export default Event;

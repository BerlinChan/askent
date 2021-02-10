import React from "react";
import { Switch, useRouteMatch, Redirect, useParams } from "react-router-dom";
import PrivateRoute from "../../../components/PrivateRoute";
import Loading from "../../../components/Loading";
import loadable from "@loadable/component";
import AdminEventHeader from "./AdminEventHeader";
import {LayoutAdmin} from "../../../components/Layout";
import {
  useEventByIdQuery,
  useEventUpdatedSubscription,
} from "../../../generated/graphqlHooks";

const QuestionsComponent = loadable(() => import("./questions"), {
  fallback: <Loading />,
});
const PollsComponent = loadable(() => import("./polls"), {
  fallback: <Loading />,
});

const AdminEvent: React.FC = () => {
  const { path } = useRouteMatch();
  const { id } = useParams<{ id: string }>();
  const eventQueryResult = useEventByIdQuery({
    variables: { eventId: id },
  });

  useEventUpdatedSubscription({
    variables: { eventId: id },
  });

  return (
    <LayoutAdmin
      header={<AdminEventHeader eventQueryResult={eventQueryResult} />}
      body={
        <Switch>
          <Redirect exact path={`${path}`} to={`${path}/questions`} />
          <PrivateRoute path={`${path}/questions`}>
            <QuestionsComponent eventQueryResult={eventQueryResult} />
          </PrivateRoute>
          <PrivateRoute path={`${path}/polls`}>
            <PollsComponent />
          </PrivateRoute>
        </Switch>
      }
    />
  );
};

export default AdminEvent;

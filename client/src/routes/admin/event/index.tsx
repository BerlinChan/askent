import React from "react";
import { Switch, useRouteMatch, Redirect, useParams } from "react-router-dom";
import PrivateRoute from "../../../components/PrivateRoute";
import Loading from "../../../components/Loading";
import loadable from "@loadable/component";
import AdminEventHeader from "./AdminEventHeader";
import Layout from "../../../components/Layout";
import { useAdminEventQuery } from "../../../generated/graphqlHooks";

const QuestionsComponent = loadable(() => import("./questions"), {
  fallback: <Loading />
});
const PollsComponent = loadable(() => import("./polls"), {
  fallback: <Loading />
});

const AdminEvent: React.FC = () => {
  const { path } = useRouteMatch();
  const { id } = useParams();
  const adminEventQuery = useAdminEventQuery({
    variables: { eventId: id as string }
  });

  return (
    <Layout
      header={<AdminEventHeader eventQuery={adminEventQuery} />}
      scrollBoxBody
      body={
        <Switch>
          <Redirect exact path={`${path}`} to={`${path}/questions`} />
          <PrivateRoute path={`${path}/questions`}>
            <QuestionsComponent eventQuery={adminEventQuery} />
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

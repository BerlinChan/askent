import React from "react";
import { Switch, useRouteMatch, Redirect } from "react-router-dom";
import { PrivateRoute } from "../../components/PrivateRoute";
import Loading from "../../components/Loading";
import loadable from "@loadable/component";
import  EventHeader  from "./EventHeader";
import Layout from "../../components/Layout";

const QuestionsComponent = loadable(() => import("./questions"), {
  fallback: <Loading />
});

const Event: React.FC = () => {
  let { path } = useRouteMatch();

  return (
    <Layout
      header={<EventHeader />}
      body={
        <Switch>
          <Redirect exact path={`${path}/:id`} to={`${path}/:id/questions`} />
          <PrivateRoute path={`${path}/:id/questions`}>
            <QuestionsComponent />
          </PrivateRoute>
        </Switch>
      }
    />
  );
};

export default Event;

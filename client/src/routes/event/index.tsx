import React from "react";
import { Switch, useRouteMatch, Redirect } from "react-router-dom";
import { PrivateRoute } from "../../components/PrivateRoute";
import Loading from "../../components/Loading";
import loadable from "@loadable/component";
import { EventHeader } from "../../components/Header";
import { Container } from "@material-ui/core";

const QuestionsComponent = loadable(() => import("./questions"), {
  fallback: <Loading />
});

const Event: React.FC = () => {
  let { path } = useRouteMatch();

  return (
    <React.Fragment>
      <EventHeader />
      <Container maxWidth="lg">
        <Switch>
          <Redirect exact path={`${path}/:id`} to={`${path}/:id/questions`} />
          <PrivateRoute path={`${path}/:id/questions`}>
            <QuestionsComponent />
          </PrivateRoute>
        </Switch>
      </Container>
    </React.Fragment>
  );
};

export default Event;

import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import Loading from "../../components/Loading";
import loadable from "@loadable/component";
import { AudienceRoute } from "../../components/Route";

const EventLoginComponent = loadable(() => import("./login"), {
  fallback: <Loading />
});
const EventQuestionsComponent = loadable(() => import("./questions"), {
  fallback: <Loading />
});

const Event: React.FC = () => {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/login`} component={EventLoginComponent} />
      <AudienceRoute path={`${path}/questions`}>
        <EventQuestionsComponent />
      </AudienceRoute>
    </Switch>
  );
};

export default Event;

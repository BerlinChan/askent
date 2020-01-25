import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import Loading from "../../components/Loading";
import loadable from "@loadable/component";

const EventLoginComponent = loadable(() => import("./login"), {
  fallback: <Loading />
});

const Event: React.FC = () => {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/login`} component={EventLoginComponent} />
    </Switch>
  );
};

export default Event;

import React from "react";
import { Switch, Redirect, useRouteMatch, useParams } from "react-router-dom";
import Loading from "../../../components/Loading";
import loadable from "@loadable/component";
import PrivateRoute from "../../../components/PrivateRoute";
import { Layout } from "../../../components/Layout";
import LiveEventHeader from "./LiveEventHeader";
import { useMeQuery } from "../../../generated/graphqlHooks";
import {
  EventDetailLiveQueryFieldsFragment,
  useEventDetailLiveQuerySubscription,
} from "../../../generated/hasuraHooks";

const LiveQuestionsComponent = loadable(() => import("./questions"), {
  fallback: <Loading />,
});

const Live: React.FC = () => {
  let { path } = useRouteMatch();
  let { id } = useParams<{ id: string }>();
  const meQueryResult = useMeQuery();
  const [
    eventDetailData,
    setEventDetailData,
  ] = React.useState<EventDetailLiveQueryFieldsFragment>();

  useEventDetailLiveQuerySubscription({
    variables: { where: { id: { _eq: id } } },
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data?.event.length) {
        setEventDetailData(subscriptionData.data?.event[0]);
      }
    },
  });

  return (
    <Switch>
      <Redirect exact path={path} to={`${path}/questions`} />

      <Layout
        disableContainer
        header={<LiveEventHeader eventDetailData={eventDetailData} />}
        body={
          <Switch>
            <PrivateRoute path={`${path}/questions`}>
              <LiveQuestionsComponent
                userQueryResult={meQueryResult}
                eventDetailData={eventDetailData}
              />
            </PrivateRoute>
          </Switch>
        }
      />
    </Switch>
  );
};

export default Live;

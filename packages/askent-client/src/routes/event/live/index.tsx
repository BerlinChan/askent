import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import Loading from "../../../components/Loading";
import loadable from "@loadable/component";
import RequireAuth from "../../../components/RequireAuth";
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
const LiveIdeasComponent = loadable(() => import("./ideas"), {
  fallback: <Loading />,
});
const LivePollsComponent = loadable(() => import("./polls"), {
  fallback: <Loading />,
});

const Live: React.FC = () => {
  let { id } = useParams<{ id: string }>();
  const meQueryResult = useMeQuery();
  const [eventDetailData, setEventDetailData] =
    React.useState<EventDetailLiveQueryFieldsFragment>();

  useEventDetailLiveQuerySubscription({
    variables: { where: { id: { _eq: id } } },
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data?.event.length) {
        setEventDetailData(subscriptionData.data?.event[0]);
      }
    },
  });

  return (
    <Routes>
      <Route
        element={
          <Layout
            disableContainer
            header={<LiveEventHeader eventDetailData={eventDetailData} />}
          />
        }
      >
        <Route
          index
          element={
            <RequireAuth>
              <LiveQuestionsComponent
                userQueryResult={meQueryResult}
                eventDetailData={eventDetailData}
              />
            </RequireAuth>
          }
        />
        <Route
          path={`questions`}
          element={
            <RequireAuth>
              <LiveQuestionsComponent
                userQueryResult={meQueryResult}
                eventDetailData={eventDetailData}
              />
            </RequireAuth>
          }
        />
        <Route
          path={`ideas`}
          element={
            <RequireAuth>
              <LiveIdeasComponent />
            </RequireAuth>
          }
        />
        <Route
          path={`polls`}
          element={
            <RequireAuth>
              <LivePollsComponent />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
};

export default Live;

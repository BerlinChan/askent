import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import Loading from "../../../components/Loading";
import RequireAuth from "../../../components/RequireAuth";
import { Layout } from "../../../components/Layout";
import LiveEventHeader from "./LiveEventHeader";
import { useMeQuery } from "../../../generated/graphqlHooks";
import {
  EventDetailLiveQueryFieldsFragment,
  useEventDetailLiveQuerySubscription,
} from "../../../generated/hasuraHooks";

const LiveQuestionsComponent = React.lazy(() => import("./questions"));
const LiveIdeasComponent = React.lazy(() => import("./ideas"));
const LivePollsComponent = React.lazy(() => import("./polls"));

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
              <React.Suspense fallback={<Loading />}>
                <LiveQuestionsComponent
                  userQueryResult={meQueryResult}
                  eventDetailData={eventDetailData}
                />
              </React.Suspense>
            </RequireAuth>
          }
        />
        <Route
          path={`questions`}
          element={
            <RequireAuth>
              <React.Suspense fallback={<Loading />}>
                <LiveQuestionsComponent
                  userQueryResult={meQueryResult}
                  eventDetailData={eventDetailData}
                />
              </React.Suspense>
            </RequireAuth>
          }
        />
        <Route
          path={`ideas`}
          element={
            <RequireAuth>
              <React.Suspense fallback={<Loading />}>
                <LiveIdeasComponent />
              </React.Suspense>
            </RequireAuth>
          }
        />
        <Route
          path={`polls`}
          element={
            <RequireAuth>
              <React.Suspense fallback={<Loading />}>
                <LivePollsComponent />
              </React.Suspense>
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
};

export default Live;

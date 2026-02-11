import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import RequireAuth from "../../../components/RequireAuth";
import Loading from "../../../components/Loading";
import AdminEventHeader from "./AdminEventHeader";
import { Layout } from "../../../components/Layout";
import {
  useEventDetailLiveQuerySubscription,
  EventDetailLiveQueryFieldsFragment,
} from "../../../generated/hasuraHooks";

const QuestionsComponent = React.lazy(() => import("./questions"));
const PollsComponent = React.lazy(() => import("./polls"));
const AnalyticsComponent = React.lazy(() => import("./analytics"));

const AdminEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [eventDetailData, setEventDetailData] =
    React.useState<EventDetailLiveQueryFieldsFragment>();

  const { loading } = useEventDetailLiveQuerySubscription({
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
            header={
              <AdminEventHeader
                eventDetailData={eventDetailData}
                loading={loading}
              />
            }
          />
        }
      >
        <Route
          index
          element={
            <RequireAuth>
              <React.Suspense fallback={<Loading />}>
                <QuestionsComponent eventDetailData={eventDetailData} />
              </React.Suspense>
            </RequireAuth>
          }
        />
        <Route
          path={`questions`}
          element={
            <RequireAuth>
              <React.Suspense fallback={<Loading />}>
                <QuestionsComponent eventDetailData={eventDetailData} />
              </React.Suspense>
            </RequireAuth>
          }
        />
        <Route
          path={`polls`}
          element={
            <RequireAuth>
              <React.Suspense fallback={<Loading />}>
                <PollsComponent />
              </React.Suspense>
            </RequireAuth>
          }
        />
        <Route
          path={`analytics`}
          element={
            <RequireAuth>
              <React.Suspense fallback={<Loading />}>
                <AnalyticsComponent />
              </React.Suspense>
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
};

export default AdminEvent;
import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import RequireAuth from "../../../components/RequireAuth";
import Loading from "../../../components/Loading";
import loadable from "@loadable/component";
import AdminEventHeader from "./AdminEventHeader";
import { Layout } from "../../../components/Layout";
import {
  useEventDetailLiveQuerySubscription,
  EventDetailLiveQueryFieldsFragment,
} from "../../../generated/hasuraHooks";

const QuestionsComponent = loadable(() => import("./questions"), {
  fallback: <Loading />,
});
const PollsComponent = loadable(() => import("./polls"), {
  fallback: <Loading />,
});
const AnalyticsComponent = loadable(() => import("./analytics"), {
  fallback: <Loading />,
});

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
              <QuestionsComponent eventDetailData={eventDetailData} />
            </RequireAuth>
          }
        />
        <Route
          path={`questions`}
          element={
            <RequireAuth>
              <QuestionsComponent eventDetailData={eventDetailData} />
            </RequireAuth>
          }
        />
        <Route
          path={`polls`}
          element={
            <RequireAuth>
              <PollsComponent />
            </RequireAuth>
          }
        />
        <Route
          path={`analytics`}
          element={
            <RequireAuth>
              <AnalyticsComponent />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
};

export default AdminEvent;

import React from "react";
import {
  Routes,
  Route,
  Redirect,
  useMatch,
  useParams,
} from "react-router-dom";
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

const Live: React.FC = () => {
  let { path } = useMatch();
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
      <Redirect exact path={path} to={`${path}/questions`} />

      <Layout
        disableContainer
        header={<LiveEventHeader eventDetailData={eventDetailData} />}
        body={
          <Routes>
            <Route
              path={`${path}/questions`}
              element={
                <RequireAuth>
                  <LiveQuestionsComponent
                    userQueryResult={meQueryResult}
                    eventDetailData={eventDetailData}
                  />
                </RequireAuth>
              }
            />
          </Routes>
        }
      />
    </Routes>
  );
};

export default Live;

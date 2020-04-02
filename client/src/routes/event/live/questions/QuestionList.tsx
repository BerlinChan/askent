import React from "react";
import { Container, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { QueryResult } from "@apollo/react-common";
import {
  MeQuery,
  MeQueryVariables,
  EventByIdQuery,
  EventByIdQueryVariables,
  useQuestionsByEventAudienceQuery,
  QuestionsByEventAudienceQuery,
  QuestionsByEventAudienceQueryVariables,
  QuestionAudienceFieldsFragment,
  QuestionOrder,
  // useQuestionAddedAudienceSubscription,
  // useQuestionUpdatedAudienceSubscription,
  // useQuestionRemovedAudienceSubscription,
  QuestionsByEventAudienceDocument,
  RoleName
} from "../../../../generated/graphqlHooks";
import { DataProxy } from "apollo-cache";
import QuestionItem from "./QuestionItem";
import QuestionListMenu from "./QuestionListMenu";
import QuestionListHeader from "./QuestionListHeader";
import { Virtuoso } from "react-virtuoso";
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT } from "../../../../constant";
import { sortQuestionBy } from "../../../../utils";
import ListFooter from "../../../../components/ListFooter";

function updateCache(
  cache: DataProxy,
  queryVariables: QuestionsByEventAudienceQueryVariables,
  data: QuestionsByEventAudienceQuery
): void {
  cache.writeQuery<
    QuestionsByEventAudienceQuery,
    Omit<QuestionsByEventAudienceQueryVariables, "pagination">
  >({
    query: QuestionsByEventAudienceDocument,
    variables: queryVariables,
    data
  });
}

interface Props {
  userQueryResult: QueryResult<MeQuery, MeQueryVariables>;
  eventQueryResult: QueryResult<EventByIdQuery, EventByIdQueryVariables>;
  queryVariables: QuestionsByEventAudienceQueryVariables;
}

const QuestionList: React.FC<Props> = ({
  userQueryResult,
  eventQueryResult,
  queryVariables
}) => {
  const theme = useTheme();
  const matcheMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [isScrolling, setIsScrolling] = React.useState(false);
  const moreMenuState = React.useState<{
    anchorEl: null | HTMLElement;
    id: string;
  }>({ anchorEl: null, id: "" });
  const editContentInputRef = React.useRef<HTMLInputElement>(null);
  const editContentIdsState = React.useState<Array<string>>([]);
  const questionsQueryResult = useQuestionsByEventAudienceQuery({
    fetchPolicy: "network-only",
    variables: queryVariables
  });
  const { data, loading, fetchMore } = questionsQueryResult;

  // subscriptions
  // useQuestionAddedAudienceSubscription({
  //   variables: {
  //     eventId: queryVariables.eventId,
  //     asRole: RoleName.Audience,
  //     order: queryVariables.order,
  //     limit: data?.questionsByEventAudience.list.length
  //   },
  //   onSubscriptionData: ({ client, subscriptionData }) => {
  //     if (subscriptionData.data) {
  //       const { questionAdded } = subscriptionData.data;

  //       if (data) {
  //         // add
  //         updateCache(client, queryVariables, {
  //           questionsByEventAudience: {
  //             ...data.questionsByEventAudience,
  //             totalCount: data.questionsByEventAudience.totalCount + 1,
  //             list: [questionAdded].concat(
  //               data.questionsByEventAudience.list.filter(
  //                 question =>
  //                   question.id !== subscriptionData.data?.questionAdded.id
  //               )
  //             )
  //           }
  //         });
  //       }
  //     }
  //   }
  // });
  // useQuestionUpdatedAudienceSubscription({
  //   variables: { eventId: queryVariables.eventId, asRole: RoleName.Audience }
  // });
  // useQuestionRemovedAudienceSubscription({
  //   variables: { eventId: queryVariables.eventId, asRole: RoleName.Audience },
  //   onSubscriptionData: ({ client, subscriptionData }) => {

  //     if (data) {
  //       // remove
  //       updateCache(client, queryVariables, {
  //         questionsByEventAudience: {
  //           ...data.questionsByEventAudience,
  //           totalCount: data.questionsByEventAudience.totalCount - 1,
  //           list: data.questionsByEventAudience.list.filter(
  //             preQuestion =>
  //               subscriptionData.data?.questionRemoved !== preQuestion.id
  //           )
  //         }
  //       });
  //     }
  //   }
  // });

  const handleMoreClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    moreMenuState[1]({ anchorEl: event.currentTarget, id });
  };
  const handleMoreClose = () => {
    moreMenuState[1]({ anchorEl: null, id: "" });
  };

  const handleEditContentToggle = (id: string) => {
    const findId = editContentIdsState[0].find(item => item === id);
    editContentIdsState[1](
      findId
        ? editContentIdsState[0].filter(item => item !== id)
        : editContentIdsState[0].concat([id])
    );
    handleMoreClose();
    setTimeout(() => editContentInputRef.current?.focus(), 100);
  };

  const orderedList = React.useMemo(() => {
    const list = sortQuestionBy<QuestionAudienceFieldsFragment>(
      queryVariables.order || QuestionOrder.Popular
    )(data?.questionsByEventAudience.list || []);

    return list;
  }, [data, queryVariables]);
  const loadMore = () => {
    if (data?.questionsByEventAudience.hasNextPage) {
      fetchMore({
        variables: {
          pagination: {
            offset:
              data?.questionsByEventAudience.list.length || DEFAULT_PAGE_OFFSET,
            limit: data?.questionsByEventAudience.limit || DEFAULT_PAGE_LIMIT
          }
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return Object.assign({}, fetchMoreResult, {
            questionsByEventAudience: {
              ...fetchMoreResult.questionsByEventAudience,
              list: [
                ...prev.questionsByEventAudience.list,
                ...fetchMoreResult.questionsByEventAudience.list
              ]
            }
          });
        }
      });
    }
  };

  const renderListItem = (index: number) => {
    let question: QuestionAudienceFieldsFragment;
    if (matcheMdUp) {
      if (index === 0) {
        return (
          <Container maxWidth="sm">
            <QuestionListHeader userQueryResult={userQueryResult} />
          </Container>
        );
      } else if (!orderedList[index - 1]) {
        return <div />;
      } else {
        question = orderedList[index - 1];
      }
    } else {
      if (!orderedList[index]) {
        return <div />;
      } else {
        question = orderedList[index];
      }
    }

    return (
      <QuestionItem
        question={question}
        userQueryResult={userQueryResult}
        handleMoreClick={handleMoreClick}
        editContent={editContentIdsState[0].includes(question.id)}
        handleEditContentToggle={handleEditContentToggle}
        editContentInputRef={editContentInputRef}
        isScrolling={isScrolling}
      />
    );
  };

  return (
    <React.Fragment>
      <Virtuoso
        className="scrollContainer"
        style={{ height: "100%", width: "100%" }}
        totalCount={orderedList.length + (matcheMdUp ? 1 : 0)}
        scrollingStateChange={scrolling => {
          setIsScrolling(scrolling);
        }}
        endReached={loadMore}
        item={renderListItem}
        footer={() => (
          <ListFooter
            loading={loading}
            hasNextPage={data?.questionsByEventAudience.hasNextPage}
          />
        )}
      />

      <QuestionListMenu
        eventQueryResult={eventQueryResult}
        questionsQueryResult={questionsQueryResult}
        moreMenuState={moreMenuState}
        editContentInputRef={editContentInputRef}
        editContentIdsState={editContentIdsState}
      />
    </React.Fragment>
  );
};

export default QuestionList;

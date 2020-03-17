import React from "react";
import { Container, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { QueryResult } from "@apollo/react-common";
import {
  MeQuery,
  MeQueryVariables,
  EventByIdQuery,
  EventByIdQueryVariables,
  QuestionsByEventAudienceQuery,
  QuestionsByEventAudienceQueryVariables,
  QuestionAudienceFieldsFragment,
  QuestionOrder
} from "../../../../generated/graphqlHooks";
import QuestionItem from "./QuestionItem";
import QuestionListMenu from "./QuestionListMenu";
import QuestionListHeader from "./QuestionListHeader";
import { Virtuoso, VirtuosoMethods, TScrollContainer } from "react-virtuoso";
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT } from "../../../../constant";
import { sortQuestionBy } from "../../../../utils";
import ListFooter from "../../../../components/ListFooter";

const ScrollContainer: TScrollContainer = ({
  className,
  style,
  reportScrollTop,
  scrollTo,
  children
}) => {
  const elRef = React.useRef<HTMLDivElement>(null);

  // 自定 scrollTo，防止回到顶部失败 bug，Doc. https://virtuoso.dev/custom-scroll-container/
  scrollTo(scrollTop => {
    elRef.current?.scrollTo({ top: 0 });
  });

  return (
    <div
      ref={elRef}
      onScroll={e => reportScrollTop(e.currentTarget.scrollTop)}
      style={style}
      className={className}
    >
      {children}
    </div>
  );
};

interface Props {
  userQueryResult: QueryResult<MeQuery, MeQueryVariables>;
  eventQueryResult: QueryResult<EventByIdQuery, EventByIdQueryVariables>;
  questionsQueryResult: QueryResult<
    QuestionsByEventAudienceQuery,
    QuestionsByEventAudienceQueryVariables
  >;
  order?: QuestionOrder;
}

const QuestionList: React.FC<Props> = ({
  userQueryResult,
  eventQueryResult,
  questionsQueryResult,
  order = QuestionOrder.Popular
}) => {
  const theme = useTheme();
  const matcheMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const { data, loading, fetchMore } = questionsQueryResult;
  const virtuosoRef = React.useRef<VirtuosoMethods>(null);
  const [isScrolling, setIsScrolling] = React.useState(false);
  const moreMenuState = React.useState<{
    anchorEl: null | HTMLElement;
    id: string;
  }>({ anchorEl: null, id: "" });
  const editContentInputRef = React.useRef<HTMLInputElement>(null);

  const handleMoreClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    moreMenuState[1]({ anchorEl: event.currentTarget, id });
  };
  const handleMoreClose = () => {
    moreMenuState[1]({ anchorEl: null, id: "" });
  };

  const [editContentIds, setEditContentIds] = React.useState<Array<string>>([]);
  const handleEditContentToggle = (id: string) => {
    const findId = editContentIds.find(item => item === id);
    setEditContentIds(
      findId
        ? editContentIds.filter(item => item !== id)
        : editContentIds.concat([id])
    );
    handleMoreClose();
    setTimeout(() => editContentInputRef.current?.focus(), 100);
  };

  const orderedList = React.useMemo(() => {
    const list = sortQuestionBy<QuestionAudienceFieldsFragment>(order)(
      data?.questionsByEventAudience.list || []
    );

    return list;
  }, [data, order]);
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
            questionsByEvent: {
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
            <QuestionListHeader
              userQueryResult={userQueryResult}
              virtuosoRef={virtuosoRef}
            />
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
        editContent={editContentIds.includes(question.id)}
        handleEditContentToggle={handleEditContentToggle}
        editContentInputRef={editContentInputRef}
        isScrolling={isScrolling}
      />
    );
  };

  return (
    <React.Fragment>
      <Virtuoso
        ref={virtuosoRef}
        ScrollContainer={ScrollContainer}
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
      />
    </React.Fragment>
  );
};

export default QuestionList;

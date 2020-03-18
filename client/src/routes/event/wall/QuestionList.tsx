import React from "react";
import * as R from "ramda";
import { QueryResult } from "@apollo/react-common";
import {
  QuestionsByEventWallQuery,
  QuestionsByEventWallQueryVariables,
  QuestionWallFieldsFragment,
  QuestionOrder,
  QuestionFilter
} from "../../../generated/graphqlHooks";
import QuestionItem from "./QuestionItem";
import { Virtuoso } from "react-virtuoso";
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT } from "../../../constant";
import { sortQuestionBy } from "../../../utils";
import ListFooter from "../../../components/ListFooter";

interface Props {
  questionsQueryResult: QueryResult<
    QuestionsByEventWallQuery,
    QuestionsByEventWallQueryVariables
  >;
  order?: QuestionOrder | QuestionFilter;
}

const QuestionList: React.FC<Props> = ({
  questionsQueryResult,
  order = QuestionOrder.Popular
}) => {
  const { data, loading, fetchMore } = questionsQueryResult;
  const [isScrolling, setIsScrolling] = React.useState(false);

  const orderedList = React.useMemo(() => {
    const list = sortQuestionBy<QuestionWallFieldsFragment>(
      (order !== QuestionFilter.Starred
        ? order
        : QuestionOrder.Popular) as QuestionOrder
    )(data?.questionsByEventWall.list || []);

    return list;
  }, [data, order]);
  const loadMore = () => {
    if (data?.questionsByEventWall.hasNextPage) {
      fetchMore({
        variables: {
          pagination: {
            offset:
              data?.questionsByEventWall.list.length || DEFAULT_PAGE_OFFSET,
            limit: data?.questionsByEventWall.limit || DEFAULT_PAGE_LIMIT
          }
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return Object.assign({}, fetchMoreResult, {
            questionsByEventWall: {
              ...fetchMoreResult.questionsByEventWall,
              list: [
                ...R.differenceWith<QuestionWallFieldsFragment>(
                  (a, b) => a.id === b.id,
                  prev.questionsByEventWall.list,
                  fetchMoreResult.questionsByEventWall.list
                ),
                ...fetchMoreResult.questionsByEventWall.list
              ]
            }
          });
        }
      });
    }
  };

  return (
    <Virtuoso
      style={{ height: "100%", width: "100%" }}
      totalCount={orderedList.length}
      scrollingStateChange={scrolling => {
        setIsScrolling(scrolling);
      }}
      endReached={loadMore}
      item={index => {
        if (!orderedList[index]) return <div />;
        return (
          <QuestionItem
            question={orderedList[index]}
            isScrolling={isScrolling}
          />
        );
      }}
      footer={() => (
        <ListFooter
          loading={loading}
          hasNextPage={data?.questionsByEventWall.hasNextPage}
        />
      )}
    />
  );
};

export default QuestionList;

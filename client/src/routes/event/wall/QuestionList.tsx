import React from "react";
import * as R from "ramda";
import { QueryResult } from "@apollo/react-common";
import {
  WallQuestionsByEventQuery,
  WallQuestionsByEventQueryVariables,
  WallQuestionFieldsFragment
} from "../../../generated/graphqlHooks";
import QuestionItem from "./QuestionItem";
import { Virtuoso } from "react-virtuoso";
import { DEFAULT_PAGE_SKIP, DEFAULT_PAGE_FIRST } from "../../../constant";

interface Props {
  questionsQueryResult: QueryResult<
    WallQuestionsByEventQuery,
    WallQuestionsByEventQueryVariables
  >;
}

const QuestionList: React.FC<Props> = ({ questionsQueryResult }) => {
  const { data, fetchMore } = questionsQueryResult;

  const [endReached, setEndReached] = React.useState(false);
  const orderList = React.useMemo(() => {
    const orderList = R.sortWith([
      R.descend<WallQuestionFieldsFragment>(R.prop("top"))
    ])(data?.wallQuestionsByEvent.list || []);

    if (
      Number(data?.wallQuestionsByEvent.list.length) >=
      Number(data?.wallQuestionsByEvent.totalCount)
    ) {
      setEndReached(true);
    }

    return orderList;
  }, [data]);
  const loadMore = () => {
    if (!endReached) {
      fetchMore({
        variables: {
          pagination: {
            skip: data?.wallQuestionsByEvent.list.length || DEFAULT_PAGE_SKIP,
            first: data?.wallQuestionsByEvent.first || DEFAULT_PAGE_FIRST
          }
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return Object.assign({}, fetchMoreResult, {
            wallQuestionsByEvent: {
              ...fetchMoreResult.wallQuestionsByEvent,
              list: [
                ...prev.wallQuestionsByEvent.list,
                ...fetchMoreResult.wallQuestionsByEvent.list
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
      totalCount={orderList.length}
      endReached={loadMore}
      item={index => {
        return <QuestionItem question={orderList[index]} />;
      }}
      footer={() => {
        return endReached ? <div>-- end --</div> : <div>Loading...</div>;
      }}
    />
  );
};

export default QuestionList;

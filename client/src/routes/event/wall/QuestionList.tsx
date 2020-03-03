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
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT } from "../../../constant";

interface Props {
  questionsQueryResult: QueryResult<
    WallQuestionsByEventQuery,
    WallQuestionsByEventQueryVariables
  >;
}

const QuestionList: React.FC<Props> = ({ questionsQueryResult }) => {
  const { data, fetchMore } = questionsQueryResult;

  const [endReached, setEndReached] = React.useState(false);
  const orderedList = React.useMemo(() => {
    const list = R.sortWith([
      R.descend<WallQuestionFieldsFragment>(R.prop("top"))
    ])(data?.wallQuestionsByEvent.list || []);

    setEndReached(
      Number(data?.wallQuestionsByEvent.list.length) >=
        Number(data?.wallQuestionsByEvent.totalCount)
    );

    return list;
  }, [data]);
  const loadMore = () => {
    if (!endReached) {
      fetchMore({
        variables: {
          pagination: {
            skip: data?.wallQuestionsByEvent.list.length || DEFAULT_PAGE_OFFSET,
            first: data?.wallQuestionsByEvent.first || DEFAULT_PAGE_LIMIT
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
      totalCount={orderedList.length}
      endReached={loadMore}
      item={index => {
        return <QuestionItem question={orderedList[index]} />;
      }}
      footer={() => {
        return endReached ? <div>-- end --</div> : <div>Loading...</div>;
      }}
    />
  );
};

export default QuestionList;

import React from "react";
import * as R from "ramda";
import { QueryResult } from "@apollo/react-common";
import {
  QuestionsByEventWallQuery,
  QuestionsByEventWallQueryVariables,
  QuestionWallFieldsFragment
} from "../../../generated/graphqlHooks";
import QuestionItem from "./QuestionItem";
import { Virtuoso } from "react-virtuoso";
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT } from "../../../constant";

interface Props {
  questionsQueryResult: QueryResult<
    QuestionsByEventWallQuery,
    QuestionsByEventWallQueryVariables
  >;
}

const QuestionList: React.FC<Props> = ({ questionsQueryResult }) => {
  const { data, fetchMore } = questionsQueryResult;

  const [endReached, setEndReached] = React.useState(false);
  const orderedList = React.useMemo(() => {
    // TODO: order
    const list = R.sortWith([
      R.descend<QuestionWallFieldsFragment>(R.prop("top"))
    ])(data?.questionsByEventWall.list || []);

    setEndReached(
      Number(data?.questionsByEventWall.list.length) >=
        Number(data?.questionsByEventWall.totalCount)
    );

    return list;
  }, [data]);
  const loadMore = () => {
    if (!endReached) {
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
                ...prev.questionsByEventWall.list,
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
      endReached={loadMore}
      item={index => {
        if (!orderedList[index]) return <div />;
        return <QuestionItem question={orderedList[index]} />;
      }}
      footer={() => {
        return endReached ? <div>-- end --</div> : <div>Loading...</div>;
      }}
    />
  );
};

export default QuestionList;

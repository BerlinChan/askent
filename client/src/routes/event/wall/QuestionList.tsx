import React from "react";
import {
  QuestionWallFieldsFragment,
  useQuestionsByEventWallQuery,
  QuestionOrder,
  QuestionSearchInput
} from "../../../generated/graphqlHooks";
import QuestionItem from "./QuestionItem";
import { Virtuoso } from "react-virtuoso";
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT } from "../../../constant";
import { sortQuestionBy } from "../../../utils";
import ListFooter from "../../../components/ListFooter";

interface Props {
  questionSearchInput: QuestionSearchInput;
}

const QuestionList: React.FC<Props> = ({ questionSearchInput }) => {
  const [isScrolling, setIsScrolling] = React.useState(false);
  const questionsWallQueryResult = useQuestionsByEventWallQuery({
    fetchPolicy: "network-only",
    variables: { input: questionSearchInput }
  });
  const { data, loading, fetchMore } = questionsWallQueryResult;

  const orderedList = React.useMemo(() => {
    const list = sortQuestionBy<QuestionWallFieldsFragment>(
      questionSearchInput.order || QuestionOrder.Popular
    )(data?.questionsByEventWall.list || []);

    return list;
  }, [data, questionSearchInput]);
  const loadMore = () => {
    if (data?.questionsByEventWall.hasNextPage) {
      fetchMore({
        variables: {
          input: {
            ...questionSearchInput,
            pagination: {
              offset:
                data?.questionsByEventWall.list.length || DEFAULT_PAGE_OFFSET,
              limit: data?.questionsByEventWall.limit || DEFAULT_PAGE_LIMIT
            }
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

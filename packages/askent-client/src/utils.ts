import * as R from "ramda";
import {
  QuestionFieldsFragment,
  QuestionOrder,
} from "./generated/graphqlHooks";
import { Order_By, Question_Order_By, Maybe } from "./generated/hasuraHooks";

export function getQuestionOrderByCondition(
  questionOrder: QuestionOrder
): Maybe<Array<Question_Order_By> | Question_Order_By> {
  switch (questionOrder) {
    case QuestionOrder.Recent:
      return {
        top: Order_By.Desc,
        createdAt: Order_By.Desc,
        voteUpCount: Order_By.Desc,
      };
    case QuestionOrder.Oldest:
      return {
        top: Order_By.Desc,
        createdAt: Order_By.Asc,
        voteUpCount: Order_By.Desc,
      };
    case QuestionOrder.Starred:
      return {
        top: Order_By.Desc,
        star: Order_By.Desc,
        createdAt: Order_By.Desc,
      };
    default:
      // QuestionOrder.Popular:
      return {
        top: Order_By.Desc,
        voteUpCount: Order_By.Desc,
        createdAt: Order_By.Desc,
      };
  }
}

export function sortQuestionBy<TQuestion extends QuestionFieldsFragment>(
  order: QuestionOrder
) {
  return R.sortWith(
    order === QuestionOrder.Recent
      ? [
          R.descend<TQuestion>(R.prop("top")),
          R.descend<TQuestion>(R.prop("createdAt")),
          R.descend<TQuestion>(R.prop("voteUpCount")),
        ]
      : order === QuestionOrder.Oldest
      ? [
          R.descend<TQuestion>(R.prop("top")),
          R.ascend<TQuestion>(R.prop("createdAt")),
          R.descend<TQuestion>(R.prop("voteUpCount")),
        ]
      : order === QuestionOrder.Starred
      ? [
          R.descend<TQuestion>(R.prop("top")),
          R.descend<TQuestion>(R.prop("star")),
          R.descend<TQuestion>(R.prop("voteUpCount")),
          R.descend<TQuestion>(R.prop("createdAt")),
        ]
      : // default: order === QuestionOrder.Popular
        [
          R.descend<TQuestion>(R.prop("top")),
          R.descend<TQuestion>(R.prop("voteUpCount")),
          R.descend<TQuestion>(R.prop("createdAt")),
        ]
  );
}

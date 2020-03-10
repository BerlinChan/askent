import * as R from "ramda";
import {
  QuestionFieldsFragment,
  QuestionOrder
} from "./generated/graphqlHooks";

export function sortQuestionBy<
  TQuestion extends Omit<QuestionFieldsFragment, "star">
>(order: QuestionOrder) {
  return R.sortWith(
    [R.descend<TQuestion>(R.prop("top"))].concat(
      order === QuestionOrder.Popular
        ? [
            R.descend<TQuestion>(R.prop("voteUpCount")),
            R.descend<TQuestion>(R.prop("createdAt"))
          ]
        : order === QuestionOrder.Recent
        ? [
            R.descend<TQuestion>(R.prop("createdAt")),
            R.descend<TQuestion>(R.prop("voteUpCount"))
          ]
        : order === QuestionOrder.Oldest
        ? [
            R.ascend<TQuestion>(R.prop("createdAt")),
            R.descend<TQuestion>(R.prop("voteUpCount"))
          ]
        : []
    )
  );
}

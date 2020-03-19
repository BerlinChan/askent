import * as R from "ramda";
import {
  QuestionFieldsFragment,
  QuestionOrder
} from "./generated/graphqlHooks";

export function sortQuestionBy<TQuestion extends QuestionFieldsFragment>(
  order: QuestionOrder
) {
  return R.sortWith(
    order === QuestionOrder.Recent
      ? [
          R.descend<TQuestion>(R.prop("top")),
          R.descend<TQuestion>(R.prop("createdAt")),
          R.descend<TQuestion>(R.prop("voteUpCount"))
        ]
      : order === QuestionOrder.Oldest
      ? [
          R.descend<TQuestion>(R.prop("top")),
          R.ascend<TQuestion>(R.prop("createdAt")),
          R.descend<TQuestion>(R.prop("voteUpCount"))
        ]
      : order === QuestionOrder.Stared
      ? [
          R.descend<TQuestion>(R.prop("top")),
          R.descend<TQuestion>(R.prop("star")),
          R.descend<TQuestion>(R.prop("voteUpCount")),
          R.descend<TQuestion>(R.prop("createdAt"))
        ]
      : // default: order === QuestionOrder.Popular
        [
          R.descend<TQuestion>(R.prop("top")),
          R.descend<TQuestion>(R.prop("voteUpCount")),
          R.descend<TQuestion>(R.prop("createdAt"))
        ]
  );
}

import React from "react";
import * as R from "ramda";
import { CircularProgress } from "@material-ui/core";
import {
  EventDetailLiveQueryFieldsFragment,
  QuestionLiveQueryFieldsFragment,
} from "../../../../../generated/hasuraHooks";
import QuestionItem from "../QuestionItem";
import QuestionItemMenu from "../QuestionItemMenu";

interface Props {
  loading: boolean;
  isScrolling?: boolean;
  question?: QuestionLiveQueryFieldsFragment;
  eventDetailData: EventDetailLiveQueryFieldsFragment | undefined;
}

const ReplyListHeader: React.FC<Props> = ({
  loading,
  isScrolling = false,
  question,
  eventDetailData,
}) => {
  const moreMenuState = React.useState<{
    anchorEl: null | HTMLElement;
    id: string;
  }>({ anchorEl: null, id: "" });
  const editContentInputRef = React.useRef<HTMLInputElement>(null);
  const editContentIdsState = React.useState<Array<string>>([]);

  const handleMoreClose = () => {
    moreMenuState[1]({ anchorEl: null, id: "" });
  };

  const handleMoreOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    moreMenuState[1]({ anchorEl: event.currentTarget, id });
  };

  const handleEditContentToggle = (id: string) => {
    const findId = editContentIdsState[0].find((item) => item === id);
    editContentIdsState[1](
      findId
        ? editContentIdsState[0].filter((item) => item !== id)
        : editContentIdsState[0].concat([id])
    );
    handleMoreClose();
    setTimeout(() => editContentInputRef.current?.focus(), 100);
  };

  return (
    <React.Fragment>
      {loading ? (
        <CircularProgress />
      ) : question ? (
        <QuestionItem
          question={question}
          eventDetailData={eventDetailData}
          handleMoreClick={handleMoreOpen}
          editContent={editContentIdsState[0].includes(question.id)}
          handleEditContentToggle={handleEditContentToggle}
          editContentInputRef={editContentInputRef}
          isScrolling={isScrolling}
          showReplyCount={false}
        />
      ) : null}

      <QuestionItemMenu
        question={question}
        moreMenuState={moreMenuState}
        editContentInputRef={editContentInputRef}
        editContentIdsState={editContentIdsState}
      />
    </React.Fragment>
  );
};

export default React.memo(ReplyListHeader, (prevProps, nextProps) => {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
  return R.equals(prevProps, nextProps);
});

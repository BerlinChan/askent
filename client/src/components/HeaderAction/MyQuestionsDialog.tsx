import React from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent
} from "@material-ui/core";
import {
  useMeQuery,
  useEventByIdQuery,
  useQuestionsByMeAudienceQuery
} from "../../generated/graphqlHooks";
import { FormattedMessage } from "react-intl";
// import QuestionList from "./questions/QuestionList";
import { DEFAULT_PAGE_FIRST, DEFAULT_PAGE_SKIP } from "../../constant";

interface Props {
  open: boolean;
  onClose: () => void;
}

const MyQuestionsDialog: React.FC<Props> = ({ open, onClose }) => {
  let { id } = useParams();
  const userQueryResult = useMeQuery();
  const eventByIdQueryResult = useEventByIdQuery({
    variables: { eventId: id as string }
  });
  const myQuestionsResult = useQuestionsByMeAudienceQuery({
    variables: {
      eventId: id as string,
      pagination: { first: DEFAULT_PAGE_FIRST, skip: DEFAULT_PAGE_SKIP }
    }
  });

  React.useEffect(() => {
    if (open) {
      myQuestionsResult.refetch();
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>
        <FormattedMessage id="My_questions" defaultMessage="My questions" />
      </DialogTitle>
      <DialogContent>
        {/* <QuestionList
          userQueryResult={userQueryResult}
          eventQueryResult={eventQueryResult}
          myQuestionsResult={myQuestionsResult}
        /> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          <FormattedMessage id="Close" defaultMessage="Close" />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MyQuestionsDialog;

import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent
} from "@material-ui/core";
// import { useQuestionsByMeQuery } from "../../generated/graphqlHooks";
import { FormattedMessage } from "react-intl";
// import QuestionList from "./questions/QuestionList";
// import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from "../../constant";

interface Props {
  open: boolean;
  onClose: () => void;
}

const MyQuestionsDialog: React.FC<Props> = ({ open, onClose }) => {
  // const myQuestionsResult = useQuestionsByMeQuery({
  //   variables: {
  //     pagination: { limit: DEFAULT_PAGE_LIMIT, offset: DEFAULT_PAGE_OFFSET }
  //   }
  // });

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

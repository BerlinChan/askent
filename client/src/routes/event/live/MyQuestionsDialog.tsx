import React from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent
} from "@material-ui/core";
import { QueryResult } from "@apollo/react-common";
import {
  MeQuery,
  MeQueryVariables
} from "../../../generated/graphqlHooks";
import { FormattedMessage } from "react-intl";
import { useQuestionsByMeAudienceQuery } from "../../../generated/graphqlHooks";
import QuestionList from "./questions/QuestionList";

interface Props {
  userQueryResult: QueryResult<MeQuery, MeQueryVariables>;
  open: boolean;
  onClose: () => void;
}

const MyQuestionsDialog: React.FC<Props> = ({
  userQueryResult,
  open,
  onClose
}) => {
  let { id } = useParams();
  const myQuestionsResult = useQuestionsByMeAudienceQuery({
    variables: { eventId: id as string }
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
        <QuestionList
          userQueryResult={userQueryResult}
          myQuestionsResult={myQuestionsResult}
        />
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

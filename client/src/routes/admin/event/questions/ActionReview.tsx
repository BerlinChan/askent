import React from "react";
import { useParams } from "react-router-dom";
import { Typography, FormControlLabel, Switch } from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import {
  useUpdateEventMutation,
  useDeleteAllReviewQuestionsMutation,
  usePublishAllReviewQuestionsMutation,
  EventByIdQuery,
  EventByIdQueryVariables,
  QuestionsByEventQuery,
  ReviewStatus
} from "../../../../generated/graphqlHooks";
import { QueryResult } from "@apollo/react-common";
import Confirm from "../../../../components/Confirm";
import { DataProxy } from "apollo-cache";

interface Props {
  eventQuery: QueryResult<EventByIdQuery, EventByIdQueryVariables>;
  updateCache: (
    cache: DataProxy,
    reviewStatus: ReviewStatus,
    data: QuestionsByEventQuery
  ) => void;
}

const ActionReview: React.FC<Props> = ({ eventQuery, updateCache }) => {
  const { formatMessage } = useIntl();
  const { id } = useParams();
  const { data } = eventQuery;
  const [updateEventMutation] = useUpdateEventMutation();
  const [
    deleteAllReviewQuestionsMutation
  ] = useDeleteAllReviewQuestionsMutation();
  const [
    publishAllReviewQuestionsMutation
  ] = usePublishAllReviewQuestionsMutation();
  const [confirmModeration, setConfirmModeration] = React.useState(false);

  const handleModerationChange = async () => {
    if (data?.eventById.moderation) {
      setConfirmModeration(true);
    } else {
      await updateEventMutation({
        variables: {
          eventId: id as string,
          moderation: true
        }
      });
    }
  };
  const handleDeleteAll = async () => {
    await deleteAllReviewQuestionsMutation({
      variables: { eventId: id as string }
    });
    await updateEventMutation({
      variables: {
        eventId: id as string,
        moderation: false
      }
    });
    setConfirmModeration(false);
  };
  const handlePublishAll = async () => {
    await publishAllReviewQuestionsMutation({
      variables: { eventId: id as string }
    });
    await updateEventMutation({
      variables: {
        eventId: id as string,
        moderation: false
      }
    });
    setConfirmModeration(false);
  };

  return (
    <React.Fragment>
      <Typography color="textSecondary">
        <FormattedMessage id="ForReview" defaultMessage="For view" />
      </Typography>
      <FormControlLabel
        labelPlacement="start"
        control={
          <Switch
            checked={Boolean(data?.eventById.moderation)}
            onChange={handleModerationChange}
          />
        }
        label={formatMessage({
          id: "Moderation",
          defaultMessage: "Moderation"
        })}
      />

      <Confirm
        disableBackdropClick
        disableEscapeKeyDown
        contentText={formatMessage({
          id: "Publish_or_delete_all_unreview_questions?",
          defaultMessage: "Publish or delete all unreview questions?"
        })}
        open={confirmModeration}
        cancelText={
          <Typography color="error" variant="subtitle1">
            <FormattedMessage id="Delete" defaultMessage="Delete" />
          </Typography>
        }
        okText={
          <Typography variant="subtitle1">
            <FormattedMessage id="Publish" defaultMessage="Publish" />
          </Typography>
        }
        onCancel={handleDeleteAll}
        onOk={handlePublishAll}
      />
    </React.Fragment>
  );
};

export default ActionReview;

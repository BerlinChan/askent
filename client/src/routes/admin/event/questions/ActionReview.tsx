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
} from "../../../../generated/graphqlHooks";
import { QueryResult } from "@apollo/client";
import Confirm from "../../../../components/Confirm";

interface Props {
  eventQueryResult: QueryResult<EventByIdQuery, EventByIdQueryVariables>;
}

const ActionReview: React.FC<Props> = ({ eventQueryResult }) => {
  const { formatMessage } = useIntl();
  const { id } = useParams<{ id: string }>();
  const { data } = eventQueryResult;
  const [updateEventMutation] = useUpdateEventMutation();
  const [
    deleteAllReviewQuestionsMutation,
  ] = useDeleteAllReviewQuestionsMutation();
  const [
    publishAllReviewQuestionsMutation,
  ] = usePublishAllReviewQuestionsMutation();
  const [confirmModeration, setConfirmModeration] = React.useState(false);

  const handleModerationChange = async () => {
    if (data?.eventById.moderation) {
      setConfirmModeration(true);
    } else {
      await updateEventMutation({
        variables: {
          input: {
            eventId: id,
            moderation: true,
          },
        },
      });
    }
  };
  const handleDeleteAll = async () => {
    await deleteAllReviewQuestionsMutation({
      variables: { eventId: id },
    });
    await updateEventMutation({
      variables: {
        input: {
          eventId: id,
          moderation: false,
        },
      },
    });
    setConfirmModeration(false);
  };
  const handlePublishAll = async () => {
    await publishAllReviewQuestionsMutation({
      variables: { eventId: id },
    });
    await updateEventMutation({
      variables: {
        input: {
          eventId: id,
          moderation: false,
        },
      },
    });
    setConfirmModeration(false);
  };

  return (
    <React.Fragment>
      <Typography color="textSecondary">
        <FormattedMessage id="ForReview" defaultMessage="For review" />
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
          defaultMessage: "Moderation",
        })}
      />

      <Confirm
        disableBackdropClick
        disableEscapeKeyDown
        contentText={formatMessage({
          id: "Publish_or_delete_all_unreview_questions?",
          defaultMessage: "Publish or delete all unreview questions?",
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

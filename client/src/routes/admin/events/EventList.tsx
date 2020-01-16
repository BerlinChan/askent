import React, { Fragment } from "react";
import {
  Paper,
  Typography,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress
} from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import DeleteIcon from "@material-ui/icons/Delete";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  EventsQuery,
  EventsQueryVariables,
  useDeleteEventMutation
} from "../../../generated/graphqlHooks";
import { QueryResult } from "@apollo/react-common";
import { useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import Confirm from "../../../components/Confirm";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    eventList: {
      position: "relative",
      marginTop: theme.spacing(2)
    },
    code: { marginLeft: theme.spacing(2) },
    progress: {
      position: "absolute",
      top: 0,
      left: "50%",
      zIndex: 1
    }
  })
);

interface Props {
  eventsQueryResult: QueryResult<EventsQuery, EventsQueryVariables>;
}

const EventList: React.FC<Props> = ({ eventsQueryResult, ...props }) => {
  const classes = useStyles();
  const history = useHistory();
  const { data, loading, refetch } = eventsQueryResult;
  const [deleteConfirm, setDeleteConfirm] = React.useState({
    open: false,
    id: ""
  });
  const [deleteEventMutation] = useDeleteEventMutation();

  const handleOpenDelete = (id: string) => {
    setDeleteConfirm({ open: true, id });
  };
  const handleCloseDelete = () => {
    setDeleteConfirm({ open: false, id: "" });
  };
  const handleDelete = async () => {
    await deleteEventMutation({
      variables: { eventId: deleteConfirm.id }
    });
    refetch();
    setDeleteConfirm({ open: false, id: "" });
  };

  return (
    <Fragment>
      <Paper className={classes.eventList}>
        <List disablePadding>
          {data?.events.map((eventItem, eventIndex) => (
            <ListItem
              key={eventIndex}
              button
              divider
              onClick={() => history.push(`/event/${eventItem.id}`)}
            >
              <ListItemAvatar>
                <Avatar>
                  <FolderIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Fragment>
                    <Typography color="inherit" display="inline">
                      {eventItem.name}
                    </Typography>
                    <Typography
                      className={classes.code}
                      color="textSecondary"
                      display="inline"
                    >
                      #{eventItem.code}
                    </Typography>
                  </Fragment>
                }
                secondary={`${eventItem.startAt} ~ ${eventItem.endAt}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleOpenDelete(eventItem.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        {loading && <CircularProgress className={classes.progress} />}
      </Paper>

      <Confirm
        open={deleteConfirm.open}
        contentText={
          <FormattedMessage
            id="Delete_this_event?"
            defaultMessage="Delete this event?"
          />
        }
        okText={<FormattedMessage id="Delete" defaultMessage="Delete" />}
        onCancel={handleCloseDelete}
        onOk={handleDelete}
      />
    </Fragment>
  );
};

export default EventList;

import React, { Fragment } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction
} from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import DeleteIcon from "@material-ui/icons/Delete";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";
import {
  useEventsQuery,
  useDeleteEventMutation
} from "../../../generated/graphqlHooks";
import CreateEventDialog from "./CreateEventDialog";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleBox: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: theme.spacing(2)
    }
  })
);

const Events: React.FC<{}> = () => {
  const classes = useStyles();
  const [openCreate, setOpenCreate] = React.useState(false);
  const { data: eventsData, loading: eventsLoading } = useEventsQuery();
  const [deleteEventMutation] = useDeleteEventMutation();

  const handleClickOpen = () => {
    setOpenCreate(true);
  };
  const handleClose = () => {
    setOpenCreate(false);
  };

  return (
    <Fragment>
      <Box className={classes.titleBox}>
        <Typography variant="h6">Events</Typography>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          <FormattedMessage id="CREAT_EVENT" />
        </Button>
      </Box>
      <Box>
        <List>
          {eventsData?.events.map((eventItem, eventIndex) => (
            <ListItem key={eventIndex}>
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
                    <Typography color="textSecondary" display="inline">
                      # {eventItem.code}
                    </Typography>
                  </Fragment>
                }
                secondary={`${eventItem.startAt} ~ ${eventItem.endAt}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() =>
                    deleteEventMutation({
                      variables: { eventId: eventItem.id }
                    })
                  }
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>

      <CreateEventDialog open={openCreate} onClose={handleClose} />
    </Fragment>
  );
};

export default Events;

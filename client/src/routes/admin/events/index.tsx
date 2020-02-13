import React, { Fragment } from "react";
import { Box, Button } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";
import { useEventsByMeQuery } from "../../../generated/graphqlHooks";
import CreateEventDialog from "./CreateEventDialog";
import EventList from "./EventList";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    actionBox: {
      display: "flex",
      justifyContent: "flex-end"
    }
  })
);

interface Props {
  searchString: string;
}

const Events: React.FC<Props> = ({ searchString }) => {
  const classes = useStyles();
  const [openCreate, setOpenCreate] = React.useState(false);
  const eventsByMeQueryResult = useEventsByMeQuery({
    variables: { searchString, pagination: { first: 50, skip: 0 } }
  });
  const { refetch: eventsByMeRefetch } = eventsByMeQueryResult;

  const handleClickOpen = () => {
    setOpenCreate(true);
  };
  const handleClose = () => {
    eventsByMeRefetch();
    setOpenCreate(false);
  };

  return (
    <Fragment>
      <Box className={classes.actionBox}>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          <FormattedMessage id="CREAT_EVENT" defaultMessage="Create Event" />
        </Button>
      </Box>
      <EventList eventsByMeQueryResult={eventsByMeQueryResult} />

      <CreateEventDialog open={openCreate} onClose={handleClose} />
    </Fragment>
  );
};

export default Events;

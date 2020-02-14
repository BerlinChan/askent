import React from "react";
import { Box, Button } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";
import {
  useEventsByMeQuery,
  OrderByArg
} from "../../../generated/graphqlHooks";
import CreateEventDialog from "./CreateEventDialog";
import EventList from "./EventList";
import { DEFAULT_PAGE_SKIP, DEFAULT_PAGE_FIRST } from "../../../constant";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    eventsBox: {
      display: "flex",
      flexDirection: "column",
      height: "100%"
    },
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
    variables: {
      searchString,
      orderBy: { createdAt: OrderByArg.Desc },
      pagination: { first: DEFAULT_PAGE_FIRST, skip: DEFAULT_PAGE_SKIP }
    }
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
    <Box className={classes.eventsBox}>
      <Box className={classes.actionBox}>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          <FormattedMessage id="CREAT_EVENT" defaultMessage="Create Event" />
        </Button>
      </Box>
      <EventList eventsByMeQueryResult={eventsByMeQueryResult} />

      <CreateEventDialog open={openCreate} onClose={handleClose} />
    </Box>
  );
};

export default Events;

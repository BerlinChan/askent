import React from "react";
import { Box, Button, Select, MenuItem } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";
import {
  useEventsByMeQuery,
  EventOwnerFilter,
  EventDateStatus,
} from "../../../generated/graphqlHooks";
import CreateEventDialog from "./CreateEventDialog";
import EventList from "./EventList";
import {
  DEFAULT_PAGE_OFFSET,
  DEFAULT_PAGE_LIMIT,
} from "askent-common/src/constant";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    eventsBox: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
    actionBox: {
      display: "flex",
      justifyContent: "flex-end",
    },
    actionField: {
      marginLeft: theme.spacing(2),
      "&.ownerFilter": {
        width: 80,
      },
      "&.eventDateFilter": {
        width: 120,
      },
    },
  })
);

const getEventOwnerFilterLabel = (value: EventOwnerFilter | "ALL") => {
  switch (value) {
    case EventOwnerFilter.Owner:
      return <FormattedMessage id="Owner" defaultMessage="Owner" />;
    case EventOwnerFilter.Guest:
      return <FormattedMessage id="Guest" defaultMessage="Guest" />;
    default:
      return <FormattedMessage id="All" defaultMessage="All" />;
  }
};

export const getEventDateFilterLabel = (value: EventDateStatus | "ALL") => {
  switch (value) {
    case EventDateStatus.Active:
      return <FormattedMessage id="Active" defaultMessage="Active" />;
    case EventDateStatus.Upcoming:
      return <FormattedMessage id="Upcoming" defaultMessage="Upcoming" />;
    case EventDateStatus.Past:
      return <FormattedMessage id="Past" defaultMessage="Past" />;
    default:
      return <FormattedMessage id="All" defaultMessage="All" />;
  }
};

interface Props {
  searchString: string;
}

const Events: React.FC<Props> = ({ searchString }) => {
  const classes = useStyles();
  const createDialogOpenState = React.useState(false);
  const [ownerFilter, setOwnerFilter] = React.useState<
    EventOwnerFilter | "ALL"
  >("ALL");
  const [eventDateFilter, setEventDateFilter] = React.useState<
    EventDateStatus | "ALL"
  >("ALL");
  const eventsByMeQueryResult = useEventsByMeQuery({
    variables: {
      searchString,
      eventOwnerFilter: ownerFilter !== "ALL" ? ownerFilter : undefined,
      dateStatusFilter: eventDateFilter !== "ALL" ? eventDateFilter : undefined,
      pagination: { limit: DEFAULT_PAGE_LIMIT, offset: DEFAULT_PAGE_OFFSET },
    },
  });

  const handleOwnerFilterChange = (
    e: React.ChangeEvent<{ value: unknown }>
  ) => {
    setOwnerFilter(e.target.value as EventOwnerFilter);
  };

  const handleEventDateFilterChange = (
    e: React.ChangeEvent<{ value: unknown }>
  ) => {
    setEventDateFilter(e.target.value as EventDateStatus);
  };

  const handleCreateOpen = () => {
    createDialogOpenState[1](true);
  };

  return (
    <Box className={classes.eventsBox}>
      <Box className={classes.actionBox}>
        <Select
          className={classes.actionField + " ownerFilter"}
          value={ownerFilter}
          onChange={handleOwnerFilterChange}
        >
          {["ALL"]
            .concat(Object.values(EventOwnerFilter))
            .map((item) => (
              <MenuItem key={item} value={item}>
                {getEventOwnerFilterLabel(item as EventOwnerFilter | "ALL")}
              </MenuItem>
            ))}
        </Select>
        <Select
          className={classes.actionField + " eventDateFilter"}
          value={eventDateFilter}
          onChange={handleEventDateFilterChange}
        >
          {["ALL"].concat(Object.values(EventDateStatus)).map((item) => (
            <MenuItem key={item} value={item}>
              {getEventDateFilterLabel(item as EventDateStatus | "ALL")}
            </MenuItem>
          ))}
        </Select>
        <Button
          className={classes.actionField}
          variant="contained"
          color="primary"
          onClick={handleCreateOpen}
        >
          <FormattedMessage id="CREATE_EVENT" defaultMessage="Create Event" />
        </Button>
      </Box>
      <EventList eventsByMeQueryResult={eventsByMeQueryResult} />

      <CreateEventDialog
        openState={createDialogOpenState}
        eventsQueryResult={eventsByMeQueryResult}
      />
    </Box>
  );
};

export default Events;

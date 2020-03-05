import React, { Fragment } from "react";
import * as R from "ramda";
import {
  Paper,
  Typography,
  Avatar,
  IconButton,
  ListSubheader,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress
} from "@material-ui/core";
import { GroupedVirtuoso } from "react-virtuoso";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  EventsByMeQuery,
  EventsByMeQueryVariables,
  useDeleteEventMutation,
  AdminEventFieldsFragment
} from "../../../generated/graphqlHooks";
import { QueryResult } from "@apollo/react-common";
import { useHistory } from "react-router-dom";
import { FormattedMessage, FormattedDate } from "react-intl";
import Confirm from "../../../components/Confirm";
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT } from "../../../constant";
import DeleteIcon from "@material-ui/icons/Delete";
import DvrIcon from "@material-ui/icons/Dvr";
import PhoneAndroidIcon from "@material-ui/icons/PhoneAndroid";
import EventIcon from "@material-ui/icons/Event";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import EventBusyIcon from "@material-ui/icons/EventBusy";
import { EventDateStatus, getEventDateStatus } from "../../../utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    eventList: {
      margin: theme.spacing(2, 0),
      flex: 1
    },
    header: {
      backgroundColor: theme.palette.background.paper
    },
    listItem: {
      "& .actionHover": { display: "none" },
      "&:hover .actionHover": { display: "inline-flex" }
    },
    code: { marginLeft: theme.spacing(2) },
    actionHoverIcon: {
      fontSize: theme.typography.pxToRem(18),
      color: theme.palette.action.disabled
    }
  })
);

interface Props {
  eventsByMeQueryResult: QueryResult<EventsByMeQuery, EventsByMeQueryVariables>;
}

const EventList: React.FC<Props> = ({ eventsByMeQueryResult }) => {
  const classes = useStyles();
  const history = useHistory();
  const { data, loading, refetch, fetchMore } = eventsByMeQueryResult;
  const [deleteConfirm, setDeleteConfirm] = React.useState({
    open: false,
    id: ""
  });
  const [deleteEventMutation] = useDeleteEventMutation();

  const handlePhoneClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    event.stopPropagation();
    window.open(`/event/${id}`);
  };
  const handleWallClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    event.stopPropagation();
    window.open(`/event/${id}/wall`);
  };
  const handleOpenDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    event.stopPropagation();
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

  const [endReached, setEndReached] = React.useState(false);
  const { groupKeys, groupCounts } = React.useMemo(() => {
    // the code below calculates the group counts
    // for the users loaded so far;
    // this should be performed on the server too
    const groupedEvents = R.groupBy<AdminEventFieldsFragment>(item =>
      item.name.indexOf("5") >= 0 ? "5" : "Current"
    )(data?.eventsByMe.list || []);
    const groupKeys = Object.keys(groupedEvents);
    const groupCounts = Object.values(groupedEvents).map(item => item.length);

    setEndReached(
      Number(data?.eventsByMe.list.length) >=
        Number(data?.eventsByMe.totalCount)
    );

    return {
      groupKeys,
      groupCounts
    };
  }, [data]);
  const loadMore = () => {
    if (!endReached) {
      fetchMore({
        variables: {
          pagination: {
            offset: data?.eventsByMe.list.length || DEFAULT_PAGE_OFFSET,
            limit: data?.eventsByMe.limit || DEFAULT_PAGE_LIMIT
          }
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return Object.assign({}, fetchMoreResult, {
            eventsByMe: {
              ...fetchMoreResult.eventsByMe,
              list: [
                ...prev.eventsByMe.list,
                ...fetchMoreResult.eventsByMe.list
              ]
            }
          });
        }
      });
    }
  };

  return (
    <Fragment>
      <Paper className={classes.eventList}>
        <GroupedVirtuoso
          style={{ height: "100%", width: "100%" }}
          groupCounts={groupCounts}
          endReached={loadMore}
          GroupContainer={({ children, ...props }) => (
            <ListSubheader {...props} className={classes.header}>
              {children}
            </ListSubheader>
          )}
          group={index => <div>Group {groupKeys[index]}</div>}
          item={index => {
            const event = data?.eventsByMe.list[index];

            return (
              <ListItem
                button
                divider
                className={classes.listItem}
                onClick={() => {
                  history.push(`/admin/event/${event?.id}`);
                }}
              >
                <React.Fragment>
                  <ListItemAvatar>
                    <Avatar>
                      {getEventDateStatus(event, new Date()) ===
                      EventDateStatus.Current ? (
                        <EventAvailableIcon />
                      ) : getEventDateStatus(event, new Date()) ===
                        EventDateStatus.Future ? (
                        <EventIcon />
                      ) : (
                        <EventBusyIcon />
                      )}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Fragment>
                        <Typography color="inherit" display="inline">
                          {event?.name}
                        </Typography>
                        <Typography
                          className={classes.code}
                          color="textSecondary"
                          display="inline"
                        >
                          # {event?.code}
                        </Typography>
                      </Fragment>
                    }
                    secondary={
                      <React.Fragment>
                        <FormattedDate value={event?.startAt} />
                        {" ~ "}
                        <FormattedDate value={event?.endAt} />
                      </React.Fragment>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      className="actionHover"
                      onClick={e => handlePhoneClick(e, event?.id as string)}
                    >
                      <PhoneAndroidIcon className={classes.actionHoverIcon} />
                    </IconButton>
                    <IconButton
                      className="actionHover"
                      onClick={e => handleWallClick(e, event?.id as string)}
                    >
                      <DvrIcon className={classes.actionHoverIcon} />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={e => handleOpenDelete(e, event?.id as string)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </React.Fragment>
              </ListItem>
            );
          }}
          footer={() => {
            return endReached ? (
              <div>-- end --</div>
            ) : loading ? (
              <CircularProgress />
            ) : (
              <div>-- more --</div>
            );
          }}
        />
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

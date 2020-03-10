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
  CircularProgress,
  Menu,
  MenuItem
} from "@material-ui/core";
import { GroupedVirtuoso } from "react-virtuoso";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  EventsByMeQuery,
  EventsByMeQueryVariables,
  useDeleteEventMutation,
  AdminEventFieldsFragment,
  EventDateStatus
} from "../../../generated/graphqlHooks";
import { QueryResult } from "@apollo/react-common";
import { useHistory } from "react-router-dom";
import { FormattedMessage, FormattedDate } from "react-intl";
import Confirm from "../../../components/Confirm";
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT } from "../../../constant";
import DvrIcon from "@material-ui/icons/Dvr";
import PhoneAndroidIcon from "@material-ui/icons/PhoneAndroid";
import EventIcon from "@material-ui/icons/Event";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import EventBusyIcon from "@material-ui/icons/EventBusy";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { getEventDateFilterLabel } from "./index";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    eventList: {
      margin: theme.spacing(2, 0),
      flex: 1
    },
    header: {
      backgroundColor: theme.palette.background.default
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
  const [moreMenu, setMoreMenu] = React.useState<{
    anchorEl: null | HTMLElement;
    id: string;
  }>({ anchorEl: null, id: "" });
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

  const handleMoreOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    event.stopPropagation();
    setMoreMenu({ anchorEl: event.currentTarget, id });
  };
  const handleMoreClose = () => {
    setMoreMenu({ anchorEl: null, id: "" });
  };
  const handleOpenDelete = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    id: string
  ) => {
    event.stopPropagation();
    setDeleteConfirm({ open: true, id });
    handleMoreClose();
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
    const groupedEvents = R.groupBy<AdminEventFieldsFragment>(
      item => item.dateStatus
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

  const moreMenuList = [
    {
      disabled: true,
      text: <FormattedMessage id="Open" defaultMessage="Open" />,
      onClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {}
    },
    {
      disabled: true,
      text: <FormattedMessage id="Setting" defaultMessage="Setting" />,
      onClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {}
    },
    {
      disabled: true,
      text: (
        <FormattedMessage id="Share_access" defaultMessage="Share_access" />
      ),
      onClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {}
    },
    {
      disabled: true,
      text: <FormattedMessage id="Duplicate" defaultMessage="Duplicate" />,
      onClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {}
    },
    {
      disabled: true,
      text: <FormattedMessage id="Transfer" defaultMessage="Transfer" />,
      onClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {}
    },
    {
      text: <FormattedMessage id="Delete" defaultMessage="Delete" />,
      onClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) =>
        handleOpenDelete(e, moreMenu.id)
    }
  ];

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
          group={index =>
            getEventDateFilterLabel(groupKeys[index] as EventDateStatus)
          }
          item={index => {
            const event = data?.eventsByMe.list[index];
            if (!event) return <div />;

            return (
              <ListItem
                button
                divider
                className={classes.listItem}
                onClick={() => {
                  history.push(`/admin/event/${event.id}`);
                }}
              >
                <React.Fragment>
                  <ListItemAvatar>
                    <Avatar>
                      {event.dateStatus === EventDateStatus.Active ? (
                        <EventAvailableIcon />
                      ) : event.dateStatus === EventDateStatus.Upcoming ? (
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
                          {event.name}
                        </Typography>
                        <Typography
                          className={classes.code}
                          color="textSecondary"
                          display="inline"
                        >
                          # {event.code}
                        </Typography>
                      </Fragment>
                    }
                    secondary={
                      <React.Fragment>
                        <FormattedDate value={event.startAt} />
                        {" ~ "}
                        <FormattedDate value={event.endAt} />
                      </React.Fragment>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      className="actionHover"
                      onClick={e => handlePhoneClick(e, event.id)}
                    >
                      <PhoneAndroidIcon className={classes.actionHoverIcon} />
                    </IconButton>
                    <IconButton
                      className="actionHover"
                      onClick={e => handleWallClick(e, event.id)}
                    >
                      <DvrIcon className={classes.actionHoverIcon} />
                    </IconButton>
                    <IconButton onClick={e => handleMoreOpen(e, event.id)}>
                      <MoreVertIcon />
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

      <Menu
        MenuListProps={{ dense: true }}
        anchorEl={moreMenu.anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={Boolean(moreMenu.anchorEl)}
        onClose={handleMoreClose}
      >
        {moreMenuList.map((menuItem, index) => (
          <MenuItem
            key={index}
            disabled={menuItem.disabled}
            onClick={menuItem.onClick}
          >
            {menuItem.text}
          </MenuItem>
        ))}
      </Menu>
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

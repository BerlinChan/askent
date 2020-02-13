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
import { VariableSizeList, ListChildComponentProps } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import FolderIcon from "@material-ui/icons/Folder";
import DeleteIcon from "@material-ui/icons/Delete";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  EventsByMeQuery,
  EventsByMeQueryVariables,
  useDeleteEventMutation
} from "../../../generated/graphqlHooks";
import { QueryResult } from "@apollo/react-common";
import { useHistory } from "react-router-dom";
import { FormattedMessage, FormattedDate } from "react-intl";
import Confirm from "../../../components/Confirm";
import { DEFAULT_PAGE_SKIP, DEFAULT_PAGE_FIRST } from "../../../constant";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    eventList: {
      position: "relative",
      margin: theme.spacing(2, 0),
      flex: 1
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
  eventsByMeQueryResult: QueryResult<EventsByMeQuery, EventsByMeQueryVariables>;
}

const EventList: React.FC<Props> = ({ eventsByMeQueryResult, ...props }) => {
  const classes = useStyles();
  const history = useHistory();
  const { data, loading, refetch, fetchMore } = eventsByMeQueryResult;
  const [deleteConfirm, setDeleteConfirm] = React.useState({
    open: false,
    id: ""
  });
  const [deleteEventMutation] = useDeleteEventMutation();

  const [listDemension, setListDemension] = React.useState({
    width: 0,
    height: 0
  });
  const listBoxRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    setListDemension({
      width: Number(listBoxRef?.current?.clientWidth),
      height: Number(listBoxRef?.current?.clientHeight)
    });
  }, []);

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

  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const itemCount =
    (data?.eventsByMe.list.length || 0) +
    (data?.eventsByMe.hasNextPage ? 1 : 0);
  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreItems = () => {
    if (loading) {
      return null;
    }

    return fetchMore({
      variables: {
        pagination: {
          skip: data?.eventsByMe.list.length || DEFAULT_PAGE_SKIP,
          first: data?.eventsByMe.first || DEFAULT_PAGE_FIRST
        }
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        return Object.assign({}, fetchMoreResult, {
          eventsByMe: {
            ...fetchMoreResult.eventsByMe,
            list: [...prev.eventsByMe.list, ...fetchMoreResult.eventsByMe.list]
          }
        });
      }
    });
  };
  // Every row is loaded except for our loading indicator row.
  const isItemLoaded = (index: number) =>
    !data?.eventsByMe.hasNextPage || index < data?.eventsByMe.list.length;
  // Render an item or a loading indicator.
  const renderRow = (props: ListChildComponentProps) => {
    const { index, style } = props;
    const eventItem = data?.eventsByMe.list[index];

    if (eventItem) {
      return (
        <ListItem
          style={style}
          key={index}
          button
          divider
          onClick={() => history.push(`/admin/event/${eventItem.id}`)}
        >
          {isItemLoaded(index) ? (
            <React.Fragment>
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
                      # {eventItem.code}
                    </Typography>
                  </Fragment>
                }
                secondary={
                  <React.Fragment>
                    <FormattedDate value={eventItem.startAt} />
                    {" ~ "}
                    <FormattedDate value={eventItem.endAt} />
                  </React.Fragment>
                }
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
            </React.Fragment>
          ) : (
            <ListItemText primary="Loading" />
          )}
        </ListItem>
      );
    } else {
      return null;
    }
  };

  return (
    <Fragment>
      <Paper className={classes.eventList} ref={listBoxRef}>
        {true ? (
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={itemCount}
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (
              <VariableSizeList
                height={listDemension.height}
                width={listDemension.width}
                estimatedItemSize={73}
                itemSize={index => 73}
                itemCount={itemCount}
                onItemsRendered={onItemsRendered}
                ref={ref}
              >
                {renderRow}
              </VariableSizeList>
            )}
          </InfiniteLoader>
        ) : (
          <List disablePadding>
            {data?.eventsByMe.list.map((eventItem, eventIndex) => (
              <ListItem
                key={eventIndex}
                button
                divider
                onClick={() => history.push(`/admin/event/${eventItem.id}`)}
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
                        # {eventItem.code}
                      </Typography>
                    </Fragment>
                  }
                  secondary={
                    <React.Fragment>
                      <FormattedDate value={eventItem.startAt} />
                      {" ~ "}
                      <FormattedDate value={eventItem.endAt} />
                    </React.Fragment>
                  }
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
        )}

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

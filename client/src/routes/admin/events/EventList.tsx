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
import FolderIcon from "@material-ui/icons/Folder";
import DeleteIcon from "@material-ui/icons/Delete";
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
import { DEFAULT_PAGE_SKIP, DEFAULT_PAGE_FIRST } from "../../../constant";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    eventList: {
      margin: theme.spacing(2, 0),
      flex: 1
    },
    header: {
      backgroundColor: theme.palette.background.paper
    },
    code: { marginLeft: theme.spacing(2) }
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
    if (
      Number(data?.eventsByMe.list.length) >=
      Number(data?.eventsByMe.totalCount)
    ) {
      setEndReached(true);
    }

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
            skip: data?.eventsByMe.list.length || DEFAULT_PAGE_SKIP,
            first: data?.eventsByMe.first || DEFAULT_PAGE_FIRST
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
          overscan={50}
          endReached={loadMore}
          GroupContainer={({ children, ...props }) => (
            <ListSubheader {...props} className={classes.header}>
              {children}
            </ListSubheader>
          )}
          group={index => <div>Group {groupKeys[index]}</div>}
          item={index => (
            <ListItem
              button
              divider
              onClick={() => {
                history.push(`/admin/event/${data?.eventsByMe.list[index].id}`);
              }}
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
                      {data?.eventsByMe.list[index].name}
                    </Typography>
                    <Typography
                      className={classes.code}
                      color="textSecondary"
                      display="inline"
                    >
                      # {data?.eventsByMe.list[index].code}
                    </Typography>
                  </Fragment>
                }
                secondary={
                  <React.Fragment>
                    <FormattedDate
                      value={data?.eventsByMe.list[index].startAt}
                    />
                    {" ~ "}
                    <FormattedDate value={data?.eventsByMe.list[index].endAt} />
                  </React.Fragment>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={e => {
                    const id = data?.eventsByMe.list[index].id as string;
                    handleOpenDelete(e, id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          )}
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

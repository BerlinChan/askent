import React, { Fragment } from "react";
import {
  Paper,
  Typography,
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress
} from "@material-ui/core";
import { ListChildComponentProps } from "react-window";
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
import InfinitList from "../../../components/InfinitList";
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

  const loadNextPage = () => {
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
            list: [...prev.eventsByMe.list, ...fetchMoreResult.eventsByMe.list]
          }
        });
      }
    });
  };
  const renderItem = (rowProps: ListChildComponentProps) => {
    const { index, style } = rowProps;
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
              onClick={event => handleOpenDelete(event, eventItem.id)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      );
    } else {
      return <div style={style} key={index}></div>;
    }
  };

  return (
    <Fragment>
      <Paper className={classes.eventList} ref={listBoxRef}>
        <InfinitList
          items={data?.eventsByMe.list || []}
          hasNextPage={data?.eventsByMe.hasNextPage}
          loading={loading}
          loadNextPage={loadNextPage}
          renderItem={renderItem}
          height={listDemension.height}
          width={listDemension.width}
          itemSize={73}
        />

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

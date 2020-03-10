import React, { Fragment } from "react";
import * as R from "ramda";
import {
  Paper,
  ListSubheader,
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
import { FormattedMessage } from "react-intl";
import Confirm from "../../../components/Confirm";
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT } from "../../../constant";
import { getEventDateFilterLabel } from "./index";
import EventItem from "./EventItem";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    eventList: {
      margin: theme.spacing(2, 0),
      flex: 1
    },
    header: {
      backgroundColor: theme.palette.background.default
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
  const moreMenuState = React.useState<{
    anchorEl: null | HTMLElement;
    id: string;
  }>({ anchorEl: null, id: "" });
  const [deleteConfirm, setDeleteConfirm] = React.useState({
    open: false,
    id: ""
  });
  const [deleteEventMutation] = useDeleteEventMutation();

  const handleMoreClose = () => {
    moreMenuState[1]({ anchorEl: null, id: "" });
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
      text: <FormattedMessage id="Open" defaultMessage="Open" />,
      onClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        history.push(`/admin/event/${moreMenuState[0].id}`);
      }
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
        handleOpenDelete(e, moreMenuState[0].id)
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

            return <EventItem event={event} moreMenuState={moreMenuState} />;
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
        anchorEl={moreMenuState[0].anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={Boolean(moreMenuState[0].anchorEl)}
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

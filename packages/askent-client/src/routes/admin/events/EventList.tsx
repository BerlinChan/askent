import React from "react";
import * as R from "ramda";
import { Paper, ListSubheader, Menu, MenuItem } from "@material-ui/core";
import { GroupedVirtuoso } from "react-virtuoso";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  EventsByMeQuery,
  EventsByMeQueryVariables,
  useDeleteEventMutation,
  EventFieldsFragment,
  EventDateStatus,
} from "../../../generated/graphqlHooks";
import { QueryResult } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import Confirm from "../../../components/Confirm";
import {
  DEFAULT_PAGE_OFFSET,
  DEFAULT_PAGE_LIMIT,
} from "askent-common/src/constant";
import { getEventDateFilterLabel } from "./index";
import EventItem from "./EventItem";
import EventSettingDialog from "../../../components/EventSettingDialog";
import ListFooter from "../../../components/ListFooter";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    eventList: {
      margin: theme.spacing(2, 0),
      flex: 1,
      overflow: "hidden",
    },
    listGroup: {
      color: theme.palette.primary.contrastText,
      fontWeight: theme.typography.fontWeightBold,
      backgroundColor: theme.palette.primary.main,
    },
  })
);

interface Props {
  eventsByMeQueryResult: QueryResult<EventsByMeQuery, EventsByMeQueryVariables>;
}

const EventList: React.FC<Props> = ({ eventsByMeQueryResult }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { data, loading, refetch, fetchMore } = eventsByMeQueryResult;
  const moreMenuState = React.useState<{
    anchorEl: null | HTMLElement;
    id: string;
  }>({ anchorEl: null, id: "" });
  const [deleteConfirm, setDeleteConfirm] = React.useState({
    open: false,
    id: "",
  });
  const eventSettingState = React.useState<string>("");
  const [deleteEventMutation] = useDeleteEventMutation();

  const handleMoreClose = () => {
    moreMenuState[1]({ anchorEl: null, id: "" });
  };
  const handleOpenDelete = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    id: string
  ) => {
    setDeleteConfirm({ open: true, id });
  };
  const handleCloseDelete = () => {
    setDeleteConfirm({ open: false, id: "" });
  };
  const handleDelete = async () => {
    await deleteEventMutation({
      variables: { eventId: deleteConfirm.id },
    });
    refetch();
    setDeleteConfirm({ open: false, id: "" });
  };

  const { groupKeys, groupCounts } = React.useMemo(() => {
    const groupedEvents = R.groupBy<EventFieldsFragment>(
      (item) => item.dateStatus
    )(data?.eventsByMe.list || []);
    const groupKeys = Object.keys(groupedEvents);
    const groupCounts = Object.values(groupedEvents).map((item) => item.length);

    return {
      groupKeys,
      groupCounts,
    };
  }, [data]);
  const loadMore = () => {
    if (data?.eventsByMe.hasNextPage) {
      fetchMore({
        variables: {
          pagination: {
            offset: data?.eventsByMe.list.length || DEFAULT_PAGE_OFFSET,
            limit: data?.eventsByMe.limit || DEFAULT_PAGE_LIMIT,
          },
        },
      });
    }
  };

  const moreMenuList = [
    {
      key: "open",
      text: <FormattedMessage id="Open" defaultMessage="Open" />,
      onClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        navigate(`/admin/event/${moreMenuState[0].id}`);
      },
    },
    {
      key: "setting",
      text: <FormattedMessage id="Setting" defaultMessage="Setting" />,
      onClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        eventSettingState[1](moreMenuState[0].id);
        handleMoreClose();
      },
    },
    {
      key: "shareAccess",
      disabled: true,
      text: (
        <FormattedMessage id="Share_access" defaultMessage="Share access" />
      ),
      onClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {},
    },
    {
      key: "duplicate",
      disabled: true,
      text: <FormattedMessage id="Duplicate" defaultMessage="Duplicate" />,
      onClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {},
    },
    {
      key: "transfer",
      disabled: true,
      text: <FormattedMessage id="Transfer" defaultMessage="Transfer" />,
      onClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {},
    },
    {
      key: "delete",
      text: <FormattedMessage id="Delete" defaultMessage="Delete" />,
      onClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        handleOpenDelete(e, moreMenuState[0].id);
        handleMoreClose();
      },
    },
  ];

  return (
    <React.Fragment>
      <Paper className={classes.eventList}>
        <GroupedVirtuoso
          style={{ height: "100%", width: "100%" }}
          groupCounts={groupCounts}
          endReached={loadMore}
          components={{
            Group: ({ children, ...props }) => (
              <ListSubheader {...props} className={classes.listGroup}>
                {children}
              </ListSubheader>
            ),
            Footer: () => (
              <ListFooter
                loading={loading}
                hasNextPage={data?.eventsByMe.hasNextPage}
              />
            ),
          }}
          groupContent={(index) =>
            getEventDateFilterLabel(groupKeys[index] as EventDateStatus)
          }
          itemContent={(index) => {
            const event = data?.eventsByMe.list[index];
            if (!event) return <div />;

            return <EventItem event={event} moreMenuState={moreMenuState} />;
          }}
        />
      </Paper>

      <Menu
        MenuListProps={{ dense: true }}
        anchorEl={moreMenuState[0].anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(moreMenuState[0].anchorEl)}
        onClose={handleMoreClose}
      >
        {moreMenuList.map((menuItem) => (
          <MenuItem
            key={menuItem.key}
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
      <EventSettingDialog eventIdState={eventSettingState} />
    </React.Fragment>
  );
};

export default EventList;

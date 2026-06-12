import React, { Fragment } from "react";
import {
  Typography,
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import {
  EventFieldsFragment,
  EventDateStatus
} from "../../../generated/graphqlHooks";
import { useNavigate } from "react-router-dom";
import { FormattedDate, FormattedTime } from "react-intl";
import DvrIcon from "@mui/icons-material/Dvr";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import EventIcon from "@mui/icons-material/Event";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const useStyles = makeStyles<Theme, {}, string>((theme: Theme) => ({
    listItem: {
      "& .actionHover": { display: "none" },
      "&:hover .actionHover": { display: "inline-flex" }
    },
    code: { marginLeft: theme.spacing(2) },
    actionHoverIcon: {
      fontSize: theme.typography.pxToRem(18),
      color: theme.palette.action.disabled
    }
  }));
interface Props {
  event: EventFieldsFragment;
  moreMenuState: [
    {
      anchorEl: HTMLElement | null;
      id: string;
    },
    React.Dispatch<
      React.SetStateAction<{
        anchorEl: HTMLElement | null;
        id: string;
      }>
    >
  ];
}

const EventItem: React.FC<Props> = ({ event, moreMenuState }) => {
  const classes = useStyles();
  const navigate = useNavigate();

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
    moreMenuState[1]({ anchorEl: event.currentTarget, id });
  };

  return (
    <ListItem
      button
      divider
      className={classes.listItem}
      onClick={() => {
        navigate(`/admin/event/${event.id}`);
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
              {", "}
              <FormattedTime value={event.startAt} />
              {" ~ "}
              <FormattedDate value={event.endAt} />
              {", "}
              <FormattedTime value={event.endAt} />
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
};

export default EventItem;

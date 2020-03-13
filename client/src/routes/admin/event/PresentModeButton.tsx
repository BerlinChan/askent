import React from "react";
import { useParams } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Button,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from "@material-ui/core";
import HoverMenu from "material-ui-popup-state/HoverMenu";
import {
  usePopupState,
  bindHover,
  bindMenu
} from "material-ui-popup-state/hooks";
import { useIntl, FormattedMessage } from "react-intl";
import DvrIcon from "@material-ui/icons/Dvr";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    presentModeBtn: {
      marginRight: theme.spacing(1),
      borderRadius: theme.spacing(2)
    },
    presentModeIcon: {
      marginRight: theme.spacing(1)
    }
  })
);

interface Props {}

const PresentModeButton: React.FC<Props> = () => {
  const classes = useStyles();
  const { id } = useParams();
  const { formatMessage } = useIntl();
  const popupState = usePopupState({
    variant: "popover",
    popupId: "presentModeMenu"
  });

  return (
    <React.Fragment>
      <Button
        className={classes.presentModeBtn}
        disableElevation
        variant="contained"
        color="secondary"
        size="small"
        {...bindHover(popupState)}
      >
        <DvrIcon
          className={classes.presentModeIcon}
          fontSize="inherit"
          color="inherit"
        />
        <FormattedMessage id="Present mode" defaultMessage="Present mode" />
      </Button>

      <HoverMenu
        {...bindMenu(popupState)}
        keepMounted
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <MenuItem
          alignItems="flex-start"
          onClick={e => {
            console.log(e, id);
          }}
        >
          <ListItemIcon>
            <DvrIcon color="inherit" />
          </ListItemIcon>
          <ListItemText
            primary={formatMessage({
              id: "Present in fullscreen",
              defaultMessage: "Present in fullscreen"
            })}
            secondary={formatMessage({
              id: "Display audience questions or poll results on a big screen",
              defaultMessage:
                "Display audience questions or poll results on a big screen"
            })}
          />
        </MenuItem>
        <MenuItem
          alignItems="flex-start"
          onClick={e => {
            console.log(e, id);
          }}
        >
          <ListItemIcon>
            <DvrIcon color="inherit" />
          </ListItemIcon>
          <ListItemText
            primary={formatMessage({
              id: "Present on another screen",
              defaultMessage: "Present on another screen"
            })}
            secondary={formatMessage({
              id:
                "Open Present mode in a new window and display it on your extended screen",
              defaultMessage:
                "Open Present mode in a new window and display it on your extended screen"
            })}
          />
        </MenuItem>
        <Divider component="li" />
        <MenuItem onClick={popupState.close}>
          <ListItemIcon>
            <DvrIcon color="inherit" />
          </ListItemIcon>
          <ListItemText
            primary={formatMessage({
              id: "Copy Present mode link",
              defaultMessage: "Copy Present mode link"
            })}
          />
        </MenuItem>
      </HoverMenu>
    </React.Fragment>
  );
};

export default PresentModeButton;

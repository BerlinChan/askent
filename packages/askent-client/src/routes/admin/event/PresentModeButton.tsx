import React from "react";
import { useParams } from "react-router-dom";
import {
  createStyles,
  makeStyles,
  withStyles,
  Theme,
} from "@material-ui/core/styles";
import {
  Button,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid,
} from "@material-ui/core";
import HoverMenu from "material-ui-popup-state/HoverMenu";
import {
  usePopupState,
  bindHover,
  bindMenu,
} from "material-ui-popup-state/hooks";
import { useIntl, FormattedMessage } from "react-intl";
import { useSnackbar } from "notistack";
import DvrIcon from "@material-ui/icons/Dvr";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import LaunchIcon from "@material-ui/icons/Launch";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import copy from "copy-to-clipboard";
import screenfull from "screenfull";
import { WallThemeProvider } from "../../../components/Providers";
import loadable from "@loadable/component";
import Loading from "../../../components/Loading";

const StyledMenuItem = withStyles({
  root: { whiteSpace: "unset", width: 280 },
})(MenuItem);
const StyledListItemIcon = withStyles((theme: Theme) =>
  createStyles({
    root: { minWidth: 28, color: theme.palette.primary.main, fontSize: 18 },
  })
)(ListItemIcon);
const StyledListItemText = withStyles((theme: Theme) =>
  createStyles({
    primary: {
      fontSize: 16,
      fontWeight: theme.typography.fontWeightMedium,
      color: theme.palette.primary.main,
    },
    secondary: {
      fontSize: 12,
      color: theme.palette.text.secondary,
    },
  })
)(ListItemText);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    presentModeBtn: {
      marginRight: theme.spacing(1),
      borderRadius: theme.spacing(2),
    },
    presentModeIcon: {
      marginRight: theme.spacing(1),
    },
  })
);

const WallComponent = loadable(() => import("../../event/wall"), {
  fallback: <Loading />,
});

interface Props {}

const PresentModeButton: React.FC<Props> = () => {
  const classes = useStyles();
  const { id } = useParams<{ id: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const popupState = usePopupState({
    variant: "popover",
    popupId: "presentModeMenu",
  });
  const fullscreenWallRef = React.useRef<Element>();
  const [fullscreen, setFullscreen] = React.useState(false);

  React.useEffect(() => {
    if (screenfull.isEnabled) {
      screenfull.on("change", handleFullscreenChange);
    }

    return () => {
      screenfull.off("change", handleFullscreenChange);
    };
  });

  const handleFullscreenChange = () => {
    setFullscreen(screenfull.isFullscreen);
  };
  const handleCopyEventLink = () => {
    if (copy(`${window.location.origin}/event/${id}`)) {
      enqueueSnackbar(
        formatMessage({
          id: "Copied!",
          defaultMessage: "Copied!",
        }),
        {
          variant: "success",
        }
      );
    }
  };

  const menuItemList = [
    {
      icon: <FullscreenIcon color="inherit" fontSize="inherit" />,
      primary: formatMessage({
        id: "Present in fullscreen",
        defaultMessage: "Present in fullscreen",
      }),
      secondary: formatMessage({
        id: "Display audience questions or poll results on a big screen",
        defaultMessage:
          "Display audience questions or poll results on a big screen",
      }),
      handleClick: () => {
        if (screenfull.isEnabled) {
          screenfull.request(fullscreenWallRef.current);
        } else {
          enqueueSnackbar(
            formatMessage({
              id: "Your browser does not support fullscreen.",
              defaultMessage: "Your browser does not support fullscreen.",
            }),
            {
              variant: "warning",
            }
          );
        }
      },
    },
    {
      icon: <LaunchIcon color="inherit" fontSize="inherit" />,
      primary: formatMessage({
        id: "Present on another screen",
        defaultMessage: "Present on another screen",
      }),
      secondary: formatMessage({
        id: "Open Present mode in a new window and display it on your extended screen",
        defaultMessage:
          "Open Present mode in a new window and display it on your extended screen",
      }),
      handleClick: () => {
        window.open(
          `/event/${id}/wall`,
          "AskentPresentation",
          "menubar=no,location=yes,resizable=yes,scrollbars=no,status=no,width=1066,height=600"
        );
      },
    },
  ];

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
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {menuItemList.map((item) => (
          <StyledMenuItem
            dense
            alignItems="flex-start"
            key={item.primary}
            onClick={item.handleClick}
          >
            <StyledListItemIcon>{item.icon}</StyledListItemIcon>
            <StyledListItemText
              primary={item.primary}
              secondary={item.secondary}
            />
          </StyledMenuItem>
        ))}

        <Divider component="li" />
        <StyledMenuItem dense onClick={handleCopyEventLink}>
          <StyledListItemIcon>
            <FileCopyOutlinedIcon color="inherit" fontSize="inherit" />
          </StyledListItemIcon>
          <StyledListItemText
            primary={formatMessage({
              id: "Copy Present mode link",
              defaultMessage: "Copy Present mode link",
            })}
          />
        </StyledMenuItem>
      </HoverMenu>

      <Grid innerRef={fullscreenWallRef}>
        {fullscreen ? (
          <WallThemeProvider>
            <WallComponent />
          </WallThemeProvider>
        ) : null}
      </Grid>
    </React.Fragment>
  );
};

export default PresentModeButton;

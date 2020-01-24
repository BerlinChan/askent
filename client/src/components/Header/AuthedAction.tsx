import React from "react";
import { useHistory } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Box,
  IconButton,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon
} from "@material-ui/core";
import { useMeQuery } from "../../generated/graphqlHooks";
import { FormattedMessage } from "react-intl";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import { AUTH_TOKEN } from "../../constant";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    userInfo: {},
    email: {
      fontSize: theme.typography.pxToRem(14),
      fontWeight: theme.typography.fontWeightBold
    },
    name: {
      fontSize: theme.typography.pxToRem(14)
    }
  })
);

export const AuthedAction: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { data: userData } = useMeQuery();
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Box className={classes.userInfo}>
        <Typography className={classes.email}>{userData?.me.email}</Typography>
        <Typography className={classes.name}>{userData?.me.name}</Typography>
      </Box>
      <IconButton size="small" onClick={handleMenuOpen}>
        <Avatar alt={userData?.me.name} src="/broken-image.jpg" />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={menuAnchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            history.replace("/admin");
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <HomeIcon fontSize="small" />
          </ListItemIcon>
          <FormattedMessage id="Events" defaultMessage="Events" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            localStorage.removeItem(AUTH_TOKEN);
            history.replace("/");
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          <FormattedMessage id="Logout" defaultMessage="Logout" />
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

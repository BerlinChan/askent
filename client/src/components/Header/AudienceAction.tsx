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
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import PersonIcon from "@material-ui/icons/Person";
import { useToken } from "../../hooks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    userInfo: {},
    email: {
      fontSize: theme.typography.pxToRem(14),
      fontWeight: theme.typography.fontWeightBold
    },
    role: {
      fontSize: theme.typography.pxToRem(14)
    }
  })
);

export const AudienceAction: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { data: userData } = useMeQuery();
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const { removeToken } = useToken();

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
        <Typography className={classes.role}>{userData?.me.role}</Typography>
      </Box>
      <IconButton size="small" onClick={handleMenuOpen}>
        <Avatar alt={userData?.me.name as string} src="/broken-image.jpg" />
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
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <FormattedMessage
            id="Edit_my_profile"
            defaultMessage="Edit my profile"
          />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <QuestionAnswerIcon fontSize="small" />
          </ListItemIcon>
          <FormattedMessage id="My_questions" defaultMessage="My questions" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            removeToken();
            history.replace("/");
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          <FormattedMessage id="Log_out" defaultMessage="Log out" />
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

import React from "react";
import { useNavigate } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Box,
  IconButton,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  Hidden,
} from "@material-ui/core";
import { useMeQuery, RoleName } from "../../generated/graphqlHooks";
import { FormattedMessage } from "react-intl";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import PersonIcon from "@material-ui/icons/Person";
import HomeIcon from "@material-ui/icons/Home";
import { useToken } from "../../hooks";
import MyProfileDialog from "./MyProfileDialog";
import MyQuestionsDialog from "./MyQuestionsDialog";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    userInfo: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1),
    },
    email: {
      fontSize: theme.typography.pxToRem(14),
      fontWeight: theme.typography.fontWeightBold,
    },
    role: {
      fontSize: theme.typography.pxToRem(14),
    },
  })
);

interface Props {
  hideUserInfo?: boolean;
}

const AuthedAction: React.FC<Props> = ({ hideUserInfo = false }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const userQueryResult = useMeQuery();
  const roles = userQueryResult.data?.me.roles.map((role) => role.name);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const { removeToken } = useToken();
  const [myProfileDialogOpen, setMyProfileDialogOpen] =
    React.useState<boolean>(false);
  const [myQuestionsDialogOpen, setMyQuestionsDialogOpen] =
    React.useState<boolean>(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <React.Fragment>
      {!hideUserInfo && (
        <Hidden smDown>
          <Box className={classes.userInfo}>
            <Typography className={classes.email}>
              {userQueryResult.data?.me.email}
            </Typography>
            <Typography className={classes.role}>
              {userQueryResult.data?.me.roles.map((role) => role.name).join()}
            </Typography>
          </Box>
        </Hidden>
      )}
      <IconButton size="small" onClick={handleMenuOpen}>
        <Avatar
          alt={userQueryResult.data?.me.name as string}
          src={userQueryResult.data?.me.avatar as string}
        />
      </IconButton>

      <Menu
        keepMounted
        anchorEl={menuAnchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        {roles?.includes(RoleName.User) && (
          <MenuItem
            onClick={() => {
              navigate("/admin", { replace: true });
              handleMenuClose();
            }}
          >
            <ListItemIcon>
              <HomeIcon fontSize="small" />
            </ListItemIcon>
            <FormattedMessage id="Events" defaultMessage="Events" />
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setMyProfileDialogOpen(true);
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
            setMyQuestionsDialogOpen(true);
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
            navigate("/", { replace: true });
            handleMenuClose();

            // fix Hasura subscription auth, https://github.com/apollographql/subscriptions-transport-ws/issues/171
            window.location.reload();
          }}
        >
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          <FormattedMessage id="Log_out" defaultMessage="Log out" />
        </MenuItem>
      </Menu>
      <MyProfileDialog
        userQueryResult={userQueryResult}
        open={myProfileDialogOpen}
        onClose={() => setMyProfileDialogOpen(false)}
      />
      <MyQuestionsDialog
        userQueryResult={userQueryResult}
        open={myQuestionsDialogOpen}
        onClose={() => setMyQuestionsDialogOpen(false)}
      />
    </React.Fragment>
  );
};

export default AuthedAction;

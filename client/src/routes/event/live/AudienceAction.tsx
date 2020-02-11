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
import { QueryResult } from "@apollo/react-common";
import {
  MeQuery,
  MeQueryVariables
} from "../../../generated/graphqlHooks";
import { FormattedMessage } from "react-intl";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import PersonIcon from "@material-ui/icons/Person";
import { useToken } from "../../../hooks";
import MyProfileDialog from "./MyProfileDialog";
import MyQuestionsDialog from "./MyQuestionsDialog";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    userInfo: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      marginRight: theme.spacing(1)
    },
    name: {
      fontSize: theme.typography.pxToRem(14),
      fontWeight: theme.typography.fontWeightBold
    },
    role: {
      fontSize: theme.typography.pxToRem(14)
    }
  })
);

interface Props {
  userQueryResult: QueryResult<MeQuery, MeQueryVariables>;
}

const AudienceAction: React.FC<Props> = ({ userQueryResult }) => {
  const classes = useStyles();
  const history = useHistory();
  const { data: userData } = userQueryResult;
  const { removeToken } = useToken();
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const [myProfileDialogOpen, setMyProfileDialogOpen] = React.useState<boolean>(
    false
  );
  const [myQuestionsDialogOpen, setMyQuestionsDialogOpen] = React.useState<
    boolean
  >(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Box className={classes.userInfo}>
        <Typography className={classes.name}>
          {userData?.me.name ? (
            userData?.me.name
          ) : (
            <FormattedMessage id="Anonymous" defaultMessage="Anonymous" />
          )}
        </Typography>
        <Typography className={classes.role}>
          {userData?.me.roles.map(role => role.name).join()}
        </Typography>
      </Box>
      <IconButton size="small" onClick={handleMenuOpen}>
        <Avatar
          alt={userData?.me.name as string}
          src="/broken-image.jpg"
        />
      </IconButton>

      <Menu
        keepMounted
        anchorEl={menuAnchorEl}
        getContentAnchorEl={null}
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

export default AudienceAction;

import React from "react";
import { useHistory } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Box,
  IconButton,
  Button,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import { TextField } from "formik-material-ui";
import { ButtonLoading } from "../../components/Form";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { QueryResult } from "@apollo/react-common";
import {
  MeAudienceQuery,
  MeAudienceQueryVariables
} from "../../generated/graphqlHooks";
import { FormattedMessage, useIntl } from "react-intl";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import PersonIcon from "@material-ui/icons/Person";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import { useToken } from "../../hooks";
import { USERNAME_MAX_LENGTH, EMAIL_MAX_LENGTH } from "../../constant";
import { useUpdateAudienceUserMutation } from "../../generated/graphqlHooks";

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
    },
    largeAvatar: {
      width: theme.spacing(8),
      height: theme.spacing(8)
    },
    formItemBox: {
      margin: theme.spacing(0, 4)
    }
  })
);

interface Props {
  userQueryResult: QueryResult<MeAudienceQuery, MeAudienceQueryVariables>;
}

export const AudienceAction: React.FC<Props> = ({ userQueryResult }) => {
  const classes = useStyles();
  const history = useHistory();
  const { formatMessage } = useIntl();
  const { data: userData } = userQueryResult;
  const { removeToken } = useToken();
  const [
    updateAudienceUserMutation,
    { loading: updateProfileLoading }
  ] = useUpdateAudienceUserMutation();
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleProfileModalOpen = () => {
    setProfileModalOpen(true);
  };
  const handleProfileModalClose = () => {
    setProfileModalOpen(false);
  };

  return (
    <React.Fragment>
      <Box className={classes.userInfo}>
        <Typography className={classes.name}>
          {userData?.meAudience.name ? (
            userData?.meAudience.name
          ) : (
            <FormattedMessage id="Anonymous" defaultMessage="Anonymous" />
          )}
        </Typography>
        <Typography className={classes.role}>
          {userData?.meAudience.role}
        </Typography>
      </Box>
      <IconButton size="small" onClick={handleMenuOpen}>
        <Avatar
          alt={userData?.meAudience.name as string}
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
            handleProfileModalOpen();
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
            removeToken("audienceAuthToken");
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
      <Dialog open={profileModalOpen} onClose={handleProfileModalClose}>
        <DialogTitle>
          <FormattedMessage id="My_profile" defaultMessage="My profile" />
        </DialogTitle>
        <Formik
          initialValues={{
            name: userData?.meAudience.name || "",
            email: userData?.meAudience.email || ""
          }}
          validationSchema={Yup.object({
            name: Yup.string().max(USERNAME_MAX_LENGTH),
            email: Yup.string()
              .max(EMAIL_MAX_LENGTH)
              .email()
          })}
          onSubmit={async (values, formikBag) => {
            await updateAudienceUserMutation({ variables: { input: values } });
            handleProfileModalClose();
          }}
        >
          {formProps => (
            <Form>
              <DialogContent>
                <Box display="flex" justifyContent="center">
                  <Avatar
                    className={classes.largeAvatar}
                    alt={formProps.values.name}
                    src="/example.jpg"
                  />
                </Box>
                <Box className={classes.formItemBox}>
                  <TextField
                    fullWidth
                    autoFocus
                    name="name"
                    label={formatMessage({
                      id: "Your_name",
                      defaultMessage: "Your name"
                    })}
                    margin="normal"
                    disabled={updateProfileLoading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                  <TextField
                    fullWidth
                    name="email"
                    label={formatMessage({
                      id: "Email",
                      defaultMessage: "Email"
                    })}
                    margin="normal"
                    type="email"
                    disabled={updateProfileLoading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailOutlineIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
                <DialogContentText>
                  You are about to delete your personal information. All your
                  questions or poll votes will be anonymized and this action
                  cannot be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleProfileModalClose}>
                  <FormattedMessage id="Cancel" defaultMessage="Cancel" />
                </Button>
                <ButtonLoading
                  variant="contained"
                  color="primary"
                  type="submit"
                  loading={updateProfileLoading}
                >
                  <FormattedMessage id="Save" defaultMessage="Save" />
                </ButtonLoading>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </React.Fragment>
  );
};

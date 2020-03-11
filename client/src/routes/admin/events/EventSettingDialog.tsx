import React from "react";
import {
  Box,
  Tabs,
  Tab,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FormattedMessage, useIntl } from "react-intl";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ButtonLoading } from "../../../components/Form";
import { add } from "date-fns";
import { QueryResult } from "@apollo/react-common";
import {
  useCheckEventCodeExistLazyQuery,
  useCreateEventMutation,
  EventsByMeQuery,
  EventsByMeQueryVariables
} from "../../../generated/graphqlHooks";
import { useSnackbar } from "notistack";
import { EVENT_CODE_MAX_LENGTH, USERNAME_MAX_LENGTH } from "../../../constant";
import { TextField } from "formik-material-ui";
import { DateTimePicker } from "formik-material-ui-pickers";
import CloseIcon from "@material-ui/icons/Close";
import TabPanel from "../../../components/TabPanel";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogTitle: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    containerGrid: { width: 900 },
    tabs: {
      borderRight: `1px solid ${theme.palette.divider}`
    },
    tabRoot: {
      paddingRight: theme.spacing(3)
    },
    tabWrapper: {
      alignItems: "flex-end"
    }
  })
);

const tabList = [
  <FormattedMessage id="General" defaultMessage="General" />,
  <FormattedMessage id="Features" defaultMessage="Features" />,
  <FormattedMessage id="Customization" defaultMessage="Customization" />,
  <FormattedMessage id="Integrations" defaultMessage="Integrations" />,
  <FormattedMessage id="Share_access" defaultMessage="Share access" />
];

interface Props {
  eventIdState: [
    string | null,
    React.Dispatch<React.SetStateAction<string | null>>
  ];
  onClose?: (reason: "save" | "cancel") => void;
}

const EventSettingDialog: React.ComponentType<Props> = ({
  eventIdState,
  onClose
}) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [eventId, setEventId] = eventIdState;
  const [tabIndex, setTabIndex] = React.useState(0);
  const [
    checkEventCodeExistLazyQuery,
    { data: checkEventCodeData, loading: checkEventCodeLoading }
  ] = useCheckEventCodeExistLazyQuery();

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };
  const handleClose = () => {
    setEventId(null);
    onClose && onClose("cancel");
  };

  return (
    <Dialog maxWidth="lg" open={Boolean(eventId)} onClose={handleClose}>
      <DialogTitle disableTypography className={classes.dialogTitle}>
        <Typography variant="subtitle1" color="textSecondary">
          <FormattedMessage
            id="Event_settings"
            defaultMessage="Event settings"
          />
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon color="inherit" fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container className={classes.containerGrid}>
          <Grid item xs={2}>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              className={classes.tabs}
              value={tabIndex}
              onChange={handleTabChange}
            >
              {tabList.map((item, index) => (
                <Tab
                  classes={{
                    root: classes.tabRoot,
                    wrapper: classes.tabWrapper
                  }}
                  key={index}
                  label={item}
                />
              ))}
            </Tabs>
          </Grid>
          <Grid item xs={10}>
            <TabPanel value={tabIndex} index={0}>
              Item One
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              Item Two
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
              Item Three
            </TabPanel>
            <TabPanel value={tabIndex} index={3}>
              Item Four
            </TabPanel>
            <TabPanel value={tabIndex} index={4}>
              Item Five
            </TabPanel>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          <FormattedMessage id="Save" defaultMessage="Save" />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventSettingDialog;

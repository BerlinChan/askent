import React from "react";
import {
  Box,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography
} from "@material-ui/core";
import {
  createStyles,
  makeStyles,
  Theme,
  fade
} from "@material-ui/core/styles";
import { FormattedMessage, useIntl } from "react-intl";
import { Formik, Form, FormikErrors, FormikHelpers } from "formik";
import * as Yup from "yup";
import * as R from "ramda";
import { ButtonLoading } from "../Form";
import {
  useCheckEventCodeExistLazyQuery,
  useEventByIdLazyQuery,
  useUpdateEventMutation
} from "../../generated/graphqlHooks";
import { useSnackbar } from "notistack";
import { EVENT_CODE_MAX_LENGTH, USERNAME_MAX_LENGTH } from "../../constant";
import CloseIcon from "@material-ui/icons/Close";
import TabPanelGeneral from "./TabPanelGeneral";
import TabPanelFeatures from "./TabPanelFeatures";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: { overflowY: "hidden" },
    dialogTitle: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    form: { display: "flex", flexDirection: "column", overflow: "hidden" },
    dialogContent: { display: "flex", overflowY: "hidden" },
    tabs: {
      width: 200,
      borderRight: `1px solid ${theme.palette.divider}`
    },
    tabRoot: { paddingRight: theme.spacing(2) },
    tabWrapper: { alignItems: "flex-end" },
    contentRightBox: {
      width: 680,
      height: "100%",
      maxHeight: 420,
      overflowY: "auto",
      marginLeft: theme.spacing(2),
      paddingLeft: 50,
      paddingRight: 50,
      position: "relative",
      "&:before": {
        content: "' '",
        display: "block",
        position: "sticky",
        top: 0,
        left: 0,
        width: "100%",
        height: 12,
        pointerEvents: "none",
        background: `linear-gradient(to top, ${fade(
          theme.palette.background.paper,
          0
        )} 0%, ${theme.palette.background.paper} 100%)`
      },
      "&:after": {
        content: "' '",
        display: "block",
        position: "sticky",
        bottom: 0,
        left: 0,
        width: "100%",
        height: 12,
        pointerEvents: "none",
        background: `linear-gradient(to bottom, ${fade(
          theme.palette.background.paper,
          0
        )} 0%, ${theme.palette.background.paper} 100%)`
      }
    }
  })
);

const tabList = [
  {
    tab: <FormattedMessage id="General" defaultMessage="General" />,
    panel: <TabPanelGeneral />
  },
  {
    tab: <FormattedMessage id="Features" defaultMessage="Features" />,
    panel: <TabPanelFeatures />
  },
  {
    tab: <FormattedMessage id="Customization" defaultMessage="Customization" />,
    panel: <div>Item Three</div>
  },
  {
    tab: <FormattedMessage id="Integrations" defaultMessage="Integrations" />,
    panel: <div>Item Four</div>
  },
  {
    tab: <FormattedMessage id="Share_access" defaultMessage="Share access" />,
    panel: <div>Item Five</div>
  }
];

type FormikValues = {
  name: string;
  code: string;
  startAt: Date;
  endAt: Date;
  eventLink: string;
  moderation: boolean | undefined;
};
interface Props {
  eventIdState: [string, React.Dispatch<React.SetStateAction<string>>];
  onExiting?: (reason: "save" | "cancel") => void;
}

const EventSettingDialog: React.FC<Props> = ({ eventIdState, onExiting }) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [eventId, setEventId] = eventIdState;
  const [tabIndex, setTabIndex] = React.useState(0);
  const [
    eventByIdQuery,
    { data: eventData, loading: eventLoading }
  ] = useEventByIdLazyQuery();
  const [
    checkEventCodeExistLazyQuery,
    { data: checkEventCodeData, loading: checkEventCodeLoading }
  ] = useCheckEventCodeExistLazyQuery();
  const [
    updateEventMutation,
    { loading: updateEventLoading }
  ] = useUpdateEventMutation();

  React.useEffect(() => {
    if (eventId) {
      eventByIdQuery({ variables: { eventId } });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };
  const handleClose = () => {
    setEventId("");
    setTabIndex(0);
    onExiting && onExiting("cancel");
  };

  const initialValues: FormikValues = {
    name: eventData?.eventById.name || "",
    code: eventData?.eventById.code || "",
    startAt: new Date(eventData?.eventById.startAt),
    endAt: new Date(eventData?.eventById.endAt),
    eventLink: `${window.location.origin}/event/${eventData?.eventById.id}`,
    moderation: eventData?.eventById.moderation
  };
  const handleValidate: (
    values: FormikValues
  ) => void | object | Promise<FormikErrors<FormikValues>> = async ({
    name,
    code,
    startAt,
    endAt
  }) => {
    try {
      await Yup.object({
        name: Yup.string()
          .max(USERNAME_MAX_LENGTH)
          .required(),
        code: Yup.string()
          .max(EVENT_CODE_MAX_LENGTH)
          .required(),
        startAt: Yup.date(),
        endAt: Yup.date()
      }).validate({
        name,
        code,
        startAt,
        endAt
      });
    } catch (err) {
      const { path, message } = err as Yup.ValidationError;
      const error: any = {};
      error[path] = message;

      return error;
    }

    if (endAt < startAt) {
      return {
        endAt: formatMessage({
          id: "End_must_after_start",
          defaultMessage: "End must after start"
        })
      };
    }

    if (code !== initialValues.code) {
      await checkEventCodeExistLazyQuery({ variables: { code } });
      if (checkEventCodeData?.checkEventCodeExist) {
        return {
          code: formatMessage({
            id: "Code_existed",
            defaultMessage: "Code existed"
          })
        };
      }
    }
  };
  const handleSubmit: (
    values: FormikValues,
    formikHelpers: FormikHelpers<FormikValues>
  ) => void | Promise<any> = async values => {
    const { data } = await updateEventMutation({
      variables: {
        input: R.omit(["eventLink"], {
          eventId,
          ...values
        })
      }
    });
    if (data) {
      enqueueSnackbar(
        formatMessage({
          id: "Event_updated",
          defaultMessage: "Event updated"
        }),
        {
          variant: "success"
        }
      );
      handleClose();
    }
  };

  return (
    <Dialog
      classes={{ paper: classes.paper }}
      maxWidth="lg"
      open={Boolean(eventId)}
      onClose={handleClose}
    >
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

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validate={handleValidate}
        onSubmit={handleSubmit}
      >
        <Form className={classes.form}>
          <DialogContent className={classes.dialogContent}>
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
                  label={item.tab}
                />
              ))}
            </Tabs>
            <Box className={classes.contentRightBox}>
              {tabList[tabIndex].panel}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>
              <FormattedMessage id="Cancel" defaultMessage="Cancel" />
            </Button>
            <ButtonLoading
              variant="contained"
              color="primary"
              style={{ width: 100 }}
              type="submit"
              loading={
                eventLoading || updateEventLoading || checkEventCodeLoading
              }
            >
              <FormattedMessage id="Save" defaultMessage="Save" />
            </ButtonLoading>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};

export default EventSettingDialog;

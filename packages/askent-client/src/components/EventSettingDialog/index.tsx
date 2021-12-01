import React from "react";
import {
  Box,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import {
  createStyles,
  makeStyles,
  Theme,
  alpha,
} from "@material-ui/core/styles";
import { FormattedMessage, useIntl } from "react-intl";
import { Formik, Form, FormikErrors, FormikHelpers } from "formik";
import * as Yup from "yup";
import * as R from "ramda";
import { ButtonLoading } from "../Form";
import DialogTitleWithClose from "../DialogTitleWithClose";
import {
  useCheckEventCodeExistLazyQuery,
  useEventByIdLazyQuery,
  useUpdateEventMutation,
  useMeLazyQuery,
} from "../../generated/graphqlHooks";
import { useSnackbar } from "notistack";
import {
  EVENT_NAME_MAX_LENGTH,
  EVENT_CODE_MAX_LENGTH,
} from "askent-common/src/constant";
import { tabList, TabPanel } from "./TabsPanels";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: { overflowY: "hidden" },
    form: { display: "flex", flexDirection: "column", overflow: "hidden" },
    dialogContent: { display: "flex", overflowY: "hidden" },
    tabs: {
      width: 200,
      borderRight: `1px solid ${theme.palette.divider}`,
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
        background: `linear-gradient(to top, ${alpha(
          theme.palette.background.paper,
          0
        )} 0%, ${theme.palette.background.paper} 100%)`,
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
        background: `linear-gradient(to bottom, ${alpha(
          theme.palette.background.paper,
          0
        )} 0%, ${theme.palette.background.paper} 100%)`,
      },
    },
  })
);

export type EventSettingValues = {
  name: string;
  code: string;
  startAt: Date;
  endAt: Date;
  eventLink: string;
  moderation: boolean | undefined | null;
};
interface Props {
  defaultFocus?: keyof EventSettingValues;
  eventIdState: [string, React.Dispatch<React.SetStateAction<string>>];
  onExiting?: (reason: "save" | "cancel") => void;
}

const EventSettingDialog: React.FC<Props> = ({
  defaultFocus = "name",
  eventIdState,
  onExiting,
}) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [eventId, setEventId] = eventIdState;
  const [tabIndex, setTabIndex] = React.useState(0);
  const [eventByIdQuery, { data: eventData, loading: eventLoading }] =
    useEventByIdLazyQuery();
  const [meQuery, { data: meData, loading: meLoading }] = useMeLazyQuery();
  const [
    checkEventCodeExistLazyQuery,
    { data: checkEventCodeData, loading: checkEventCodeLoading },
  ] = useCheckEventCodeExistLazyQuery();
  const [updateEventMutation, { loading: updateEventLoading }] =
    useUpdateEventMutation();

  React.useEffect(() => {
    if (eventId) {
      eventByIdQuery({ variables: { eventId } });
      meQuery();
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

  const initialValues: EventSettingValues = {
    name: eventData?.eventById.name || "",
    code: eventData?.eventById.code || "",
    startAt: new Date(eventData?.eventById.startAt),
    endAt: new Date(eventData?.eventById.endAt),
    eventLink: `${window.location.origin}/event/${eventData?.eventById.id}`,
    moderation: eventData?.eventById.moderation,
  };
  const handleValidate: (
    values: EventSettingValues
  ) => void | object | Promise<FormikErrors<EventSettingValues>> = async ({
    name,
    code,
    startAt,
    endAt,
  }) => {
    try {
      await Yup.object({
        name: Yup.string().max(EVENT_NAME_MAX_LENGTH).required(),
        code: Yup.string().max(EVENT_CODE_MAX_LENGTH).required(),
        startAt: Yup.date(),
        endAt: Yup.date(),
      }).validate({
        name,
        code,
        startAt,
        endAt,
      });
    } catch (err) {
      const { path, errors } = err as Yup.ValidationError;
      console.error(path, errors);

      return { [path as string]: errors[0] };
    }

    if (endAt < startAt) {
      return {
        endAt: formatMessage({
          id: "End_must_after_start",
          defaultMessage: "End must after start",
        }),
      };
    }

    if (code !== initialValues.code) {
      await checkEventCodeExistLazyQuery({ variables: { code } });
      if (checkEventCodeData?.checkEventCodeExist) {
        return {
          code: formatMessage({
            id: "Code_existed",
            defaultMessage: "Code existed",
          }),
        };
      }
    }
  };
  const handleSubmit: (
    values: EventSettingValues,
    formikHelpers: FormikHelpers<EventSettingValues>
  ) => void | Promise<any> = async (values) => {
    const { data } = await updateEventMutation({
      variables: {
        input: R.omit(["eventLink"], {
          eventId,
          ...values,
        }),
      },
    });
    if (data) {
      enqueueSnackbar(
        formatMessage({
          id: "Event_updated",
          defaultMessage: "Event updated",
        }),
        {
          variant: "success",
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
      <DialogTitleWithClose
        title={
          <FormattedMessage
            id="Event_settings"
            defaultMessage="Event settings"
          />
        }
        onClose={handleClose}
      />

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
                    wrapper: classes.tabWrapper,
                  }}
                  key={index}
                  label={item}
                />
              ))}
            </Tabs>
            <Box className={classes.contentRightBox}>
              <TabPanel
                index={tabIndex}
                defaultFocus={defaultFocus}
                eventId={eventId}
                eventData={eventData}
                meData={meData}
              />
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
                eventLoading ||
                meLoading ||
                updateEventLoading ||
                checkEventCodeLoading
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

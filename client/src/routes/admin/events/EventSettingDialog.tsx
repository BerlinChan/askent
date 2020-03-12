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
  Typography,
  InputAdornment
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FormattedMessage, useIntl } from "react-intl";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ButtonLoading } from "../../../components/Form";
import { add } from "date-fns";
import { useCheckEventCodeExistLazyQuery } from "../../../generated/graphqlHooks";
import { useSnackbar } from "notistack";
import { EVENT_CODE_MAX_LENGTH, USERNAME_MAX_LENGTH } from "../../../constant";
import { TextField, Switch } from "formik-material-ui";
import { DateTimePicker } from "formik-material-ui-pickers";
import CloseIcon from "@material-ui/icons/Close";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import SecurityIcon from "@material-ui/icons/Security";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import TabPanel from "../../../components/TabPanel";
import CollapseList from "./CollapseList";
import SwitchItem from "./SwitchItem";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogTitle: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    dialogContent: {
      display: "flex",
      overflowY: "hidden"
    },
    tabs: {
      width: 200,
      borderRight: `1px solid ${theme.palette.divider}`
    },
    tabRoot: {
      paddingRight: theme.spacing(2)
    },
    tabWrapper: {
      alignItems: "flex-end"
    },
    contentRightBox: {
      width: 650,
      height: "100%",
      maxHeight: 400,
      overflowY: "auto",
      marginLeft: theme.spacing(2),
      paddingLeft: 50,
      paddingRight: 50
    },
    basicInfoField: { width: "70%" },
    dateRange: {
      display: "flex",
      justifyContent: "space-between",
      "& > *": { width: "47%" }
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
              label={item}
            />
          ))}
        </Tabs>
        <Box className={classes.contentRightBox}>
          <Formik
            initialValues={{
              name: "",
              code: "",
              startAt: new Date(),
              endAt: add(new Date(), { days: 4 })
            }}
            validate={async ({ name, code, startAt, endAt }) => {
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

              await checkEventCodeExistLazyQuery({ variables: { code } });
              if (checkEventCodeData?.checkEventCodeExist) {
                return {
                  code: formatMessage({
                    id: "Code_existed",
                    defaultMessage: "Code existed"
                  })
                };
              }
            }}
            onSubmit={async values => {
              console.log("values", values);
              enqueueSnackbar(
                formatMessage({
                  id: "Event_created",
                  defaultMessage: "Event created"
                }),
                {
                  variant: "success"
                }
              );
              handleClose();
            }}
          >
            <Form>
              <TabPanel value={tabIndex} index={0}>
                <CollapseList
                  list={[
                    {
                      titleIcon: <InfoOutlinedIcon />,
                      titleText: (
                        <FormattedMessage
                          id="Basic_information"
                          defaultMessage="Basic information"
                        />
                      ),
                      body: (
                        <Box className={classes.basicInfoField}>
                          <Field
                            component={TextField}
                            autoFocus
                            fullWidth
                            name="name"
                            label={formatMessage({
                              id: "Event_name",
                              defaultMessage: "Event name"
                            })}
                            margin="normal"
                          />
                          <Box className={classes.dateRange}>
                            <Field
                              component={DateTimePicker}
                              name="startAt"
                              label={formatMessage({
                                id: "Start_datetime",
                                defaultMessage: "Start date time"
                              })}
                              variant="inline"
                              margin="normal"
                              autoOk
                              disableToolbar
                            />
                            <Field
                              component={DateTimePicker}
                              name="endAt"
                              label={formatMessage({
                                id: "End_datetime",
                                defaultMessage: "End date time"
                              })}
                              variant="inline"
                              margin="normal"
                              autoOk
                              disableToolbar
                            />
                          </Box>
                          <Field
                            component={TextField}
                            fullWidth
                            name="code"
                            label={formatMessage({
                              id: "Event_code",
                              defaultMessage: "Event code"
                            })}
                            margin="normal"
                          />
                          <Field
                            component={TextField}
                            fullWidth
                            name="eventLink"
                            label={formatMessage({
                              id: "Event_link",
                              defaultMessage: "Event link"
                            })}
                            InputProps={{
                              readOnly: true,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton size="small" onClick={e => {}}>
                                    <FileCopyOutlinedIcon
                                      fontSize="inherit"
                                      color="inherit"
                                    />
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                          />
                        </Box>
                      )
                    },
                    {
                      titleIcon: <SecurityIcon />,
                      titleText: (
                        <FormattedMessage
                          id="Security"
                          defaultMessage="Security"
                        />
                      ),
                      body: <Box></Box>
                    }
                  ]}
                />
              </TabPanel>
              <TabPanel value={tabIndex} index={1}>
                <CollapseList
                  list={[
                    {
                      titleIcon: <QuestionAnswerIcon />,
                      titleText: (
                        <FormattedMessage
                          id="Audience_Q&A"
                          defaultMessage="Audience Q&A"
                        />
                      ),
                      body: (
                        <React.Fragment>
                          <SwitchItem
                            label={
                              <FormattedMessage
                                id="Moderation"
                                defaultMessage="Moderation"
                              />
                            }
                            description={
                              <FormattedMessage
                                id="Easily review all questions before they go live."
                                defaultMessage="Easily review all questions before they go live."
                              />
                            }
                            switchField={
                              <Field component={Switch} name="moderation" />
                            }
                          />
                        </React.Fragment>
                      )
                    }
                  ]}
                />
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
            </Form>
          </Formik>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          <FormattedMessage id="Cancel" defaultMessage="Cancel" />
        </Button>

        <ButtonLoading
          variant="contained"
          color="primary"
          type="submit"
          disabled={checkEventCodeLoading}
          loading={checkEventCodeLoading}
        >
          <FormattedMessage id="Save" defaultMessage="Save" />
        </ButtonLoading>
      </DialogActions>
    </Dialog>
  );
};

export default EventSettingDialog;

import React from "react";
import { useNavigate } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Container,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Paper,
  IconButton,
  CircularProgress,
  Tooltip,
  Grid,
} from "@material-ui/core";
import { RouteTabs } from "../../../components/Tabs";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import { FormattedDate, FormattedTime, useIntl } from "react-intl";
import HeaderAction from "../../../components/HeaderAction";
import SettingsIcon from "@material-ui/icons/Settings";
import PhoneAndroidIcon from "@material-ui/icons/PhoneAndroid";
import EventSettingDialog, {
  EventSettingValues,
} from "../../../components/EventSettingDialog";
import PresentModeButton from "./PresentModeButton";
import { EventDetailLiveQueryFieldsFragment } from "../../../generated/hasuraHooks";
import { getEventDateStatus } from "../../../utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbarLeft: {
      display: "flex",
    },
    toolbarCenter: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    toolbarRight: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    openSettingText: {
      display: "inline-block",
      cursor: "pointer",
    },
    tabAndActionBox: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
  })
);

interface Props {
  loading: boolean;
  eventDetailData: EventDetailLiveQueryFieldsFragment | undefined;
}

const AdminEventHeader: React.FC<Props> = ({ loading, eventDetailData }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const eventSettingState = React.useState<string>("");
  const [eventSettingDefaultFocus, setEventSettingDefaultFocus] =
    React.useState<keyof EventSettingValues>("name");
  const { formatMessage } = useIntl();

  const handleOpenSetting = (
    id: string,
    defaultFocus?: keyof EventSettingValues
  ) => {
    setEventSettingDefaultFocus(defaultFocus || "name");
    eventSettingState[1](id);
  };

  return (
    <React.Fragment>
      <AppBar position="static" elevation={2}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {loading ? (
              <CircularProgress />
            ) : (
              <Grid container>
                <Grid item xs={4} className={classes.toolbarLeft}>
                  <IconButton
                    edge="start"
                    color="inherit"
                    size="small"
                    style={{ width: 48 }}
                    onClick={() => navigate(-1)}
                  >
                    <NavigateBeforeIcon fontSize="large" />
                  </IconButton>
                  <Box>
                    <Tooltip
                      arrow
                      title={formatMessage({
                        id: "Edit event name",
                        defaultMessage: "Edit event name",
                      })}
                      placement="right"
                    >
                      <Typography
                        color="inherit"
                        className={classes.openSettingText}
                        onClick={() =>
                          handleOpenSetting(eventDetailData?.id, "name")
                        }
                      >
                        {eventDetailData?.name}
                      </Typography>
                    </Tooltip>
                    <Box>
                      <Tooltip
                        arrow
                        title={formatMessage({
                          id: "Edit event date",
                          defaultMessage: "Edit event date",
                        })}
                        placement="right"
                      >
                        <Typography
                          variant="body2"
                          color="inherit"
                          className={classes.openSettingText}
                          onClick={() =>
                            handleOpenSetting(eventDetailData?.id, "startAt")
                          }
                        >
                          <FormattedDate value={eventDetailData?.startAt} />
                          {", "}
                          <FormattedTime value={eventDetailData?.startAt} />
                          {" ~ "}
                          <FormattedDate value={eventDetailData?.endAt} />
                          {", "}
                          <FormattedTime value={eventDetailData?.endAt} />
                        </Typography>
                      </Tooltip>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={4} className={classes.toolbarCenter}>
                  <Tooltip
                    arrow
                    title={formatMessage({
                      id: "Edit event code",
                      defaultMessage: "Edit event code",
                    })}
                    placement="right"
                  >
                    <Typography
                      color="inherit"
                      className={classes.openSettingText}
                      onClick={() =>
                        handleOpenSetting(eventDetailData?.id, "code")
                      }
                    >
                      #{eventDetailData?.code}
                    </Typography>
                  </Tooltip>
                  <Typography color="inherit">
                    {getEventDateStatus(
                      eventDetailData?.startAt,
                      eventDetailData?.endAt,
                      new Date()
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={4} className={classes.toolbarRight}>
                  <PresentModeButton />
                  <HeaderAction hideUserInfo />
                </Grid>
              </Grid>
            )}
          </Toolbar>
        </Container>
        <Paper elevation={0} square>
          <Container maxWidth="lg" className={classes.tabAndActionBox}>
            <RouteTabs
              tabs={[
                {
                  label: formatMessage({
                    id: "Audience_Q&A",
                    defaultMessage: "Audience Q&A",
                  }),
                  to: `questions`,
                },
                {
                  label: formatMessage({
                    id: "Live_polls",
                    defaultMessage: "Live polls",
                  }),
                  to: `polls`,
                },
                {
                  label: formatMessage({
                    id: "Analitics",
                    defaultMessage: "Analitics",
                  }),
                  to: `analytics`,
                },
              ]}
              indicatorColor="primary"
              textColor="primary"
            />
            <Box>
              <Tooltip
                title={formatMessage({
                  id: "Participant mode",
                  defaultMessage: "Participant mode",
                })}
              >
                <IconButton
                  size="small"
                  onClick={(e) => {
                    window.open(`/event/${eventDetailData?.id}`);
                  }}
                >
                  <PhoneAndroidIcon fontSize="inherit" color="inherit" />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={formatMessage({
                  id: "Open_event_settings",
                  defaultMessage: "Open event settings",
                })}
              >
                <Box display="inline-block">
                  <IconButton
                    size="small"
                    disabled={loading && !eventDetailData}
                    onClick={(e) => handleOpenSetting(eventDetailData?.id)}
                  >
                    <SettingsIcon fontSize="inherit" color="inherit" />
                  </IconButton>
                </Box>
              </Tooltip>
            </Box>
          </Container>
        </Paper>
      </AppBar>

      <EventSettingDialog
        eventIdState={eventSettingState}
        defaultFocus={eventSettingDefaultFocus}
      />
    </React.Fragment>
  );
};

export default AdminEventHeader;

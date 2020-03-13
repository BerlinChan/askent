import React from "react";
import { Box, IconButton, InputAdornment, Tooltip } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FormattedMessage, useIntl } from "react-intl";
import { Field } from "formik";
import { TextField } from "formik-material-ui";
import { DateTimePicker } from "formik-material-ui-pickers";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import SecurityIcon from "@material-ui/icons/Security";
import CollapseList from "./CollapseList";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    basicInfoField: { width: "70%" },
    dateRange: {
      display: "flex",
      justifyContent: "space-between",
      "& > *": { width: "47%" }
    }
  })
);

interface Props {}

const TabPanelGeneral: React.FC<Props> = () => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const eventLinkRef = React.useRef<HTMLInputElement>(null);
  const [showCopies, setShowCopies] = React.useState(false);

  const handleEventLinkFocus = () => {
    eventLinkRef.current?.select();
  };
  const handleCopyEventLink = () => {
    eventLinkRef.current?.focus();
    eventLinkRef.current?.select();
    try {
      if (window.document.execCommand("copy")) {
        setShowCopies(true);
        window.setTimeout(() => setShowCopies(false), 3000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
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
                size="small"
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
                  size="small"
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
                  size="small"
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
                size="small"
              />
              <Field
                component={TextField}
                inputRef={eventLinkRef}
                fullWidth
                name="eventLink"
                label={formatMessage({
                  id: "Event_link",
                  defaultMessage: "Event link"
                })}
                size="small"
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip
                        arrow
                        placement="right"
                        title={
                          showCopies
                            ? formatMessage({
                                id: "Copied!",
                                defaultMessage: "Copied!"
                              })
                            : formatMessage({
                                id: "Copy to clipboard",
                                defaultMessage: "Copy to clipboard"
                              })
                        }
                      >
                        <IconButton size="small" onClick={handleCopyEventLink}>
                          <FileCopyOutlinedIcon
                            fontSize="inherit"
                            color="inherit"
                          />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
                onFocus={handleEventLinkFocus}
              />
            </Box>
          )
        },
        {
          titleIcon: <SecurityIcon />,
          titleText: (
            <FormattedMessage id="Security" defaultMessage="Security" />
          ),
          body: <Box></Box>
        }
      ]}
      defaultActiveKey={[0]}
    />
  );
};

export default TabPanelGeneral;

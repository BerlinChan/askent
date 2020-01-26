import React from "react";
import {
  InputAdornment,
  Paper,
  CircularProgress,
  TextField
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ButtonLoading } from "../../components/Form";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { EVENT_CODE_MAX_LENGTH } from "../../constant";
import { usePubEventsLazyQuery, PubEvent } from "../../generated/graphqlHooks";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    joinForm: {
      padding: theme.spacing(6, 8)
    }
  })
);

const JoinEventForm: React.FC = props => {
  const classes = useStyles();
  const [pubEventsLazyQuery, { data, loading }] = usePubEventsLazyQuery();

  return (
    <Paper>
      <Formik
        initialValues={{ eventCode: "" }}
        validationSchema={Yup.object({
          eventCode: Yup.string()
            .max(EVENT_CODE_MAX_LENGTH)
            .required()
        })}
        onSubmit={async values => {
          console.log("join event:", values);
        }}
      >
        {formProps => (
          <Form className={classes.joinForm}>
            <Autocomplete
              clearOnEscape
              id="eventCode"
              onInputChange={(event, value, reason) => {
                pubEventsLazyQuery({
                  variables: { code: value }
                });
              }}
              onChange={(
                event: React.ChangeEvent<{}>,
                newValue: Pick<
                  PubEvent,
                  "id" | "code" | "name" | "startAt" | "endAt"
                > | null
              ) => {
                formProps.setTouched({ eventCode: true });
                formProps.setFieldValue("eventCode", newValue?.code || "");
              }}
              getOptionSelected={(option, value) => option.code === value.code}
              getOptionLabel={option => option.code}
              options={data?.pubEvents}
              loading={loading}
              renderInput={params => (
                <TextField
                  {...params}
                  fullWidth
                  label="Event Code"
                  variant="outlined"
                  margin="normal"
                  error={Boolean(
                    formProps.touched.eventCode && formProps.errors.eventCode
                  )}
                  helperText={
                    formProps.touched.eventCode && formProps.errors.eventCode
                      ? formProps.errors.eventCode
                      : " "
                  }
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">#</InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
            <ButtonLoading
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="primary"
              loading={loading}
              disabled={loading}
            >
              <FormattedMessage id="Join" defaultMessage="Join" />
            </ButtonLoading>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default JoinEventForm;

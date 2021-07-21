import React from "react";
import { useHistory } from "react-router-dom";
import {
  InputAdornment,
  Paper,
  CircularProgress,
  TextField,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ButtonLoading } from "../../components/Form";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { EVENT_CODE_MAX_LENGTH } from "askent-common/src/constant";
import {
  useEventCodeOptionsLazyQuery,
  Event,
} from "../../generated/graphqlHooks";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    joinForm: {
      padding: theme.spacing(6, 8),
    },
  })
);

const JoinEventForm: React.FC = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [eventCodeOptionsLazyQuery, { data, loading }] =
    useEventCodeOptionsLazyQuery();

  return (
    <Paper>
      <Formik
        initialValues={{ code: "", id: "" }}
        validationSchema={Yup.object({
          code: Yup.string().max(EVENT_CODE_MAX_LENGTH).required(),
          id: Yup.string().required(),
        })}
        onSubmit={async (values) => {
          history.push(`/event/${values.id}/login`);
        }}
      >
        {(formProps) => (
          <Form className={classes.joinForm}>
            <Autocomplete
              clearOnEscape
              id="code"
              onOpen={() => eventCodeOptionsLazyQuery()}
              onInputChange={(event, value, reason) => {
                eventCodeOptionsLazyQuery({
                  variables: { code: value },
                });
              }}
              onChange={(
                event: React.ChangeEvent<{}>,
                newValue: Pick<
                  Event,
                  "id" | "code" | "name" | "startAt" | "endAt"
                > | null
              ) => {
                formProps.setValues({
                  code: newValue?.code || "",
                  id: newValue?.id || "",
                });
              }}
              getOptionSelected={(option, value) => option.id === value.id}
              getOptionLabel={(option) => option.code}
              options={data?.eventsByCode || []}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Event Code"
                  variant="outlined"
                  margin="normal"
                  error={Boolean(formProps.errors.code)}
                  helperText={formProps.errors.code}
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
                    ),
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

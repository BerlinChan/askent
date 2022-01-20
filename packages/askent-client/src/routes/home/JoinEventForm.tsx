import React from "react";
import { useNavigate } from "react-router-dom";
import { InputAdornment, CircularProgress, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  createStyles,
  makeStyles,
  withStyles,
  Theme,
} from "@material-ui/core/styles";
import { ButtonLoading } from "../../components/Form";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { EVENT_CODE_MAX_LENGTH } from "askent-common/src/constant";
import {
  useEventCodeOptionsLazyQuery,
  Event,
} from "../../generated/graphqlHooks";
import { useIntl, FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    joinForm: {
      padding: theme.spacing(4, 8, 10, 8),
    },
  })
);

const JoinInputField = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "& .MuiFilledInput-root": {
        ...theme.typography.h5,
        color: "white",
        padding: `${theme.spacing(1, 2)} !important`,
        borderRadius: theme.shape.borderRadius,
        "& .MuiInputAdornment-positionStart .MuiTypography-colorTextSecondary":
          {
            fontSize: theme.typography.h5.fontSize,
            lineHeight: theme.typography.h5.lineHeight,
            color: theme.palette.grey["100"],
          },
      },
    },
  })
)(TextField);

const JoinEventForm: React.FC = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const [eventCodeOptionsLazyQuery, { data, loading }] =
    useEventCodeOptionsLazyQuery();

  return (
    <Formik
      initialValues={{ code: "", id: "" }}
      validationSchema={Yup.object({
        code: Yup.string().max(EVENT_CODE_MAX_LENGTH).required(),
        id: Yup.string().required(),
      })}
      onSubmit={async (values) => {
        navigate(`/event/${values.id}/login`);
      }}
    >
      {(formProps) => (
        <Form className={classes.joinForm}>
          <Autocomplete
            clearOnEscape
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
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
              <JoinInputField
                {...params}
                fullWidth
                variant="filled"
                margin="normal"
                hiddenLabel={true}
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                  placeholder: formatMessage({
                    id: "Event code",
                    defaultMessage: "Event code",
                  }),
                  startAdornment: (
                    <InputAdornment position="start">#</InputAdornment>
                  ),
                  endAdornment: loading ? (
                    <InputAdornment position="end">
                      <CircularProgress color="inherit" size={20} />
                    </InputAdornment>
                  ) : null,
                }}
              />
            )}
          />
          <ButtonLoading
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="secondary"
            loading={loading}
            disabled={loading}
          >
            <FormattedMessage id="Join" defaultMessage="Join" />
          </ButtonLoading>
        </Form>
      )}
    </Formik>
  );
};

export default JoinEventForm;

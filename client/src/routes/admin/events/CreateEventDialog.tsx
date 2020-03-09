import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";
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
import { DatePicker } from "formik-material-ui-pickers";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    createForm: { minWidth: 400 },
    dateRange: {
      display: "flex",
      justifyContent: "space-between",
      "& > *": { width: "47%" }
    },
    boldButton: {
      fontWeight: theme.typography.fontWeightBold
    }
  })
);

interface Props {
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  eventsQueryResult: QueryResult<EventsByMeQuery, EventsByMeQueryVariables>;
}

const CreateEventDialog: React.ComponentType<Props> = ({
  openState,
  eventsQueryResult,
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = openState;
  const [
    checkEventCodeExistLazyQuery,
    { data: checkEventCodeData, loading: checkEventCodeLoading }
  ] = useCheckEventCodeExistLazyQuery();
  const [
    createEventMutation,
    { loading: createEventLoading }
  ] = useCreateEventMutation();

  const handleClose = () => {
    eventsQueryResult.refetch();
    setOpen(false);
  };

  return (
    <Dialog open={open}>
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
            return { endAt: "End must after start" };
          }

          await checkEventCodeExistLazyQuery({ variables: { code } });
          if (checkEventCodeData?.checkEventCodeExist) {
            return { code: "Code exist" };
          }
        }}
        onSubmit={async values => {
          const { data } = await createEventMutation({ variables: values });
          if (data) {
            enqueueSnackbar("Create success!", {
              variant: "success"
            });
            handleClose();
          }
        }}
      >
        <Form className={classes.createForm}>
          <DialogTitle>
            <FormattedMessage id="CREAT_EVENT" />
          </DialogTitle>
          <DialogContent>
            <Field
              component={TextField}
              autoFocus
              fullWidth
              id="name"
              name="name"
              label="Event Name"
              margin="normal"
            />
            <Box className={classes.dateRange}>
              <Field
                component={DatePicker}
                id="startAt"
                name="startAt"
                label="Start date"
                variant="inline"
                margin="normal"
                autoOk
                disableToolbar
                disablePast
              />
              <Field
                component={DatePicker}
                id="endAt"
                name="endAt"
                label="End date"
                variant="inline"
                margin="normal"
                autoOk
                disableToolbar
                disablePast
              />
            </Box>
            <Field
              component={TextField}
              fullWidth
              id="code"
              name="code"
              label="Event Code"
              type="code"
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>
              <FormattedMessage id="CANCEL" defaultMessage="Cancel" />
            </Button>
            <ButtonLoading
              className={classes.boldButton}
              type="submit"
              color="primary"
              disabled={createEventLoading || checkEventCodeLoading}
              loading={createEventLoading || checkEventCodeLoading}
            >
              <FormattedMessage id="CREATE" defaultMessage="Create" />
            </ButtonLoading>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};

export default CreateEventDialog;

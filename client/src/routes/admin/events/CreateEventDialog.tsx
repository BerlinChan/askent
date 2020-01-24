import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  FTextField,
  FDatePicker,
  ButtonLoading
} from "../../../components/Form";
import { add } from "date-fns";
import {
  useCheckEventCodeExistLazyQuery,
  useCreateEventMutation
} from "../../../generated/graphqlHooks";
import { useSnackbar } from "notistack";
import { EVENT_CODE_MAX_LENGTH } from "../../../constant";

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
  onClose: () => void;
}

const CreateEventDialog: React.ComponentType<Props & DialogProps> = props => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [
    checkEventCodeExistLazyQuery,
    { data: checkEventCodeData, loading: checkEventCodeLoading }
  ] = useCheckEventCodeExistLazyQuery();
  const [
    createEventMutation,
    { loading: createEventLoading }
  ] = useCreateEventMutation();

  return (
    <Dialog {...props}>
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
                .max(20)
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
            props.onClose();
          }
        }}
      >
        <Form className={classes.createForm}>
          <DialogTitle>
            <FormattedMessage id="CREAT_EVENT" />
          </DialogTitle>
          <DialogContent>
            <FTextField
              autoFocus
              fullWidth
              id="name"
              name="name"
              label="Event Name"
              margin="normal"
            />
            <Box className={classes.dateRange}>
              <FDatePicker
                id="startAt"
                name="startAt"
                label="Start date"
                variant="inline"
                margin="normal"
                autoOk
                disableToolbar
                disablePast
              />
              <FDatePicker
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
            <FTextField
              fullWidth
              id="code"
              name="code"
              label="Event Code"
              type="code"
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={props.onClose}>
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

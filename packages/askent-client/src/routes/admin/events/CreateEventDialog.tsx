import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { FormattedMessage, useIntl } from "react-intl";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ButtonLoading } from "../../../components/Form";
import { add } from "date-fns";
import { QueryResult } from "@apollo/client";
import {
  useCheckEventCodeExistLazyQuery,
  useCreateEventMutation,
  EventsByMeQuery,
  EventsByMeQueryVariables,
} from "../../../generated/graphqlHooks";
import { useSnackbar } from "notistack";
import {
  EVENT_CODE_MAX_LENGTH,
  EVENT_NAME_MAX_LENGTH,
} from "askent-common/src/constant";
import { FTextField } from "../../../components/Form";
import { FDateTimePicker } from "../../../components/Form";

const useStyles = makeStyles<Theme, {}, string>((theme: Theme) => ({
    createForm: { minWidth: 400 },
    dateRange: {
      display: "flex",
      justifyContent: "space-between",
      "& > *": { width: "47%" },
    },
    boldButton: {
      fontWeight: theme.typography.fontWeightBold,
    },
  }));
interface Props {
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  eventsQueryResult: QueryResult<EventsByMeQuery, EventsByMeQueryVariables>;
}

const CreateEventDialog: React.FC<Props> = ({
  openState,
  eventsQueryResult,
}) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = openState;
  const [
    checkEventCodeExistLazyQuery,
    { data: checkEventCodeData, loading: checkEventCodeLoading },
  ] = useCheckEventCodeExistLazyQuery();
  const [createEventMutation, { loading: createEventLoading }] =
    useCreateEventMutation();

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
          endAt: add(new Date(), { days: 4 }),
        }}
        validate={async ({ name, code, startAt, endAt }) => {
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

          await checkEventCodeExistLazyQuery({ variables: { code } });
          if (checkEventCodeData?.checkEventCodeExist) {
            return {
              code: formatMessage({
                id: "Code_existed",
                defaultMessage: "Code existed",
              }),
            };
          }
        }}
        onSubmit={async (values) => {
          const { data } = await createEventMutation({ variables: values });
          if (data) {
            enqueueSnackbar(
              formatMessage({
                id: "Event_created",
                defaultMessage: "Event created",
              }),
              {
                variant: "success",
              }
            );
            handleClose();
          }
        }}
      >
        <Form className={classes.createForm}>
          <DialogTitle>
            <FormattedMessage id="Create_event" defaultMessage="Create event" />
          </DialogTitle>
          <DialogContent>
            <Field
              component={FTextField}
              autoFocus
              fullWidth
              name="name"
              label={formatMessage({
                id: "Event_name",
                defaultMessage: "Event name",
              })}
              margin="normal"
            />
            <Box className={classes.dateRange}>
              <Field
                component={FDateTimePicker}
                name="startAt"
                label={formatMessage({
                  id: "Start_datetime",
                  defaultMessage: "Start date time",
                })}
                variant="inline"
                margin="normal"
                closeOnSelect
                disableFuture
              />
              <Field
                component={FDateTimePicker}
                name="endAt"
                label={formatMessage({
                  id: "End_datetime",
                  defaultMessage: "End date time",
                })}
                variant="inline"
                margin="normal"
                closeOnSelect
                disableFuture
              />
            </Box>
            <Field
              component={FTextField}
              fullWidth
              name="code"
              label={formatMessage({
                id: "Event_code",
                defaultMessage: "Event code",
              })}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>
              <FormattedMessage id="Cancel" defaultMessage="Cancel" />
            </Button>
            <ButtonLoading
              className={classes.boldButton}
              type="submit"
              color="primary"
              disabled={createEventLoading || checkEventCodeLoading}
              loading={createEventLoading || checkEventCodeLoading}
            >
              <FormattedMessage id="Create" defaultMessage="Create" />
            </ButtonLoading>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};

export default CreateEventDialog;

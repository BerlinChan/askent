import React from "react";
import { FormattedMessage } from "react-intl";
import {
  Box,
  IconButton,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { TextField } from "formik-material-ui";
import * as Yup from "yup";
import { Formik, Form, Field, FormikErrors, FormikHelpers } from "formik";
import {
  useGuestesByEventQuery,
  useCheckEmailExistLazyQuery,
  useAddGuestMutation,
  useRemoveGuestMutation,
  EventByIdQuery,
  MeQuery,
} from "../../../generated/graphqlHooks";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import { ButtonLoading } from "../../Form";
import { USER_EMAIL_MAX_LENGTH } from "askent-common/src/constant";
import Confirm from "../../Confirm";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    removeButton: { color: theme.palette.text.secondary },
  })
);

interface Props {
  eventId: string;
  eventData?: EventByIdQuery;
  meData?: MeQuery;
}

const TabPanelGuestes: React.FC<Props> = ({ eventId, eventData, meData }) => {
  const classes = useStyles();
  const [addOpen, setAddOpen] = React.useState(false);
  const [removeId, setRemoveId] = React.useState("");
  const { data, loading, refetch } = useGuestesByEventQuery({
    variables: { eventId },
  });
  const [removeGuestMutation, { loading: removeGuestLoading }] =
    useRemoveGuestMutation();
  const isGuestAdmin = eventData?.eventById.owner.id !== meData?.me.id;

  const handleAddDialogOpen = () => {
    setAddOpen(true);
  };
  const handleAddDialogClose = (submit?: boolean) => {
    submit && refetch();
    setAddOpen(false);
  };

  const handleRemoveOpen = (id: string) => {
    setRemoveId(id);
  };
  const handleRemoveClose = () => {
    setRemoveId("");
  };
  const handleRemove = async () => {
    await removeGuestMutation({
      variables: { eventId, guestId: removeId },
    });
    refetch();
    handleRemoveClose();
  };

  return (
    <React.Fragment>
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={handleAddDialogOpen}
          disabled={isGuestAdmin}
        >
          <FormattedMessage id="Add guest" defaultMessage="Add guest" />
        </Button>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage id="Name" defaultMessage="Name" />
              </TableCell>
              <TableCell align="right">
                <FormattedMessage id="Email" defaultMessage="Email" />
              </TableCell>
              <TableCell align="right">
                <FormattedMessage id="Actions" defaultMessage="Actions" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.eventById.guestes.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.email}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    className={classes.removeButton}
                    onClick={(e) => handleRemoveOpen(row.id)}
                    disabled={isGuestAdmin}
                  >
                    <RemoveCircleOutlineIcon
                      fontSize="inherit"
                      color="inherit"
                    />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {loading && <CircularProgress />}

      <AddGuestDialog
        open={addOpen}
        eventId={eventId}
        eventData={eventData}
        handleClose={handleAddDialogClose}
      />
      <Confirm
        open={Boolean(removeId)}
        loading={removeGuestLoading}
        contentText={
          <FormattedMessage
            id="Remove_this_guest?"
            defaultMessage="Remove this guest?"
          />
        }
        okText={<FormattedMessage id="Remove" defaultMessage="Remove" />}
        onCancel={handleRemoveClose}
        onOk={handleRemove}
      />
    </React.Fragment>
  );
};

export default TabPanelGuestes;

interface AddGuestDialogProps {
  open: boolean;
  eventId: string;
  eventData?: EventByIdQuery;
  handleClose: (refetch?: boolean) => void;
}
const AddGuestDialog: React.FC<AddGuestDialogProps> = ({
  open,
  eventId,
  eventData,
  handleClose,
}) => {
  const [
    checkEmailExistQuery,
    { data: checkEmailData, loading: checkEmailLoading },
  ] = useCheckEmailExistLazyQuery();
  const [addGuestMutation, { loading: addGuestLoading }] =
    useAddGuestMutation();

  const initialValues = { email: "" };
  const handleValidate: (
    values: typeof initialValues
  ) => void | object | Promise<FormikErrors<typeof initialValues>> = async ({
    email,
  }) => {
    try {
      await Yup.object({
        email: Yup.string().max(USER_EMAIL_MAX_LENGTH).email().required(),
      }).validate({
        email,
      });
    } catch (err) {
      const { path, errors } = err as Yup.ValidationError;
      console.error(path, errors);

      return { [path as string]: errors[0] };
    }

    if (email === eventData?.eventById.owner.email) {
      return { email: "Can't add event owner as guest" };
    }

    await checkEmailExistQuery({
      variables: {
        email,
      },
    });
    if (!checkEmailData?.checkEmailExist) {
      return { email: "User with this eamil does not exist" };
    }
  };
  const handleSubmit: (
    values: typeof initialValues,
    formikHelpers: FormikHelpers<typeof initialValues>
  ) => void | Promise<any> = async ({ email }) => {
    await addGuestMutation({ variables: { eventId, email } });
    handleClose(true);
  };

  return (
    <Dialog open={open} onClose={(e) => handleClose()}>
      <DialogTitle>
        <FormattedMessage id="Add guest" defaultMessage="Add guest" />
      </DialogTitle>
      <Formik
        initialValues={initialValues}
        validate={handleValidate}
        onSubmit={handleSubmit}
      >
        <Form>
          <DialogContent>
            <DialogContentText>
              <FormattedMessage
                id="Add a user as guest administrator, who can cooperating manage this event with you."
                defaultMessage="Add a user as guest administrator, who can cooperating manage this event with you."
              />
            </DialogContentText>
            <Field
              component={TextField}
              autoFocus
              fullWidth
              name="email"
              label={
                <FormattedMessage id="User email" defaultMessage="User email" />
              }
              type="email"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={(e) => handleClose()}>
              <FormattedMessage id="Cancel" defaultMessage="Cancel" />
            </Button>
            <ButtonLoading
              type="submit"
              variant="contained"
              color="primary"
              style={{ width: 100 }}
              loading={checkEmailLoading || addGuestLoading}
            >
              <FormattedMessage id="Add" defaultMessage="Add" />
            </ButtonLoading>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  );
};

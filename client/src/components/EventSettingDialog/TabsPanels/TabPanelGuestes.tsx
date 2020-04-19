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
} from "../../../generated/graphqlHooks";
import { useParams } from "react-router-dom";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import { ButtonLoading } from "../../Form";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    removeButton: { color: theme.palette.text.secondary },
  })
);

interface Props {}

const TabPanelGuestes: React.FC<Props> = () => {
  const classes = useStyles();
  const { id } = useParams();
  const [addOpen, setAddOpen] = React.useState(false);
  const { data, loading } = useGuestesByEventQuery({
    variables: { eventId: id as string },
  });
  const [
    removeGuestMutation,
    { loading: removeGuestLoading },
  ] = useRemoveGuestMutation();

  const handleAddDialogOpen = () => {
    setAddOpen(true);
  };
  const handleAddDialogClose = () => {
    setAddOpen(false);
  };

  return (
    <React.Fragment>
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={handleAddDialogOpen}
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
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.eventById.guestes.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.email}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" className={classes.removeButton}>
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

      <AddGuestDialog open={addOpen} handleClose={handleAddDialogClose} />
    </React.Fragment>
  );
};

export default TabPanelGuestes;

interface AddGuestDialogProps {
  open: boolean;
  handleClose: () => void;
}
const AddGuestDialog: React.FC<AddGuestDialogProps> = ({
  open,
  handleClose,
}) => {
  const { id } = useParams();
  const [
    checkEmailExistQuery,
    { data: checkEmailData, loading: checkEmailLoading },
  ] = useCheckEmailExistLazyQuery();
  const [
    addGuestMutation,
    { loading: addGuestLoading },
  ] = useAddGuestMutation();

  const initialValues = { email: "" };
  const handleValidate: (
    values: typeof initialValues
  ) => void | object | Promise<FormikErrors<typeof initialValues>> = async ({
    email,
  }) => {
    try {
      await Yup.object({
        email: Yup.string().email().required(),
      }).validate({
        email,
      });
    } catch (err) {
      const { path, message } = err as Yup.ValidationError;
      const error: any = {};
      error[path] = message;

      return error;
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
    await addGuestMutation({ variables: { eventId: id as string, email } });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
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
            <Button onClick={handleClose}>
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

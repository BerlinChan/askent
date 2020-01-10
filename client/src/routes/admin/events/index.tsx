import React from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FTextField, FDatePicker } from "../../../components/Form";
import { add } from "date-fns";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleBox: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: theme.spacing(2)
    }
  })
);

const Events: React.FC<{}> = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Box className={classes.titleBox}>
        <Typography variant="h6">Events</Typography>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          <FormattedMessage id="CREAT_EVENT" />
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <FormattedMessage id="CREAT_EVENT" />
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              name: "",
              code: "",
              startAt: new Date(),
              endAt: add(new Date(), { days: 4 })
            }}
            validationSchema={Yup.object({
              name: Yup.string()
                .max(20)
                .required(),
              code: Yup.string()
                .max(20)
                .required(),
              startAt: Yup.date(),
              endAt: Yup.date()
            })}
            onSubmit={async values => {
              // const { data } = await loginMutation({ variables: values });
            }}
          >
            <Form>
              <FTextField
                autoFocus
                fullWidth
                id="name"
                name="name"
                label="Event Name"
                margin="normal"
              />
              <FTextField
                fullWidth
                id="code"
                name="code"
                label="Event Code"
                type="code"
                margin="normal"
              />
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
            </Form>
          </Formik>
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            // disabled={loading}
          >
            Log In
          </Button>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default Events;

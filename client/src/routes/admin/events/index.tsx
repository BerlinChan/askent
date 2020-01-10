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
import {
  useCheckEventCodeExistLazyQuery,
  useCreateEventMutation,
  useEventsLazyQuery
} from "../../../generated/graphqlHooks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleBox: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: theme.spacing(2)
    },
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

const Events: React.FC<{}> = () => {
  const classes = useStyles();
  const [openCreate, setOpenCreate] = React.useState(false);
  const [
    checkEventCodeExistLazyQuery,
    { data: checkEventCodeData, loading: checkEventCodeLoading }
  ] = useCheckEventCodeExistLazyQuery();

  const handleClickOpen = () => {
    setOpenCreate(true);
  };
  const handleClose = () => {
    setOpenCreate(false);
  };

  return (
    <React.Fragment>
      <Box className={classes.titleBox}>
        <Typography variant="h6">Events</Typography>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          <FormattedMessage id="CREAT_EVENT" />
        </Button>
      </Box>

      <Dialog open={openCreate} onClose={handleClose}>
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
              setOpenCreate(false);
              // const { data } = await loginMutation({ variables: values });
            }}
          >
            <Form className={classes.createForm}>
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
            </Form>
          </Formik>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            className={classes.boldButton}
            type="submit"
            color="primary"
            // disabled={loading}
          >
            <FormattedMessage id="CREAT_EVENT" />
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default Events;

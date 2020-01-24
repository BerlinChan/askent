import React from "react";
import { Grid, InputAdornment, Container, Paper } from "@material-ui/core";
import HomeHeader from "./HomeHeader";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FTextField, ButtonLoading } from "../../components/Form";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { EVENT_CODE_MAX_LENGTH } from "../../constant";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    joinForm: {
      margin: theme.spacing(0, 8),
      textAlign: "center"
    },
    card: {
      padding: theme.spacing(2)
    }
  })
);

const Home: React.FC = props => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <HomeHeader />
      <Container maxWidth="lg">
        <Grid container>
          <Grid item md={4}>
            <Paper elevation={0}>
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
                <Form className={classes.joinForm}>
                  <FTextField
                    autoFucous
                    fullWidth
                    id="eventCode"
                    name="eventCode"
                    label="Event Code"
                    variant="outlined"
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">#</InputAdornment>
                      )
                    }}
                  />
                  <ButtonLoading
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                    loading={false}
                    disabled={false}
                  >
                    Join
                  </ButtonLoading>
                </Form>
              </Formik>
            </Paper>
          </Grid>
          <Grid item md={8}>
            Other components
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default Home;

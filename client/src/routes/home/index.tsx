import React from "react";
import {
  Grid,
  InputAdornment,
  Container,
  Card,
  CardActions,
  CardContent
} from "@material-ui/core";
import HomeHeader from "./HomeHeader";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FTextField, ButtonLoading } from "../../components/Form";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    joinForm: {
      marginTop: theme.spacing(2)
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
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={Yup.object({
                email: Yup.string()
                  .email()
                  .required(),
                password: Yup.string()
                  .max(20)
                  .required()
              })}
              onSubmit={async values => {}}
            >
              <Form className={classes.joinForm}>
                <Card className={classes.card}>
                  <CardContent>
                    <FTextField
                      autoFucous
                      id="eventCode"
                      name="eventCode"
                      label="Event Code"
                      variant="filled"
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">#</InputAdornment>
                        )
                      }}
                    />
                  </CardContent>
                  <CardActions>
                    <ButtonLoading
                      type="submit"
                      variant="contained"
                      color="primary"
                      loading={false}
                      disabled={false}
                    >
                      Join
                    </ButtonLoading>
                  </CardActions>
                </Card>
              </Form>
            </Formik>
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

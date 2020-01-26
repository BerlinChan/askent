import React from "react";
import { Grid, Container, Typography } from "@material-ui/core";
import HomeHeader from "./HomeHeader";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import JoinEventForm from "./JoinEventForm";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    description: {
      textAlign: "center"
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
            <JoinEventForm />
          </Grid>
          <Grid item md={8}>
            <Typography className={classes.description}>
              Askent is a simple presentation tool.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default Home;

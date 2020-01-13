import React from "react";
import { useParams, useRouteMatch } from "react-router-dom";
import {
  Grid,
  Paper,
  Box,
  Typography,
  FormControlLabel,
  Switch
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    reviewActions: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "nowrap",  
     },
  })
);

const Questions: React.FC = () => {
  const classes = useStyles();
  let { id } = useParams();
  const { url, path } = useRouteMatch();

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item sm={6}>
          <Box className={classes.reviewActions}>
            <Typography>
              <FormattedMessage id="Moderation" defaultMessage="Moderation" />
            </Typography>
            <FormControlLabel
              control={<Switch value="checkedC" />}
              label="Uncontrolled"
            />
          </Box>
          <Paper>
            <div>Event Questions</div>
            <ul>
              <li> id: {id}</li>
              <li> path: {path}</li>
              <li> url: {url}</li>
            </ul>
          </Paper>
        </Grid>
        <Grid item sm={6}>
          <Paper>xs=12</Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Questions;

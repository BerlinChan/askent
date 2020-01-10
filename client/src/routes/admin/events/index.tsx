import React from "react";
import { Box, Typography, Button } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";

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

  return (
    <React.Fragment>
      <Box className={classes.titleBox}>
        <Typography variant="h6">Events</Typography>
        <Button variant="contained" color="primary">
          <FormattedMessage id="CREAT_EVENT" />
        </Button>
      </Box>
    </React.Fragment>
  );
};

export default Events;

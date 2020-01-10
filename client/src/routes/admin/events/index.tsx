import React from "react";
import { Box, Typography, Button } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";
import { useEventsLazyQuery } from "../../../generated/graphqlHooks";
import CreateEventDialog from "./CreateEventDialog";

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
  const [openCreate, setOpenCreate] = React.useState(false);
  const [
    eventsLazyQuery,
    { data: eventsData, loading: eventsLoading }
  ] = useEventsLazyQuery();

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

      <CreateEventDialog open={openCreate} onClose={handleClose} />
    </React.Fragment>
  );
};

export default Events;

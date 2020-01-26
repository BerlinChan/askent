import React from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Container,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Paper,
  IconButton,
  CircularProgress
} from "@material-ui/core";
import { RouteTabs } from "../../../components/Tabs";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import {
  EventByMeQuery,
  EventByMeQueryVariables
} from "../../../generated/graphqlHooks";
import { QueryResult } from "@apollo/react-common";
import { FormattedDate } from "react-intl";
import { AuthedAction } from "../../../components/Header";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      justifyContent: "space-between"
    },
    leftBox: {
      display: "flex",
      flexWrap: "nowrap"
    },
    actions: {
      display: "flex",
      alignItems: "center",
      flexWrap: "nowrap",
      "& > *": { margin: theme.spacing(1) }
    }
  })
);

interface Props {
  eventByMeQuery: QueryResult<EventByMeQuery, EventByMeQueryVariables>;
}

const EventHeader: React.FC<Props> = ({ eventByMeQuery }) => {
  const classes = useStyles();
  const history = useHistory();
  let { url } = useRouteMatch();
  const { data: eventByMeData, loading } = eventByMeQuery;

  return (
    <AppBar position="static" elevation={2}>
      <Container maxWidth="lg">
        <Toolbar className={classes.toolbar}>
          {loading ? (
            <CircularProgress />
          ) : (
            <React.Fragment>
              <Box className={classes.leftBox}>
                <IconButton
                  edge="start"
                  color="inherit"
                  size="small"
                  style={{ width: 48 }}
                  onClick={() => history.goBack()}
                >
                  <NavigateBeforeIcon fontSize="large" />
                </IconButton>
                <Box>
                  <Typography color="inherit">
                    {eventByMeData?.eventByMe.name}
                  </Typography>
                  <Typography color="inherit">
                    <FormattedDate value={eventByMeData?.eventByMe.startAt} /> ~{" "}
                    <FormattedDate value={eventByMeData?.eventByMe.endAt} />
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography color="inherit">
                  #{eventByMeData?.eventByMe.code}
                </Typography>
                <Typography color="inherit">
                  #{eventByMeData?.eventByMe.code}
                </Typography>
              </Box>
              <Box className={classes.actions}>
                <AuthedAction />
              </Box>
            </React.Fragment>
          )}
        </Toolbar>
      </Container>
      <Paper elevation={0} square>
        <Container maxWidth="lg">
          <RouteTabs
            tabs={[
              { label: "问答", to: `${url}/questions` },
              { label: "调查", to: `${url}/polls` },
              { label: "分析", to: `${url}/analytics` }
            ]}
            indicatorColor="primary"
            textColor="primary"
          />
        </Container>
      </Paper>
    </AppBar>
  );
};

export default EventHeader;
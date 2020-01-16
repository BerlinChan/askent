import React from "react";
import { match } from "react-router";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Container,
  Box,
  Typography,
  Link,
  AppBar,
  Toolbar,
  Paper,
  IconButton,
  CircularProgress
} from "@material-ui/core";
import RouteTabs from "../../components/Header/RouteTabs";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import { EventQuery, EventQueryVariables } from "../../generated/graphqlHooks";
import { QueryResult } from "@apollo/react-common";
import { FormattedDate } from "react-intl";
import { EventRouteParams } from "./index";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      justifyContent: "space-between"
    },
    leftBox: {
      display: "flex",
      flexWrap: "nowrap"
    },
    actions: { "& > *": { margin: theme.spacing(1) } }
  })
);

interface Props {
  eventQuery: QueryResult<EventQuery, EventQueryVariables>;
  routeMatch: match<EventRouteParams>;
}

const EventHeader: React.FC<Props> = ({ eventQuery, routeMatch }) => {
  const classes = useStyles();
  const history = useHistory();
  let { url } = routeMatch;
  const { data: eventData, loading } = eventQuery;

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
                    {eventData?.event.name}
                  </Typography>
                  <Typography color="inherit">
                    <FormattedDate value={eventData?.event.startAt} /> ~{" "}
                    <FormattedDate value={eventData?.event.endAt} />
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography color="inherit">
                  #{eventData?.event.code}
                </Typography>
                <Typography color="inherit">
                  #{eventData?.event.code}
                </Typography>
              </Box>
              <Box className={classes.actions}>
                <Link color="inherit" component={RouterLink} to="/admin">
                  Admin
                </Link>
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

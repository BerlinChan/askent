import React from "react";
import { match } from "react-router";
import {
  Link as RouterLink,
  useRouteMatch,
  useHistory
} from "react-router-dom";
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
import { useEventQuery } from "../../generated/graphqlHooks";
import { format } from "date-fns";

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

type Params = { id: string };

export function EventHeader() {
  const classes = useStyles();
  const history = useHistory();
  let { params, url } = useRouteMatch<Params>(`/event/:id`) as match<Params>;
  // TODO: generate short id for event
  const { data: eventData, loading } = useEventQuery({
    variables: { eventId: params.id }
  });

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
                  onClick={() => history.goBack()}
                >
                  <NavigateBeforeIcon fontSize="large" />
                </IconButton>
                <Box>
                  <Typography color="inherit">
                    {eventData?.event.name}
                  </Typography>
                  <Typography color="inherit">
                    {format(eventData?.event.startAt, "yyyy-MM-dd")} ~{" "}
                    {format(eventData?.event.endAt, "yyyy-MM-dd")}
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
}

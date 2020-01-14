import React from "react";
import { matchPath } from "react-router";
import {
  Link as RouterLink,
  useRouteMatch,
  useLocation,
  useHistory
} from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Container,
  Box,
  Link,
  AppBar,
  Toolbar,
  Paper,
  IconButton
} from "@material-ui/core";
import RouteTabs from "../../components/Header/RouteTabs";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      justifyContent: "space-between"
    },
    actions: { "& > *": { margin: theme.spacing(1) } }
  })
);

export function EventHeader() {
  const classes = useStyles();
  const history = useHistory();
  let { path } = useRouteMatch();
  const { pathname } = useLocation();
  const { url } = matchPath(pathname, { path: `${path}/:id` }) as {
    url: string;
  };

  return (
    <AppBar position="static" elevation={2}>
      <Container maxWidth="lg">
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            size="small"
            onClick={() => history.goBack()}
          >
            <NavigateBeforeIcon fontSize="large" />
          </IconButton>
          <Link color="inherit" component={RouterLink} to="/" variant="h6">
            Askent
          </Link>
          <Box className={classes.actions}>
            <Link color="inherit" component={RouterLink} to="/admin">
              Admin
            </Link>
          </Box>
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

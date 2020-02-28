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
  EventByIdQuery,
  EventByIdQueryVariables
} from "../../../generated/graphqlHooks";
import { QueryResult } from "@apollo/react-common";
import { FormattedDate, useIntl } from "react-intl";
import HeaderAction from "../../../components/HeaderAction";

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
  eventQuery: QueryResult<EventByIdQuery, EventByIdQueryVariables>;
}

const AdminEventHeader: React.FC<Props> = ({ eventQuery }) => {
  const classes = useStyles();
  const history = useHistory();
  let { url } = useRouteMatch();
  const { formatMessage } = useIntl();
  const { data, loading } = eventQuery;

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
                    {data?.eventById.name}
                  </Typography>
                  <Typography color="inherit">
                    <FormattedDate value={data?.eventById.startAt} /> ~{" "}
                    <FormattedDate value={data?.eventById.endAt} />
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography color="inherit">#{data?.eventById.code}</Typography>
                <Typography color="inherit">#{data?.eventById.code}</Typography>
              </Box>
              <Box className={classes.actions}>
                <HeaderAction />
              </Box>
            </React.Fragment>
          )}
        </Toolbar>
      </Container>
      <Paper elevation={0} square>
        <Container maxWidth="lg">
          <RouteTabs
            tabs={[
              {
                label: formatMessage({
                  id: "Audience_Q&A",
                  defaultMessage: "Audience Q&A"
                }),
                to: `${url}/questions`
              },
              {
                label: formatMessage({
                  id: "Live_polls",
                  defaultMessage: "Live polls"
                }),
                to: `${url}/polls`
              },
              {
                label: formatMessage({
                  id: "Analitics",
                  defaultMessage: "Analitics"
                }),
                to: `${url}/analytics`
              }
            ]}
            indicatorColor="primary"
            textColor="primary"
          />
        </Container>
      </Paper>
    </AppBar>
  );
};

export default AdminEventHeader;

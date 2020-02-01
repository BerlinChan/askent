import React from "react";
import { Box, Typography, Container, Paper } from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import QuestionForm from "./QuestionForm";
import TabPanel from "../../../components/TabPanel";
import { SubTabs, SubTab } from "../../../components/Tabs";
import { QueryResult } from "@apollo/react-common";
import {
  LiveEventQuery,
  LiveEventQueryVariables
} from "../../../generated/graphqlHooks";
import Logo from "../../../components/Logo";
import QuestionList from "./QuestionList";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginTop: theme.spacing(1),
      marginDown: theme.spacing(1)
    },
    listActions: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "nowrap",
      marginTop: theme.spacing(1)
    },
    panelPaper: {}
  })
);

interface Props {
  eventQueryResult: QueryResult<LiveEventQuery, LiveEventQueryVariables>;
}

const LiveQuestions: React.FC<Props> = ({ eventQueryResult }) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabsChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Container maxWidth="md">
      <Typography
        variant="subtitle1"
        color="textSecondary"
        className={classes.title}
      >
        <FormattedMessage
          id="Ask_the_speaker"
          defaultMessage="Ask the speaker"
        />
      </Typography>
      <QuestionForm />
      <Box className={classes.listActions}>
        <SubTabs value={tabIndex} onChange={handleTabsChange}>
          <SubTab
            label={formatMessage({
              id: "Popular",
              defaultMessage: "Popular"
            })}
          />
          <SubTab
            label={formatMessage({
              id: "Recent",
              defaultMessage: "Recent"
            })}
          />
        </SubTabs>
        <Box>
          <Typography color="textSecondary">
            {eventQueryResult.data?.eventById.questionCountForLive}{" "}
            <FormattedMessage id="questions" defaultMessage="questions" />
          </Typography>
        </Box>
      </Box>
      <Paper className={classes.panelPaper}>
        <TabPanel value={tabIndex} index={0}>
          <QuestionList eventQueryResult={eventQueryResult} />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          Popular
        </TabPanel>
      </Paper>
      <Box textAlign="center">
        <Logo />
      </Box>
    </Container>
  );
};

export default LiveQuestions;
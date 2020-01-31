import React from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import {
  FormattedMessage,
  FormattedTime,
  FormattedDate,
  useIntl
} from "react-intl";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import QuestionForm from "./QuestionForm";
import TabPanel from "../../../components/TabPanel";
import { SubTabs, SubTab } from "../../../components/Tabs";
import { QueryResult } from "@apollo/react-common";
import {
  LiveEventQuery,
  LiveEventQueryVariables
} from "../../../generated/graphqlHooks";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";

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
    panelPaper: {},
    list: {},
    listItem: {
      flexWrap: "wrap",
      position: "relative"
    },
    questionMeta: {
      marginLeft: theme.spacing(0.5),
      marginRight: theme.spacing(1)
    },
    questionContent: { width: "100%" }
  })
);

interface Props {
  eventQueryResult: QueryResult<LiveEventQuery, LiveEventQueryVariables>;
}

const LiveQuestions: React.FC<Props> = ({ eventQueryResult }) => {
  const classes = useStyles();
  let { id } = useParams();
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
          <List className={classes.list} disablePadding>
            {eventQueryResult.data?.eventById.questionsForLive.map(
              (question, index) => (
                <ListItem
                  key={index}
                  className={classes.listItem}
                  alignItems="flex-start"
                  divider
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={question.author?.name as string}
                      src="/static/images/avatar/1.jpg"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                      >
                        {question.author?.name ? (
                          question.author?.name
                        ) : (
                          <FormattedMessage
                            id="Anonymous"
                            defaultMessage="Anonymous"
                          />
                        )}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <ThumbUpIcon style={{ fontSize: 12 }} />
                        <Typography
                          className={classes.questionMeta}
                          component="span"
                          variant="body2"
                          color="inherit"
                        >
                          {question.voteCount}
                        </Typography>
                        <Typography
                          className={classes.questionMeta}
                          component="span"
                          variant="body2"
                          color="inherit"
                        >
                          <FormattedDate value={question.updatedAt} />
                          {", "}
                          <FormattedTime value={question.updatedAt} />
                        </Typography>
                      </React.Fragment>
                    }
                  />{" "}
                  <Typography
                    className={classes.questionContent}
                    variant="body1"
                  >
                    {question.content}
                  </Typography>
                </ListItem>
              )
            )}
          </List>
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          Popular
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default LiveQuestions;

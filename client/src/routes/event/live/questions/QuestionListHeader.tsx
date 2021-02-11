import React from "react";
import { QueryResult } from "@apollo/client";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Container,
  useMediaQuery,
} from "@material-ui/core";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";
import QuestionForm from "./QuestionForm";
import QuestionFormInput from "./QuestionFormInput";
import {
  Exact,
  QuestionOrder,
  QuestionsByEventAudienceQuery,
  QuestionQueryInput,
} from "../../../../generated/graphqlHooks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginTop: theme.spacing(1),
      marginDown: theme.spacing(1),
    },
    formBox: {
      [theme.breakpoints.down("md")]: {
        backgroundColor: theme.palette.background.paper,
        paddingLeft: theme.spacing(2),
      },
    },
    questionForm: { marginBottom: theme.spacing(2) },
    sortAndCount: {
      display: "flex",
      justifyContent: "space-between",
    },
    questionCount: {
      display: "flex",
      alignItems: "center",
    },
  })
);

interface Props {
  questionsQueryResult: QueryResult<
    QuestionsByEventAudienceQuery,
    Exact<{
      input: QuestionQueryInput;
    }>
  >;
}

const QuestionListHeader: React.FC<Props> = ({ questionsQueryResult }) => {
  const classes = useStyles();
  const theme = useTheme();
  const matchMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const { data } = questionsQueryResult;
  const [sortTabValue, setSortTabValue] = React.useState<QuestionOrder>(
    QuestionOrder.Popular
  );

  const handleSortTabChange = (
    event: React.ChangeEvent<{}>,
    newValue: QuestionOrder
  ) => {
    setSortTabValue(newValue);
  };

  return (
    <React.Fragment>
      <Container maxWidth="sm">
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
      </Container>
      <Container maxWidth="sm" className={classes.formBox} disableGutters>
        {matchMdUp ? (
          <QuestionForm
            className={classes.questionForm}
            onFocus={() => {
              document.querySelector(".scrollContainer")?.scrollTo(0, 0);
            }}
          />
        ) : (
          <QuestionFormInput />
        )}
      </Container>
      <Container maxWidth="sm" className={classes.sortAndCount}>
        <Tabs value={sortTabValue} onChange={handleSortTabChange}>
          <Tab
            value={QuestionOrder.Popular}
            label={<FormattedMessage id="Popular" defaultMessage="Popular" />}
          />
          <Tab
            value={QuestionOrder.Recent}
            label={<FormattedMessage id="Recent" defaultMessage="Recent" />}
          />
        </Tabs>
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.questionCount}
        >
          <FormattedMessage
            id="questionCount"
            defaultMessage="{num, plural, one {# question} other {# questions}}"
            values={{ num: data?.questionsByEventAudience.totalCount }}
          />
        </Typography>
      </Container>
    </React.Fragment>
  );
};

export default QuestionListHeader;

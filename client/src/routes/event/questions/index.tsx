import React from "react";
import { Box, Typography, Container } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import QuestionForm from "./QuestionForm";
import TabPanel from "../../../components/TabPanel";
import { SubTabs, SubTab } from "../../../components/Tabs";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listActions: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "nowrap"
    }
  })
);

const LiveQuestions: React.FC = () => {
  const classes = useStyles();
  let { id } = useParams();
  const { formatMessage } = useIntl();
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabsChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
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
          <Typography color="inherit">{}</Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default LiveQuestions;

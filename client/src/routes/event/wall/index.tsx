import React from "react";
import { Box, Grid, Card, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import QRCode from "qrcode.react";
import { FormattedMessage } from "react-intl";
import SortSelect from "./SortSelect";
import {
  useLiveEventQuery,
  useLiveEventUpdatedSubscription,
  useWallQuestionsByEventQuery,
  OrderByArg
} from "../../../generated/graphqlHooks";
import { DEFAULT_PAGE_FIRST, DEFAULT_PAGE_SKIP } from "../../../constant";
import QuestionList from "./QuestionList";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wallGrid: {
      width: "100%",
      height: "100vh",
      padding: theme.typography.pxToRem(15),
      color: theme.palette.text.primary,
      background: "radial-gradient(#3b5379 0%, #0e1935 100%)"
    },
    gridItem: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      padding: theme.typography.pxToRem(15)
    },
    infoBox: {
      textAlign: "center",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    },
    listBox: { flex: 1 }
  })
);

interface Props {}

const EventWall: React.FC<Props> = () => {
  const classes = useStyles();
  const { id } = useParams();
  const qrcodeCardRef = React.useRef<HTMLElement>(null);
  const [qrcodeCardWidth, setQrcodeCardWidth] = React.useState(0);
  const liveEventQueryResult = useLiveEventQuery({
    variables: { eventId: id as string }
  });
  const wallQuestionsResult = useWallQuestionsByEventQuery({
    variables: {
      eventId: id as string,
      pagination: { first: DEFAULT_PAGE_FIRST, skip: DEFAULT_PAGE_SKIP },
      orderBy: { createdAt: OrderByArg.Desc }
    }
  });

  useLiveEventUpdatedSubscription({
    variables: { eventId: id as string }
  });

  const onResize = () => {
    setQrcodeCardWidth(Number(qrcodeCardRef?.current?.clientWidth));
  };
  React.useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  });
  React.useEffect(() => {
    onResize();
  }, []);

  return (
    <Grid container className={classes.wallGrid}>
      <Grid item xs={3} className={classes.gridItem}>
        <Card ref={qrcodeCardRef} style={{ height: qrcodeCardWidth }}>
          <QRCode
            size={qrcodeCardWidth}
            includeMargin={true}
            value={`${window.location.origin}/event/${id}`}
          />
        </Card>
        <Box className={classes.infoBox}>
          <Typography variant="h4" color="textPrimary">
            <FormattedMessage id="Join_at" defaultMessage="Join at" />
          </Typography>
          <Typography variant="h3" color="textPrimary">
            Askent
          </Typography>
          <Typography variant="h4" color="textPrimary">
            # {liveEventQueryResult.data?.eventById.code}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={9} className={classes.gridItem}>
        <SortSelect wallQuestionsResult={wallQuestionsResult} />
        <Box className={classes.listBox}>
          <QuestionList questionsQueryResult={wallQuestionsResult} />
        </Box>
        <Typography variant="h6" color="inherit">
          <FormattedMessage
            id="Latest_question"
            defaultMessage="Latest question"
          />
        </Typography>
      </Grid>
    </Grid>
  );
};

export default EventWall;

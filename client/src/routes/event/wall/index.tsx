import React from "react";
import { Box, Grid, Card, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import QRCode from "qrcode.react";
import { FormattedMessage } from "react-intl";
import SortSelect from "./SortSelect";
import {
  useEventByIdQuery,
  useEventUpdatedSubscription,
  useWallQuestionsByEventLazyQuery,
  WallQuestionsByEventQuery,
  WallQuestionsByEventQueryVariables,
  WallQuestionsByEventDocument,
  useWallQuestionAddedSubscription,
  useWallQuestionUpdatedSubscription,
  useWallQuestionRemovedSubscription,
  RoleName
} from "../../../generated/graphqlHooks";
import { DataProxy } from "apollo-cache";
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from "../../../constant";
import QuestionList from "./QuestionList";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wallGrid: {
      width: "100%",
      height: "100vh",
      padding: theme.typography.pxToRem(24),
      color: theme.palette.text.primary,
      background: "radial-gradient(#3b5379 0%, #0e1935 100%)"
    },
    gridItem: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      padding: theme.typography.pxToRem(24),
      position: "relative"
    },
    infoBox: {
      textAlign: "center",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    },
    rightTitleBox: {
      position: "absolute",
      top: `-${theme.typography.pxToRem(6)}`,
      left: theme.typography.pxToRem(40),
      color: theme.palette.text.secondary
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
  const eventByIdQueryResult = useEventByIdQuery({
    variables: { eventId: id as string }
  });
  const [
    wallQuestionsByEventLazyQuery,
    wallQuestionsResult
  ] = useWallQuestionsByEventLazyQuery();

  // subscription
  const updateCache = (
    cache: DataProxy,
    eventId: string,
    data: WallQuestionsByEventQuery
  ) => {
    cache.writeQuery<
      WallQuestionsByEventQuery,
      Omit<WallQuestionsByEventQueryVariables, "pagination">
    >({
      query: WallQuestionsByEventDocument,
      variables: { eventId },
      data
    });
  };
  useWallQuestionAddedSubscription({
    variables: { eventId: id as string, role: RoleName.Wall },
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data) {
        const { questionAdded } = subscriptionData.data;
        const prev = wallQuestionsResult.data;

        if (prev) {
          // add
          updateCache(client, id as string, {
            wallQuestionsByEvent: {
              ...prev.wallQuestionsByEvent,
              totalCount: prev.wallQuestionsByEvent.totalCount + 1,
              list: [questionAdded].concat(
                prev.wallQuestionsByEvent.list.filter(
                  question =>
                    question.id !== subscriptionData.data?.questionAdded.id
                )
              )
            }
          });
        }
      }
    }
  });
  useWallQuestionUpdatedSubscription({
    variables: { eventId: id as string, role: RoleName.Wall }
  });
  useWallQuestionRemovedSubscription({
    variables: { eventId: id as string, role: RoleName.Wall },
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data?.questionRemoved) {
        const { questionRemoved } = subscriptionData.data;
        const prev = wallQuestionsResult.data;

        if (prev) {
          // remove
          updateCache(client, id as string, {
            wallQuestionsByEvent: {
              ...prev.wallQuestionsByEvent,
              totalCount: prev.wallQuestionsByEvent.totalCount - 1,
              list: prev.wallQuestionsByEvent.list.filter(
                preQuestion => questionRemoved.id !== preQuestion.id
              )
            }
          });
        }
      }
    }
  });
  useEventUpdatedSubscription({
    variables: { eventId: id as string }
  });

  const onResize = () => {
    setQrcodeCardWidth(Number(qrcodeCardRef?.current?.clientWidth));
  };
  React.useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    wallQuestionsByEventLazyQuery({
      variables: {
        eventId: id as string,
        pagination: { limit: DEFAULT_PAGE_LIMIT, offset: DEFAULT_PAGE_OFFSET }
        // orderBy: { createdAt: OrderByArg.Desc }
      }
    });

    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
            # {eventByIdQueryResult.data?.eventById.code}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={9} className={classes.gridItem}>
        <Box className={classes.rightTitleBox}>
          <SortSelect
            wallQuestionsByEventLazyQuery={wallQuestionsByEventLazyQuery}
            wallQuestionsResult={wallQuestionsResult}
          />
        </Box>
        <Box className={classes.listBox}>
          <QuestionList questionsQueryResult={wallQuestionsResult} />
        </Box>
        {0 ? (
          <Typography variant="h6" color="inherit">
            <FormattedMessage
              id="Latest_question"
              defaultMessage="Latest question"
            />
          </Typography>
        ) : null}
      </Grid>
    </Grid>
  );
};

export default EventWall;

import React from "react";
import { Box, Grid, Card, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import QRCode from "qrcode.react";
import { FormattedMessage } from "react-intl";
import OrderSelect from "./OrderSelect";
import {
  useEventByIdQuery,
  useEventUpdatedSubscription,
  useQuestionsByEventWallQuery,
  QuestionsByEventWallQuery,
  QuestionsByEventWallQueryVariables,
  QuestionsByEventWallDocument,
  useQuestionAddedWallSubscription,
  useQuestionUpdatedWallSubscription,
  useQuestionRemovedWallSubscription,
  RoleName,
  QuestionOrder
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
  const orderSelectedState = React.useState<QuestionOrder>(
    QuestionOrder.Popular
  );
  const questionsQueryVariables = {
    eventId: id as string,
    pagination: { limit: DEFAULT_PAGE_LIMIT, offset: DEFAULT_PAGE_OFFSET },
    order: orderSelectedState[0]
  };
  const questionsWallQueryResult = useQuestionsByEventWallQuery({
    fetchPolicy: "network-only",
    variables: questionsQueryVariables
  });

  // subscription
  const updateCache = (cache: DataProxy, data: QuestionsByEventWallQuery) => {
    cache.writeQuery<
      QuestionsByEventWallQuery,
      Omit<QuestionsByEventWallQueryVariables, "pagination">
    >({
      query: QuestionsByEventWallDocument,
      variables: questionsQueryVariables,
      data
    });
  };
  useQuestionAddedWallSubscription({
    variables: { eventId: id as string, role: RoleName.Wall },
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data) {
        const { questionAdded } = subscriptionData.data;
        const prev = questionsWallQueryResult.data;

        if (prev) {
          // add
          updateCache(client, {
            questionsByEventWall: {
              ...prev.questionsByEventWall,
              totalCount: prev.questionsByEventWall.totalCount + 1,
              list: [questionAdded].concat(
                prev.questionsByEventWall.list.filter(
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
  useQuestionUpdatedWallSubscription({
    variables: { eventId: id as string, role: RoleName.Wall }
  });
  useQuestionRemovedWallSubscription({
    variables: { eventId: id as string, role: RoleName.Wall },
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData.data?.questionRemoved) {
        const { questionRemoved } = subscriptionData.data;
        const prev = questionsWallQueryResult.data;

        if (prev) {
          // remove
          updateCache(client, {
            questionsByEventWall: {
              ...prev.questionsByEventWall,
              totalCount: prev.questionsByEventWall.totalCount - 1,
              list: prev.questionsByEventWall.list.filter(
                preQuestion => questionRemoved !== preQuestion.id
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

    return () => window.removeEventListener("resize", onResize);
  });

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
          <OrderSelect
            orderSelectedState={orderSelectedState}
            questionsWallQueryResult={questionsWallQueryResult}
          />
        </Box>
        <Box className={classes.listBox}>
          <QuestionList
            questionsQueryResult={questionsWallQueryResult}
            order={orderSelectedState[0]}
          />
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

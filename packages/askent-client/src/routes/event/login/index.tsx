import React from "react";
import { Box, Typography, Button } from "@material-ui/core";
import { ButtonLoading } from "../../../components/Form";
import { useParams, useNavigate, Link } from "react-router-dom";
import Logo from "../../../components/Logo";
import {
  createStyles,
  makeStyles,
  Theme,
  alpha,
} from "@material-ui/core/styles";
import { FormattedMessage, FormattedDate, FormattedTime } from "react-intl";
import { QueryResult } from "@apollo/client";
import {
  EventForLoginQuery,
  EventForLoginQueryVariables,
  useLoginAudienceMutation,
  useIsEventAudienceLazyQuery,
  useJoinEventMutation,
} from "../../../generated/graphqlHooks";
import { useFingerprint, useToken } from "../../../hooks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    eventLogin: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      height: "100vh",
      background: `radial-gradient(circle, 
        ${alpha(theme.palette.primary.main, 0.1)} 0%,
        ${alpha(theme.palette.primary.main, 0.4)} 100%)`,
    },
    eventInfoBox: {
      marginTop: theme.spacing(5),
    },
  })
);

interface Props {
  eventQuery: QueryResult<EventForLoginQuery, EventForLoginQueryVariables>;
}

const EventLogin: React.FC<Props> = ({ eventQuery }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  let { id } = useParams<{ id: string }>();
  const { token, setToken } = useToken();
  const { data, loading: eventForLoginLoading } = eventQuery;
  const [loginAudienceMutation, { loading: loginAudienceLoading }] =
    useLoginAudienceMutation();
  const [joinEventMutation, { loading: joinEventLoading }] =
    useJoinEventMutation();
  const fingerprint = useFingerprint();
  const [isEventAudienceLazyQuery, { data: isEventAudienceData }] =
    useIsEventAudienceLazyQuery();

  React.useEffect(() => {
    if (token) {
      (async () => {
        await isEventAudienceLazyQuery({
          variables: { eventId: id as string },
        });
      })();

      if (isEventAudienceData?.isEventAudience) {
        handleNavToLive();
      } else {
        (async () => {
          await joinEventMutation({ variables: { eventId: id as string } });
          handleNavToLive();
        })();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token, isEventAudienceData]);

  const handleEventLogin = async () => {
    const { data } = await loginAudienceMutation({
      variables: { fingerprint },
    });
    setToken(data?.loginAudience.token as string);
  };
  const handleNavToLive = () => {
    navigate(`/event/${id}/live/questions`, { replace: true });

    // fix Hasura subscription auth, https://github.com/apollographql/subscriptions-transport-ws/issues/171
    window.location.reload();
  };

  return (
    <Box className={classes.eventLogin}>
      <Box textAlign="center">
        <Logo />
      </Box>
      <Box textAlign="center" className={classes.eventInfoBox}>
        <Typography paragraph variant="h6">
          <FormattedMessage id="Welcome" defaultMessage="Welcome" />
        </Typography>
        <Typography paragraph variant="h4">
          {data?.eventById.name}
        </Typography>
        <Typography paragraph variant="h6">
          {data?.eventById.code}
        </Typography>
        <Typography paragraph color="textSecondary">
          <FormattedDate value={data?.eventById.startAt} />
          {", "}
          <FormattedTime value={data?.eventById.startAt} />
          {" ~ "}
          <FormattedDate value={data?.eventById.endAt} />
          {", "}
          <FormattedTime value={data?.eventById.endAt} />
        </Typography>
        <ButtonLoading
          variant="contained"
          color="primary"
          loading={
            eventForLoginLoading || loginAudienceLoading || joinEventLoading
          }
          onClick={handleEventLogin}
        >
          <FormattedMessage id="Join_event" defaultMessage="Join event" />
        </ButtonLoading>
        <Button component={Link} to="/">
          <FormattedMessage id="Back_to_home" defaultMessage="Back to home" />
        </Button>
      </Box>
    </Box>
  );
};

export default EventLogin;

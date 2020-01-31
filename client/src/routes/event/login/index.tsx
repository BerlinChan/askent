import React from "react";
import { Box, Typography, Button } from "@material-ui/core";
import { ButtonLoading } from "../../../components/Form";
import { useParams, useHistory, Link } from "react-router-dom";
import Logo from "../../../components/Logo";
import {
  createStyles,
  makeStyles,
  Theme,
  fade
} from "@material-ui/core/styles";
import { FormattedMessage, FormattedDate } from "react-intl";
import { QueryResult } from "@apollo/react-common";
import {
  EventForLoginQuery,
  EventForLoginQueryVariables,
  useLoginAudienceMutation,
  useIsEventAudienceQuery,
  useJoinEventMutation
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
        ${fade(theme.palette.primary.main, 0.1)} 0%,
         ${fade(theme.palette.primary.main, 0.4)} 100%)`
    },
    eventInfoBox: {
      marginTop: theme.spacing(5)
    }
  })
);

interface Props {
  eventQuery: QueryResult<EventForLoginQuery, EventForLoginQueryVariables>;
}

const EventLogin: React.FC<Props> = ({ eventQuery }) => {
  const classes = useStyles();
  const history = useHistory();
  let { id } = useParams();
  const { data, loading: eventForLoginLoading } = eventQuery;
  const [
    loginAudienceMutation,
    { loading: loginAudienceLoading }
  ] = useLoginAudienceMutation();
  const { data: isEventAudienceData } = useIsEventAudienceQuery({
    variables: { eventId: id as string }
  });
  const [
    joinEventMutation,
    { loading: joinEventLoading }
  ] = useJoinEventMutation();
  const fingerprint = useFingerprint();
  const { token, setToken } = useToken();

  React.useEffect(() => {
    if (token.audienceAuthToken) {
      if (isEventAudienceData?.isEventAudience) {
        history.replace(`/event/${id}/questions`);
      }
    }
  });

  const handleEventLogin = async () => {
    if (!token.audienceAuthToken) {
      const { data } = await loginAudienceMutation({
        variables: { fingerprint }
      });
      setToken({ audienceAuthToken: data?.loginAudience.token });
    }
    await joinEventMutation({ variables: { eventId: id as string } });
    history.replace(`/event/${id}/questions`);
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
          <FormattedDate value={data?.eventById.startAt} /> ~
          <FormattedDate value={data?.eventById.endAt} />
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

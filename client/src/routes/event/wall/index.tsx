import React from "react";
import { Box, Grid, Card, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import QRCode from "qrcode.react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wallBox: {
      display: "flex",
      width: "100%",
      height: "100vh",
      padding: theme.spacing(3),
      background: "radial-gradient(#3b5379 0%, #0e1935 100%)"
    },
    qrcodeCard: {},
    qrcode: {}
  })
);

interface Props {}

const EventWall: React.FC<Props> = () => {
  const classes = useStyles();
  const { id } = useParams();
  const [qrcodeCardWidth, setQrcodeCardWidth] = React.useState(0);
  const qrcodeCardRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    setQrcodeCardWidth(Number(qrcodeCardRef?.current?.clientWidth));
  }, [qrcodeCardRef]);

  return (
    <Box className={classes.wallBox}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Card ref={qrcodeCardRef} style={{ height: qrcodeCardWidth }}>
            <QRCode
              className={classes.qrcode}
              size={qrcodeCardWidth}
              includeMargin={true}
              value={`${window.location.origin}/event/${id}/wall`}
            />
          </Card>
          <Typography variant="h4">Join at</Typography>
          <Typography variant="h4">Askent</Typography>
          <Typography variant="h4"># code</Typography>
        </Grid>
        <Grid item xs={9}>
          Event wall {id}
        </Grid>
      </Grid>
    </Box>
  );
};

export default EventWall;

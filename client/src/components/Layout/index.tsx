import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Container, Box } from "@material-ui/core";

interface Props {
  header?: React.ReactElement;
  body?: React.ReactElement;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    layoutBox: {
      display: "flex",
      flexDirection: "column",
      height: "100vh"
    },
    bodyRoutesBox: {
      overflowX: "hidden",
      overflowY: "auto",
      height: "100%"
    },
    bodyContainer: {
      paddingTop: theme.spacing(2),
      height: "100%"
    }
  })
);

const Layout: React.FC<Props> = ({ header, body }) => {
  const classes = useStyles();

  return (
    <Box className={classes.layoutBox}>
      {header && header}
      <Box className={classes.bodyRoutesBox}>
        <Container maxWidth="lg" className={classes.bodyContainer}>
          {body && body}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;

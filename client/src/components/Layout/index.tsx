import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Container, Box } from "@material-ui/core";

interface Props {
  header: React.ReactElement;
  body: React.ReactElement;
  scrollBoxBody?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    layoutBox: {
      display: "flex",
      flexDirection: "column",
      height: "100vh"
    },
    scrollBox: {
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

const Layout: React.FC<Props> = ({ header, scrollBoxBody, body }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      {scrollBoxBody ? (
        <Box className={classes.layoutBox}>
          {header}
          <Box className={classes.scrollBox}>
            <Container maxWidth="lg" className={classes.bodyContainer}>
              {body}
            </Container>
          </Box>
        </Box>
      ) : (
        <React.Fragment>
          {header}
          {body}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Layout;

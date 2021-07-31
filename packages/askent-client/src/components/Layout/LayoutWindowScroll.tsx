import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Container, Box } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    layoutBox: {
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.up("md")]: {
        height: "100vh",
      },
    },
    scrollBox: {
      [theme.breakpoints.up("md")]: {
        overflowX: "hidden",
        overflowY: "auto",
        height: "100%",
      },
    },
    bodyContainer: {
      paddingTop: theme.spacing(2),
      height: "100%",
    },
  })
);

interface Props {
  header: React.ReactElement;
  body: React.ReactElement;
  disableContainer?: boolean;
}

export const LayoutWindowScroll: React.FC<Props> = ({
  header,
  body,
  disableContainer = false,
}) => {
  const classes = useStyles();

  return (
    <Box className={classes.layoutBox}>
      {header}
      <Box className={classes.scrollBox}>
        {disableContainer ? (
          body
        ) : (
          <Container maxWidth="lg" className={classes.bodyContainer}>
            {body}
          </Container>
        )}
      </Box>
    </Box>
  );
};

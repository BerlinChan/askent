import React from "react";
import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { Container, Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const useStyles = makeStyles<Theme, {}, string>((theme: Theme) => ({
    layoutBox: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
    },
    scrollBox: {
      overflowX: "hidden",
      overflowY: "auto",
      height: "100%",
    },
    bodyContainer: {
      paddingTop: theme.spacing(2),
      height: "100%",
    },
  }));
interface Props {
  header: React.ReactElement;
  disableContainer?: boolean;
}

export const Layout: React.FC<Props> = ({
  header,
  disableContainer = false,
}) => {
  const classes = useStyles();

  return (
    <Box className={classes.layoutBox}>
      {header}
      <Box className={classes.scrollBox}>
        {disableContainer ? (
          <Outlet />
        ) : (
          <Container maxWidth="lg" className={classes.bodyContainer}>
            <Outlet />
          </Container>
        )}
      </Box>
    </Box>
  );
};

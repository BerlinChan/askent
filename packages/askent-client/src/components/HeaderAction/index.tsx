import React from "react";
import { useToken } from "../../hooks";
import AuthedAction from "./AuthedAction";
import UnauthAction from "./UnauthAction";
import { Box } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";

const useStyles = makeStyles({
    header: {
      display: "flex",
      alignItems: "center",
    },
  });

interface Props {
  hideUserInfo?: boolean;
}

const HeaderAction: React.FC<Props> = ({ hideUserInfo = false }) => {
  const { token } = useToken();
  const classes = useStyles();

  return (
    <Box className={classes.header}>
      {token ? <AuthedAction hideUserInfo={hideUserInfo} /> : <UnauthAction />}
    </Box>
  );
};

export default HeaderAction;

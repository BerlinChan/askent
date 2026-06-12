import React from "react";
import { Button, CircularProgress, ButtonProps } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";

const useStyles = makeStyles({
    buttonWrapper: {
      position: "relative",
      "&.fullWidth": { width: "100%" }
    },
    buttonProgress: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12
    }
  });

interface Props {
  loading: boolean;
  fullWidth?: boolean;
}

export const ButtonLoading: React.FC<Props & ButtonProps> = ({
  children,
  loading,
  fullWidth = false,
  ...props
}) => {
  const classes = useStyles();

  return (
    <div className={classes.buttonWrapper + (fullWidth ? " fullWidth" : "")}>
      <Button
        disabled={loading || props.disabled}
        fullWidth={fullWidth}
        {...props}
      >
        {children}
      </Button>
      {loading && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </div>
  );
};
